---
title: "Building Ampli: Architecture decisions behind an audio streaming platform"
description: "Why I chose Go over Node.js, how we handle real-time waveform generation, and the tradeoffs of building a Bandcamp + Mixcloud hybrid from scratch."
date: 2025-05-01
tags: ["Go", "Next.js", "Audio", "Architecture"]
---

## The problem

There's no platform that serves the independent audio creator end-to-end. Bandcamp handles sales but not streaming. Mixcloud handles DJ sets but takes too much control. SoundCloud has degraded. Tidal is for majors.

Ampli is an attempt to fill that gap: a platform built from the community, not the mainstream.

## Why Go for the backend

The initial instinct was Node.js — same language, fast iteration, shared types. But the workload told a different story.

Audio analysis (waveform generation, duration extraction, BPM detection) is CPU-bound. Node's single-threaded event loop becomes a bottleneck immediately. Go's goroutines handle this concurrently without worker threads or child processes.

The difference in practice: waveform generation runs as a goroutine off the main request. The upload endpoint returns immediately, the client polls for status, and the heavy work doesn't block anything.

## The stack decision

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 16 | App Router, RSC, good audio tooling |
| Backend | Go + Gin | Concurrency, performance, strong stdlib |
| Auth | Better Auth | Sessions in DB, not JWT |
| Storage | UploadThing → R2 | Fast to ship, plan to migrate |
| Analysis | ffmpeg/ffprobe | Battle-tested, handles every format |

## What's next

- ONNX-based audio fingerprinting for duplicate detection
- HLS adaptive bitrate streaming
- Monetization layer (pay-what-you-want + subscriptions)
