import { Agent, run } from '@openai/agents';
import { config } from '../config/config';
import { instructions } from './prompts/instructions';

// Set the OpenAI API key globally
if (config.openai.apiKey) {
  process.env.OPENAI_API_KEY = config.openai.apiKey;
}

export class AgentService {
  private agent: Agent;

  constructor() {
    this.agent = new Agent({
      name: 'Travel Research Assistant',
      model: 'gpt-4.1',
      instructions: instructions.travelAgent,
    });
  }

  /**
   * Research travel information based on a user prompt
   * @param prompt - The travel query string (e.g., "I want to go from Paris to London on December 15th")
   * @returns Comprehensive travel information with sources
   */
  async researchTravel(prompt: string): Promise<{
    response: string;
    sources?: string[];
  }> {
    try {
      const result = await run(this.agent, prompt);

      const response = result.finalOutput || 'No travel information could be generated.';

      const sources = this.extractSources(response);

      return {
        response,
        sources: sources.length > 0 ? sources : undefined,
      };
    } catch (error) {
      console.error('Error researching travel:', error);
      throw new Error('Failed to research travel information');
    }
  }

  /**
   * Extract source URLs from the agent's response
   * Simple regex-based extraction for URLs
   */
  private extractSources(text: string): string[] {
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const matches = text.match(urlRegex) || [];

    return [...new Set(matches)];
  }
}
