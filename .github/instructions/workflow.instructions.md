---
description: "Use when editing GitHub Actions workflows, issue templates, or repository automation files under .github. Covers CI/CD consistency for this Vite template."
applyTo: [".github/workflows/**/*.yml", ".github/ISSUE_TEMPLATE/**/*.yml", ".github/PULL_REQUEST_TEMPLATE.md"]
---

# Repository Automation Guidelines

- CI should stay minimal: install, lint, and build.
- CD should remain compatible with GitHub Pages and repository-name-based base paths.
- Avoid workflow complexity unless the task explicitly needs additional jobs.
- Keep issue and PR templates aligned with GitHub Copilot based development, not older tooling names.
- When changing deployment behavior, ensure README setup instructions stay consistent with the workflow.