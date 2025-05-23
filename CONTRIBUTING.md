# Contributing to Nyiks CLI

Thank you for considering contributing to **Nyiks CLI**! This guide will help you set up your local environment, understand our branching strategy, and follow best practices for contributions.

---

## 🛠 Local Development Setup

1. **Fork the repository:**
Go to the
 ```bash
https://github.com/zorex-tech/nyiks-cli.git

```
 and click the "Fork" button in the top-right corner.

2. **Clone your forked repository:**

```bash
git clone https://github.com/<your-username>/nyiks-cli.git
cd nyiks-cli

```
> *NOTE:* Replace <your-username> with your actual GitHub username.

3. **Add the original repo as an upstream remote (optional but recommended):**

```bash
git remote add upstream https://github.com/zorex-tech/nyiks-cli.git
```
4. **Install dependencies:**

```bash
npm install

```
5. **Run the CLI in development:**

```bash
npx ts-node src/index.ts
```
6. **Build for distribution (optional):**

```bash
npm run build
```

## 🔀 Branching & Merging Strategy
1. **Main Branches**

| Branch | Purpose                         |
| ------ | ------------------------------- |
| `main` | Stable, release-ready code      |
| `dev`  | Integration branch for features |

## 🧪 Workflow
**Create a new branch off dev:**

```bash
git checkout dev
git checkout -b feature/generate-command

```
**2. Make changes and commit:**
Follow Conventional Commits:
```bash
feat: add DAO template generator
fix: resolve CLI crash on invalid param
chore: update dependency versions
```

**3. Merge your branch into `dev` using squash:**
Follow Conventional Commits:
```bash
git checkout dev
git merge --squash feature/generate-command
git commit -m "feat: add generate command for contract templates"
```
**4. Merge `dev` into `main` at each milestone:**

```bash
git checkout main
git merge dev --no-ff -m "Merge Milestone 2 work into main"

```
## ✅ Feature Branch Naming
Use clear, descriptive names:

| Branch Type | Example                     |
| ----------- | --------------------------- |
| Feature     | `feature/init-command`      |
| Bugfix      | `bugfix/help-output-crash`  |
| Chore       | `chore/update-dependencies` |
| Docs        | `docs/update-readme`        |


## 🚥 GitHub Practices
- All pull requests should target dev
- Use Squash & Merge for all feature PRs
- Enable draft PRs if you’re working in progress
- Tag a maintainer for review if needed
- 
## 🧪 Testing (Coming Soon)
Once test support is added, run:
```bash
npm run test
```
## ✨ Tips
- Keep PRs focused and small
- Add inline comments in templates for readability
- Keep generated Clarity contracts Clarinet-compatible

## 💬 Questions?
Feel free to open an issue or start a discussion. We’re happy to help!

Thanks for contributing to Nyiks CLI! 🚀