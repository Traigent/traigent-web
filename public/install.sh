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
PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
export PATH

PACKAGE="traigent"
if [ -n "${TRAIGENT_VERSION:-}" ]; then
  PACKAGE="traigent==${TRAIGENT_VERSION}"
fi

install_uv() {
  if has uv; then
    return 0
  fi

  say "uv not found. Installing uv with Astral's official bootstrap:"
  say "  curl -LsSf https://astral.sh/uv/install.sh | sh"
  if ! has curl; then
    say "curl not found; cannot run the uv bootstrap."
    return 1
  fi

  curl -LsSf https://astral.sh/uv/install.sh | sh || true
  has uv
}

install_with_pip() {
  if has python3; then
    PYTHON=python3
  elif has python; then
    PYTHON=python
  else
    die "Python is required for the pip fallback."
  fi

  USER_BASE="$("$PYTHON" -m site --user-base 2>/dev/null || printf '%s/.local' "$HOME")"
  PATH="$USER_BASE/bin:$PATH"
  export PATH
  say "Installing Traigent with pip --user..."
  "$PYTHON" -m pip install --user --upgrade "$PACKAGE"
}

if install_uv; then
  say "Installing Traigent with uv..."
  uv tool install --force --upgrade "$PACKAGE"
elif has pipx; then
  say "uv is unavailable. Installing Traigent with pipx..."
  pipx install --force "$PACKAGE"
else
  say "uv and pipx are unavailable."
  install_with_pip
fi

has traigent || die "traigent is not on PATH. Add $HOME/.local/bin to PATH, then rerun 'traigent info'."
traigent info >/dev/null 2>&1 || die "'traigent info' failed. Run 'traigent info' for details."

say ""
say "Traigent is installed and 'traigent info' ran successfully."
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
