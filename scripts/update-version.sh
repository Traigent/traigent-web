#!/bin/bash
# Auto-generate version info from git branch, repo name, and current datetime

BRANCH=$(git rev-parse --abbrev-ref HEAD)
DATETIME=$(date +"%Y-%m-%d-%H:%M")
# Extract repo name from remote URL (e.g., "Achi-Traigent/traigent-web" from git URL)
REPO=$(git remote get-url origin 2>/dev/null | sed -E 's/.*[:/]([^/]+\/[^/]+)(\.git)?$/\1/' | sed 's/\.git$//')
VERSION="v-${REPO}-${BRANCH}-${DATETIME}"

cat > src/version.json << EOF
{
  "version": "${VERSION}",
  "repo": "${REPO}",
  "branch": "${BRANCH}",
  "buildTime": "${DATETIME}"
}
EOF

echo "Updated version to: ${VERSION}"
