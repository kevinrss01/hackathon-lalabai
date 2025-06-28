import { SpeechToTextService } from '@/services/speechToText.service';
import { Request, Response } from 'express';
import { z } from 'zod';

const textValidator = z.object({
  data: z.string().min(1, 'The text data must not be empty').trim(),
});

export class TranscribeController {
  private SpeechToTextService = new SpeechToTextService();

  process = async (req: Request, res: Response): Promise<void> => {
    let textData: string | undefined;
    let transcription = null as string | null;

    if (req.body) {
      const result = textValidator.safeParse(req.body);
      if (result.success) textData = result.data.data;
    }

    if (textData) transcription = textData;

    if (req.file && req.file.mimetype.startsWith('audio/')) {
      const transcriptionResult = await this.SpeechToTextService.transcribeAudio({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        size: req.file.size,
      });

      transcription = transcriptionResult;
    }

    if (!transcription) {
      res.status(400).json({ error: 'No valid audio file or text data provided.' });
      return;
    }

    res.json({ success: true, transcription });
  };
}
