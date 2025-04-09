# LCQ: MCP-Powered AI Agent Framework for Solana

![1500x500 (22)](https://github.com/user-attachments/assets/4504fcab-4bc8-4a51-87f1-994125dba553)

<div align="center">
  <br />
  <br />
  <p>
    <strong>AI Agents that interact with Solana using Model Context Protocol</strong>
  </p>
  <p>
    <a href="https://lcq.gg">Website</a> •
    <a href="https://lcqdocs.site">Documentation</a> •
    <a href="https://x.com/lcqdotgg">Twitter</a>
  </p>
  <p>
    <a href="https://github.com/LCQLabs/lcq/releases">
      <img src="https://img.shields.io/github/v/release/LCQLabs/lcq?style=flat-square" alt="GitHub release" />
    </a>
    <a href="https://github.com/LCQLabs/lcq/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/LCQLabs/lcq?style=flat-square" alt="License" />
    </a>
    <a href="https://github.com/LCQLabs/lcq/stargazers">
      <img src="https://img.shields.io/github/stars/LCQLabs/lcq?style=flat-square" alt="GitHub stars" />
    </a>
  </p>
</div>

## Overview

LCQ is an open-source framework for creating AI agents that interact with the Solana blockchain using Model Context Protocol (MCP). This framework enables developers to build intelligent, context-aware AI agents that can analyze, optimize, and assist with various Solana-related tasks without requiring direct wallet connections.

## What is Model Context Protocol (MCP)?

Model Context Protocol (MCP) is a standardized interface that allows AI models to safely interact with external tools and data sources. For Solana development, MCP provides:

1. **Secure Blockchain Access**: AI can fetch on-chain data without requiring private keys or wallet connections
2. **Standardized Methods**: Common RPC calls like `getBalance`, `getAccountInfo`, and `getTransaction` are available through a consistent interface
3. **Context Preservation**: MCP maintains context across interactions, enabling more intelligent and stateful conversations
4. **Rate Limiting**: Built-in protections against excessive blockchain RPC calls

MCP serves as the bridge between the AI agents and the Solana blockchain, allowing the agents to access real-time blockchain data while maintaining security and user privacy.

Learn more about MCP at:
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [Anthropic MCP Announcement](https://www.anthropic.com/news/model-context-protocol)

## Features

LCQ provides five specialized AI agents, each designed to solve specific problems in the Solana ecosystem:

### 1. Transaction Optimizer Agent 💸
Helps users optimize transaction fees based on network congestion and recommended fee structures.
```
"What's the optimal time and fee for sending SOL today?"
```

### 2. Program Deployment Assistant 🚀
Automates and assists developers in deploying Solana programs across environments (testnet, devnet, mainnet).
```
"How do I deploy my program to devnet?"
```

### 3. Account Analyzer Agent 🔍
Helps users analyze Solana accounts, providing insights into balances, token distributions, and transaction histories.
```
"Analyze this wallet: 7aqH6qcgZj4g33QQNNmP1LACNmpomujNNCZXVjJUQVgz"
```

### 4. Smart Contract Auditor Agent 🔒
Audits Solana smart contracts to identify vulnerabilities, inefficiencies, and provide optimization suggestions.
```
"Check this program for security issues: BTC7SSkyyrWWfJMbW4BC3qQkFTCCzFWpfuK4cHeBZ2cu"
```

### 5. Data Scraper Agent 📊
Scrapes data from Solana for reporting purposes, including token transfers, program interactions, and market data.
```
"Show me JUP token transfers in the last 24 hours"
```

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: Solana Web3.js, SPL Token
- **AI Integration**: Model Context Protocol (MCP)
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (>= 18.17.0)
- npm or yarn
- Access to MCP API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LCQLabs/lcq.git
cd lcq
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Copy the environment variables template:
```bash
cp .env.example .env
```

4. Update `.env` with your MCP credentials and Solana RPC URL.

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

LCQ can be configured using environment variables. See [.env.example](.env.example) for a list of available options.

### Key Configuration Parameters:

- `MCP_API_KEY`: Your Model Context Protocol API key
- `SOLANA_RPC_URL`: URL for Solana RPC endpoint
- `SOLANA_NETWORK`: Network to use (mainnet-beta, testnet, devnet, localnet)

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get involved.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

Full documentation is available at [https://lcqdocs.site](https://lcqdocs.site). This includes:

- [Installation Guide](https://lcqdocs.site/getting-started.html)
- [Architecture Overview](https://lcqdocs.site/architecture.html)
- [Agent Reference](https://lcqdocs.site/features/)
- [API Documentation](https://lcqdocs.site/api-reference.html)
- [Examples](https://lcqdocs.site/usage-examples.html)

## Roadmap

- Mobile app for iOS and Android
- Additional agent types for specialized use cases
- Integration with more Solana DeFi protocols
- Enhanced visualization and reporting capabilities
- Community agent marketplace


## Connect With Us

- Website: [https://lcq.gg](https://lcq.gg)
- Documentation: [https://lcqdocs.site](https://lcqdocs.site)
- Twitter: [@LCQDOTGG_](https://x.com/lcqdotgg)
- GitHub: [https://github.com/LCQLabs](https://github.com/LCQLabs)
- Email: hello@lcq.gg

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
