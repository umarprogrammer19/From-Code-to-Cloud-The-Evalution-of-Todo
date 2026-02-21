"""CLI Todo App - A terminal-based todo list manager."""

import sys
import typer
from src.cli.commands import app, run_interactive_mode

def main():
    """Main entry point for the CLI Todo App."""
    if len(sys.argv) == 1:
        run_interactive_mode()
    else:
        app()

if __name__ == "__main__":
    main()
