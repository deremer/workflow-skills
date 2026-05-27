# Phase 4: Validate

## Announcement
Say: "Starting Phase 4: Validate. Running the deployment checklist, functional testing protocol, and packaging."

## Input Contract
- Approved skill files from Phase 3 (on filesystem, including subagent files if applicable)
- Line count report, anti-pattern audit, contract chain verification, and description verification from Phase 3
- Architecture spec from Phase 2 (for cross-reference)

## Process

### Step 1: Deployment Checklist
Verify each item by opening the relevant file and checking. Mark PASS or FAIL.

**Spec Compliance:**
- [ ] Orchestrator line count near target (~100); excess is justified substance
- [ ] Phase file line counts near target (~150); excess is justified substance
- [ ] Shared reference files near target (~300); TOC present if >150
- [ ] `name`: ≤64 chars, lowercase/numbers/hyphens, no XML, no "anthropic"/"claude"
- [ ] `name` matches parent directory name
- [ ] `name` does not start/end with hyphen or contain consecutive hyphens
- [ ] `description`: ≤1024 chars, non-empty, no XML, imperative phrasing ("Use this skill when..."), what + when, ≥5 triggers
- [ ] Description focuses on user intent, not implementation details
- [ ] Description includes both formal and casual trigger variants
- [ ] Description includes "even if they don't explicitly mention..." clause
- [ ] Description errs toward over-triggering
- [ ] Optional frontmatter considered (license, compatibility, metadata)
- [ ] Standard frontmatter only (Claude Code extensions commented out as optional)
- [ ] If available, run `skills-ref validate ./[skill-name]` to check spec compliance

**Architecture Integrity — open each file and verify:**
- [ ] Every phase file has ## Input Contract naming specific artifact with format and structure
- [ ] Every phase file has ## Output Contract with artifact name, format, and structure
- [ ] Every phase file has ## Validation Loop (self-validate: check → fix → re-check until all pass)
- [ ] Every phase with 3+ process steps has a progress checklist in the Process section
- [ ] Every phase file has ## Revision Protocol with specific count and procedure
- [ ] Every gate has STOP line
- [ ] Every gate has "Do NOT read the next phase reference file"
- [ ] Every gate has "Do NOT begin work on the next phase"
- [ ] Every gate has "Do NOT summarize what the next phase will do"
- [ ] Orchestrator has ## Workflow State Template with Decision rationale field
- [ ] Orchestrator has revision limits per phase in Rules section
- [ ] Orchestrator has revision procedure (feedback → revise → re-run validation loop → re-present) in Rules
- [ ] Orchestrator has ## Resuming an Interrupted Workflow section
- [ ] Orchestrator Rules include NEVER skip, NEVER combine, NEVER read ahead
- [ ] Cross-cutting skills referenced by name with concrete application instructions in process steps
- [ ] Cross-cutting skills verified with observable criteria in validation checklists
- [ ] References one level deep (no sub-sub-references)

**Research Phases (open each research phase file):**
- [ ] ## Execution Depth Contract present with numeric minimums calibrated to frequency
- [ ] Search Depth specifies minimum N searches and search angles
- [ ] Source Chasing specifies minimum N full reads via web_fetch
- [ ] Evidence Standards specifies minimum N unique sources, labeling scheme
- [ ] Process steps contain enough discrete search actions to meet depth minimums
- [ ] Validation checklist includes depth contract verification items

**Interactive Design:**
- [ ] All bounded questions use ask_user_input
- [ ] Questions batched (1-3 prompts, up to 4 options each)
- [ ] Multi-select preferred over single-select where appropriate
- [ ] "Other (I'll explain)" escape hatch on every question
- [ ] Questions front-loaded before work begins in each phase
- [ ] Gate decisions use ask_user_input with Approved/Refine/Rework/Reject options

**Parameterization (if applicable):**
- [ ] `argument-hint:` in commented-out orchestrator frontmatter
- [ ] `Subject: $ARGUMENTS` in orchestrator phase block for Phase 1
- [ ] Phase 1 Input Contract includes: "$ARGUMENTS. If empty, ask the user."

**Subagent Files (if any phases use context: fork):**
- [ ] Reference file exists under `references/` (sequential fallback)
- [ ] Standalone subagent file exists under `.claude/skills/` or `.claude/agents/`
- [ ] Subagent file has correct frontmatter (context: fork, agent:, model:, skills:)
- [ ] Subagent file is self-contained (no dependency on parent context)
- [ ] Subagent output contract returns structured brief, not raw data
- [ ] Orchestrator references both paths (comment for Claude Code, reference file for others)

