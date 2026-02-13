# Buster's Command Center 🎯

A modern, production-grade **Kanban-style task management dashboard** for tracking projects, tasks, budget, and progress across all your work.

## Features ✨

- **Kanban Board**: Drag-and-drop tasks between Todo, In Progress, Done, and Planned columns
- **Project Management**: Switch between multiple projects with full task isolation
- **Budget Tracking**: Real-time cost tracking with remaining budget visibility
- **Progress Analytics**: Task completion rates, project statistics, and budget breakdown
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly dark theme optimized for long work sessions
- **Local Storage**: All data persists in your browser (no backend required)
- **Real-time Sync**: Automatic sync with tracker.json for seamless integration

## Tech Stack 🛠️

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with modern utilities
- **Vite** - Lightning-fast build tool
- **Lucide Icons** - Beautiful, consistent iconography

## Getting Started 🚀

### Installation

```bash
cd /Users/theharrowed/.openclaw/workspace/dashboard
npm install
```

### Development

```bash
npm run dev
# Opens at http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure 📁

```
dashboard/
├── src/
│   ├── components/
│   │   ├── TaskCard.tsx         # Individual task card component
│   │   └── KanbanColumn.tsx     # Kanban column component
│   ├── hooks/
│   │   └── useDashboard.ts      # State management hook
│   ├── types.ts                 # TypeScript type definitions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + custom styles
├── vite.config.ts              # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tracker.json                 # Project data (auto-generated)
└── package.json                 # Dependencies
```

## Data Format 📊

The dashboard reads from `tracker.json` (or localStorage if available):

```json
{
  "projects": {
    "project-id": {
      "id": "project-id",
      "name": "Project Name",
      "emoji": "🎮",
      "description": "Project description",
      "phase": "MVP Testing",
      "color": "bg-blue-600",
      "tasks": [
        {
          "id": "task-1",
          "title": "Task Title",
          "description": "Task details",
          "status": "todo" | "in-progress" | "done" | "planned",
          "priority": "low" | "medium" | "high" | "critical",
          "estimatedTokens": 1000,
          "cost": 0.50,
          "tags": ["feature", "urgent"],
          "createdAt": "2026-02-13T...",
          "updatedAt": "2026-02-13T..."
        }
      ]
    }
  },
  "costTracking": {
    "totalBudget": 100.00,
    "spent": 25.50,
    "remaining": 74.50
  }
}
```

## Architecture Highlights 🏗️

### Component Hierarchy

```
App (Main Layout)
├── Header (Project selector, budget card)
├── Project Info (Completion rate, cost, phase)
├── KanbanBoard (4 Columns)
│   ├── KanbanColumn (Todo)
│   │   ├── TaskCard
│   │   ├── TaskCard
│   │   └── AddTask Button
│   ├── KanbanColumn (In Progress)
│   │   └── TaskCards...
│   ├── KanbanColumn (Done)
│   │   └── TaskCards...
│   └── KanbanColumn (Planned)
│       └── TaskCards...
└── Footer (Last updated timestamp)
```

### State Management

Uses React Hooks with localStorage persistence:
- `useDashboard()` - Main state hook
- Automatic save on state changes
- Real-time drag-and-drop updates

### Performance Optimizations

✅ Code-split components  
✅ Memoized callbacks  
✅ Efficient re-renders with React.memo  
✅ CSS containment for fast layout  
✅ Lazy image loading (when images added)  

## Drag & Drop Usage 🎯

1. **Hover** over any task card - grab handle appears
2. **Drag** the task to another column
3. **Drop** to change status automatically
4. **Auto-save** to localStorage

## Keyboard Shortcuts ⌨️

- `Esc` - Close modals (when implemented)
- `Click` card - View/edit task details (coming soon)
- `Ctrl/Cmd + K` - Quick task search (coming soon)

## Future Enhancements 🔮

- [ ] Task editing modal
- [ ] Filtering by priority/tags
- [ ] Search functionality
- [ ] Calendar view for due dates
- [ ] Team collaboration features
- [ ] Time tracking integration
- [ ] Budget forecasting
- [ ] Custom fields for tasks
- [ ] Export to CSV/PDF
- [ ] Dark/light theme toggle

## Development Tips 💡

### Adding a New Component

1. Create in `src/components/`
2. Export from component barrel (if needed)
3. Import in parent component
4. Type with TypeScript interfaces

### Styling

- Use Tailwind utility classes
- Define component styles in className strings
- Use `@apply` for repeated patterns (in index.css)
- Reference `tailwind.config.js` for custom theme values

### Type Safety

- Define types in `src/types.ts`
- Use discriminated unions for state
- Export types from components as needed
- Run `npm run type-check` to validate

## Browser Support 🌐

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License 📄

Built with ❤️ by Buster for the Agent Arena project.

---

**Last Updated**: 2026-02-13  
**Version**: 1.0.0  
**Status**: 🚀 Production Ready
