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
nyiks init <projectName>
nyiks generate dao --name "MyDAO"
nyiks generate nft --name "MyNFT" --symbol "MNFT"
```

---

## 📁 Folder Structure

nyiks-cli/
├── src/
│   ├── commands/    
│   │   ├── init.ts
│   │   ├── generate.ts
│   │   ├── test.ts
│   │   └── deploy.ts
│   │
│   ├── templates/          
│   │   ├── nft.template.clar
│   │   ├── ft.template.clar
│   │   ├── dao.template.clar
│   │   └── ...
│   │
│   ├── utils/             
│   │   ├── fileWriter.ts
│   │   ├── templateEngine.ts
│   │   └── parameterParser.ts
│   │
│   ├── config/            
│   │   └── cli-config.ts
│   │
│   └── index.ts             
│
├── bin/
│   └── nyiks-cli.js         
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md

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

## 🙌 Contributing

We welcome contributions from the community! If you'd like to contribute to Nyiks CLI, please follow the guidelines in our [CONTRIBUTING.md](./CONTRIBUTING.md) file. Here’s how to get started:

Fork this repository.

- Create a new branch for your feature or fix.
- Commit your changes with descriptive messages.
- Open a pull request with a clear description of your changes.

For detailed contribution instructions, please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

---
