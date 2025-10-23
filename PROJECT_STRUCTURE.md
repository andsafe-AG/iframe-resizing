# Project Structure

This document provides an overview of the `@andsafe/iframe-resizing` package structure.

## Directory Structure

```
iframe-resizing-standalone/
├── src/                          # Source files (TypeScript)
│   ├── index.ts                  # Main entry point and exports
│   ├── iframe-resizing.ts        # Core resizing implementation
│   └── types.ts                  # TypeScript type definitions
│
├── dist/                         # Build output (generated)
│   ├── iframe-resizing.js        # ES Module build
│   ├── iframe-resizing.cjs       # CommonJS build
│   ├── iframe-resizing.d.ts      # TypeScript declarations (main)
│   ├── index.d.ts                # TypeScript declarations (entry)
│   ├── types.d.ts                # TypeScript declarations (types)
│   └── *.map                     # Source maps
│
├── examples/                     # Usage examples
│   ├── vanilla-js.html           # Vanilla JavaScript example (child window)
│   ├── typescript.ts             # TypeScript usage examples
│   └── parent-window.html        # Parent window implementation example
│
├── package.json                  # Package configuration
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
│
├── README.md                     # Main documentation
├── CHANGELOG.md                  # Version history
├── LICENSE                       # MIT License
├── PROJECT_STRUCTURE.md          # This file
│
├── .gitignore                    # Git ignore rules
└── .npmignore                    # NPM publish ignore rules
```

## Source Files

### `src/index.ts`
Main entry point for the package. Exports all public APIs and types.

**Exports:**
- `initIFrameResizing` - Manual initialization function
- `autoInitIFrameResizing` - Auto-init with DOM ready detection
- `IFrameResizingOptions` - Configuration type
- `Participant` - Participant type
- `Command` - Command structure type
- `CommandResponse` - Response structure type
- `participants` - Participant constants

### `src/iframe-resizing.ts`
Core implementation of the iframe resizing functionality.

**Key Components:**
- `sendResizeCommand()` - Sends resize command via postMessage
- `isServerSide()` - SSR detection
- `initIFrameResizing()` - Main initialization function
- `autoInitIFrameResizing()` - Auto-init wrapper
- Browser global setup for UMD support

### `src/types.ts`
TypeScript type definitions and constants.

**Exports:**
- `participants` - Constant object with PARENT and CHILD values
- `Participant` - Type for participants
- `Command` - Message command structure
- `CommandResponse` - Message response structure
- `IFrameResizingOptions` - Configuration options

## Build Output

The build process (via Vite) generates:

1. **ES Module** (`iframe-resizing.js`)
   - For modern bundlers and browsers
   - Tree-shakeable
   - ~1.7KB (uncompressed), ~0.8KB gzipped

2. **CommonJS** (`iframe-resizing.cjs`)
   - For Node.js and older bundlers
   - Requires Node.js or bundler
   - ~1.4KB (uncompressed), ~0.76KB gzipped

3. **Type Declarations** (`*.d.ts`)
   - Full TypeScript support
   - Includes type maps for IDE navigation

4. **Source Maps** (`*.map`)
   - For debugging
   - Maps compiled code back to source

## Examples

### `examples/vanilla-js.html`
A complete working example showing:
- How to import and initialize the library
- Dynamic content manipulation
- Error handling
- Cleanup on unload

### `examples/typescript.ts`
TypeScript examples demonstrating:
- Basic usage
- Error handling
- Manual initialization
- Class-based usage
- Dynamic content applications
- Conditional initialization

### `examples/parent-window.html`
Parent window implementation showing:
- How to receive resize messages
- Message acknowledgment
- Height adjustment
- Debugging/logging

## Configuration Files

### `package.json`
- Package metadata and dependencies
- Build scripts
- Module format exports configuration
- Publishing configuration

### `tsconfig.json`
- TypeScript compiler options
- Strict mode enabled
- ES2020 target
- Declaration generation

### `vite.config.ts`
- Vite build configuration
- Library mode setup
- Multiple output formats (ES + CJS)
- Type declaration generation via vite-plugin-dts

### `.npmignore`
Files excluded from npm package:
- Source files (`.ts`)
- Development configs
- Examples (optional)
- Documentation source

### `.gitignore`
Files excluded from git:
- `node_modules/`
- `dist/`
- Build artifacts
- IDE files
- OS files

## Development Workflow

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Type Checking
```bash
npm run type-check
```

### Building
```bash
npm run build
```

### Publishing
```bash
npm publish
```

The `prepublishOnly` script automatically runs the build before publishing.

## Package Exports

The package uses modern package.json exports field:

```json
{
  "exports": {
    ".": {
      "import": "./dist/iframe-resizing.js",
      "require": "./dist/iframe-resizing.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

This provides:
- Automatic format selection based on consumer
- TypeScript type support
- Future-proof export mapping

## Dependencies

### Runtime
- `uuid@^9.0.1` - UUID generation for command IDs

### Development
- `typescript@^5.3.3` - TypeScript compiler
- `vite@^5.0.8` - Build tool
- `vite-plugin-dts@^3.7.0` - TypeScript declaration generation

## Browser Compatibility

- **Core Features**: All modern browsers (Chrome 64+, Firefox 69+, Safari 13.1+)
- **ResizeObserver**: Required, polyfill available for older browsers
- **postMessage**: Universal support
- **ES Modules**: Modern browsers and bundlers
- **CommonJS**: Node.js and all bundlers

## Bundle Size

| Format | Uncompressed | Gzipped |
|--------|-------------|---------|
| ES Module | 1.71 KB | 0.80 KB |
| CommonJS | 1.41 KB | 0.76 KB |

Very lightweight with minimal overhead!

## Publishing Checklist

Before publishing to npm:

1. ✅ Update version in `package.json`
2. ✅ Update `CHANGELOG.md`
3. ✅ Run `npm run type-check`
4. ✅ Run `npm run build`
5. ✅ Test in example applications
6. ✅ Review `dist/` output
7. ✅ Commit changes
8. ✅ Create git tag
9. ✅ Run `npm publish`
10. ✅ Push to repository with tags

## Testing the Package Locally

To test the package before publishing:

```bash
# In the package directory
npm pack

# This creates a .tgz file
# In your test project
npm install /path/to/andsafe-iframe-resizing-1.0.0.tgz
```

Or use npm link:

```bash
# In the package directory
npm link

# In your test project
npm link @andsafe/iframe-resizing
```

## Future Enhancements

Potential improvements for future versions:

- [ ] Add CI/CD pipeline
- [ ] Add ResizeObserver polyfill option
- [ ] Add width monitoring option
- [ ] Add retry logic for failed messages
- [ ] Add message queue for multiple resizes
