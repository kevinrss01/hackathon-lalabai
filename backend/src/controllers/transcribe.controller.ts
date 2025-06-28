import { AssistantOrchestratorService } from '@/services/assistantOrchestrator.service';
import { Request, Response } from 'express';
import { z } from 'zod';

const textValidator = z.object({
  data: z.string().min(1, 'The text data must not be empty').trim(),
});

export type AudioFile = {
  buffer: Buffer;
  mimetype: string;
  originalname?: string;
  size: number;
};

export class TranscribeController {
  private assistantOrchestratorService = new AssistantOrchestratorService();
  private extractInput(req: Request) {
    const input: { text?: string; audioFile?: AudioFile } = {};

    if (req.body) {
      const result = textValidator.safeParse(req.body);
      if (result.success) {
        input.text = result.data.data;
      }
    }

    if (req.file && req.file.mimetype.startsWith('audio/')) {
      input.audioFile = {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        size: req.file.size,
      };
    }

    return input;
  }

  process = async (req: Request, res: Response): Promise<void> => {
    const input = this.extractInput(req);
    if (!input.text && !input.audioFile) {
      res
        .status(400)
        .json({ error: 'No valid input provided. Please provide either text or an audio file.' });
      return;
    }

    const result = await this.assistantOrchestratorService.processRequest(input);

    res.json({
      success: true,
      response: result,
    });
  };
}
