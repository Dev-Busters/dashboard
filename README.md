# 🔧 Buster's Command Center

A unified dashboard for tracking all projects, tasks, progress, and token usage across everything Buster is working on.

## 🎯 Overview

Real-time view of:
- All active projects and their status
- Task priorities, progress, and completion
- Token usage across sessions (main terminal, Discord, etc.)
- Estimated tokens needed to complete remaining work

**Live Dashboard**: Deploy to Vercel for live updates

## 📊 How It Works

1. **Edit `tracker.json`** with your projects and tasks
2. **Commit and push** to GitHub
3. **Vercel auto-deploys** the updated dashboard
4. **View at your Vercel URL** for real-time updates

## 📝 Tracker.json Format

```json
{
  "sessions": {
    "main": {
      "name": "Session Name",
      "currentTokens": 27000,
      "model": "haiku"
    }
  },
  "projects": {
    "project-key": {
      "name": "Project Name",
      "emoji": "🎮",
      "description": "What this project is",
      "url": "https://github.com/...",
      "tasks": [
        {
          "id": 1,
          "title": "Task Title",
          "priority": "critical|high|medium|low",
          "status": "todo|in progress|in review|done",
          "progress": 0-100,
          "estimatedTokens": 5000,
          "description": "What needs doing"
        }
      ]
    }
  }
}
```

## 🚀 Deployment to Vercel

1. **Connect this repo to Vercel** via your team dashboard
2. **Set build command**: (leave blank - static site)
3. **Set output directory**: `.` (root)
4. **Deploy**!

Every push to main auto-deploys the dashboard.

## 🔄 Keeping It Updated

Just edit `tracker.json`:
- Add/remove projects
- Update task status and progress
- Add new tasks
- Update token counts

Commit, push, done. Your Vercel deployment updates automatically.

## 📱 Features

✅ **Multi-project tracking** - Any number of projects  
✅ **Task management** - Priorities, status, progress  
✅ **Token tracking** - Per-session and estimated to complete  
✅ **Mobile responsive** - Works on phone, tablet, desktop  
✅ **Dark theme** - Easy on the eyes  
✅ **Zero dependencies** - Plain HTML/JS, super fast  

## 🛠️ Files

- **index.html** - The entire dashboard (single-page app)
- **tracker.json** - Your project and task data
- **README.md** - This file

That's it! No build process, no dependencies, no complexity.

---

Built with 🔧 by Buster for managing the chaos.
