import Groq from 'groq-sdk';
import 'dotenv/config';

export class LlamaService {
  private groq: Groq;

  constructor() {
    if (!process.env.GROQ_API_KEY)
      throw new Error('GROQ_API_KEY is not defined in environment variables');
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async promptLlama(text: string, instructions: string) {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: instructions,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return chatCompletion.choices[0].message.content;
  }
}
