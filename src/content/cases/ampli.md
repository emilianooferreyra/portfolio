---
title: "Ampli"
subtitle: "Audio Streaming Platform for Independent Creators"
description: "Full-stack audio platform architected from scratch — Go backend, async audio processing, BFF pattern, and a roadmap to HLS adaptive streaming and AI-powered recommendations."
tech: ["Next.js 16", "React 19", "TypeScript", "Go/Gin", "PostgreSQL", "pgx/v5", "Better Auth", "UploadThing", "Prisma", "Zustand", "TanStack Query", "Sass", "Web Audio API"]
year: "2025"
github: "https://github.com/emilianooferreyra/ampli"
---

## The problem

No existing platform gives independent podcasters, musicians, and DJs the full stack they need:

- **Bandcamp** handles sales but not real-time streaming
- **Mixcloud** handles DJ sets but monetization is limited
- **SoundCloud** has degraded and prioritizes major labels
- **Spotify / Tidal** are inaccessible to independent artists at launch

Ampli is an attempt to fill that gap — a platform built from the community, not the mainstream. The model: ownership and monetization like Bandcamp, streaming quality like Tidal, set culture like Mixcloud.

---

## Architecture overview

Ampli is a full-stack monorepo with two distinct services and a BFF layer:

```
Browser
  └── Next.js 16 (App Router) — BFF + UI
        ├── API routes (proxy)  →  Go backend (:8000)
        └── Direct Prisma reads →  PostgreSQL (shared DB)

Go backend (:8000)
  └── Gin + pgx/v5 — core business logic, auth, CRUD
```

**Why the BFF pattern?** Next.js API routes sit between the browser and Go — they validate sessions, attach auth headers, and forward requests. The browser never talks to Go directly. This keeps auth logic centralized and Go focused on domain logic.

**Two exceptions** where Next.js queries the DB directly via Prisma (bypassing Go):
- `/api/user-tracks/[id]/waveform` — reads `waveformData` JSONB
- `/api/community-tracks` — public feed query

These are candidates for migration to Go once the async worker is in place.

---

## What's implemented

The Go backend covers the core domain:

| Feature | Endpoint |
|---------|----------|
| Tracks CRUD | `GET/POST/PATCH/DELETE /tracks` |
| Play tracking | `POST /tracks/:id/play` — upsert, one play per user per track |
| Profile | `GET/PATCH /profile/me` |
| Favorites | `GET/POST /favorites`, `DELETE /favorites/:trackRef` |
| Playlists | Full CRUD + transactional track management |
| Auth middleware | Better Auth JWKS Ed25519 + session DB fallback |

---

## Auth: Better Auth + JWKS Ed25519

Auth runs through Better Auth with sessions stored in PostgreSQL — no JWT statefulness issues, no token expiry edge cases to handle on the client.

The Go backend validates requests by verifying the session token against the DB via the Better Auth JWKS endpoint (Ed25519 signatures). A middleware wraps every protected route:

```go
func requireSession(db *pgxpool.Pool) gin.HandlerFunc {
    return func(c *gin.Context) {
        token := extractBearerToken(c)
        session, err := validateSession(db, token)
        if err != nil {
            c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})
            return
        }
        c.Set("userID", session.UserID)
        c.Next()
    }
}
```

Next.js proxy routes attach the token from the server-side session:

```typescript
const session = await auth.api.getSession({ headers: await headers() });
// token lives at session.session.token — not on the user object
const response = await fetch(`${BACKEND_URL}/tracks`, {
  headers: { Authorization: `Bearer ${session.session.token}` },
});
```

---

## Upload pipeline: current state and where it's going

### Today

```
Browser → Web Audio API (analyze) → UploadThing → DB (status: ready)
```

This works at MVP scale. The problem surfaces with large files: a 1-hour DJ set triggers 30–90 seconds of browser-side audio analysis before the upload even starts. On mobile it crashes entirely.

### Target architecture

```
Browser → POST /upload (presign) → Go API → R2 (raw file)
                                          → Redis job queue
                                          → 200 OK { status: "processing" }

Worker (Go goroutine)
  → FFmpeg: loudnorm → HLS segmentation (AAC 160k + AAC 96k)
  → audiowaveform: generate waveform.json
  → Upload segments to R2
  → UPDATE tracks SET status = 'ready', hls_url = '...'

Browser (polling)
  → GET /tracks/:id/status every 2s
  → When status = 'ready': render player with HLS + waveform
```

