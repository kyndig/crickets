# Crickets

Play a quick cricket chirp sound effect from Raycast.

## Features

- Single `no-view` command for instant playback
- Bundled audio asset (`assets/crickets.mp3`) for deterministic behavior
- Fast failure feedback when playback cannot start
- macOS-only support (uses `afplay`)

## Command

- `Crickets`: plays the bundled cricket sound and shows a HUD confirmation

## Requirements

- Raycast
- macOS

## Development

```bash
npm install
npm run check
```

`npm run check` runs linting, tests, asset/dependency verification, and a production build to stay aligned with Raycast publication checks.