# Phase 3: Build

## Announcement
Say: "Starting Phase 3: Build. Generating all files from the approved architecture spec."

## Input Contract
- Approved architecture spec from Phase 2 (phase map with format-specific contracts, execution models, gates with focus, depth contracts, frontmatter decisions including subagent file types)

## Line Limit Guidance
Target line counts for the generated skill files:
- Orchestrator SKILL.md: target ~100 lines
- Phase reference files: target ~150 lines each
- Shared reference files: target ~300 lines (add TOC if >150)

These are efficiency targets, not hard rules. If a phase file needs more lines to fully specify its depth contract, gate logic, revision protocol, and validation checklist, use more lines. Compressing to hit a target at the cost of vague instructions, missing validation items, or incomplete contracts produces worse skills. Prefer clarity and specificity over brevity. When a file exceeds the target, verify the excess is substance (contracts, procedures, checklists) not padding (explanations, context, examples the agent doesn't need).

## Process

### Step 1: Generate Orchestrator SKILL.md

**Spec constraints (hard rules):**
- `name`: ≤64 chars, lowercase letters/numbers/hyphens only, no XML tags, cannot contain "anthropic" or "claude"
- `name`: must not start or end with a hyphen, no consecutive hyphens (`--`), must match parent directory name
- `description`: ≤1024 chars, non-empty, no XML tags

**Recommended optional frontmatter (from Agent Skills spec):**
- `license`: License name or reference to a bundled license file
- `compatibility`: Platform/environment requirements if any (≤500 chars)
- `metadata`: Key-value pairs (e.g., author, version)

**Description writing rules (the description is the trigger mechanism):**
1. Lead with imperative phrasing: "Use this skill when..." — not third person ("Orchestrates...") or first person ("I orchestrate...")
2. Focus on user intent (what the user is trying to achieve), not implementation details
3. List 5+ specific trigger phrases, including synonyms and casual variants
4. Include "even if they don't explicitly mention [domain]" — err toward being pushy. A skill that activates unnecessarily is a minor annoyance; one that fails to activate when needed is a missed workflow
5. Both what AND when must be present — the description must serve dual purpose

Read and use the template: references/phase-3-orchestrator-template.md

The orchestrator NEVER contains phase-level detail, inline questions, depth contract specifics, or cross-cutting skill content.

### Step 2: Generate Phase Reference Files
Create `references/phase-N-[name].md` for each phase.

**Hard constraints:**
- One concern per phase (single verb from arch spec)
- Front-load ALL questions before starting work
- End with hard stop (all four prohibitions — no exceptions)
- Input contract references the actual artifact from the prior phase by name, format, and structure
- Process section includes a progress checklist for phases with 3+ steps (tracks completion of each step)
- Validation section is a self-validation loop: check → fix → re-check until all pass, THEN present at gate

Read and use the template: references/phase-3-phase-file-template.md

### Step 3: Generate Subagent Files (Claude Code only)
For any phase marked with `context: fork` in the architecture spec, generate BOTH:

1. **A reference file** under `references/phase-N-[name].md` — this is the sequential fallback used on Claude.ai, Cowork, and any platform without subagents. It follows the standard phase file template above.

2. **A standalone subagent file** — based on the subagent file type from the arch spec:

**If standalone skill** (`.claude/skills/phase-N-[name]-subagent/SKILL.md`):
```yaml
---
name: phase-N-[name]-subagent
description: >-
  [Subagent description — what this phase does in isolation].
  Invoked by the [workflow-name] orchestrator for Phase [N].
context: fork
agent: [Explore / Plan / from arch spec]
model: [haiku / sonnet / from arch spec]
skills:
  - [cross-cutting-skill-1]
  - [cross-cutting-skill-2]
user-invocable: false
---

[Phase instructions adapted for subagent execution.
Key differences from the reference file:
- No gate section (the parent orchestrator manages the gate)
- Output contract is the subagent output contract from arch spec
  (structured brief, not full artifacts)
- No revision protocol (subagent runs once, parent handles revisions)
- Must be self-contained — does not inherit parent context]
```

**If custom agent** (`.claude/agents/[name]-researcher.md`):
```yaml
---
name: [name]-researcher
description: [Conducts deep research for the workflow]
skills:
  - [cross-cutting-skill-1]
---

[Agent instructions. Same self-contained requirements as above.]
```

**The orchestrator must reference both paths.** In the generated orchestrator, for phases with subagent files, add a comment:
```
## Phase [N]: [Name]
# Claude Code: dispatches to .claude/skills/phase-N-[name]-subagent/
# Other platforms: reads references/phase-N-[name].md sequentially
Read and follow: references/phase-N-[name].md
```

**Folder structure when subagent files are present:**
```
[skill-name]/
├── SKILL.md
├── references/
│   ├── phase-1-[name].md          (sequential fallback)
│   ├── phase-2-[name].md
│   └── ...
└── .claude/                        (Claude Code only)
    └── skills/
        └── phase-1-[name]-subagent/
            └── SKILL.md            (subagent with context: fork)
```

### Step 4: Pattern-Specific Build Instructions
Based on the pattern from the arch spec, apply these constraints to the generated phase files. These are structural requirements for the pattern to function correctly.

**Pattern A (Research → Synthesize → Produce → Distribute):**

*Research phase:* MUST include a full Execution Depth Contract. Process steps must operationalize the search minimums — list specific search angles, describe the iterative narrowing sequence, specify when to chase sources. The output contract must be a structured brief (not raw notes). Include in process steps: "Search broadly and flag information gaps. Do NOT invent information to fill gaps."

*Synthesis phase:* Input contract references the approved research brief by name and format. Process steps must include: "Review the research brief. Carry forward any gaps as explicit TBD items — do NOT paper over gaps with plausible-sounding content." If marked for ultrathink, include the keyword.

*Distribute phase:* Process steps must specify per-channel adaptation: "Adapt the [artifact] for each distribution channel. [Channel 1] requires [format/length/tone]. [Channel 2] requires [different format/length/tone]." Do NOT just copy the same content to multiple channels.

**Pattern B (Interview → Draft → Review → Refine):**

*Interview phase:* ALL questions with predictable answer sets MUST use ask_user_input. Minimize open-ended questions — they produce vague answers that weaken the draft. The output contract should be a structured set of decisions and content inputs, not a transcript.

*Review phase:* MUST include a self-review step before presenting to the user. Process steps: "Review the draft against [rubric/criteria]. Identify weaknesses. Revise before presenting." The output is the revised draft, not the first draft.

**Pattern C (Analyze → Plan → Execute → Verify):**

*Plan phase:* Output contract MUST specify a numbered checklist of actions. Not a narrative plan — a sequenced, checkable list.

*Execute phase:* Process steps work through the checklist sequentially. For high-risk items (destructive operations, external communications, financial commitments), add mini-gates: "Before executing [high-risk item]: present the action and ask for confirmation using ask_user_input."

**Pattern D (Triage → Route → Specialize):**

*Triage phase:* Asks classification questions via ask_user_input, then loads ONLY the relevant specialist reference file. Other specialist files are NEVER read. Each specialist path is a separate reference file under `references/`.

*Specialist phases:* Each specialist file is self-contained — it does not reference other specialist files or assume the triage phase's working context.

**Pattern E (Parallel Gather → Merge → Output):**

Generate the gather phase file with platform-aware instructions:

```
## Process — Platform-Adaptive Execution

### On Claude.ai (no subagents):
Search each source stream sequentially. For each stream:
1. [Stream A search instructions]
2. [Stream B search instructions]
3. [Stream C search instructions]
Compile all results before synthesizing.

### On Cowork (auto-spawned subagents):
Describe each source stream as an independent task. Claude may
automatically parallelize across subagents:
- Stream A: [independent task description]
- Stream B: [independent task description]
- Stream C: [independent task description]

### On Claude Code (context: fork):
Each stream dispatches as a parallel subagent:
- Stream A subagent: [task + return format]
- Stream B subagent: [task + return format]
- Stream C subagent: [task + return format]
```

Each stream requires its own Execution Depth Contract with independent minimums.

### Step 5: Cross-Cutting Skill Integration
For phases that reference cross-cutting skills, the generated files must include BOTH process instructions AND validation criteria:

**In process steps** — specify what applying the skill means concretely:
```
Apply [brand-guidelines]: use [specific font family], [specific
color codes], [specific heading hierarchy]. Voice should be
[specific tone characteristics from the brand skill].
```
NOT just "Apply brand guidelines."

**In validation checklist** — specify observable proof of application:
```
- [ ] Brand guidelines applied: output uses [font], [colors],
      [heading style]. Tone matches [specific characteristic].
```
NOT just "brand guidelines applied."

**In subagent phases:** Subagents do NOT inherit parent skills. The standalone subagent file (Step 3) must list cross-cutting skills in its `skills:` frontmatter field. The reference file fallback must include the specific application instructions inline.

### Step 6: Error Recovery
Add resume-from-gate protocol to the generated orchestrator's rules section (already in template above). For Claude Code targets, also add: "At each gate, save state to `.claude/workflow-state/[name].json`."

### Step 7: Write Files
Create the complete folder structure using architecture spec as single source of truth. Do not invent details not in the spec. Include subagent files under `.claude/` if any phases are marked `context: fork`.

### Step 8: Contract Chain Verification (in generated files)
Verify the chain in the GENERATED files — not the arch spec, since files may have drifted during generation:

1. Open Phase 1's Output Contract. Read the artifact name, format, and structure.
2. Open Phase 2's Input Contract. Does it reference that exact artifact name and format? Does it expect every structure field that Phase 1 produces?
3. Repeat for every transition.
4. If any gap: fix the contract in the generated file.
5. **After fixing, re-verify the full chain from the start.** A fix to Phase 2's output may break Phase 3's input.

### Step 9: Anti-Pattern Audit
For each check, follow the verification procedure. Fix issues before presenting.

**Mega-Skill:** Open SKILL.md. Does it contain process steps, interview questions, depth contract details, or cross-cutting skill content? If yes: move that content to the appropriate phase reference file.

**Implicit Handoffs:** Open each phase file. Scroll to the end. Is there a ## Gate section with a STOP line and all three "Do NOT" lines? If any are missing: add them.

**Optional Gates:** Search all files for "optional", "recommended", "if you'd like". Gates must use mandatory language only. If found: rewrite as mandatory.

**Context Amnesia:** Open SKILL.md. Is there a ## Workflow State Template section? Does it include "Decision rationale"? If missing: add it.

**Unbounded Loops:** Open each phase file. Is there a ## Revision Protocol section with a specific number? "A few revisions" or "refine until good" is not bounded. If missing or vague: add specific count and full procedure.

**Assumed Inputs:** Open each phase file's ## Input Contract. Does it name a specific artifact with format and structure from the prior phase's output? Or does it describe what the input "should" contain? If the latter: rewrite to reference the actual prior output by name and format.

**Trigger Collisions:** Read the description. Could any trigger phrase match a different common skill (e.g., "create a skill" matching the generic skill-creator)? If yes: make phrases more specific.

**Shallow Research:** Open each phase with a depth contract. Count the discrete search actions in the ## Process steps. Are there enough to meet the depth contract minimums? If the contract says 8+ searches but the process describes 3 search steps: add more search steps or describe an iterative loop that will produce 8+ searches.

**Prose Questions:** Open each phase file. Are all bounded questions formatted for ask_user_input? Search for question marks in the Process section — any that have predictable answers should be ask_user_input instead.

**Unverified Skills:** Open each phase that references cross-cutting skills. Is the skill name in BOTH the Process steps (with concrete instructions) AND the Validation Checklist (with observable criteria)? If only in one: add to the other.

**Platform-Blind:** Open each phase. Are there any references to context: fork, hooks, or .claude/ paths without a fallback instruction for platforms that lack those features? If yes: add fallback.

**Deep Nesting:** Do any phase files reference sub-reference files that themselves reference other files? References must be one level deep from SKILL.md only.

**Missing Progress Checklist:** Open each phase file with 3+ process steps. Is there a progress checklist at the start of the Process section? If missing: add one with an entry per step.

**One-Pass Validation:** Open each phase file's Validation section. Does it instruct the agent to loop (fix issues and re-run all checks) or just check once? If it's a one-pass check: rewrite as a validation loop — check, fix, re-check until all pass.

**After fixing any issues found in this audit, re-run the contract chain verification (Step 8) and re-check any anti-pattern items that required fixes.** Fixes can introduce new problems — verify the fix didn't break something else.

### Step 10: Description Verification
Run these checks against the generated description:
1. Count characters. Is it ≤1024? If over: compress.
2. Count trigger phrases (quoted strings after "Use when" or similar). Are there ≥5? If fewer: add more.
3. Does the first sentence use imperative phrasing ("Use this skill when...")? If it starts with a noun phrase ("Orchestrates...") or first person ("I..."): rewrite.
4. Does it focus on user intent rather than implementation details? If it leads with internal mechanics (state contracts, execution models): rewrite to lead with what the user is trying to achieve.
5. Do trigger phrases include both formal ("create a competitive analysis") and casual ("analyze the competition") variants? If only formal: add casual.
6. Does the description include an "even if they don't explicitly mention..." clause? If not: add one.

### Step 11: Line Count Audit
Count lines in each generated file. If on Claude.ai (no filesystem), count lines in the artifact content. Compare against targets (orchestrator ~100, phases ~150, shared refs ~300). If a file exceeds its target: is the excess substantive content (contracts, procedures, checklists) or padding? Substantive excess is acceptable — document the justification. Padding should be removed.

## Output Contract
- Complete skill folder on filesystem (including subagent files if applicable)
- Line count report (target vs actual per file, with justification for any excess)
- Anti-pattern audit results (PASS/FAIL per check with procedure followed)
- Contract chain verification (in generated files, re-verified after any fixes)
- Description verification (6 checks)
- File tree

## Validation Checklist
- [ ] Orchestrator includes ALL mandatory structural elements (see template)
- [ ] Every phase file includes ALL mandatory sections (see template)
- [ ] name/description spec-compliant (hard constraints)
- [ ] Description passes all 6 verification checks
- [ ] Every gate has STOP + all three "Do NOT" prohibitions
- [ ] Workflow state template includes Decision rationale
- [ ] Every phase has Revision Protocol section with specific count and procedure
- [ ] Every phase with 3+ process steps has a progress checklist in the Process section
- [ ] Every phase has a validation loop (not one-pass check) before the gate
- [ ] References one level deep
- [ ] All bounded questions use ask_user_input with batching rules
- [ ] Cross-cutting skills have concrete instructions AND observable checklist criteria
- [ ] If parameterized: $ARGUMENTS flows through orchestrator and Phase 1 input contract
- [ ] If ultrathink phases: keyword present in Process section
- [ ] If subagent phases: both reference file AND standalone subagent file generated
- [ ] Claude Code extensions from arch spec included as commented-out frontmatter
- [ ] Contract chain verified in generated files and re-verified after any fixes
- [ ] Anti-pattern audit passed, re-verified after any fixes
- [ ] Files match architecture spec — no invented details

## Gate
Present file tree, line counts, anti-pattern audit, contract chain verification, description verification, and full content of each generated file.
ask_user_input:
  question: "How do the generated files look?"
  options: "Approved — proceed to Validate" / "Needs refinement" / "Major rework"

STOP. Wait for explicit user approval before ANY next action.
Do NOT read the next phase reference file.
Do NOT begin work on the next phase.
Do NOT summarize what the next phase will do.
