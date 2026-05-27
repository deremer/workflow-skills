# Phase Reference File Template

The generated phase file MUST include ALL of the following sections. Omitting any section produces a non-conforming phase file:

```markdown
# Phase [N]: [Name]

## Announcement
Say: "Starting Phase [N]: [Name]. [One sentence.]"

## Input Contract
- [Artifact name] ([format]: [structure]) from Phase [N-1]
  Example: "Approved research brief (markdown: Summary, Sources,
  Key Findings tagged FACT/PROJECTION/OPINION, Gaps) from Phase 1"
- If parameterized and this is Phase 1: "Client/subject from
  workflow invocation: $ARGUMENTS. If $ARGUMENTS is empty, ask the
  user to provide [the parameter]."

## User Questions
RULE: ask_user_input for all bounded questions. Prefer multi-select
over single-select. Batch into 1-3 prompts, up to 4 options each.
Include "Other (I'll explain)" escape hatch on every question.
Prose only for genuinely unpredictable answers. If prior output or
triggering message already answers a question, confirm rather than
re-ask.

1. **[Question]** (single/multi-select)
   - Options...
   - Other (I'll explain)

## Execution Depth Contract [only if arch spec requires for this phase]
### Search Depth
- Minimum [N] web searches (calibrated to workflow frequency)
- Start broad (2-3 words), narrow iteratively
- When results reveal new terms/players, search those
- Search angles: [list from arch spec]
### Source Chasing
- web_fetch [N] most promising sources (full text, not snippets)
- Priority: official docs > analyst reports > journalism > blogs
### Evidence Standards
- [N]+ unique sources cited
- Every quantified claim needs a source
- Label: [FACT] / [PROJECTION] / [OPINION]
- State gaps explicitly — never fill with plausible-sounding filler

## Process
[Include "ultrathink" on its own line at the start of this section
for phases marked as ultrathink in the arch spec.]

Progress checklist (update as each step completes):
- [ ] Step 1: [action verb]
- [ ] Step 2: [action verb]
- [ ] Step 3: [action verb]
[Include one entry per step. For phases with 3+ steps, this checklist
helps the agent track progress and avoid skipping steps.]

### Step 1: [Action verb]: [Description]
[One clear instruction per step. Each step should have enough search
actions to operationalize the depth contract minimums — if the contract
says "8+ searches", the process steps must describe 8+ distinct search
actions or iterative loops, not just "search for evidence".]

[Reference cross-cutting skills by name with specific application
instructions. NOT: "Apply brand guidelines." YES: "Apply
[brand-guidelines] — use approved color palette, typography, and
tone of voice. Output must use heading styles and pull quote
formatting from the brand system."]

### Step 2: [Action verb]: [Description]
...

## Output Contract
Produce exactly:
- [Artifact name] ([format]: [structure]) — from arch spec

## Validation Loop
Before presenting output, self-validate against this checklist.
If any check fails: fix the issue, then re-run ALL checks from the
top. Repeat until all checks pass. Only present output at the gate
once every check passes.

- [ ] [Quality criterion from arch spec]
- [ ] [Cross-cutting skill applied with observable proof — NOT
      "brand guidelines applied" but "output uses [specific font],
      [specific color], [specific tone characteristic]"]
- [ ] [Depth contract met: conducted N+ searches, fetched N+ full
      sources, cited N+ unique sources in output]
- [ ] All progress checklist steps marked complete
[If the phase includes a validation script, add:
- [ ] Validation script passes: `scripts/[validate].py [args]`
      If it fails, fix issues and re-run until it passes.]

## Revision Protocol
Maximum [N] revision cycles for this phase (from arch spec).
Cycle: user feedback → revise → re-run validation loop → re-present at gate.
After [N] cycles: "This is revision [N] of [N]. Here is the current
version. Would you like to continue refining, or proceed to the next
phase with this version?"

## Gate
Present output. Say: "[Gate framing derived from gate focus in arch spec]"
ask_user_input:
  question: "[review framing — derived from gate focus]"
  type: single_select
  options:
    - "Approved — proceed to [next phase name]"
    - "Needs refinement (I'll specify)"
    - "Needs major rework"
    - "Reject — start this phase over"

STOP. Wait for explicit user approval before ANY next action.
Do NOT read the next phase reference file.
Do NOT begin work on the next phase.
Do NOT summarize what the next phase will do.
```
