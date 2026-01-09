---
id: 003
title: Update Frontend Design System Rules
stage: constitution
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: Umar Farooq
command: sp.constitution
labels: [constitution,frontend,design-system]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - null
---

## Prompt

Update `.specify/memory/constitution.md`.
Append these strict rules to the **Frontend** section:

- **Design System**: STRICTLY use **Shadcn/UI** (based on Radix UI) for all interactive components (Dialogs, Dropdowns, Inputs).
- **Styling**: Use **Tailwind CSS** with a consistent color variable theme (CSS Variables).
- **Icons**: Use **Lucide React** for all icons.
- **UX Standards**:
  - **Feedback**: Every action (Add, Delete, Save) MUST show a **Toast Notification** (Success/Error).
  - **Loading**: Use **Skeleton Loaders** instead of simple spinners for data fetching.
  - **Responsiveness**: The app MUST be fully functional on Mobile and Desktop.
  - **Motion**: Use `framer-motion` for subtle entry animations (lists fading in).

## Response snapshot

Updated the constitution file by adding a new "Frontend Design System (Strict)" section (IX) with the specified rules. The changes included:
- Adding the new section with all the frontend design system requirements
- Updating the sync impact report at the top of the file
- Incrementing the version from 2.0.0 to 2.1.0
- Updating the last amended date to today (2026-01-05)

## Outcome

- ✅ Impact: Updated constitution with strict frontend design system rules
- 🧪 Tests: No tests required for documentation update
- 📁 Files: Modified .specify/memory/constitution.md with new frontend rules
- 🔁 Next prompts: Ready for implementation following new frontend guidelines
- 🧠 Reflection: New frontend standards will ensure consistent UI/UX implementation

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A