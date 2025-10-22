# AI Agent Teasers - Visual Guide

## Component Showcase

This visual guide shows you exactly what the AgentTeasers component looks like and how it works.

---

## 🎨 Full Component Layout

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              ┌─────────────────────────────────┐                ║
║              │ 🌟 AI-Powered Code Generation  │                ║
║              └─────────────────────────────────┘                ║
║                                                                  ║
║          Watch AI Build Your App                                ║
║    See how our AI agents transform your ideas                   ║
║          into production-ready code in seconds                  ║
║                                                                  ║
╠══════════════════════════════╦═══════════════════════════════════╣
║                              ║                                   ║
║  EXAMPLE SELECTOR            ║   CODE PREVIEW                    ║
║  ─────────────────           ║   ─────────────                   ║
║                              ║                                   ║
║  Choose an Example           ║   ●  ●  ●  TodoApp.tsx   [Copy]  ║
║  Select a prompt to see AI   ║   ┌───────────────────────────┐  ║
║  generate code in real-time  ║   │                           │  ║
║                              ║   │ import { useState } from  │  ║
║  ┌────────────────────────┐  ║   │   'react';                │  ║
║  │  📱                    │  ║   │ import { Card } from      │  ║
║  │  Todo App              │  ║   │   '@/components/ui/card'; │  ║
║  │  Create a modern todo  │  ║   │                           │  ║
║  │  app with local...     │  ║   │ interface Todo {          │  ║
║  └────────────────────────┘  ║   │   id: string;             │  ║
║                              ║   │   text: string;           │  ║
║  ┌────────────────────────┐  ║   │   completed: boolean;     │  ║
║  │  📊                    │  ║   │ }                         │  ║
║  │  Analytics Dashboard   │  ║   │                           │  ║
║  │  Build a real-time...  │  ║   │ export function TodoApp() │  ║
║  └────────────────────────┘  ║   │ {                         │  ║
║                              ║   │   const [todos,           │  ║
║  ┌────────────────────────┐  ║   │     setTodos] = ...       │  ║
║  │  🔐                    │  ║   │                           │  ║
║  │  Auth System           │  ║   │   useEffect(() => {       │  ║
║  │  Create a secure...    │  ║   │     const saved =         │  ║
║  └────────────────────────┘  ║   │       localStorage...     │  ║
║                              ║   │   }, []);█                │  ║
║  ┌────────────────────────┐  ║   │                           │  ║
║  │  🔌                    │  ║   │   return (                │  ║
║  │  REST API              │  ║   │     <Card>                │  ║
║  │  Generate a RESTful... │  ║   │       ...                 │  ║
║  └────────────────────────┘  ║   │     </Card>               │  ║
║                              ║   │   );                      │  ║
║  ┌────────────────────────┐  ║   │ }                         │  ║
║  │  📝                    │  ║   │                           │  ║
║  │  Form Validation       │  ║   └───────────────────────────┘  ║
║  │  Create a complex...   │  ║                                   ║
║  └────────────────────────┘  ║   ┌───────────────────────────┐  ║
║                              ║   │ ✓ Code generation complete│  ║
║  ┌────────────────────────┐  ║   └───────────────────────────┘  ║
║  │  💬                    │  ║                                   ║
║  │  Real-time Chat        │  ║                                   ║
║  │  Build a real-time...  │  ║                                   ║
║  └────────────────────────┘  ║                                   ║
║                              ║                                   ║
║  ┌────────────────────────┐  ║                                   ║
║  │    ▶ Try It Now        │  ║                                   ║
║  └────────────────────────┘  ║                                   ║
║                              ║                                   ║
╠══════════════════════════════╩═══════════════════════════════════╣
║                                                                  ║
║  STATS SECTION                                                   ║
║  ─────────────                                                   ║
║                                                                  ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       ║
║  │    💻    │  │    📦    │  │    ⚡    │  │    ✨    │       ║
║  │   10K+   │  │   60+    │  │   <3s    │  │   99%    │       ║
║  │  Lines   │  │Components│  │  Speed   │  │ Accuracy │       ║
║  └──────────┘  └──────────┘  └──────────┘  └──────────┘       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🎭 Animation Flow

