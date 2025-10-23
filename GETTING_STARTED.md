# Getting Started with @andsafe/iframe-resizing

This guide will help you quickly get started with the iframe resizing library.

## Quick Start (30 seconds)

### 1. Install the package

```bash
npm install @andsafe/iframe-resizing
```

### 2. Add to your embedded application

**JavaScript (ES6):**
```javascript
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';

autoInitIFrameResizing();
```

**TypeScript:**
```typescript
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';

autoInitIFrameResizing();
```

**HTML (Script tag):**
```html
<script type="module">
  import { autoInitIFrameResizing } from './node_modules/@andsafe/iframe-resizing/dist/iframe-resizing.js';
  autoInitIFrameResizing();
</script>
```

That's it! Your iframe will now automatically communicate its height to the parent window.

## Parent Window Setup

The parent window needs to handle the resize messages. Here's a minimal example:

```javascript
// Get reference to your iframe
const iframe = document.querySelector('#my-iframe');

// Listen for resize messages
window.addEventListener('message', (event) => {
  const { name, payload, id, sender } = event.data;

  if (name === 'resize' && sender === 'child') {
    const height = payload[0][0];

    // Update iframe height
    iframe.style.height = `${height}px`;

    // Send acknowledgment
    event.source.postMessage({
      id: crypto.randomUUID(),
      correspondingCommandId: id,
      sender: 'parent',
      receiver: 'child',
      payload: undefined
    }, '*');
  }
});
```

## Common Scenarios

### Scenario 1: Simple Embedded Form

**Child (embedded form):**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Contact Form</title>
  <script type="module">
    import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';
    autoInitIFrameResizing();
  </script>
</head>
<body>
  <form>
    <input type="text" name="name" placeholder="Name">
    <input type="email" name="email" placeholder="Email">
    <textarea name="message" placeholder="Message"></textarea>
    <button type="submit">Send</button>
  </form>
</body>
</html>
```

### Scenario 2: Dynamic Content Application

```typescript
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';

// Initialize resizing
const cleanup = autoInitIFrameResizing({
  onError: (error) => console.error('Resize failed:', error)
});

// Load and add dynamic content
async function loadContent() {
  const response = await fetch('/api/content');
  const html = await response.text();

  document.getElementById('content').innerHTML = html;
  // Height change is automatically detected and communicated!
}

// Cleanup on navigation
window.addEventListener('beforeunload', cleanup);
```

## Advanced Usage

### With Error Handling and Monitoring

```typescript
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';

const cleanup = autoInitIFrameResizing({
  onError: (error) => {
    // Show user-friendly error
    console.error('Failed to resize iframe:', error);
    showErrorToast('Connection to parent window lost');
  },
  captureError: (error) => {
    // Send to your monitoring service
    if (window.Sentry) {
      window.Sentry.captureException(error);
    }
  }
});
```

### Understanding the Two Initialization Methods

The library provides two initialization functions:

#### `autoInitIFrameResizing()` - Recommended ⭐

**Smart initialization** that automatically handles DOM ready state:

```typescript
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';

// Can be called anywhere - even before DOM is ready!
const cleanup = autoInitIFrameResizing({
  onError: (error) => console.error(error)
});
```

**How it works:**
- Checks if DOM is ready (`document.readyState`)
- If DOM is still loading → waits for `DOMContentLoaded` event
- If DOM is ready → initializes immediately
- ✅ Safe to call anytime, anywhere in your code

**Use this when:**
- You want convenience and safety (most cases)
- You're not sure about DOM timing
- You're loading the script early in the page

#### `initIFrameResizing()` - Manual Control

**Immediate initialization** without DOM checks:

```typescript
import { initIFrameResizing } from '@andsafe/iframe-resizing';

// Only call after DOM is ready!
document.addEventListener('DOMContentLoaded', () => {
  // Initialize your app first
  initializeApp();

  // Then start resize monitoring
  const cleanup = initIFrameResizing({
    onError: (error) => console.error(error)
  });

  // Store cleanup for later
  window.cleanupResize = cleanup;
});
```

**How it works:**
- Initializes immediately when called
- Does NOT wait for DOM ready
- Assumes `document.body` exists
- ⚠️ Will log warning if called too early

**Use this when:**
- You need manual control over timing
- You're already inside a DOM ready handler
- Your framework handles DOM ready state
- You're using `defer` script attribute

#### Comparison Table

| Feature | `autoInitIFrameResizing` | `initIFrameResizing` |
|---------|-------------------------|----------------------|
| DOM Ready Check | ✅ Automatic | ❌ You must ensure it |
| Safe Early Call | ✅ Yes | ❌ No |
| Waits for DOM | ✅ If needed | ❌ Never |
| Recommended | ✅ Yes | Only if you need control |

**Example - Wrong vs Right:**

```typescript
// ❌ WRONG - initIFrameResizing called too early
import { initIFrameResizing } from '@andsafe/iframe-resizing';
const cleanup = initIFrameResizing(); // May fail if body doesn't exist!

// ✅ RIGHT - initIFrameResizing with DOM ready check
import { initIFrameResizing } from '@andsafe/iframe-resizing';
document.addEventListener('DOMContentLoaded', () => {
  const cleanup = initIFrameResizing(); // Safe!
});

