---
name: workflow-skill-creator
description: >-
  Use this skill when the user wants to turn a repeatable multi-step
  process into a structured skill with review gates between phases.
  Triggers on "create a workflow skill", "build a multi-phase skill",
  "make a skill pipeline", "new workflow", "skill with phases and gates",
  "turn this process into a workflow", "I have a multi-step process",
  "help me structure a repeatable workflow", or when the user describes
  a process with 3+ steps needing human review between them — even if
  they don't explicitly mention "workflow" or "skill".
  Orchestrates scope, architect, build, and validate phases with
  human checkpoints following the Agent Skills open standard.
license: MIT
compatibility: Works on Claude Code and Claude.ai.
metadata:
  author: David DeRemer
  version: "0.1.0"
# --- Claude Code extensions (optional, ignored on other platforms) ---
# disable-model-invocation: true
---

# Workflow Skill Creator

Announce: "Starting the Workflow Skill Creator — a 4-phase workflow
with review checkpoints between each phase."

Present the phases:
1. **Scope** — Interview to capture intent, phases, platforms, and constraints
2. **Architect** — Design state contracts, execution models, gates, depth contracts, frontmatter
3. **Build** — Generate orchestrator SKILL.md and all phase reference files
4. **Validate** — Run deployment checklist, functional tests, package for delivery

## Phase 1: Scope
Read and follow: references/phase-1-scope.md
OUTPUT: Structured scope brief (purpose, pattern, phases, platforms, cross-cutting skills, triggers, constraints)
GATE: "Review this scope brief. Do the phase boundaries and gate placement match your process?"

## Phase 2: Architect
Read and follow: references/phase-2-architect.md
INPUT: Approved scope brief from Phase 1
OUTPUT: Architecture spec (phase map with state contracts, execution models, gate design, depth contracts, frontmatter decisions)
GATE: "Review the architecture. This is the blueprint — Build generates directly from it."

## Phase 3: Build
Read and follow: references/phase-3-build.md
INPUT: Approved architecture spec from Phase 2
OUTPUT: Complete skill folder — orchestrator + all phase reference files + subagent files if needed
GATE: "Review the generated files against the approved architecture."

## Phase 4: Validate
Read and follow: references/phase-4-validate.md
INPUT: Approved skill files from Phase 3
OUTPUT: Validation report + testing protocol + packaged skill
GATE: "Review validation results. Ready to deploy?"

## Workflow State Template
At each gate, produce:
```
WORKFLOW STATE
Phase completed: [N] of 4
Skill being created: [name]
Target pattern: [A/B/C/D/E]
Target platforms: [list]
Key decisions: [list]
Decision rationale: [why each — survives context rot]
Artifacts produced: [list]
Open questions: [unresolved items]
Next phase: [name]
```

## Rules
- NEVER skip a gate. Wait for explicit user approval.
- NEVER combine phases.
- NEVER read ahead into the next phase reference file.
- If the user asks to skip a phase: name what's skipped, list missing outputs, state replacement assumptions, confirm with AskUserQuestion (if available).
- Revision limits: 2 cycles for Scope/Architect, 3 for Build, 1 for Validate.
- If context grows long, summarize completed phases before continuing.
- If the user's triggering message contains workflow details, extract in Phase 1 — confirm, don't re-ask.

## Resuming an Interrupted Workflow
1. Ask via AskUserQuestion (if available): "Resume from the last checkpoint" / "Start over from Phase 1". If unavailable, ask in prose.
2. Read the most recent WORKFLOW STATE block.
3. Confirm state with the user.
4. Resume from the next phase. Do NOT re-read completed phase files.
