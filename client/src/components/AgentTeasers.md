# AI Agent Teasers Component

An interactive, visually stunning component that showcases AI code generation capabilities with real-time typing animations and terminal-style UI.

## Features

### Core Functionality
- **6 Example Prompts**: Pre-configured examples including Todo App, Analytics Dashboard, Auth System, REST API, Form Validation, and Real-time Chat
- **Interactive Preview**: Users can switch between different code generation examples
- **Animated Code Output**: Terminal-style display with typing animation effect
- **Syntax Highlighting**: Custom lightweight syntax highlighter for TypeScript/JavaScript
- **Copy to Clipboard**: One-click code copying with visual feedback
- **Try It Now**: Interactive button that triggers demo code generation

### Animations
- **Framer Motion**: Smooth page transitions and element animations
- **Typing Effect**: Character-by-character code reveal animation
- **Loading States**: Rotating sparkle icon during code generation
- **Fade Transitions**: Smooth transitions when switching between examples
- **Scroll Animations**: Elements fade in as they enter viewport

### UI/UX
- **Terminal Theme**: Dark slate background with authentic terminal aesthetics
- **Terminal Controls**: macOS-style traffic light buttons (red, yellow, green)
- **Gradient Effects**: Subtle background gradients for depth
- **Hover States**: Interactive cards with hover effects
- **Active States**: Visual feedback for selected examples
- **Stats Section**: Display key metrics with icons

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Grid Layouts**: Responsive grid that adapts to screen size
- **2-column layout on desktop (lg:grid-cols-2)**
- **Single column on mobile**
- **Flexible stats section (2 cols on mobile, 4 on desktop)**

## Component Structure

```typescript
<AgentTeasers />
```

No props required - fully self-contained component.

## Examples Included

1. **Todo App** - Modern todo app with local storage
2. **Analytics Dashboard** - Real-time dashboard with WebSocket
3. **Auth System** - Secure authentication with JWT
4. **REST API** - Full CRUD API with Express and validation
5. **Form Validation** - Complex form with react-hook-form and Zod
6. **Real-time Chat** - WebSocket-powered chat application

## Usage

### Basic Usage
```tsx
import { AgentTeasers } from '@/components/AgentTeasers';

function LandingPage() {
  return (
    <div>
      <AgentTeasers />
    </div>
  );
}
```

### In a Full Page
```tsx
import { AgentTeasers } from '@/components/AgentTeasers';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';

function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <AgentTeasers />
    </div>
  );
}
```

## Customization

### Adding New Examples

To add a new example, add an object to the `examples` array:

```typescript
{
  id: 'unique-id',
  icon: YourIcon, // from lucide-react
  title: 'Your Title',
  prompt: 'Description of what the code does',
  language: 'typescript',
  code: `your code here`
}
```

### Modifying Typing Speed

Change the typing speed by adjusting the interval in the `TypingCode` component:

```typescript
const typingInterval = setInterval(() => {
  // Current: 5ms (fast)
  // Slower: 20ms
  // Faster: 2ms
}, 5);
```

### Customizing Colors

The component uses Tailwind and shadcn/ui theme variables:
- `bg-slate-950` - Terminal background
- `border-slate-800` - Terminal borders
- `text-primary` - Accent color
- `bg-muted` - Secondary backgrounds

### Adjusting Code Height

Modify the max height in the code preview section:

```typescript
<div className="p-6 text-slate-100 overflow-x-auto max-h-[600px] overflow-y-auto">
```

## Dependencies

All dependencies are already installed in FlashFusion:

- `framer-motion` - Animations
- `lucide-react` - Icons
- `@/components/ui/button` - Button component
- `@/components/ui/card` - Card component
- `@/components/ui/tabs` - Tabs component (imported but not actively used)
- `@/lib/utils` - Utility functions (cn for className merging)

## Syntax Highlighting

The component includes a custom lightweight syntax highlighter that supports:
- **Keywords**: import, export, const, let, var, function, return, etc.
- **Types**: string, number, boolean, void, any, unknown, never
- **Strings**: Single, double, and template literals
- **Numbers**: Numeric values
- **Comments**: Single-line comments

Color scheme:
- Keywords: Purple (`text-purple-400`)
- Types: Blue (`text-blue-400`)
- Strings: Yellow (`text-yellow-400`)
- Numbers: Orange (`text-orange-400`)
- Comments: Green (`text-green-500`)

## Animation Details

### Viewport Animations
All sections use `whileInView` to trigger animations when scrolled into view:
```typescript
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}
```

### Typing Animation
The typing effect uses a character-by-character reveal:
```typescript
setInterval(() => {
  setDisplayedCode(code.slice(0, currentIndex + 1));
  currentIndex++;
}, 5);
```

### Loading States
Rotating sparkle icon during generation:
```typescript
animate={{ rotate: 360 }}
transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
```

## Performance

- **Optimized Re-renders**: Uses `useState` and `useEffect` efficiently
- **Animation Cleanup**: Properly cleans up intervals and timeouts
- **Lazy Highlighting**: Code highlighting happens on-demand
- **Fast Typing**: 5ms interval provides smooth typing without lag

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Semantic HTML**: Proper use of semantic elements
- **ARIA Labels**: Button labels clearly describe actions
- **Color Contrast**: High contrast for code readability

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## File Location

```
/home/user/FlashFusion/client/src/components/AgentTeasers.tsx
```

## File Size

- Total: 858 lines
- Component code: ~850 lines
- Includes 6 complete example code snippets
- Self-contained with no external dependencies beyond standard shadcn/ui

## Tips

1. **Use in Landing Pages**: Perfect for showcasing AI capabilities to potential users
2. **Above the Fold**: Consider placing after the hero section for maximum impact
3. **Call to Action**: The "Try It Now" button can be linked to your signup flow
4. **Social Proof**: The stats section can be updated with real metrics
5. **SEO**: Component is fully SSR-compatible for Next.js/Remix

## Troubleshooting

### Code not typing?
Make sure `isGenerating` state is true. Check the `TypingCode` component's `isActive` prop.

### Syntax highlighting not working?
The highlighting uses `dangerouslySetInnerHTML`. Ensure your CSP allows inline styles.

### Animations not smooth?
Check if Framer Motion is properly installed and imported.

### Copy not working?
Ensure the app is served over HTTPS (required for clipboard API) or localhost.

## Future Enhancements

Potential additions:
- [ ] More language support (Python, Go, Rust)
- [ ] Live code execution in sandbox
- [ ] User-submitted prompts
- [ ] Save favorite examples
- [ ] Share generated code
- [ ] Dark/light theme toggle for code
- [ ] Download code as file
- [ ] Syntax error checking
- [ ] Code formatting with Prettier
- [ ] Multiple file preview
