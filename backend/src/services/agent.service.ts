import { Agent, run, webSearchTool } from '@openai/agents';
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
      model: 'o4-mini',
      tools: [webSearchTool()],
      instructions: instructions.travelAgent,
    });

    this.agent.on('agent_start', (ctx, agent) => {
      console.log(`[${agent.name}] started`);
    });

    this.agent.on('agent_end', (ctx, output) => {
      console.log(`[${this.agent.name}] produced:`, output);
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
      console.log('\n=== Starting Travel Research ===');
      console.log(`📝 User prompt: "${prompt}"`);
      console.log('⏳ Processing...\n');

      // Run the agent
      console.log('🤖 Agent is thinking...');
      const startTime = Date.now();

      const result = await run(this.agent, prompt);

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`\n✅ Agent completed in ${duration} seconds`);

      const response = result.finalOutput || 'No travel information could be generated.';
      const sources = this.extractSources(response);

      // Log summary
      console.log('\n📊 Summary:');
      console.log(`- Response length: ${response.length} characters`);
      console.log(`- Sources found: ${sources.length}`);
      if (sources.length > 0) {
        console.log('- Sources:');
        sources.forEach((source, index) => {
          console.log(`  ${index + 1}. ${source}`);
        });
      }
      console.log('=== Travel Research Completed ===\n');

      return {
        response,
        sources: sources.length > 0 ? sources : undefined,
      };
    } catch (error) {
      console.error('❌ Error researching travel:', error);
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
