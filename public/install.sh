#!/bin/sh
set -eu

say() {
  printf '%s\n' "$*"
}

die() {
  say "error: $*"
  exit 1
}

has() {
  command -v "$1" >/dev/null 2>&1
}

: "${HOME:?HOME is required}"
ORIGINAL_PATH="${PATH:-}"
PATH="$HOME/.local/bin:$HOME/.cargo/bin${ORIGINAL_PATH:+:$ORIGINAL_PATH}"
export PATH

# Keep the installer default aligned with the packaged quickstart dependencies.
# Switch this to traigent[recommended] once that extras bundle ships.
PACKAGE="traigent[integrations]"
if [ -n "${TRAIGENT_VERSION:-}" ]; then
  PACKAGE="traigent[integrations]==${TRAIGENT_VERSION}"
fi

ATTEMPT_SUMMARY=""
INSTALL_BIN_DIR=""

append_attempt_summary() {
  if [ -n "$ATTEMPT_SUMMARY" ]; then
    ATTEMPT_SUMMARY="${ATTEMPT_SUMMARY}
  - $*"
  else
    ATTEMPT_SUMMARY="  - $*"
  fi
}

prepend_path() {
  CURRENT_PATH="${PATH:-}"
  PATH="$1${CURRENT_PATH:+:$CURRENT_PATH}"
  export PATH
}

path_has_dir() {
  case ":$ORIGINAL_PATH:" in
    *":$1:"*) return 0 ;;
    *) return 1 ;;
  esac
}

uv_tool_bin_dir() {
  if [ -n "${UV_TOOL_BIN_DIR:-}" ]; then
    printf '%s\n' "$UV_TOOL_BIN_DIR"
    return 0
  fi

  UV_BIN_DIR="$(uv tool dir --bin 2>/dev/null || true)"
  if [ -n "$UV_BIN_DIR" ]; then
    printf '%s\n' "$UV_BIN_DIR"
  else
    printf '%s/.local/bin\n' "$HOME"
  fi
}

pipx_bin_dir() {
  if [ -n "${PIPX_BIN_DIR:-}" ]; then
    printf '%s\n' "$PIPX_BIN_DIR"
  else
    printf '%s/.local/bin\n' "$HOME"
  fi
}

guard_root() {
  # TRAIGENT_ALLOW_ROOT=1 overrides this guard for controlled admin/container use.
  if [ "$(id -u)" != "0" ] || [ "${TRAIGENT_ALLOW_ROOT:-}" = "1" ]; then
    return 0
  fi

  if [ -f /.dockerenv ] || [ -f /run/.containerenv ] || [ "${CI+x}" = "x" ]; then
    say "notice: running as root inside a container/CI context; continuing."
    return 0
  fi

  die "do not run this installer with sudo/root. Install as your normal user so 'traigent' lands on your user PATH. Set TRAIGENT_ALLOW_ROOT=1 to override."
}

ensure_uv() {
  if has uv; then
    return 0
  fi

  say "uv not found. Installing uv with Astral's official bootstrap:"
  say "  curl -LsSf https://astral.sh/uv/install.sh | sh"
  if ! has curl; then
    say "curl not found; cannot run the uv bootstrap."
    return 1
  fi

  UV_INSTALLER="${TMPDIR:-/tmp}/traigent-uv-install.$$"
  if curl -LsSf https://astral.sh/uv/install.sh -o "$UV_INSTALLER" && sh "$UV_INSTALLER"; then
    rm -f "$UV_INSTALLER"
    if has uv; then
      return 0
    fi
    say "uv bootstrap completed, but uv is not on PATH."
    return 1
  fi

  rm -f "$UV_INSTALLER"
  say "uv bootstrap failed."
  return 1
}

attempt_uv() {
  if ! ensure_uv; then
    append_attempt_summary "uv: unavailable or bootstrap failed"
    return 1
  fi

  say "Installing Traigent with uv..."
  if uv tool install --force --upgrade "$PACKAGE"; then
    INSTALL_BIN_DIR="$(uv_tool_bin_dir)"
    prepend_path "$INSTALL_BIN_DIR"
    append_attempt_summary "uv: succeeded"
    return 0
  fi

  append_attempt_summary "uv: failed installing '$PACKAGE'"
  return 1
}

