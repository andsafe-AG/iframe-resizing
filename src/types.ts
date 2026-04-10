/**
 * Participant types in iframe communication
 * @deprecated Use `@andsafe/iframe-messaging` instead. See https://www.npmjs.com/package/@andsafe/iframe-messaging
 */
export const participants = {
  PARENT: 'parent',
  CHILD: 'child',
} as const;

export type Participant = (typeof participants)[keyof typeof participants];

/**
 * Command structure for iframe messaging
 * @deprecated Use `@andsafe/iframe-messaging` instead. See https://www.npmjs.com/package/@andsafe/iframe-messaging
 */
export interface Command {
  id: string;
  sender: Participant;
  receiver: Participant;
  name: string;
  payload: unknown[][];
}

/**
 * Command response structure
 * @deprecated Use `@andsafe/iframe-messaging` instead. See https://www.npmjs.com/package/@andsafe/iframe-messaging
 */
export interface CommandResponse {
  id: string;
  correspondingCommandId: string;
  sender: Participant;
  receiver: Participant;
  payload: unknown;
}

/**
 * Configuration options for iframe resizing
 * @deprecated Use `@andsafe/iframe-messaging` instead. See https://www.npmjs.com/package/@andsafe/iframe-messaging
 */
export interface IFrameResizingOptions {
  /**
   * Error callback function called when resize command fails
   */
  onError?: (error: Error) => void;
  /**
   * Error capture function for monitoring/logging services
   */
  captureError?: (error: Error) => void;
  /**
   * Method used to calculate the iframe height
   * - 'contentRect': Uses the height from ResizeObserver's contentRect (default)
   * - 'scrollHeight': Uses document.documentElement.scrollHeight
   */
  heightCalculationMethod?: 'contentRect' | 'scrollHeight';
}
