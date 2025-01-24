import { AgentType } from '../../config/agent-config';
import { McpClient } from '../mcp/client';
import { BaseAgent } from './base-agent';
import { 
  TransactionOptimizerAgent, 
  ProgramDeploymentAgent, 
  AccountAnalyzerAgent, 
  SmartContractAuditorAgent, 
  DataScraperAgent 
} from './agent-types';

/**
 * Factory for creating agent instances
 * This class handles the creation of different agent types
 */
export class AgentFactory {
  private mcpClient: McpClient;
  
  constructor(mcpClient: McpClient) {
    this.mcpClient = mcpClient;
  }
  
  /**
   * Create a new agent instance
   * @param type The type of agent to create
   * @param id Optional ID for the agent (auto-generated if not provided)
   * @param name Optional name for the agent (defaults to type name if not provided)
   * @param options Additional agent options
   * @returns A new agent instance of the specified type
   */
  public createAgent(
    type: AgentType, 
    id?: string, 
    name?: string, 
    options?: Record<string, any>
  ): BaseAgent {
    // Generate an ID if not provided
    const agentId = id || `${type}-${Date.now()}`;
    
    // Create different agent types based on the specified type
    switch (type) {
      case 'transaction-optimizer':
        return new TransactionOptimizerAgent(agentId, name, this.mcpClient, options);
        
      case 'program-deployment':
        return new ProgramDeploymentAgent(agentId, name, this.mcpClient, options);
        
      case 'account-analyzer':
        return new AccountAnalyzerAgent(agentId, name, this.mcpClient, options);
        
      case 'smart-contract-auditor':
        return new SmartContractAuditorAgent(agentId, name, this.mcpClient, options);
        
      case 'data-scraper':
        return new DataScraperAgent(agentId, name, this.mcpClient, options);
        
      default:
        throw new Error(`Unsupported agent type: ${type}`);
    }
  }
  
  /**
   * Load an existing agent from saved configuration
   * @param agentData Saved agent data
   * @returns A new agent instance initialized with the saved data
   */
  public loadAgent(agentData: any): BaseAgent {
    if (!agentData || !agentData.type || !agentData.id) {
      throw new Error('Invalid agent data');
    }
    
    // Create a new agent of the specified type
    const agent = this.createAgent(
      agentData.type as AgentType,
      agentData.id,
      agentData.name,
      agentData.options
    );
    
    // Initialize with saved state if available
    if (agentData.state) {
      agent.loadState(agentData.state);
    }
    
    return agent;
  }
  
  /**
   * Clone an existing agent
   * @param agent The agent to clone
   * @param newId Optional new ID for the cloned agent
   * @param newName Optional new name for the cloned agent
   * @returns A new agent instance with the same configuration
   */
  public cloneAgent(agent: BaseAgent, newId?: string, newName?: string): BaseAgent {
    const agentState = agent.saveState();
    
    // Create a new agent with the same type and options
    const clonedAgent = this.createAgent(
      agent.getType(),
      newId || `${agent.getId()}-clone-${Date.now()}`,
      newName || `${agent.getName()} (Clone)`,
      agent.getOptions()
    );
    
    // Copy the state from the original agent
    clonedAgent.loadState(agentState);
    
    return clonedAgent;
  }
}

export default AgentFactory;