attempt_pipx() {
  if ! has pipx; then
    append_attempt_summary "pipx: skipped (pipx not found)"
    return 1
  fi

  say "uv did not complete. Installing Traigent with pipx..."
  if pipx install --force "$PACKAGE"; then
    INSTALL_BIN_DIR="$(pipx_bin_dir)"
    prepend_path "$INSTALL_BIN_DIR"
    append_attempt_summary "pipx: succeeded"
    return 0
  fi

  append_attempt_summary "pipx: failed installing '$PACKAGE'"
  return 1
}

print_pep668_help() {
  say ""
  say "pip refused to install because this Python environment is externally managed (PEP 668)."
  say "Do not use --break-system-packages here. Install Traigent as a tool with uv or pipx instead:"
  say "  curl -LsSf https://astral.sh/uv/install.sh | sh"
  say "  uv tool install --force --upgrade '$PACKAGE'"
  say "or:"
  say "  python3 -m pip install --user pipx"
  say "  pipx install --force '$PACKAGE'"
}

attempt_pip() {
  if has python3; then
    PYTHON=python3
  elif has python; then
    PYTHON=python
  else
    append_attempt_summary "pip: skipped (python not found)"
    return 1
  fi

  USER_BASE="$("$PYTHON" -m site --user-base 2>/dev/null || printf '%s/.local' "$HOME")"
  INSTALL_BIN_DIR="$USER_BASE/bin"
  prepend_path "$INSTALL_BIN_DIR"
  PIP_ERROR_LOG="${TMPDIR:-/tmp}/traigent-pip-error.$$"

  say "uv and pipx did not complete. Installing Traigent with pip --user..."
  if "$PYTHON" -m pip install --user --upgrade "$PACKAGE" 2>"$PIP_ERROR_LOG"; then
    rm -f "$PIP_ERROR_LOG"
    append_attempt_summary "pip: succeeded"
    return 0
  else
    PIP_STATUS=$?
  fi

  if grep -Eiq 'externally-managed-environment|externally managed' "$PIP_ERROR_LOG"; then
    print_pep668_help
  else
    sed 's/^/pip: /' "$PIP_ERROR_LOG"
  fi
  rm -f "$PIP_ERROR_LOG"
  append_attempt_summary "pip: failed installing '$PACKAGE'"
  return "$PIP_STATUS"
}

print_path_persistence_hint() {
  if [ -z "$INSTALL_BIN_DIR" ] || path_has_dir "$INSTALL_BIN_DIR"; then
    return 0
  fi

  say ""
  say "Add Traigent to PATH for future shells:"
  say "  export PATH=\"$INSTALL_BIN_DIR:\$PATH\""
  say "Add that line to your shell profile (for example ~/.profile, ~/.bashrc, or ~/.zshrc), then open a new terminal."
}

fail_all_installers() {
  say ""
  say "Traigent install failed after trying:"
  printf '%s\n' "$ATTEMPT_SUMMARY"
  die "install uv or pipx, or fix the pip error above, then rerun this installer."
}

guard_root

if attempt_uv; then
  :
elif attempt_pipx; then
  :
elif attempt_pip; then
  :
else
  fail_all_installers
fi

has traigent || die "traigent is not on PATH. Add ${INSTALL_BIN_DIR:-$HOME/.local/bin} to PATH, then rerun 'traigent info'."
traigent info >/dev/null 2>&1 || die "'traigent info' failed. Run 'traigent info' for details."

say ""
say "Traigent is installed and 'traigent info' ran successfully."
print_path_persistence_hint
if traigent onboard --help >/dev/null 2>&1; then
  say "Next step:"
  say "  traigent onboard"
else
  say "Next steps for the current SDK:"
  say "  1. Create or copy an API key from https://portal.traigent.ai"
  say "  2. Run:"
  say "     traigent auth login"
  say "     python -m traigent.examples.quickstart"
  say ""
  say "The quickstart is a zero-cost mock run; it does not call an LLM provider."
fi
