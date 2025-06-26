import { Request, Response } from 'express';

export class TranscribeController {
  // private SpeechToTextService: SpeechToTextService;

  constructor() {
    // this.SpeechToTextService = new SpeechToTextService();
  }

  process = async (req: Request, res: Response): Promise<void> => {
    let result;

    res.json({ success: true, result });
  };
}
