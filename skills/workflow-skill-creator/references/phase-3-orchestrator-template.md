# Orchestrator SKILL.md Template

The generated orchestrator MUST include ALL of the following structural elements. This is not a suggestion — omitting any element produces a non-conforming skill:

```yaml
---
name: [from arch spec]
description: >-
  Use this skill when [user intent — what they're trying to achieve].
  Triggers on [trigger 1], [trigger 2], [trigger 3], [trigger 4],
  [trigger 5] — even if they don't explicitly mention [domain].
  Orchestrates [phase-1] → [phase-2] → [phase-3] with human checkpoints.
# --- Optional fields (from Agent Skills spec) ---
# license: [from user or default]
# compatibility: [platform requirements, if any]
# metadata:
#   author: [from user or default]
#   version: "0.1.0"
# --- Claude Code extensions (optional, ignored on other platforms) ---
# disable-model-invocation: true   # if side effects
# argument-hint: [param]           # if parameterized
# user-invocable: false             # if background-only
# [include ALL applicable extensions from arch spec, commented out]
---

# [Workflow Name]

Announce: "Starting [name]. This is a [N]-phase workflow with review
checkpoints between each phase."

Present phases:
1. **[Phase 1]** — [one-line]
...

## Phase 1: [Name]
Read and follow: references/phase-1-[name].md
# If parameterized, include: Subject: $ARGUMENTS
OUTPUT: [artifact name] ([format]: [structure])
GATE: "[review framing derived from gate focus in arch spec]"

## Phase 2: [Name]
Read and follow: references/phase-2-[name].md
INPUT: Approved output from Phase 1
OUTPUT: [artifact name] ([format]: [structure])
GATE: "[review framing]"

[...repeat for all phases...]

## Workflow State Template
At each gate, produce:
WORKFLOW STATE
Phase completed: [N] of [total]
Subject: [topic]
Key decisions: [list]
Decision rationale: [why each — mandatory field]
Artifacts produced: [list]
Open questions: [unresolved]
Next phase: [name]

## Rules
- NEVER skip a gate. Wait for explicit user approval.
- NEVER combine phases. Each phase is a distinct unit of work.
- NEVER read ahead into the next phase reference file.
- If user asks to skip: name the phase, list missing outputs, state
  replacement assumptions, confirm with AskUserQuestion (if available).
- Maximum [N] revision cycles per phase [from arch spec].
- Revision procedure: user provides feedback → revise output →
  re-validate against phase checklist → re-present at gate.
  After max revisions: "This is revision [N] of [N]. Here is the
  current version. Continue refining or proceed to the next phase?"
- If context grows long, summarize completed phases before continuing.

## Resuming an Interrupted Workflow
1. Ask via AskUserQuestion (if available): "Resume from last checkpoint" / "Start over from Phase 1". If unavailable, ask in prose.
2. Read most recent WORKFLOW STATE block.
3. Confirm state with user.
4. Resume next phase. Do NOT re-read completed phase files.
```

The orchestrator NEVER contains phase-level detail, inline questions, depth contract specifics, or cross-cutting skill content.