// ✅ BEST - autoInitIFrameResizing (handles everything)
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';
const cleanup = autoInitIFrameResizing(); // Always safe!
```

### Class-Based Application

```typescript
import { initIFrameResizing, type IFrameResizingOptions } from '@andsafe/iframe-resizing';

class EmbeddedApplication {
  private resizeCleanup?: () => void;

  constructor(private config: IFrameResizingOptions = {}) {}

  async init() {
    // Initialize your app
    await this.loadData();
    this.setupUI();

    // Start resize monitoring
    this.resizeCleanup = initIFrameResizing(this.config);
  }

  destroy() {
    // Cleanup resize monitoring
    this.resizeCleanup?.();
  }
}

// Usage
const app = new EmbeddedApplication({
  onError: (error) => console.error(error)
});

app.init();
```

## Troubleshooting

### Issue: Iframe not resizing

**Possible causes:**
1. Parent window is not handling resize messages
2. Cross-origin restrictions
3. Initialization happened before DOM was ready

**Solutions:**
```javascript
// 1. Verify parent window has message handler
console.log('Parent handler installed?');

// 2. Check initialization
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';
const cleanup = autoInitIFrameResizing({
  onError: (error) => console.error('ERROR:', error)
});

// 3. Check console for errors
```

### Issue: Getting timeout errors

**Cause:** Parent window is not sending acknowledgments

**Solution:** Ensure parent sends response:
```javascript
window.addEventListener('message', (event) => {
  if (event.data.name === 'resize') {
    // Update height
    iframe.style.height = event.data.payload[0][0] + 'px';

    // IMPORTANT: Send acknowledgment
    event.source.postMessage({
      id: crypto.randomUUID(),
      correspondingCommandId: event.data.id,
      sender: 'parent',
      receiver: 'child',
      payload: undefined
    }, '*');
  }
});
```

### Issue: TypeScript errors

**Error:** Cannot find module '@andsafe/iframe-resizing'

**Solution:**
```bash
# Ensure package is installed
npm install @andsafe/iframe-resizing

# Check your tsconfig.json includes node_modules
{
  "compilerOptions": {
    "moduleResolution": "bundler" // or "node"
  }
}
```

## Testing Locally

Before deploying, test locally:

### 1. Build your embedded app
```bash
npm run build
```

### 2. Serve locally
```bash
npx serve dist
```

### 3. Create test parent page
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Parent</title>
</head>
<body>
  <h1>Test Parent Window</h1>
  <iframe id="test" src="http://localhost:3000"></iframe>

  <script>
    const iframe = document.getElementById('test');

    window.addEventListener('message', (e) => {
      console.log('Message:', e.data);
      if (e.data.name === 'resize') {
        iframe.style.height = e.data.payload[0][0] + 'px';
        e.source.postMessage({
          id: crypto.randomUUID(),
          correspondingCommandId: e.data.id,
          sender: 'parent',
          receiver: 'child',
          payload: undefined
        }, '*');
      }
    });
  </script>
</body>
</html>
```

## Best Practices

### 1. Initialize Early
```typescript
// Good - Initialize as soon as module loads
import { autoInitIFrameResizing } from '@andsafe/iframe-resizing';
const cleanup = autoInitIFrameResizing();

// Less ideal - Delayed initialization may miss initial resize
setTimeout(() => {
  const cleanup = autoInitIFrameResizing();
}, 5000);
```

### 2. Always Cleanup
```typescript
const cleanup = autoInitIFrameResizing();

// On SPA navigation
router.beforeEach(() => {
  cleanup();
});

// On page unload
window.addEventListener('beforeunload', cleanup);
```

### 3. Handle Errors Gracefully
```typescript
autoInitIFrameResizing({
  onError: (error) => {
    // Don't throw - just log
    console.warn('Resize failed:', error);
  }
});
```

### 4. Use TypeScript
```typescript
import type { IFrameResizingOptions } from '@andsafe/iframe-resizing';

const options: IFrameResizingOptions = {
  onError: (error: Error) => console.error(error)
};
```

## Performance Considerations

The library is highly optimized:

- **Tiny bundle**: ~0.8KB gzipped
- **Efficient**: Uses ResizeObserver (browser-native)
- **Debounced**: ResizeObserver naturally debounces
- **Non-blocking**: Runs in separate observer thread

No performance tuning needed for most use cases!

## Next Steps

1. **Read the API docs** - See [README.md](./README.md) for complete API reference
2. **Check examples** - Look in `examples/` for more use cases
3. **Review project structure** - See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
4. **Report issues** - Open issues on GitHub

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🏗️ [Project Structure](./PROJECT_STRUCTURE.md)
- 💻 [Examples](./examples/)
- 🐛 [Report Issues](https://github.com/andsafe-AG/iframe-resizing/issues)

## Quick Reference

```typescript
// Import
import {
  autoInitIFrameResizing,  // Auto-init (recommended)
  initIFrameResizing,      // Manual init
  type IFrameResizingOptions
} from '@andsafe/iframe-resizing';

// Basic usage
const cleanup = autoInitIFrameResizing();

// With options
const cleanup = autoInitIFrameResizing({
  onError: (e) => console.error(e),
  captureError: (e) => Sentry.captureException(e)
});

// Cleanup
cleanup();
```

Happy coding! 🚀
