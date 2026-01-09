# Skill: Professional Next.js UI/UX

## 1. The Stack
- **Components**: `shadcn/ui` (Button, Card, Input, Dialog, DropdownMenu).
- **Animations**: `framer-motion` (for layout transitions and list items).
- **Icons**: `lucide-react`.
- **Fonts**: `Geist Sans` or `Inter`.

## 2. Layout Patterns
- **Dashboard Layout**: Fixed Sidebar (Desktop) / Hamburger Menu (Mobile) + Scrollable Main Content.
- **Card Design**: Clean borders, subtle shadows (`shadow-sm`), and hover effects (`hover:shadow-md`).

## 3. UX Patterns (Crucial)
- **Optimistic UI**: When adding a task, show it *instantly* in the list while the API saves it in the background.
- **Empty States**: If a list is empty, show a friendly illustration or icon with a "Create your first task" button.
- **Error Boundaries**: If the API fails, show a specialized Error Card with a "Retry" button.

## 4. Visual Hierarchy
- Primary Actions (Save/Add): Solid Background (Black/Brand Color).
- Secondary Actions (Cancel): Ghost or Outline variant.
- Destructive Actions (Delete): Red/Destructive variant.