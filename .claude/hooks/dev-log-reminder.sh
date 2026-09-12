#!/usr/bin/env bash
# PostToolUse hook: after a `git commit`, remind the model to consider
# updating DEVELOPMENT_LOG.md (see CLAUDE.md). Does not write the log itself.
set -euo pipefail

input="$(cat)"
tool_name="$(printf '%s' "$input" | jq -r '.tool_name // empty')"
command="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"

if [ "$tool_name" != "Bash" ]; then
  exit 0
fi

case "$command" in
  *"git commit"*)
    jq -n '{
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: "A git commit just ran. Check whether it represents a notable milestone (an OpenSpec change archived, a significant bug root-caused and fixed, or an OpenSpec methodology lesson) and, if so, append an entry to DEVELOPMENT_LOG.md at the project root, per the instructions in CLAUDE.md. If nothing notable happened, no action is needed."
      }
    }'
    ;;
esac
