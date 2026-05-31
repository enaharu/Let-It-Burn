---
description: "Use when editing React, TypeScript, TSX, or CSS files in src. Covers Vite template preservation, small mock-oriented UI changes, and required validation."
applyTo: "src/**/*.{ts,tsx,css}"
---

# Frontend Guidelines

- Keep components simple and easy to reset back to the Vite default state.
- Prefer local component state before introducing new abstractions.
- Avoid adding routing, global state, or premium feature scaffolding unless the task requires it.
- Keep mock implementations within the 3-screen constraint when building features.
- Reuse the existing Vite styling baseline unless the task asks for a new visual direction.
- After frontend edits, run npm run lint and npm run build when the environment allows it.