# kamiocal

## Unreleased

### Minor Changes

- Replaced Express with Hono for the local sharing server.
- Added current-directory defaults, better path validation, `--port`, and help output.
- Added `--tunnel` / `--cloudflare` / `--cf` Cloudflare quick tunnel support through `cloudflared`.

### Patch Changes

- Fixed nested directory listing links, empty folder visibility, and zero-byte size formatting.
- Optimized serving to skip duplicate static lookups, use conditional/range file responses, cache bundled assets immutably, and keep directory listings uncached.
- Reduced Cloudflare tunnel noise and disabled cloudflared auto-update checks during quick tunnel startup.
- Reorganized source into `cli`, `server`, and `tunnel` modules with obsolete utility folders removed.

## 2.2.4

### Patch Changes

- 8822bdd: readme enchanted

## 2.2.3

### Patch Changes

- b6d650a: fixed video on readme
- f45f5b4: video fixed

## 2.2.2

### Patch Changes

- f37931f: added readme

## 2.2.1

### Patch Changes

- 4f96909: fixed

## 2.2.0

### Minor Changes

- b8adb20: fixed isuue

## 2.1.1

### Patch Changes

- fc4002d: fixed file isuue

## 2.1.0

### Minor Changes

- fced0f0: fixed

### Patch Changes

- 6fe9cea: hello
- 1666ea2: hm

## 2.0.0

### Major Changes

- e247e0b: fixed

### Minor Changes

- a583108: fixed

## 1.3.0

### Minor Changes

- 68a99ab: fixed a bit issue

## 1.2.0

### Minor Changes

- eced068: fixed size issue

## 1.1.1

### Patch Changes

- 3613484: fixed a isuue

## 1.1.0

### Minor Changes

- 3de10a8: fixed issue
