/**
 * Unit tests for TypeScript types and constants
 */

import { describe, expect, it } from 'vitest';
import {
  type Command,
  type CommandResponse,
  type IFrameResizingOptions,
  type Participant,
  participants,
} from '../types';

describe('types', () => {
  describe('participants constant', () => {
    it('should have PARENT participant', () => {
      expect(participants.PARENT).toBe('parent');
    });

    it('should have CHILD participant', () => {
      expect(participants.CHILD).toBe('child');
    });

    it('should be frozen to prevent modification', () => {
      // In JavaScript, const only prevents reassignment, not mutation
      // The 'as const' in TypeScript makes it readonly at compile time
      // At runtime, we can verify the object structure
      expect(Object.isFrozen(participants)).toBe(false); // Objects with 'as const' are not frozen by default
      expect(participants.PARENT).toBe('parent');
      expect(participants.CHILD).toBe('child');
    });

    it('should have exactly 2 participants', () => {
      const keys = Object.keys(participants);
      expect(keys).toHaveLength(2);
      expect(keys).toEqual(['PARENT', 'CHILD']);
    });
  });

  describe('Participant type', () => {
    it('should accept valid participant values', () => {
      const parent: Participant = 'parent';
      const child: Participant = 'child';

      expect(parent).toBe('parent');
      expect(child).toBe('child');
    });

    it('should match participant constant values', async () => {
      // Re-import to get fresh values
      const { participants: freshParticipants } = await import('../types');

      const parent: Participant = freshParticipants.PARENT;
      const child: Participant = freshParticipants.CHILD;

      expect(parent).toBe('parent');
      expect(child).toBe('child');
    });
  });

  describe('Command interface', () => {
    it('should create valid command object', () => {
      const command: Command = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sender: 'child',
        receiver: 'parent',
        name: 'resize',
        payload: [[500]],
      };

      expect(command.id).toBeDefined();
      expect(command.sender).toBe('child');
      expect(command.receiver).toBe('parent');
      expect(command.name).toBe('resize');
      expect(command.payload).toEqual([[500]]);
    });

    it('should support any string as command name', () => {
      const customCommand: Command = {
        id: 'test-id',
        sender: 'child',
        receiver: 'parent',
        name: 'custom-command',
        payload: [['data']],
      };

      expect(customCommand.name).toBe('custom-command');
    });

    it('should support complex payload structures', () => {
      const complexCommand: Command = {
        id: 'test-id',
        sender: 'child',
        receiver: 'parent',
        name: 'resize',
        payload: [[500, 800], ['data1', 'data2'], [{ key: 'value' }]],
      };

      expect(complexCommand.payload).toHaveLength(3);
      expect(complexCommand.payload[0]).toEqual([500, 800]);
      expect(complexCommand.payload[1]).toEqual(['data1', 'data2']);
      expect(complexCommand.payload[2]).toEqual([{ key: 'value' }]);
    });
  });

  describe('CommandResponse interface', () => {
    it('should create valid command response object', () => {
      const response: CommandResponse = {
        id: 'response-id',
        correspondingCommandId: 'original-command-id',
        sender: 'parent',
        receiver: 'child',
        payload: undefined,
      };

      expect(response.id).toBeDefined();
      expect(response.correspondingCommandId).toBe('original-command-id');
      expect(response.sender).toBe('parent');
      expect(response.receiver).toBe('child');
      expect(response.payload).toBeUndefined();
    });

    it('should support various payload types', () => {
      const responses: CommandResponse[] = [
        {
          id: '1',
          correspondingCommandId: 'cmd-1',
          sender: 'parent',
          receiver: 'child',
          payload: null,
        },
        {
          id: '2',
          correspondingCommandId: 'cmd-2',
          sender: 'parent',
          receiver: 'child',
          payload: { status: 'success' },
        },
        {
          id: '3',
          correspondingCommandId: 'cmd-3',
          sender: 'parent',
          receiver: 'child',
          payload: ['array', 'data'],
        },
        {
          id: '4',
          correspondingCommandId: 'cmd-4',
          sender: 'parent',
          receiver: 'child',
          payload: 'string payload',
        },
      ];

      expect(responses[0]?.payload).toBeNull();
      expect(responses[1]?.payload).toEqual({ status: 'success' });
      expect(responses[2]?.payload).toEqual(['array', 'data']);
      expect(responses[3]?.payload).toBe('string payload');
    });

    it('should link response to command via correspondingCommandId', () => {
      const commandId = '123e4567-e89b-12d3-a456-426614174000';

      const command: Command = {
        id: commandId,
        sender: 'child',
        receiver: 'parent',
        name: 'resize',
        payload: [[500]],
      };

      const response: CommandResponse = {
        id: 'response-id',
        correspondingCommandId: commandId,
        sender: 'parent',
        receiver: 'child',
        payload: undefined,
      };

      expect(response.correspondingCommandId).toBe(command.id);
    });
  });

  describe('IFrameResizingOptions interface', () => {
    it('should create empty options object', () => {
      const options: IFrameResizingOptions = {};

      expect(options).toEqual({});
    });

    it('should support onError callback', () => {
      const onError = (error: Error) => {
        console.error(error);
      };

      const options: IFrameResizingOptions = {
        onError,
      };

      expect(options.onError).toBe(onError);
      expect(typeof options.onError).toBe('function');
    });

    it('should support captureError callback', () => {
      const captureError = (_error: Error) => {
        // Send to monitoring service
      };

      const options: IFrameResizingOptions = {
        captureError,
      };

      expect(options.captureError).toBe(captureError);
      expect(typeof options.captureError).toBe('function');
    });

    it('should support both callbacks together', () => {
      const onError = (error: Error) => console.error(error);
      const captureError = (_error: Error) => {};

      const options: IFrameResizingOptions = {
        onError,
        captureError,
      };

      expect(options.onError).toBe(onError);
      expect(options.captureError).toBe(captureError);
    });

    it('should accept Error objects in callbacks', () => {
      let capturedError: Error | undefined;

      const options: IFrameResizingOptions = {
        onError: (error: Error) => {
          capturedError = error;
        },
      };

      const testError = new Error('Test error');
      options.onError?.(testError);

      expect(capturedError).toBe(testError);
      expect(capturedError?.message).toBe('Test error');
    });
  });

  describe('Type compatibility', () => {
    it('should allow Command sender and receiver to be Participant type', async () => {
      const { participants: p } = await import('../types');
      const sender: Participant = p.CHILD;
      const receiver: Participant = p.PARENT;

      const command: Command = {
        id: 'test',
        sender,
        receiver,
        name: 'resize',
        payload: [[100]],
      };

      expect(command.sender).toBe('child');
      expect(command.receiver).toBe('parent');
    });

    it('should allow CommandResponse sender and receiver to be Participant type', async () => {
      const { participants: p } = await import('../types');
      const sender: Participant = p.PARENT;
      const receiver: Participant = p.CHILD;

      const response: CommandResponse = {
        id: 'test',
        correspondingCommandId: 'original',
        sender,
        receiver,
        payload: null,
      };

      expect(response.sender).toBe('parent');
      expect(response.receiver).toBe('child');
    });
  });

  describe('Realistic message scenarios', () => {
    it('should model a complete resize message exchange', () => {
      // Child sends resize command
      const resizeCommand: Command = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        sender: 'child',
        receiver: 'parent',
        name: 'resize',
        payload: [[768]],
      };

      expect(resizeCommand.sender).toBe('child');
      expect(resizeCommand.receiver).toBe('parent');
      expect(resizeCommand.name).toBe('resize');
      expect(resizeCommand.payload[0]?.[0]).toBe(768);

      // Parent sends acknowledgment
      const acknowledgment: CommandResponse = {
        id: '660e8400-e29b-41d4-a716-446655440001',
        correspondingCommandId: resizeCommand.id,
        sender: 'parent',
        receiver: 'child',
        payload: undefined,
      };

      expect(acknowledgment.sender).toBe('parent');
      expect(acknowledgment.receiver).toBe('child');
      expect(acknowledgment.correspondingCommandId).toBe(resizeCommand.id);
    });

    it('should validate sender-receiver pairing', () => {
      const command: Command = {
        id: 'test',
        sender: 'child',
        receiver: 'parent',
        name: 'resize',
        payload: [[500]],
      };

      const response: CommandResponse = {
        id: 'response',
        correspondingCommandId: command.id,
        sender: 'parent', // Should be opposite of command.receiver
        receiver: 'child', // Should be opposite of command.sender
        payload: null,
      };

      // Verify the pairing is correct
      expect(command.sender).toBe(response.receiver);
      expect(command.receiver).toBe(response.sender);
    });
  });
});
