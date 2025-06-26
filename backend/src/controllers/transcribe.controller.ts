import { Request, Response } from 'express';

export class TranscribeController {
  // private SpeechToTextService: SpeechToTextService;

  constructor() {
    // this.SpeechToTextService = new SpeechToTextService();
  }

  process = async (req: Request, res: Response): Promise<void> => {
    const { type, data }: { type: string; data: unknown } = req.body;

    console.log('type, data', type, data);

    if (!type || !data) {
      res.status(400).json({ success: false, message: 'Type and data are required.' });
      return;
    }

    let result;

    res.json({ success: true, result });
  };
}
