## Repository: Nyiks-cli

### 🚀 Overview
**Nyiks CLI** is a command-line tool for generating Clarity smart contract templates for the Stacks blockchain. It speeds up prototyping and development of DAOs, NFTs, fungible tokens, and more by letting you scaffold contracts with prebuilt or custom templates.

### 🔗 Built with Stacks
- Uses the Clarity language
- Integrates with Clarinet for testing
- Targets use cases on the Stacks blockchain

### 📦 Key Features
- Generate smart contracts (DAO, NFT, token)
- Supports contract naming and parameter injection
- Template engine with default and custom contract templates
- Clarinet-ready project setup
- Optional export to frontend-compatible format

### 🛠 Installation
```bash
git clone https://github.com/zorex-tech/nyiks-cli.git
cd nyiks-cli
npm install -g .
```

### 💻 Usage
```bash
nyiks init
nyiks generate dao --name "MyDAO"
nyiks generate nft --name "MyNFT" --symbol "MNFT"
```

---

## 📅 Project Roadmap

### Milestone 1: Foundation
- Scaffold basic CLI commands
- Add DAO, NFT, Token boilerplate templates
- Initialize testing with Clarinet

### Milestone 2: Customization Engine
- Implement parameter injection in templates
- Add support for flags and options
- Improve contract descriptions and inline comments

### Milestone 3: Testing + Docs
- Add test suite for CLI logic
- Validate contract generation correctness
- Improve CLI docs and inline help commands

### Milestone 4: Template Expansion
- Add new templates (e.g., multisig wallet, launchpad contract)
- Enable users to manage custom templates via config

### Milestone 5: Export & Share
- Export contracts to zip/archive
- Add ability to push generated contracts to a remote Git repo

### Milestone 6: Community Mode
- Accept user-submitted templates
- Provide a public registry of templates (if time allows)

---

## 🤝 Related Projects
- [nyiks-ui](https://github.com/zorex-tech/nyiks-ui) – Frontend interface for the same contract generation engine

---
