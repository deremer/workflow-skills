# Workflow Skill Creator

A Claude Code plugin that turns a repeatable multi-step process into a structured skill with human review gates between phases.

The plugin ships one skill, `workflow-skill-creator`, which runs a 4-phase pipeline:

1. **Scope** — interview to capture intent, phases, platforms, and constraints
2. **Architect** — design state contracts, execution models, gates, depth contracts, and frontmatter
3. **Build** — generate the orchestrator `SKILL.md` and all phase reference files
4. **Validate** — run the deployment checklist, functional tests, and package the result

Each phase ends at a gate. The skill stops and waits for explicit approval before moving on, so you stay in control of the design as it takes shape. The output follows the [Agent Skills](https://agentskills.io) open standard and runs on Claude Code and Claude.ai.

## Install

Add the marketplace, then install the plugin:

```
/plugin marketplace add deremer/workflow-skills
/plugin install workflow-skill-creator@workflow-skills
```

## Use

Invoke it directly:

```
/workflow-skill-creator
```

Or describe the work in natural language. The skill activates on phrases like "create a workflow skill", "build a multi-phase skill", "turn this process into a workflow", or any description of a 3+ step process that needs review between steps.

## Layout

```
.
├── .claude-plugin/
│   ├── plugin.json          # plugin manifest
│   └── marketplace.json     # marketplace manifest
├── skills/
│   └── workflow-skill-creator/
│       ├── SKILL.md         # orchestrator
│       └── references/      # one reference file per phase, plus build templates
├── LICENSE
└── README.md
```

## License

MIT. See [LICENSE](LICENSE).
