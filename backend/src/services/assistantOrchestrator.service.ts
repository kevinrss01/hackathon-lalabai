import { AudioFile } from '@/controllers/transcribe.controller';
import { SpeechToTextService } from './speechToText.service';
import { LlamaService } from './llama.service';
import { PromptsService } from './prompts/prompts.service';
import { instructions } from './prompts/instructions';
import { AgentService } from './agent.service';
import { SocketIOService } from './socketio.service';

export class AssistantOrchestratorService {
  private speechToTextService = new SpeechToTextService();
  private llamaService = new LlamaService();
  private agentService = new AgentService();
  private promptsService = new PromptsService();
  private socketIOService = SocketIOService.getInstance();

  getTextFromInput = (input: { text?: string; audioFile?: AudioFile }) => {
    if (input.audioFile) return this.speechToTextService.transcribeAudio(input.audioFile);
    if (input.text) return input.text;
    throw new Error('No valid input provided. Please provide either text or an audio file.');
  };

  processRequest = async (userQuery: string, conversationId?: string) => {
    try {
      if (!userQuery)
        throw new Error('No valid input provided. Please provide either text or an audio file.');

      console.debug('transcription', userQuery);

      if (conversationId) {
        console.log(`📤 Sending progress to room ${conversationId}: 'Processing your request...'`);
        this.socketIOService.sendProgress(conversationId, 'Processing your request...');
      }

      const prompt = this.promptsService.getPromptToTransformUserQueryToAgentPrompt(userQuery);

      const llamaInstructions = instructions.llamaBaseInstructions;

      if (conversationId) {
        console.log(`📤 Sending progress to room ${conversationId}: 'Analyzing your query...'`);
        this.socketIOService.sendProgress(conversationId, 'Analyzing your query...');
      }

      const llamaPrompt = await this.llamaService.promptLlama({
        instructions: llamaInstructions,
        prompt,
      });

      console.debug('llamaPrompt', llamaPrompt);

      const agentResponse = await this.agentService.researchTravel(llamaPrompt, conversationId);

      const totalResponses = `
      ${agentResponse.response}
      ${agentResponse.sources?.map((source) => `- ${source}`).join('\n')}
      `;

      if (conversationId) {
        console.log(
          `📤 Sending progress to room ${conversationId}: 'Preparing your personalized response...'`
        );
        this.socketIOService.sendProgress(
          conversationId,
          'Preparing your personalized response...'
        );
      }

      const promptToTransformAgentResponseToReadable =
        this.promptsService.getPromptToTransformAgentResponseToReadable(totalResponses, userQuery);

      const readableResponse = await this.llamaService.promptLlama({
        instructions: llamaInstructions,
        prompt: promptToTransformAgentResponseToReadable,
      });

      console.debug('readableResponse', readableResponse);

      if (conversationId) {
        console.log(`📤 Sending final response to room ${conversationId}`);
        this.socketIOService.sendFinalResponse(conversationId, readableResponse);
      }

      return readableResponse;
    } catch (error) {
      console.error('Error in processRequest', error);

      if (conversationId) {
        this.socketIOService.sendToRoom(conversationId, 'agent-error', {
          error: error instanceof Error ? error.message : 'An error occurred',
          timestamp: new Date(),
        });
      }

      throw error;
    }
  };
}
