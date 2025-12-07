# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Traigent-web is a React-based web application. The project uses Vite for bundling (based on the hashed output file naming convention).

## Current State

- Production bundle: `index-cf790de1.js` (minified React production build)
- Single source component: `layout.jsx` - basic React layout wrapper
- Deployed to GitHub Pages via `gh-pages` branch

## Architecture

Simple React SPA structure:
- `layout.jsx` - Root layout component wrapping children
- Bundle includes React, React DOM, and JSX runtime

## Codacy Integration

This project is configured for Codacy MCP Server integration (see `.github/instructions/codacy.instructions.md`):
- Provider: `gh`
- Organization: `gilrose4`
- Repository: `traigent-web`

When editing files, run `codacy_cli_analyze` tool after changes if Codacy MCP is available.
