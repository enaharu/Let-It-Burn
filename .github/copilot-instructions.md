# Project Guidelines

## Purpose

- This repository is a starter template for mock development in Next_Gen_AI'sPractice_<name>.
- Keep the default React + Vite screen as the baseline unless the task explicitly asks for feature work.
- Prefer changes that keep the project reusable as a template for future mock projects.

## Build And Validation

- Install dependencies with npm install.
- Validate code changes with npm run lint and npm run build.
- When the user asks for startup confirmation, use npm run dev and verify the default React screen.

## Product Constraints

- Default to a maximum of 3 screens for mock tasks unless the user asks otherwise.
- Keep the implementation frontend-only unless backend work is explicitly requested.
- Favor small, reversible changes over speculative architecture.

## Repository Conventions

- Update README.md when setup steps, CI/CD, or repository usage changes.
- Update docs/one-day-report.md when the user asks for deliverables or worklog-style output.
- Keep GitHub Actions compatible with GitHub Pages deployment.
- Use GitHub Copilot oriented wording in repository templates and docs instead of older AI-specific labels.

## Code Conventions

- Follow the existing Vite + React + TypeScript structure in src/.
- Do not add dependencies unless they are necessary for the requested task.
- Remove dead files and unused config when simplifying the template.