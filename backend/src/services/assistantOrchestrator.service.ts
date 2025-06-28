import { AudioFile } from '@/controllers/transcribe.controller';
import { SpeechToTextService } from './speechToText.service';
import { LlamaService } from './llama.service';
import fs from 'fs';
import path from 'path';

export class AssistantOrchestratorService {
  private speechToTextService = new SpeechToTextService();
  private llamaService = new LlamaService();

  private instructions(name: string) {
    const filePath = path.resolve(__dirname, `../instructions/${name}.txt`);
    return fs.readFileSync(filePath, 'utf-8');
  }

  processRequest = async (input: { text?: string; audioFile?: AudioFile }) => {
    let transcription: string | null = null;

    if (input.audioFile)
      transcription = await this.speechToTextService.transcribeAudio(input.audioFile);

    if (input.text) transcription = input.text;

    if (!transcription)
      throw new Error('No valid input provided. Please provide either text or an audio file.');

    // get instructions
    const instructions = this.instructions('llama-instructions');

    const llamaPrompt = await this.llamaService.promptLlama(transcription, instructions);

    // TODO: call here service agentAI, get response and re-send to llama
    console.log('la response de orchestrator', llamaPrompt);
  };
}
