import { AudioFile } from '@/controllers/transcribe.controller';
import { SpeechToTextService } from './speechToText.service';
import { LlamaService } from './llama.service';
import { PromptsService } from './prompts/prompts.service';
import { instructions } from './prompts/instructions';
import { AgentService } from './agent.service';

export class AssistantOrchestratorService {
  private speechToTextService = new SpeechToTextService();
  private llamaService = new LlamaService();
  private agentService = new AgentService();
  private promptsService = new PromptsService();

  processRequest = async (input: { text?: string; audioFile?: AudioFile }) => {
    try {
      let transcription: string | null = null;

      if (input.audioFile)
        transcription = await this.speechToTextService.transcribeAudio(input.audioFile);

      if (input.text) transcription = input.text;

      if (!transcription)
        throw new Error('No valid input provided. Please provide either text or an audio file.');

      console.debug('transcription', transcription);

      // get instructions
      const prompt = this.promptsService.getPromptToTransformUserQueryToAgentPrompt(transcription);

      const llamaInstructions = instructions.llamaBaseInstructions;

      const llamaPrompt = await this.llamaService.promptLlama({
        instructions: llamaInstructions,
        prompt,
      });

      console.debug('llamaPrompt', llamaPrompt);

      const agentResponse = await this.agentService.researchTravel(llamaPrompt);

      const totalResponses = `
      ${agentResponse.response}
      ${agentResponse.sources?.map((source) => `- ${source}`).join('\n')}
      `;

      const promptToTransformAgentResponseToReadable =
        this.promptsService.getPromptToTransformAgentResponseToReadable(
          totalResponses,
          transcription
        );

      const readableResponse = await this.llamaService.promptLlama({
        instructions: llamaInstructions,
        prompt: promptToTransformAgentResponseToReadable,
      });

      console.debug('readableResponse', readableResponse);

      return readableResponse;
    } catch (error) {
      console.error('Error in processRequest', error);
      throw error;
    }
  };
}
