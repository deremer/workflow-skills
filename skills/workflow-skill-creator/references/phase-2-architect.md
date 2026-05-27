# Phase 2: Architect

## Announcement
Say: "Starting Phase 2: Architect. I'll design state contracts, execution models, gates, depth contracts, and frontmatter from the approved scope."

## Input Contract
- Approved scope brief from Phase 1 (including gate focus per phase, frequency, parameterization, invocation mode)

## User Questions

1. **Revision tolerance** (single-select)
   - Tight (1/phase) / Standard (2/phase) / Generous (3 for high-stakes, 1-2 for others) / Custom

2. **Research depth?** (single-select, only if scope flagged depth contracts)
   - Light (3-5 searches, 1-2 full reads, 5+ sources)
   - Standard (8+ searches, 3-5 full reads, 8+ sources)
   - Heavy (15+ searches, 5-8 full reads, 12+ sources)
   - Custom

## Process

### Step 1: Design State Contracts
For each phase, define:

**Input contract** — exactly what this phase needs, referencing the actual artifact (not an idealized version). Specify the artifact name, format, and internal structure.

Format: `[Artifact name] ([format]: [structure description])`
Example: `Approved research brief (markdown: Summary, Sources with URLs, Key Findings tagged FACT/PROJECTION/OPINION, Gaps)`
NOT: `Research findings from Phase 1`

**Output contract** — exactly what this phase produces. Same format specificity.

Example: `Draft narrative (markdown: 800-1200 words, results-led structure, 3 pull quotes highlighted, all claims sourced from research brief)`
NOT: `A draft of the case study`

**Subagent output contract** (only for context: fork phases):
```
Return EXACTLY:
- Summary (3-5 sentences)
- Sources (numbered): URL, title, credibility
- Key findings (list): each tagged [FACT] / [PROJECTION] / [OPINION]
- Gaps (list): unanswered questions
- Recommended follow-up searches (optional)
Do NOT return raw results, full articles, or intermediate notes.
```

