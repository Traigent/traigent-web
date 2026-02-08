#!/bin/bash
# Auto-generate version info from git branch and current datetime

BRANCH=$(git rev-parse --abbrev-ref HEAD)
DATETIME=$(date +"%Y-%m-%d-%H:%M")
VERSION="v-${BRANCH}-${DATETIME}"

cat > src/version.json << EOF
{
  "version": "${VERSION}",
  "branch": "${BRANCH}",
  "buildTime": "${DATETIME}"
}
EOF

echo "Updated version to: ${VERSION}"