### 1. Page Load - Fade In
```
[Hidden]
  ↓ 600ms
[Visible with slide up]
```

### 2. Example Selection
```
[User clicks Todo App card]
  ↓
[Card highlights with border]
  ↓
[Code preview fades out]
  ↓ 300ms
[New code fades in]
  ↓
[Typing animation starts]
```

### 3. Typing Animation
```
import { us█
  ↓ 5ms
import { use█
  ↓ 5ms
import { useSt█
  ↓ 5ms
[continues character by character...]
  ↓
[Complete code displayed]
  ↓
✓ Code generation complete!
```

### 4. Try It Now - Loading State
```
[Normal State]
  ▶ Try It Now
    ↓ [user clicks]
[Loading State]
  ✨ (rotating) Generating Code...
    ↓ 3 seconds
[Reset to Normal]
  ▶ Try It Now
```

---

## 🎨 Color Scheme

### Terminal Window
```
Background:     #020617  (slate-950)
Border:         #1e293b  (slate-800)
Text:           #f8fafc  (slate-100)
```

### Traffic Light Controls
```
Red:     #ef4444  ●
Yellow:  #eab308  ●
Green:   #22c55e  ●
```

### Syntax Highlighting
```typescript
// Purple - Keywords
import, const, function, return

// Blue - Types
string, number, boolean, interface

// Yellow - Strings
'hello', "world", `template`

// Orange - Numbers
123, 456.78

// Green - Comments
// This is a comment
```

### UI Elements
```
Primary Color:       var(--primary)
Hover Border:        var(--primary)/50
Active Background:   var(--primary)/10
Muted Text:          var(--muted-foreground)
```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
```
┌─────────────────────┐
│     Header          │
├─────────────────────┤
│  ┌───────┬───────┐  │
│  │Example│Example│  │
│  ├───────┼───────┤  │
│  │Example│Example│  │
│  ├───────┼───────┤  │
│  │Example│Example│  │
│  └───────┴───────┘  │
│  [  Try It Now  ]   │
├─────────────────────┤
│   Code Preview      │
│   ┌───────────────┐ │
│   │ Terminal      │ │
│   │ Code          │ │
│   │ Display       │ │
│   └───────────────┘ │
├─────────────────────┤
│ ┌────┐ ┌────┐      │
│ │Stat│ │Stat│      │
│ ├────┤ ├────┤      │
│ │Stat│ │Stat│      │
│ └────┘ └────┘      │
└─────────────────────┘
```

### Desktop (≥ 1024px)
```
┌─────────────────────────────────────┐
│            Header                   │
├─────────────────┬───────────────────┤
│  Examples       │  Code Preview     │
│  ┌───────────┐  │  ┌─────────────┐ │
│  │ Example 1 │  │  │  Terminal   │ │
│  ├───────────┤  │  │  Code       │ │
│  │ Example 2 │  │  │  Display    │ │
│  ├───────────┤  │  │  Area       │ │
│  │ Example 3 │  │  │             │ │
│  ├───────────┤  │  │             │ │
│  │ Example 4 │  │  │             │ │
│  ├───────────┤  │  └─────────────┘ │
│  │ Example 5 │  │                  │
│  ├───────────┤  │                  │
│  │ Example 6 │  │                  │
│  └───────────┘  │                  │
│  [ Try It Now ] │                  │
├─────────────────┴───────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │Stat│ │Stat│ │Stat│ │Stat│      │
│  └────┘ └────┘ └────┘ └────┘      │
└─────────────────────────────────────┘
```

---

## 🖱️ Interactive Elements

