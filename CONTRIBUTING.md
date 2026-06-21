# Contributing to FirstMove

Thank you for your interest in contributing to FirstMove! We welcome contributions of all forms—bug reports, feature requests, documentation updates, and code submissions.

Following these guidelines helps ensure a smooth and productive collaboration process.

## How to Contribute

### 1. Reporting Issues
* Search existing issues to see if the problem has already been reported.
* If not, open a new issue detailing:
  * What you expected to happen.
  * What actually happened.
  * Clear steps to reproduce the behavior.
  * Environment details (browser, Node.js version, OS).

### 2. Suggesting Features
* Open an issue explaining the proposed feature and why it would be beneficial to users.
* Describe the user scenario and potential implementation ideas.

### 3. Submitting Code Changes
1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone the Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/FirstMove.git
   cd FirstMove
   ```
3. **Create a Topic Branch**: Use a descriptive branch name:
   ```bash
   git checkout -b feature/your-awesome-feature
   # or
   git checkout -b fix/issue-name
   ```
4. **Implement Your Changes**:
   * Adhere to the existing code styling, variable naming, and spacing conventions.
   * Verify changes locally by running the dev server.
5. **Build and Test**: Run a production build to check for compilation or bundler errors:
   ```bash
   npm run build
   ```
6. **Commit Your Changes**: Keep commits atomic and use clear, descriptive commit messages:
   ```bash
   git commit -am "feat: implement immediate next step dashboard indicators"
   ```
7. **Push and Open a Pull Request**:
   * Push your topic branch to your fork.
   * Open a Pull Request (PR) against the `main` branch of the official repository.
   * Provide a summary of the changes made, the issue they solve, and how they were tested.

## Development Workflow

FirstMove is built on:
- **Core Stack**: React (Vite), Tailwind CSS, Vanilla CSS
- **Local Dev Server**: Launches on port `5173`.
  ```bash
  npm run dev
  ```
- **Static Assets**: Background media and icons are located in the `/public` folder.

## Community & Standards
By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations or concerns to the maintainers.
