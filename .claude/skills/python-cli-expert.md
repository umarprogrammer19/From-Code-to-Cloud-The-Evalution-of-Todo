# Skill: Professional Python CLI Development

## 1. Data Layer (`src/core`)
- Use `Pydantic` BaseModel for the `Task` object.
- Fields: `id` (int), `title` (str), `status` (pending/done), `priority` (high/medium/low).
- **Persistence**: Save/Load from `data/tasks.json`. Ensure the directory exists.

## 2. CLI Layer (`src/cli`)
- Use `typer.Typer()` for the app.
- **Coloring Rules**:
  - Use `rich.console.Console` for all output.
  - **Success**: Green text (`[bold green]...[/]`).
  - **Error**: Red text (`[bold red]...[/]`).
  - **Lists**: Display tasks in a `rich.table.Table` with columns: ID (Cyan), Title (White), Priority (Colored by level), Status.

## 3. Best Practices
- Never use `print()`. Use `console.print()`.
- Handle "File Not Found" errors by creating an empty list.