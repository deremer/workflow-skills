# Phase 1: Scope

## Announcement
Say: "Starting Phase 1: Scope. I'll capture what this workflow skill needs to do, then produce a scope brief for your review."

## Input Contract
- The user's triggering message (may contain partial workflow details)
- Any referenced process documentation or examples

## Pre-Interview: Extract from Context
Before asking questions, scan the triggering message and conversation history. List what's already known. Skip questions that context resolves — confirm instead.

## User Questions

RULE: Use ask_user_input for all bounded questions. Include "Other (I'll explain)" escape hatches. Prefer multi-select over single-select when users may have multiple preferences. Batch into 1-3 prompts with up to 4 options each. Prose only for genuinely unpredictable answers.

### Batch 1 — Purpose and Pattern

1. **What does this workflow produce?** (single-select)
   - Research report or competitive analysis
   - Content piece (case study, blog post, thought leadership, proposal)
   - Technical artifact (migration plan, architecture doc, config, code)
   - Process document (playbook, SOP, checklist, meeting prep)
   - Other (I'll explain)

2. **Which pattern?** (single-select)
   - Research → Synthesize → Produce → Distribute (Pattern A)
   - Interview → Draft → Review → Refine (Pattern B)
   - Analyze → Plan → Execute → Verify (Pattern C)
   - Triage → Route → Specialize (Pattern D)
   - Parallel Gather → Merge → Output (Pattern E)
   - Other (I'll describe)

3. **How many phases?** (single-select)
   - 3 / 4 / 5 / 6+ (beyond 7, recommend decomposing into sub-workflows)

### Batch 2 — Platform and Execution

1. **Target platforms** (multi-select)
   - Claude.ai / Claude Code / Cowork / Claude API / Agent SDK

2. **Does any phase require deep research (8+ web searches, source chasing)?** (single-select)
   - Yes — needs Execution Depth Contracts
   - No — operates on provided data or light lookups
   - Not sure

3. **External side effects?** (single-select)
   - Yes — publishes, deploys, sends, or modifies external systems
   - No — produces artifacts for review only

### Batch 3 — Invocation and Cross-Cutting

1. **Is this workflow parameterized?** (single-select)
   - Yes — user passes an argument when invoking (e.g., `/case-study-pipeline Betterment`)
   - No — workflow gathers all input through interview questions

2. **Invocation mode?** (single-select)
   - User-triggered from natural language or slash command (default)
   - Background only — auto-triggered by Claude, hidden from slash menu (user-invocable: false)

3. **Cross-cutting skills to reference?** (multi-select)
   - Brand guidelines / Writing style / Personal voice / Data gathering standards / None / Other

4. **How often will this run?** (single-select)
   - Daily or near-daily / Weekly / Monthly or ad-hoc / One-time

### Follow-up (open-ended, only if gaps remain)
- "Describe the workflow steps and where you need to pause for review."

## Process

### Step 1: Clarify Phase Boundaries
For each phase: name it with a single verb (research, draft, format, distribute, assess, plan, execute, verify). Confirm input, output, and gate placement. If a phase does two things, flag and recommend splitting.

### Step 2: Capture Gate Review Intent
For each gate, ask the user (or infer from context): "What matters most to you at this review point?" Record the gate focus — this is what the user needs to evaluate before approving. Examples:
- After research: "source quality and coverage completeness"
- After drafting: "narrative accuracy, tone, and structure"
- After formatting: "visual presentation and brand compliance"
- After distribution: "channel-appropriate adaptations"

If the user doesn't specify, infer reasonable defaults from the phase's verb and output. Record in the scope brief.

### Step 3: Terminology Check
Flag ambiguous terms, project names, or acronyms with multiple meanings. Resolve collisions with the user. Record resolutions for the scope brief.

### Step 4: Validate Workflow Necessity
Verify: 3+ distinct phases producing different artifacts? Human review required between phases? Downstream depends on upstream? Process repeats? If a single skill suffices, say so and offer to simplify.

### Step 5: Compile Scope Brief

```
SCOPE BRIEF
Skill name: [lowercase, letters/numbers/hyphens, ≤64 chars]
Purpose: [one sentence]
Pattern: [A/B/C/D/E]
Target platforms: [list]
Frequency: [daily/weekly/monthly/ad-hoc]
External side effects: [yes/no]
Parameterized: [yes: describe argument and the argument-hint label / no]
Invocation mode: [user-triggered / background-only (user-invocable: false)]

Phases:
  1. [Verb] — [one-line description]
     Input: [source] | Output: [artifact type and format]
     Gate: yes | Gate focus: [what the user reviews at this checkpoint]
  2. [Verb] — [one-line description]
     Input: [from Phase 1] | Output: [artifact]
     Gate: yes | Gate focus: [review focus]
  ...

Cross-cutting skills: [list or "none"]
Execution depth needed: [which phases, or "none"]
Terminology resolutions: [list or "none"]

Trigger phrases (≥5, including synonyms and casual variants):
  1-5. [specific phrases a user would say]
  Also trigger when: [alternate context]

Constraints: [platform-specific limitations, other]
```

## Output Contract
- Structured scope brief (format above) including gate focus per phase
- 5+ trigger phrases (formal and casual variants)
- Terminology resolution list (even if "none")

## Validation Checklist
- [ ] Skill name spec-compliant (lowercase, hyphens, ≤64 chars, no "anthropic"/"claude", no XML)
- [ ] Every phase has a single verb
- [ ] Every phase has a gate focus (what the user reviews)
- [ ] ≥5 trigger phrases, ≥3 specific to this workflow, includes both formal and casual variants
- [ ] Platform constraints identified
- [ ] Ambiguous terms resolved
- [ ] Workflow actually warrants multiple gated phases

## Gate
Present the scope brief. Use ask_user_input:
  question: "How does this scope brief look?"
  options: "Approved — proceed to Architecture" / "Needs refinement" / "Needs major rework" / "Should be a single skill instead"

STOP. Wait for explicit user approval before ANY next action.
Do NOT read the next phase reference file.
Do NOT begin work on the next phase.
Do NOT summarize what the next phase will do.