The upload endpoint returns immediately. Processing happens async via a Go worker (asynq over Redis). The client shows a skeleton waveform and polls for completion — the same pattern you see on SoundCloud and Vimeo.

### Why TUS for uploads

Files up to 500MB can't be uploaded via a single POST. If the connection drops at 80%, the user starts from zero. TUS (an open protocol for resumable uploads) solves this: the client uploads in chunks and resumes from the last successful offset on reconnect. Cloudflare R2 supports TUS natively.

### R2 storage layout

```
ampli-media/
  uploads/{trackId}/original.flac     ← master, never modified
  tracks/{trackId}/
    hls/
      manifest.m3u8                   ← master playlist
      aac_160/playlist.m3u8 + *.ts    ← primary (160kbps)
      aac_96/playlist.m3u8 + *.ts     ← fallback (96kbps mobile)
    waveform.json                     ← amplitude array
    artwork_500.jpg
```

HLS segments are immutable — `Cache-Control: public, max-age=31536000, immutable`. The manifest gets a shorter TTL.

---

## Upload limits by plan

```typescript
const UPLOAD_LIMITS = {
  free: {
    maxFileSize:   100 * 1024 * 1024,  // 100MB
    maxDuration:   60 * 20,             // 20 min
    totalStorage:  500 * 1024 * 1024,  // 500MB
    tracksPerMonth: 10,
  },
  premium: {
    maxFileSize:   500 * 1024 * 1024,  // 500MB
    maxDuration:   60 * 180,            // 3 hours (DJ sets)
    totalStorage:  10 * 1024 * 1024 * 1024, // 10GB
    tracksPerMonth: Infinity,
  },
};
```

---

## AI recommendations roadmap

The platform will use a staged approach to recommendations, starting with what's available without user data:

```
Stage 1 (now)    → Audio feature similarity: BPM, key, energy, spectral centroid
                 → Tag/genre matching
                 → Claude API for playlist name generation

Stage 2 (100+ users) → Collaborative filtering (matrix factorization)
                      → "Because you listened to X" via co-play matrix

Stage 3 (1000+ users) → Audio embeddings + two-tower model
                       → Real-time feature store (Redis)
                       → pgvector for similarity search
```

Claude API is already in the plan for generating playlist names and descriptions — reasoning over track metadata to produce copy that avoids generic phrases:

```typescript
const response = await anthropic.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 200,
  messages: [{
    role: 'user',
    content: `Generate a short, evocative playlist name and one-line description
    for: ${tracks.map(t => `${t.title} by ${t.artist} (${t.genre})`).join(', ')}.
    Style: minimal, music-culture aware. Return JSON: { name, description }`
  }]
});
```

For audio feature similarity in PostgreSQL, the plan is pgvector — no external infra needed at this stage:

```sql
SELECT id, title, 1 - (features_vector <=> $1::vector) AS similarity
FROM tracks
ORDER BY features_vector <=> $1::vector
LIMIT 20;
```

---

## State management

The player state lives in a Zustand store — global, persistent across navigation, independent of React's component tree. Track selection, queue, shuffle, repeat modes are all managed there.

TanStack Query handles server state: track lists, user profile, favorites, playlists. Polling for processing status uses `refetchInterval` that stops automatically when the status reaches `ready` or `error`.

---

## Roadmap

```
Q2 2026
  ├── R2 migration (pre-signed URLs, Go presign endpoint)
  ├── Go worker: FFmpeg pipeline + HLS output
  └── Testing setup: Vitest + Playwright for critical flows

Q3 2026
  ├── Full HLS streaming (replace direct UploadThing URLs)
  ├── pgvector + audio features (foundation for recommendations)
  └── TUS resumable uploads

Q4 2026
  ├── Rights & licensing schema (territory checks via CF-IPCountry)
  ├── Dispute workflow (append-only event log, deadline automation)
  └── AI recommendations Stage 1 (genre radio + Claude playlist intelligence)
```