### Example Cards
```
[Default State]
┌─────────────────────┐
│  📱                 │
│  Todo App           │
│  Create a modern... │
└─────────────────────┘

[Hover State]
┌─────────────────────┐  ← Border glows
│  📱  ✨             │
│  Todo App           │
│  Create a modern... │
└─────────────────────┘

[Active State]
╔═════════════════════╗  ← Thicker border
║  📱                 ║  ← Background color
║  Todo App           ║
║  Create a modern... ║
╚═════════════════════╝
```

### Copy Button
```
[Default]              [Hover]              [Clicked]
┌──────────┐          ┌──────────┐          ┌──────────┐
│ 📋 Copy  │    →    │ 📋 Copy  │    →    │ ✓ Copied │
└──────────┘          └──────────┘          └──────────┘
                      (brightens)           (green, 2s)
```

### Try It Now Button
```
[Ready]                        [Loading]
┌─────────────────────┐       ┌─────────────────────┐
│  ▶ Try It Now       │   →   │ ✨ Generating...    │
└─────────────────────┘       └─────────────────────┘
                              (spinner rotates 360°)
```

---

## 📊 Component Hierarchy

```
AgentTeasers (root)
│
├── Header Section
│   ├── Badge Component
│   │   ├── Sparkles Icon
│   │   └── "AI-Powered Code Generation"
│   ├── Title (h2)
│   └── Description (p)
│
├── Main Grid (lg:grid-cols-2)
│   │
│   ├── Left Column - Example Selector
│   │   ├── Card
│   │   │   ├── CardHeader
│   │   │   │   ├── Terminal Icon
│   │   │   │   ├── Title
│   │   │   │   └── Description
│   │   │   └── CardContent
│   │   │       ├── Example Grid (sm:grid-cols-2)
│   │   │       │   ├── Example Card 1 (Todo)
│   │   │       │   ├── Example Card 2 (Dashboard)
│   │   │       │   ├── Example Card 3 (Auth)
│   │   │       │   ├── Example Card 4 (API)
│   │   │       │   ├── Example Card 5 (Form)
│   │   │       │   └── Example Card 6 (Chat)
│   │   │       └── Try It Now Button
│   │
│   └── Right Column - Code Preview
│       └── Card (Terminal Theme)
│           ├── Terminal Header
│           │   ├── Traffic Lights (● ● ●)
│           │   ├── File Name
│           │   └── Copy Button
│           └── Code Display
│               ├── TypingCode Component
│               │   ├── Highlighted Code
│               │   └── Blinking Cursor
│               └── Success Message
│
└── Stats Section (grid-cols-2 md:grid-cols-4)
    ├── Stat Card 1 (Lines)
    ├── Stat Card 2 (Components)
    ├── Stat Card 3 (Speed)
    └── Stat Card 4 (Accuracy)
```

---

## 🎬 User Journey

```
1. User scrolls to section
   ↓
   [Fade in animation triggers]
   ↓
2. User sees header and examples
   ↓
   [Default example (Todo) is pre-selected]
   ↓
3. User observes typing animation
   ↓
   [Code types out character by character]
   ↓
4. User clicks different example
   ↓
   [Card highlights, code switches, new typing starts]
   ↓
5. User clicks "Try It Now"
   ↓
   [Button shows loading state for 3s]
   ↓
6. User clicks Copy button
   ↓
   [Code copied, button shows ✓ Copied]
   ↓
7. User scrolls to stats
   ↓
   [Stats fade in with stagger effect]
```

---

## 🔧 State Management

```typescript
Component State
│
├── activeExample: string
│   └── Tracks which example is selected
│
├── isGenerating: boolean
│   └── Controls "Try It Now" loading state
│
├── copied: boolean
│   └── Shows copy feedback (resets after 2s)
│
└── TypingCode Internal State
    ├── displayedCode: string
    │   └── Currently visible code
    └── isTyping: boolean
        └── Whether animation is active
```

---

## 💡 Key Features Visualized

