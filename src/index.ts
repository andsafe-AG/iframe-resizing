/**
 * @packageDocumentation
 * IFrame Resizing - Standalone iframe height resizing for applications
 *
 * This package provides automatic iframe height resizing functionality by monitoring
 * the document body and communicating size changes to the parent window.
 */

export { autoInitIFrameResizing, initIFrameResizing } from './iframe-resizing';
export type { Command, CommandResponse, IFrameResizingOptions, Participant } from './types';
export { participants } from './types';
