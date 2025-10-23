# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-23

### Added
- Initial release of `@andsafe/iframe-resizing`
- `initIFrameResizing` function for manual initialization
- `autoInitIFrameResizing` function for automatic DOM-ready initialization
- Full TypeScript support with type definitions
- CommonJS and ES Module builds
- ResizeObserver-based automatic height detection
- PostMessage protocol for parent-child communication
- Error handling callbacks (`onError`, `captureError`)
- SSR-safe implementation
- UMD browser global support (`window.IFrameResizing`)
- Comprehensive documentation and examples
- MIT license

### Features
- Automatic iframe height resizing
- 20-second timeout for acknowledgment
- Cleanup function for proper resource disposal
- Zero configuration required for basic usage
- Framework-agnostic implementation
