import { AgentType, getAgentConfig } from '../../config/agent-config';
import { McpClient } from '../mcp/client';

/**
 * Response object from an agent
 */
export interface AgentResponse {
  text: string;  // Text response to display to the user
  data?: any;    // Optional structured data from the response
  [key: string]: any;  // Additional fields specific to agent types
}

/**
 * Base class for all agent types
 * Provides common functionality and structure
 */
export abstract class BaseAgent {
  // Agent identification
  protected id: string;
  protected name: string;
  protected type: AgentType;
  
  // State and configuration
  protected options: Record<string, any>;
  protected mcpClient: McpClient;
  protected state: Record<string, any> = {};
  protected networkStatus: any = null;
  protected isCustom: boolean = false;
  
  /**
   * Create a new agent instance
   * @param id Unique identifier for this agent
   * @param name Human-readable name for this agent
   * @param type Agent type
   * @param mcpClient MCP client for data access
   * @param options Optional configuration options
   */
  constructor(
    id: string, 
    name: string, 
    type: AgentType, 
    mcpClient: McpClient, 
    options?: Record<string, any>
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.mcpClient = mcpClient;
    
    // Load agent config and apply default options
    const agentConfig = getAgentConfig(type);
    this.options = {
      ...(agentConfig?.defaultSettings || {}),
      ...(options || {})
    };
  }
  
  /**
   * Get the agent's unique identifier
   */
  public getId(): string {
    return this.id;
  }
  
  /**
   * Get the agent's name
   */
  public getName(): string {
    return this.name;
  }
  
  /**
   * Set a new name for the agent
   * @param name New name for the agent
   */
  public setName(name: string): void {
    this.name = name;
  }
  
  /**
   * Get the agent's type
   */
  public getType(): AgentType {
    return this.type;
  }
  
  /**
   * Get the agent's options
   */
  public getOptions(): Record<string, any> {
    return { ...this.options };
  }
  
  /**
   * Update the agent's options
   * @param options New options to apply (partial update)
   */
  public updateOptions(options: Record<string, any>): void {
    this.options = {
      ...this.options,
      ...options
    };
  }
  
  /**
   * Check if the agent is a custom instance
   */
  public isCustomAgent(): boolean {
    return this.isCustom;
  }
  
  /**
   * Set the agent as a custom instance
   * @param isCustom Whether this is a custom agent
   */
  public setCustom(isCustom: boolean): void {
    this.isCustom = isCustom;
  }
  
  /**
   * Save the current agent state
   * @returns Agent state object
   */
  public saveState(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      options: this.options,
      state: { ...this.state },
      isCustom: this.isCustom
    };
  }
  
  /**
   * Load a saved agent state
   * @param state Saved agent state
   */
  public loadState(state: Record<string, any>): void {
    if (state.id) this.id = state.id;
    if (state.name) this.name = state.name;
    if (state.options) this.options = { ...state.options };
    if (state.state) this.state = { ...state.state };
    if (state.isCustom !== undefined) this.isCustom = state.isCustom;
  }
  
  /**
   * Process a user message and return a response
   * Each agent type should implement its own version of this method
   * @param message The message to process
   * @param context Optional context data
   */
  abstract processMessage(message: string, context?: Record<string, any>): Promise<AgentResponse>;
  
  /**
   * Initialize the agent with any required startup processes
   */
  public async initialize(): Promise<void> {
    // Base implementation does nothing
    // Child classes can override if needed
  }
  
  /**
   * Clean up agent resources when no longer needed
   */
  public async cleanup(): Promise<void> {
    // Base implementation does nothing
    // Child classes can override if needed
  }
  
  /**
   * Reset the agent's state
   */
  public async reset(): Promise<void> {
    this.state = {};
    this.networkStatus = null;
  }
  
  /**
   * Get agent description
   */
  public getDescription(): string {
    const agentConfig = getAgentConfig(this.type);
    return agentConfig?.description || '';
  }
  
  /**
   * Get agent capabilities
   */
  public getCapabilities(): any[] {
    const agentConfig = getAgentConfig(this.type);
    return agentConfig?.capabilities || [];
  }
  
  /**
   * Execute MCP query while handling errors
   * @param method MCP method to call
   * @param params Parameters for the method
   * @returns Result from MCP
   */
  protected async executeMcpQuery(method: string, params: any): Promise<any> {
    try {
      return await this.mcpClient.execute(method, params);
    } catch (error) {
      console.error(`MCP query error in ${this.type} agent:`, error);
      throw new Error(`Failed to execute MCP query: ${error}`);
    }
  }
}