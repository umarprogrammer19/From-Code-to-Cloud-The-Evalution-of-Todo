#!/usr/bin/env python3
"""CLI Todo App - A terminal-based todo list manager."""

import sys
import typer
from src.cli.commands import app, run_interactive_mode


def main():
    """Main entry point for the CLI Todo App."""
    # Check if no arguments provided (besides the script name)
    if len(sys.argv) == 1:
        # Run interactive mode
        run_interactive_mode()
    else:
        # Run command-line mode with Typer
        app()


if __name__ == "__main__":
    main()