#!/usr/bin/env bash
# Workshop Navigation Helper
# Usage: ./scripts/workshop-nav.sh <command> [step-number]
#
# Commands:
#   list-steps    Show all workshop step branches
#   goto <N>      Checkout step-N branch (e.g., goto 3)
#   diff-next     Show diff between current step and next step
#   diff-prev     Show diff between previous step and current step
#   current       Show current step
#   summary       Show one-line summary for each step

set -e

STEPS=(
  "step-01-scaffold:Project scaffold with enterprise architecture"
  "step-02-standalone-migration:NgModule vs Standalone component patterns"
  "step-03-signals-reactivity:signal(), computed(), effect() patterns"
  "step-04-zoneless:Zoneless change detection (Angular 21 default)"
  "step-05-ngrx-signalstore:NgRx SignalStore state management"
  "step-06-mock-api:Mock API interceptor and HTTP services"
  "step-07-vitest-migration:Vitest testing patterns and migration"
  "step-08-signal-forms:Signal Forms and Reactive Forms comparison"
  "step-09-angular-aria:WAI-ARIA accessibility patterns"
  "step-10-ci-cd:CI/CD pipeline and migration checklists"
)

get_branch_name() {
  local num=$(printf "%02d" "$1")
  for step in "${STEPS[@]}"; do
    local branch="${step%%:*}"
    if [[ "$branch" == *"-$num-"* ]]; then
      echo "$branch"
      return
    fi
  done
}

get_current_step() {
  local branch=$(git branch --show-current)
  if [[ "$branch" == step-* ]]; then
    echo "${branch}" | grep -oP '\d{2}' | head -1
  else
    echo "0"
  fi
}

case "${1:-help}" in
  list-steps|list|ls)
    echo "Workshop Steps:"
    echo "==============="
    for step in "${STEPS[@]}"; do
      local branch="${step%%:*}"
      local desc="${step#*:}"
      printf "  %-35s %s\n" "$branch" "$desc"
    done
    ;;

  goto|go|checkout)
    if [ -z "$2" ]; then
      echo "Usage: $0 goto <step-number>"
      echo "Example: $0 goto 3"
      exit 1
    fi
    branch=$(get_branch_name "$2")
    if [ -n "$branch" ]; then
      echo "Switching to $branch..."
      git checkout "$branch"
    else
      echo "Step $2 not found. Use 'list-steps' to see available steps."
      exit 1
    fi
    ;;

  diff-next|next)
    current=$(get_current_step)
    next=$((10#$current + 1))
    next_branch=$(get_branch_name "$next")
    current_branch=$(git branch --show-current)
    if [ -n "$next_branch" ]; then
      echo "Changes from $current_branch → $next_branch:"
      git diff "$current_branch".."$next_branch" --stat
    else
      echo "You're on the last step."
    fi
    ;;

  diff-prev|prev)
    current=$(get_current_step)
    prev=$((10#$current - 1))
    prev_branch=$(get_branch_name "$prev")
    current_branch=$(git branch --show-current)
    if [ -n "$prev_branch" ] && [ "$prev" -gt 0 ]; then
      echo "Changes from $prev_branch → $current_branch:"
      git diff "$prev_branch".."$current_branch" --stat
    else
      echo "You're on the first step."
    fi
    ;;

  current)
    echo "Current branch: $(git branch --show-current)"
    ;;

  summary)
    echo "Workshop Progress:"
    echo "=================="
    current_branch=$(git branch --show-current)
    for step in "${STEPS[@]}"; do
      local branch="${step%%:*}"
      local desc="${step#*:}"
      if [ "$branch" = "$current_branch" ]; then
        printf "  → %-35s %s\n" "$branch" "$desc"
      else
        printf "    %-35s %s\n" "$branch" "$desc"
      fi
    done
    ;;

  help|--help|-h)
    echo "Workshop Navigation Helper"
    echo ""
    echo "Usage: $0 <command> [step-number]"
    echo ""
    echo "Commands:"
    echo "  list-steps    Show all workshop step branches"
    echo "  goto <N>      Checkout step-N branch"
    echo "  diff-next     Show diff to next step"
    echo "  diff-prev     Show diff from previous step"
    echo "  current       Show current step"
    echo "  summary       Show all steps with current marker"
    ;;

  *)
    echo "Unknown command: $1"
    echo "Run '$0 help' for usage"
    exit 1
    ;;
esac
