/**
 * @packageDocumentation
 * IFrame Resizing - Standalone iframe height resizing for applications
 *
 * @deprecated This package is deprecated. Please migrate to `@andsafe/iframe-messaging`
 * (https://www.npmjs.com/package/@andsafe/iframe-messaging), which provides generic
 * bidirectional postMessage communication between iframes and parent windows.
 *
 * This package only reported iframe size to the parent window. The new package covers
 * the same use case and much more.
 */

export { autoInitIFrameResizing, initIFrameResizing } from './iframe-resizing';
export type { Command, CommandResponse, IFrameResizingOptions, Participant } from './types';
export { participants } from './types';
