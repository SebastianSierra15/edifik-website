# AGENTS – Architecture & Refactor Rules

This project is under an **incremental refactor towards Clean Architecture**.

- The backend has already been refactored using Clean Architecture.
- The backend is currently being validated while the frontend is progressively refactored.
- The frontend refactor MUST NOT change UI styles or visual behavior.

This document defines **mandatory rules** that any agent
(Codex, Copilot, AI assistant, etc.) MUST follow.

---

## 1. Global Principles (Non-Negotiable)

- Apply SOLID principles at all times.
- Respect Clean Architecture boundaries.
- Prefer explicit and readable code over clever solutions.
- Refactor incrementally — NEVER rewrite entire features.
- Do NOT change UI styles, class names, or layouts.
- Do NOT introduce breaking changes without explicit instruction.
- All code MUST be written in **TypeScript**.
- This project prioritizes **separation of responsibilities**, not over-abstraction.

---

## Language & Naming Conventions

- Prompts and discussions with the agent may be in Spanish.
- Code identifiers MUST be in English:
  - file and folder names
  - variables, functions, classes
  - TypeScript types/interfaces (except shared domain terms if already established)
- UI text, labels, and user-facing messages MUST remain in Spanish (unless the existing UI is in English).
- Do NOT introduce Spanish identifiers in code unless explicitly requested.

---

## Component & Page Export Conventions (MANDATORY FOR NEW OR TOUCHED FILES)

The following rules apply **ONLY to files that are newly created or explicitly modified
during the refactor process**.

Agents MUST NOT apply these conventions retroactively to the entire codebase
unless explicitly instructed.

## UI Components (`src/components`)

- All components MUST use **named exports**.
- **Default exports are NOT allowed** for components.

### Component file naming rules:

Component file names MUST:

- Start with an **uppercase letter**
- Use **PascalCase**
- **Match the component name exactly**

### Example:

```ts
// src/components/admin/RoleTable.tsx
export function RoleTable() {
  return <div />;
}
```

---

## 2. Real Project Structure (Source of Truth)

### High-level structure:

```text
app/
├── (pages)/
│   ├── */page.tsx
│   └── local UI components (ONLY presentation)
│
├── api/
│   └── */route.ts
│
src/
├── components/   # Shared & refactored UI components
├── hooks/        # Frontend business & orchestration logic
├── services/     # API communication (frontend side)
├── modules/      # Backend Clean Architecture
├── interfaces/    # Shared TypeScript interfaces (FRONT + BACK)
├── shared/       # Cross-cutting logic (errors, helpers, etc.)
├── config/       # App configuration
├── lib/          # apiClient and low-level utilities
├── providers/    # React providers
├── utils/        # Pure utility functions
```

## 3. Frontend Responsibility Flow (STRICT)

### Mandatory call chain:

```text
app/(pages) & UI components
↓
src/hooks
↓
src/services
↓
app/api
↓
src/modules/*/presentation
```

### Rules:

- Pages and UI components:
  - MUST NOT call services or APIs directly
  - MUST ONLY call `src/hooks`
- Hooks:
  - Handle orchestration and frontend logic
  - May call `src/services`
- Services:
  - Handle HTTP/API calls ONLY
  - Use `src/lib/apiClient`
- Pages MUST remain thin and declarative.

---

## 4. Backend Modules (Clean Architecture)

Each module under `src/modules/<module>` MUST follow
a **file-based Clean Architecture**, where the role of each file
is defined by its location and naming, NOT by additional subfolders.

```text
src/modules/<module>/
 ├── domain/              # interfaces, inputs, entities, contracts
 │    └── *.ts
 │
 ├── application/         # use cases (one responsibility per file)
 │    └── *.ts
 │
 ├── infrastructure/      # database & external implementations
 │    └── *.ts
 │
 └── presentation/        # controllers used by app/api
      └── *.controller.ts
```

- Subfolders inside domain/application/infrastructure are OPTIONAL.
- File naming and dependency direction define responsibility.
- Agents MUST NOT introduce extra folder nesting unless explicitly requested.

### Dependency rules (ENFORCED):

- `domain` → depends on NOTHING
- `application` → depends ONLY on `domain`
- `infrastructure` → implements `domain` interfaces
- `presentation` → orchestrates use cases only
- Database access:
  - ONLY in `infrastructure`
  - ALWAYS through stored procedures

---

## 5. API Layer Rules (`app/api`)

- API routes MUST be thin.
- API routes MUST call `src/modules/*/presentation` controllers.
- API routes MUST NOT contain business logic.
- API routes MUST NOT access the database directly.

---

## 6. Shared Types & Interfaces (VERY IMPORTANT)

- ALL shared types MUST live in: `src/interfaces`
- These interfaces are used by BOTH frontend and backend.
- The file `src/lib/definitions.ts` is **DEPRECATED**.
- If any code uses `definitions.ts`, it MUST be migrated.
- If a required type does NOT exist in `src/interfaces`, it MUST be created there.

---

## 7. UI Components Migration Rules

- Legacy components live in `app/ui`
- Refactored or new components MUST live in: `src/components`
- UI components:
  - MUST remain presentational
  - MUST NOT contain business logic
  - MUST NOT change styles or markup

---

## 8. Frontend Refactor Context

- Current evaluation area: `/admin`
- `/admin` layout and UI are FINAL.
- Current focus module: `/admin/roles`

### Refactor goals:

- Reduce responsibility saturation.
- Move logic to `src/hooks`.
- Replace usage of `app/hooks` with `src/hooks`.
- Preserve behavior exactly.

---

## 9. Refactor Strategy (How to Act)

When refactoring code:

1. Analyze current responsibilities.
2. Identify SOLID or Clean Architecture violations.
3. Propose changes BEFORE writing code.
4. Apply minimal refactor.
5. Create new files ONLY when responsibility clearly demands it.
6. Avoid over-atomization.

---

## 10. Output Rules for Agents

When generating code, the agent MUST:

- Explicitly list:
  - Files to create
  - Files to modify
  - Exact paths
- Avoid unrelated changes.
- Avoid style or markup changes.
- Explain reasoning before implementation.

---

## 11. Role of the Agent

The agent acts as:

- A senior full-stack developer
- A Clean Architecture enforcer
- An assistant to the lead architect (human)

The agent does NOT:

- Make autonomous architectural decisions
- Rewrite entire modules without approval
- Introduce new patterns without justification

## Git Workflow (Optional but Recommended)

- Work only on branch `refactor/clean-architecture`.
- Prefer small commits with semantic messages (e.g. `refactor(roles): move fetching logic to src/hooks`).
- Do NOT mix formatting-only changes with refactors.