**Portability:**
- [ ] Core workflow uses standard frontmatter only
- [ ] Claude Code extensions clearly optional (commented out)
- [ ] Sequential fallback exists for platforms without subagents
- [ ] If API is a target, research phases adapted for no-network

### Step 2: Best Practices Verification

Validate the generated skill against current best practices from three sources. This step checks live references so validation stays current as standards evolve.

**Source 1: Agent Skills spec and best practices**
Fetch https://agentskills.io/skill-creation/best-practices and https://agentskills.io/specification.
Check the generated skill against every guideline on those pages:
- Frontmatter field constraints (name, description, optional fields)
- Description writing rules (phrasing, trigger coverage, length)
- Content quality (add what agent lacks, omit what it knows)
- Progressive disclosure (SKILL.md size, reference file organization)
- Instruction patterns (gotchas, templates, validation loops, defaults not menus)
- Any new guidelines added since this workflow was last updated

**Source 2: /skill-creator**
If the skill-creator skill is available, invoke it in review mode against the generated skill files. Apply its recommendations.

**Source 3: /plugin-dev skill-development**
If the plugin-dev:skill-development skill is available, load it and check the generated skill against its guidance for:
- Description quality and trigger phrase coverage
- SKILL.md body structure and writing style
- Progressive disclosure and reference file organization
- Any additional conventions

**Output:** Best-practices verification report listing:
- Source checked
- Guidelines verified
- Issues found (with severity and fix)
- Guidelines that passed

Fix any issues found before proceeding. Re-run contract chain verification (Step 4) after fixes.

### Step 3: Trigger Phrase Test
For each trigger phrase in the description:
- Would it unambiguously activate THIS skill (no collisions with common skills)?
- Are common user phrasings missing?
- Do phrases include both formal and casual variants?
- Does description err toward over-triggering?

Suggest additions if gaps exist. Re-verify ≤1024 chars after any changes.

### Step 4: Contract Chain Walk (in generated files)
For each Phase N → Phase N+1 transition in the GENERATED files:
1. Open Phase N file. Read ## Output Contract — what artifact name, format, and structure?
2. Open Phase N+1 file. Read ## Input Contract — does it reference that exact artifact name, format, and structure?
3. MATCH if input names the output artifact with compatible format. GAP if it uses a vague description, misses structure fields, or has format mismatch.
4. Verify format compatibility (markdown vs JSON, structured brief vs raw notes, etc.).

```
CONTRACT CHAIN (generated files)
Phase 1 → 2: [MATCH / GAP: description]
Phase 2 → 3: [MATCH / GAP: description]
...
```
Fix any gaps and re-verify the full chain from the start (fixes can introduce new gaps).

### Step 5: Second Anti-Pattern Pass
Apply the operationalized procedures from Phase 3 Step 9 again on the final files. Focus on issues that commonly survive the first audit:
- **Context amnesia**: Read the Workflow State Template. If you had ONLY this block and no conversation history, could you reconstruct what happened and why? If key decisions or reasoning would be lost, expand the template.
- **Assumed inputs**: Read each Input Contract. Does it say "Research findings from Phase 1" (vague) or "Approved research brief (markdown: Summary, Sources, Key Findings, Gaps) from Phase 1" (specific)?
- **Shallow depth**: Count process steps that perform searches in research phases. Compare count to depth contract minimum. If steps describe "search for X" as one action but the contract says 8+ searches, the steps don't operationalize the contract.
- **Unverified skills**: For each cross-cutting skill reference, confirm it appears in process steps with concrete instructions AND in the validation checklist with observable proof criteria.

After fixing any issues, re-run the contract chain walk (Step 4) and re-check the specific anti-pattern items that required fixes.

### Step 6: Functional Testing Protocol
Produce this testing protocol for the user to run after deploying the skill:

