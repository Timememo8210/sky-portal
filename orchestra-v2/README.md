# Orchestra v2

Orchestra v2 keeps the v1 idea small, but makes the collaboration protocol explicit.
The key change is file ownership: the coordinator is the only process that edits the
shared plan, task list, global memory, and state snapshot. Planner, worker, and
review agents write only to their own directories or append-only mailbox files.

## What Changed

| Area | v1 | v2 |
| --- | --- | --- |
| Task state | Shared `state.json` plus context file | Coordinator-owned `state.json`, `todo.md`, `memory/global.md` |
| Worker progress | Worker logs | Per-agent `status.json`, `progress.ndjson`, `handoff.md` |
| Agent communication | Prompt context and git diff | Append-only `mailbox/*.md` files plus coordinator memory rollup |
| Code conflicts | Workers may share one tree | Default `git worktree` isolation, one tree per worker |
| Model routing | Hard-coded Opus / GLM / Codex | Runtime selectable planner, worker, reviewer, and worker count |
| Review loop | Review then retry | Review issues become coordinator-owned next-round tasks |

## Runtime Layout

```text
.orchestra-v2/
  runs/
    run-20260522-204800/
      config.json
      state.json                 # coordinator-owned
      todo.md                    # coordinator-owned
      memory/
        global.md                # coordinator-owned
      mailbox/
        20260522T204812-worker-1-to-coordinator.md
      agents/
        worker-1/
          task.md
          prompt.md
          status.json
          progress.ndjson
          handoff.md
      review/
        prompt-round-1.md
        review-round-1.md
        status.json
      worktrees/
        worker-1/
      patches/
        worker-1.patch
```

## Ownership Rules

1. The coordinator writes `state.json`, `todo.md`, `memory/global.md`, review
   task allocation, and final merge decisions.
2. A worker writes only inside `agents/<agent-id>/` and creates new files in
   `mailbox/`. It never edits `todo.md` or global memory directly.
3. A reviewer writes only inside `review/` and `mailbox/`.
4. Cross-agent communication is append-only: create a new mailbox file instead of
   appending to a shared conversation log.
5. Code changes happen in isolated worktrees when the target directory is a git
   repo. The coordinator collects patches and decides what to merge.

## Model Selection

The dashboard and `/api/start` accept:

- `planner_model`: model/profile for the master planning phase.
- `worker_model`: default model/profile for child agents.
- `worker_models`: optional per-worker override list.
- `reviewer_model`: model/profile for review.
- `worker_count`: number of child agents.
- `monitor_interval_seconds`: how often the coordinator polls child status.
- `isolation`: `worktree` or `shared`.

Built-in profiles are defined in `orchestrator_v2.py`. The `noop` profile is useful
for testing the protocol without spending model calls.

## Run

```bash
cd orchestra-v2
./start_v2.sh
```

Then open `http://localhost:8420`.

Command line run without the dashboard:

```bash
python3 orchestrator_v2.py --once --config CONFIG.example.json
```

## Update Log

- 2026-05-22: Added v2 design package, coordinator-owned status protocol,
  append-only mailbox, selectable model profiles, worker count control, and
  worktree-first isolation.
