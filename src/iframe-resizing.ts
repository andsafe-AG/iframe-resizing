/**
 * Standalone iframe resizing script for applications
 *
 * This script provides automatic iframe height resizing functionality by monitoring
 * the document body and communicating size changes to the parent window via postMessage.
 *
 * @packageDocumentation
 */

import { v4 as uuidv4 } from 'uuid';
import type { Command, CommandResponse, IFrameResizingOptions } from './types';
import { participants } from './types';

/**
 * Sends a resize command to the parent window
 * @param height - The new height to communicate to the parent
 * @returns Promise that resolves when the resize is acknowledged
 * @internal
 */
function sendResizeCommand(height: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const command: Command = {
      id: uuidv4(),
      sender: participants.CHILD,
      receiver: participants.PARENT,
      name: 'resize',
      payload: [[height]],
    };

    const timeout = setTimeout(() => {
      window.removeEventListener('message', listener);
      reject(new Error(`Timeout exceeded for command resize`));
    }, 20000);

    function listener({ data: commandResponse }: MessageEvent<CommandResponse>) {
      if (
        command.sender !== commandResponse.receiver ||
        command.id !== commandResponse.correspondingCommandId
      ) {
        // this is not the response we are looking for
        return;
      }

      clearTimeout(timeout);
      window.removeEventListener('message', listener);
      resolve();
    }

    window.addEventListener('message', listener, false);
    window.parent.postMessage(command, '*');
  });
}

/**
 * Checks if code is running on server side
 * @returns true if running on server side
 * @internal
 */
function isServerSide(): boolean {
  return typeof window === 'undefined';
}

/**
 * Initializes iframe resizing functionality
 *
 * This function sets up a ResizeObserver on the document body that automatically
 * communicates size changes to the parent window via postMessage.
 *
 * @param options - Configuration options
 * @returns Cleanup function to disconnect the observer
 *
 * @example
 * ```typescript
 * // Basic usage
 * const cleanup = initIFrameResizing();
 *
 * // With error handling
 * const cleanup = initIFrameResizing({
 *   onError: (error) => console.error('Failed to resize:', error),
 *   captureError: (error) => Sentry.captureException(error)
 * });
 *
 * // Cleanup when done
 * cleanup();
 * ```
 *
 * @public
 */
export function initIFrameResizing(options: IFrameResizingOptions = {}): () => void {
  const { onError, captureError } = options;

  if (isServerSide()) {
    console.warn('initIFrameResizing: Cannot initialize on server side');
    return () => {};
  }

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;

    const { contentRect } = entry;

    sendResizeCommand(contentRect.height).catch((error) => {
      console.warn(error.message);

      if (onError) {
        onError(error);
      }

      if (captureError) {
        captureError(error);
      }
    });
  });

  const { body } = document;

  if (body) {
    observer.observe(body);
  } else {
    console.warn('initIFrameResizing: Document body not found');
  }

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
}

/**
 * Auto-initializes iframe resizing when DOM is ready
 *
 * This is a convenience function that automatically waits for DOMContentLoaded
 * if the document is still loading, or initializes immediately if the DOM is ready.
 *
 * @param options - Configuration options (same as initIFrameResizing)
 * @returns Cleanup function
 *
 * @example
 * ```typescript
 * // Call this at the top level of your script
 * const cleanup = autoInitIFrameResizing({
 *   onError: (error) => console.error(error)
 * });
 *
 * // Or with no options
 * const cleanup = autoInitIFrameResizing();
 * ```
 *
 * @public
 */
export function autoInitIFrameResizing(options: IFrameResizingOptions = {}): () => void {
  if (isServerSide()) {
    return () => {};
  }

  if (document.readyState === 'loading') {
    let cleanup = () => {};

    document.addEventListener('DOMContentLoaded', () => {
      cleanup = initIFrameResizing(options);
    });

    return () => cleanup();
  } else {
    return initIFrameResizing(options);
  }
}

// For UMD/browser global usage
declare global {
  interface Window {
    IFrameResizing?: {
      init: typeof initIFrameResizing;
      autoInit: typeof autoInitIFrameResizing;
    };
  }
}

if (typeof window !== 'undefined') {
  window.IFrameResizing = {
    init: initIFrameResizing,
    autoInit: autoInitIFrameResizing,
  };
}