### Feature 1: Syntax Highlighting
```typescript
Before:
import { useState } from 'react';

After:
import { useState } from 'react';
^^^^^   ^^^^^^^^    ^^^^  ^^^^^^^
purple   blue      purple yellow
```

### Feature 2: Typing Animation
```
Frame 1:  i█
Frame 2:  im█
Frame 3:  imp█
Frame 4:  impo█
Frame 5:  impor█
Frame 6:  import█
...
Final:    [complete code]
```

### Feature 3: Responsive Grid
```
Mobile:     Tablet:       Desktop:
┌───┬───┐   ┌───┬───┐     ┌─────┬──────┐
│ 1 │ 2 │   │ 1 │ 2 │     │ Ex  │ Code │
├───┼───┤   ├───┼───┤     │ amp │ Prev │
│ 3 │ 4 │   │ 3 │ 4 │     │ les │ iew  │
├───┼───┤   ├───┼───┤     │     │      │
│ 5 │ 6 │   │ 5 │ 6 │     │     │      │
└───┴───┘   └───┴───┘     └─────┴──────┘
```

---

## 🎯 Design Patterns

### Card Pattern
```
┌─────────────────────────────┐
│ HEADER                      │  ← bg-muted/30
├─────────────────────────────┤
│                             │
│ CONTENT                     │  ← p-6
│                             │
└─────────────────────────────┘
  rounded-xl, border, shadow-sm
```

### Terminal Pattern
```
┌─────────────────────────────┐
│ ● ● ●  File.tsx     [Copy] │  ← Header bar
├─────────────────────────────┤
│ [dark background]           │
│ [syntax highlighted code]   │  ← Code area
│ [scrollable content]        │
│                             │
│ [fade gradient at bottom]   │  ← Visual cue
└─────────────────────────────┘
```

---

## 📈 Performance Metrics

```
Load Time:    <100ms first render
Animation:    60fps (16.67ms/frame)
Typing Speed: 200 chars/second (5ms/char)
Transition:   300ms smooth fade
Memory:       ~2MB (includes all examples)
```

---

## 🌈 Visual Enhancements

### Gradient Background
```
from-primary/5 ──────→
                via-transparent
                         ──────→ to-purple-500/5
```

### Hover Elevation
```
Default:    shadow-sm
Hover:      shadow-md, translateY(-2px)
Active:     shadow-lg, scale(0.98)
```

### Scroll Animations
```
Element Position:
[-100px]  Hidden (opacity: 0, y: 20)
[trigger] Animation starts
[0px]     Visible (opacity: 1, y: 0)
```

---

## 🎨 Icon Usage

| Icon | Purpose | Color |
|------|---------|-------|
| ✨ Sparkles | AI features, loading | Primary |
| 🖥️ Terminal | Code preview header | Primary |
| 💻 Code2 | Code-related stats | Primary |
| ⚡ Zap | Speed/performance | Primary |
| 🗄️ Database | Data examples | Primary |
| 📐 Layout | UI examples | Primary |
| ▶️ Play | Try It Now button | White |
| 📋 Copy | Copy to clipboard | Muted |
| ✓ Check | Success states | Green |

---

## 🔮 Special Effects

### Blinking Cursor
```
█     (opacity: 1)
      (opacity: 0)
█     (opacity: 1)
      (opacity: 0)
[repeats infinitely]
```

### Loading Spinner
```
✨ → (rotate 0°)
✨ → (rotate 90°)
✨ → (rotate 180°)
✨ → (rotate 270°)
✨ → (rotate 360°)
[continuous rotation]
```

### Fade Gradient
```
Top:    100% opacity
        ↓
        75% opacity
        ↓
        50% opacity
        ↓
        25% opacity
        ↓
Bottom: 0% opacity
```

---

This visual guide provides a complete picture of how the AgentTeasers component looks and behaves. Use it as a reference for understanding the UI/UX design!