```
FUNCTIONAL TESTING PROTOCOL
Run these 9 tests against the deployed skill:

1. TRIGGER TEST
   Invoke the skill using at least 3 different natural-language
   phrasings from the description. Does it activate each time?

2. GATE HOLD TEST
   At a gate, say "keep going" or "continue" without giving explicit
   approval. The gate MUST hold — Claude must NOT proceed.

3. SKIP TEST
   Ask to skip a phase. The skill must: name the phase being skipped,
   list the outputs that phase would have produced, state the
   assumptions that replace those outputs, and ask for confirmation.

4. CONTEXT SURVIVAL TEST
   At the final phase, check: does the workflow state block still
   accurately reflect Phase 1 decisions? Are Key decisions and
   Decision rationale intact and correct?

5. REVISION TEST
   At a gate, request a change. Verify: does the revision loop
   follow the protocol (revise → re-validate → re-present)? Does
   it respect the maximum revision count for that phase?

6. DEPTH TEST (research phases only)
   Count the actual web searches and web_fetch calls. Do they meet
   or exceed the Execution Depth Contract minimums?

7. INTERACTIVE GATE TEST
   Review every question asked during the workflow. Did all bounded
   questions use ask_user_input? Were any prose questions asked
   where structured options would have worked?

8. CROSS-PLATFORM TEST
   Run the workflow on each target platform. On platforms without
   subagents (Claude.ai, Cowork), does the core workflow function
   using sequential execution? On Claude Code, do enhancements
   (context: fork, hooks, subagent files) activate correctly?

9. RECOVERY TEST
   Interrupt the workflow mid-phase (close the session or stop
   responding). Resume from the last gate. Does the workflow state
   block provide enough context to continue without re-reading
   completed phase files?
```

**What to watch for during testing** (common agent failure behaviors):
- Reads ahead into future phase files before the current phase completes
- Combines the gate presentation with the start of the next phase in one response
- Fabricates information not present in earlier phase outputs
- Drops the workflow state block at later gates (especially gates 3+)
- Ignores cross-cutting skill references under context pressure
- Satisfies research phases with 2-3 surface searches instead of depth contract minimums
- Asks prose questions where ask_user_input should be used
- Drops Decision rationale from workflow state blocks
- Subagent output contracts violated (returns raw data dump instead of structured brief)

### Step 7: Produce Validation Report
```
VALIDATION REPORT
Skill: [name]
Target platforms: [list]

Deployment Checklist: [N] PASS / [N] FAIL
  Failures: [list with remediation applied]

Trigger Phrases: [N] in description, [N] adequate, [N] additions suggested

Contract Chain (generated files): [ALL MATCH / GAPS: list]
  Re-verified after fixes: [yes/no]

Anti-Pattern Scan: [CLEAN / ISSUES: list with remediation]
  Re-verified after fixes: [yes/no]

Functional Testing Protocol: INCLUDED (9 tests + watch-for list)

Deployment Readiness: [READY / BLOCKED: list blockers]

Deployment Instructions:
  Claude.ai: Upload zip via Settings > Features (per-user).
    Enterprise admins can push organization-wide.
  Claude Code: Copy folder to .claude/skills/ (project-level)
    or ~/.claude/skills/ (personal). For team distribution,
    package as a plugin with .claude-plugin/plugin.json.
  Cowork: Place in Cowork skills directory (filesystem).
  Claude API: Upload via /v1/skills endpoint. Required beta
    headers: code-execution-2025-08-25, skills-2025-10-02,
    files-api-2025-04-14.
  Agent SDK: Place in .claude/skills/. Enable by including
    "Skill" in allowed_tools configuration.
```

### Step 8: Fix Failures
Fix any FAIL items in the generated files. Re-verify the fixed items. Re-count lines if files changed. Re-run contract chain walk and affected anti-pattern checks. Update the validation report.

### Step 9: Package
Create a zip archive containing ALL generated skill files (SKILL.md, every reference file, scripts, assets — the complete skill folder). Present the zip for download. This is critical — the user must receive every file, not just SKILL.md.

On Claude.ai / Cowork: Copy all files to /mnt/user-data/outputs/[skill-name]/ and create zip at /mnt/user-data/outputs/[skill-name].zip. Present the zip for download. Do NOT rely on "View folder" links — always produce a downloadable zip.
On Claude Code: Create a zip of the skill folder in the current working directory. Present the file tree and confirm location with the user.

## Output Contract
- Validation report (all items checked, all failures remediated, re-verified)
- Functional testing protocol (9 tests + watch-for behaviors)
- Fixed skill files (if remediated)
- Packaged skill folder + zip with deployment instructions

## Validation Checklist
- [ ] All deployment checklist items marked PASS or FAIL (none skipped)
- [ ] All FAIL items remediated, re-verified, and contract chain re-walked
- [ ] Contract chain has no gaps (verified in generated files)
- [ ] Anti-pattern scan clean (operationalized procedures followed)
- [ ] Trigger coverage adequate (≥5, diverse, formal + casual, over-trigger bias)
- [ ] Functional testing protocol included with all 9 tests and watch-for list
- [ ] Deployment instructions included for each target platform
- [ ] ALL files packaged as a single zip archive and presented for download (not just SKILL.md)

## Gate
Present validation report.
ask_user_input:
  question: "Validation complete. Ready to deploy?"
  options: "Approved — deliver" / "Needs fixes" / "Additional testing" / "Revise Build phase"

STOP. Wait for explicit user approval.
