#!/usr/bin/env python3
"""CLI Todo App - A terminal-based todo list manager."""

import typer
from src.cli.commands import app


def main():
    """Main entry point for the CLI Todo App."""
    app()


if __name__ == "__main__":
    main()