Verify the full chain: every output contract must feed cleanly into the next input contract. For every field in Phase N+1's input, confirm Phase N's output explicitly produces it. Check format compatibility (if output is markdown but input expects JSON, that's a gap).

### Step 2: Execution Model Per Phase
Apply these decision trees:

**Research/gather phases:**
```
8+ searches needed?
├── Yes → Cross-reference between streams needed?
│   ├── Yes → Agent Teams (Claude Code + Opus only)
│   └── No → Subagent with context: fork (Claude Code / SDK)
│         └── Target platform lacks subagents? → Sequential
└── No → Single session
```

**Cross-cutting skill phases:**
```
Needs cross-cutting skills?
├── Yes → Running as subagent?
│   ├── Yes → Custom subagent with skills: field (subagents don't inherit parent skills)
│   └── No → Reference skills by name in phase file
└── No → Standard
```

**High-stakes phases:**
```
Destructive operations, external comms, or financial?
├── Yes → Hook-based gate (Claude Code) + prompt-based gate (all)
└── No → Prompt-based gate only
```

Document the decision AND rationale for each phase.

### Step 3: Design Gates
For each gate:

- **Review framing**: Derive from the gate focus captured in the scope brief. The gate message must tell the user what specifically to evaluate — not "review this" but "Check [gate focus from scope brief]. Verify [specific criteria]."
- **Interactive decision**: ask_user_input with options: Approved / Needs refinement / Major rework / Reject
- **Skip handling**: What assumptions replace the output if skipped. Mark phases that cannot be skipped.
- **Enforcement**: All four prohibitions (every generated gate MUST include all four):
  1. STOP. Wait for explicit user approval before ANY next action.
  2. Do NOT read the next phase reference file.
  3. Do NOT begin work on the next phase.
  4. Do NOT summarize what the next phase will do.

### Step 4: Calibrate Depth and Revisions to Frequency
Use the workflow frequency from the scope brief to calibrate cost-sensitive decisions:

| Frequency | Depth Contract | Revision Limits | Model Choice |
|---|---|---|---|
| Daily | Light (3-5 searches) unless critical | Tight (1/phase) | haiku for research |
| Weekly | Standard (8+ searches) | Standard (2/phase) | haiku or sonnet |
| Monthly/ad-hoc | Standard or Heavy | Standard or Generous | sonnet or opus |
| One-time | Heavy (15+ searches) | Generous (3 for key phases) | opus for synthesis |

Override user's depth/revision preferences if they conflict with frequency economics, but explain why. Example: "You selected Heavy depth for a daily workflow — this would consume significant tokens per run. Recommend Light depth for daily frequency. Proceed with Heavy anyway?"

### Step 5: Execution Depth Contracts
For each phase flagged as needing deep research:

```
## Execution Depth Contract
### Search Depth
- Minimum [N] web searches (calibrated to frequency)
- Start broad (2-3 words), narrow iteratively
- When results reveal new terms/players, search those
- Search angles: [list domain-specific angles]

### Source Chasing
- web_fetch full text of [N] most promising sources (not just snippets)
- Priority: official docs > analyst reports > reputable journalism > blogs

### Evidence Standards
- [N]+ unique sources cited
- Every quantified claim needs a source
- Label each claim: [FACT] / [PROJECTION] / [OPINION]
- State gaps explicitly — never fill with plausible-sounding filler
```

Platform constraint: Depth contracts using web_search/web_fetch work on Claude.ai (with network enabled) and Claude Code. They do NOT work via the Claude API (no network in code execution). For API targets, research phases must operate on pre-provided data.

### Step 6: Claude Code Frontmatter Decisions
For each phase and for the orchestrator, decide which Claude Code extension fields apply. These are optional enhancements — the workflow must function without them.

| Field | Purpose | When to use |
|---|---|---|
| `context: fork` | Run phase in isolated subagent | Research phases with 8+ searches (keeps main context clean) |
| `agent:` | Subagent type (Explore, Plan, custom) | Explore for read-only research; Plan for analysis |
| `allowed-tools:` | Restrict tool access for a phase | Phases with destructive operations (deploy, publish, send) |
| `model: haiku` | Override model for a phase | Cheap exploration/research; use opus for complex synthesis |
| `disable-model-invocation: true` | Prevent auto-triggering | Workflows with side effects — user must invoke explicitly |
| `user-invocable: false` | Hide from slash menu | Background knowledge skills, not action skills |
| `hooks:` | Lifecycle hooks scoped to skill | Programmatic gate enforcement for high-stakes transitions |
| `memory: project` | Persistent memory across sessions | Workflows that run repeatedly on similar inputs |
| `argument-hint: [param]` | Autocomplete hint for slash command | Parameterized workflows (from scope brief) |
| `skills:` | Preload skills into subagent context | Inject cross-cutting skills into subagent phases |

Record decisions for each field per phase. Mark as "N/A" or "yes: [value]".

For phases marked `context: fork`: note that Build will need to generate BOTH a reference file (for sequential fallback on Claude.ai/Cowork) AND a standalone subagent file (for Claude Code execution). Record the subagent file type: standalone skill (`.claude/skills/`) or custom agent (`.claude/agents/`).

### Step 7: Compile Architecture Spec

```
ARCHITECTURE SPEC
Skill name: [name]
Pattern: [A/B/C/D/E]
Total phases: [N]
Target platforms: [list]
Frequency: [daily/weekly/monthly/ad-hoc]

Phase Map:
  Phase [N]: [Name]
    Verb: [single verb]
    Execution model: [single session / subagent / agent team]
    Execution rationale: [why]
    Input: [artifact name] ([format]: [structure description])
    Output: [artifact name] ([format]: [structure description])
    Revision limit: [N]
    Depth contract: [yes: minimums / no]
    Cross-cutting skills: [list or none]
    Gate framing: "[specific message derived from gate focus]"
    Gate focus: [from scope brief]
    Skippable: [yes / no: reason]
    Uses ultrathink: [yes for synthesis/strategy/architecture phases / no]
    Claude Code extensions: [list fields and values, or "none"]
    Subagent file: [standalone skill / custom agent / N/A]

Contract Chain:
  Phase 1 → 2: [MATCH / GAP — verify artifact name, format, and structure fields]
  Phase 2 → 3: [MATCH / GAP]
  ...

Orchestrator Frontmatter:
  name: [verified ≤64 chars, lowercase, matches parent dir, no reserved words, no XML]
  description: [draft ≤1024 chars, imperative phrasing, what + when, 5+ triggers, "even if they don't mention..."]
  # Optional fields (from Agent Skills spec):
  # license: [from user or default]
  # compatibility: [platform requirements, if any]
  # metadata: { author: ..., version: ... }
  # Claude Code extensions (all optional, commented out):
  # disable-model-invocation: [true/false]
  # argument-hint: [param name, if parameterized]
  # user-invocable: [true/false, if background-only]
```

## Output Contract
- Architecture spec (format above) with format-specific contracts and gate focus per phase
- Execution model rationale per phase
- Contract chain verification (all transitions, checking artifact name + format + structure)
- Claude Code frontmatter decisions per phase, including subagent file type where applicable
- Frequency-calibrated depth and revision settings

## Validation Checklist
- [ ] Every phase has one verb
- [ ] Every contract specifies artifact name, format, and structure (not vague descriptions)
- [ ] Every output → next input chain verified with format compatibility, no gaps
- [ ] Execution models include fallback for platforms without subagents
- [ ] Research phases have depth contracts calibrated to workflow frequency
- [ ] Revision limits calibrated to workflow frequency
- [ ] Gate framing messages derived from gate focus (specific, not generic)
- [ ] Gate enforcement requires all four prohibitions
- [ ] Skip handling defined per gate (or marked not-skippable)
- [ ] Cross-cutting skills referenced by name; subagent preloading noted where needed
- [ ] Phases marked context: fork have subagent file type specified
- [ ] Synthesis/strategy phases marked for ultrathink
- [ ] Description draft ≤1024 chars with 5+ triggers

## Gate
Present the architecture spec. Use ask_user_input:
  question: "How does this architecture look?"
  options: "Approved — proceed to Build" / "Needs refinement" / "Needs major rework"

STOP. Wait for explicit user approval before ANY next action.
Do NOT read the next phase reference file.
Do NOT begin work on the next phase.
Do NOT summarize what the next phase will do.
