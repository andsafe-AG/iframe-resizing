# IFrame Resizing Examples

This directory contains example implementations and a development server for testing the iframe resizing library.

## Quick Start

### Starting the Server

```bash
npm run server
```

The server will start at `http://localhost:3000` with permissive headers that allow iframing from any origin.

### Development Mode (with auto-reload)

```bash
npm run server:dev
```

Uses nodemon to automatically restart the server when files change.

## Available Examples

### 1. Vanilla JavaScript (`vanilla-js.html`)
Basic implementation showing how to use the library with plain JavaScript.

**URL:** `http://localhost:3000/examples/vanilla-js.html`

**Features:**
- Auto-initialization of iframe resizing
- Dynamic content addition/removal
- Error handling
- Cleanup on page unload

### 2. Parent-Child Demo (`parent-child-demo.html`)
Complete demonstration showing both parent and child communication.

**URL:** `http://localhost:3000/examples/parent-child-demo.html`

**Features:**
- Live message logging
- Real-time statistics
- Visual representation of parent-child communication
- Automatic iframe height adjustment

### 3. Test IFrame (`test-iframe.html`)
Simple test page to verify iframe resizing functionality.

**URL:** `http://localhost:3000/examples/test-iframe.html`

**Features:**
- Metrics dashboard
- Quick action controls
- Visual feedback for resize events

## Server Features

The example server (`server.js`) is configured with permissive headers to allow embedding from any origin:

### Headers Set

- **X-Frame-Options:** Removed (allows all origins)
- **Content-Security-Policy:** `frame-ancestors *`
- **Access-Control-Allow-Origin:** `*`
- **Access-Control-Allow-Methods:** `GET, POST, OPTIONS`
- **Access-Control-Allow-Headers:** `Content-Type`

### Why These Headers?

These headers are necessary for testing iframe embedding scenarios:

1. **Removed X-Frame-Options** - Allows the pages to be embedded in iframes from any domain
2. **CSP frame-ancestors:** - Modern alternative to X-Frame-Options, set to allow all origins
3. **CORS headers** - Allow cross-origin requests for testing from different domains

> **Note:** These permissive settings are for development/testing only. In production, you should restrict these headers to specific trusted domains.

## Testing Cross-Origin Scenarios

To test cross-origin iframe scenarios:

1. Start the server: `npm run server`
2. Open `http://localhost:3000/examples/parent-child-demo.html`
3. The page will load the child iframe and demonstrate automatic resizing

You can also embed these examples in your own pages:

```html
<iframe
  src="http://localhost:3000/examples/vanilla-js.html"
  id="myFrame"
  style="width: 100%; border: none;"
></iframe>

<script>
  window.addEventListener('message', (event) => {
    if (event.data.name === 'resize' && event.data.sender === 'child') {
      const iframe = document.getElementById('myFrame');
      const [height] = event.data.payload[0];
      iframe.style.height = height + 'px';

      // Send acknowledgment
      iframe.contentWindow.postMessage({
        id: event.data.id,
        sender: 'parent',
        receiver: 'child',
        correspondingCommandId: event.data.id
      }, '*');
    }
  });
</script>
```

## File Structure

```
examples/
├── server.js                 # Express server with permissive headers
├── vanilla-js.html           # Basic vanilla JS implementation
├── parent-child-demo.html    # Full parent-child communication demo
├── test-iframe.html          # Simple test page
└── README.md                 # This file
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm run server
```

### CORS Issues

If you're experiencing CORS issues, ensure:
1. The server is running
2. You're accessing the pages through the server (not opening files directly)
3. Your browser allows cross-origin communication

### Iframe Not Resizing

Check the browser console for errors. Common issues:
1. Missing build files in `/dist` directory (run `npm run build`)
2. JavaScript errors in the child page
3. Parent page not listening for messages correctly

## Production Considerations

When deploying to production, remember to:

1. **Restrict frame-ancestors** - Replace `*` with specific allowed domains
2. **Set proper X-Frame-Options** - Use `SAMEORIGIN` or specific domains
3. **Limit CORS origins** - Only allow trusted domains
4. **Use HTTPS** - Ensure secure communication
5. **Validate message origins** - Check `event.origin` in message handlers

Example production headers:

```javascript
res.setHeader('X-Frame-Options', 'ALLOW-FROM https://trusted-domain.com');
res.setHeader(
  'Content-Security-Policy',
  "frame-ancestors 'self' https://trusted-domain.com"
);
res.setHeader('Access-Control-Allow-Origin', 'https://trusted-domain.com');
```
