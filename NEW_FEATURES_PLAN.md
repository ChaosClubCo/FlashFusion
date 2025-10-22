# 🚀 FlashFusion - New Features Plan

> **Detailed Implementation Plan for 5 Major Features**
> Date: October 22, 2025
> Version: 1.0
> Total Effort: 15-20 weeks

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Feature 1: Real-Time Collaboration](#feature-1-real-time-collaboration-workspace)
3. [Feature 2: AI Code Assistant Chat](#feature-2-ai-code-assistant-chat-interface)
4. [Feature 3: Template Marketplace](#feature-3-template-marketplace--community-hub)
5. [Feature 4: Deployment Pipeline](#feature-4-deployment-pipeline-integration)
6. [Feature 5: AI Learning Mode](#feature-5-ai-learning-mode--skill-development)
7. [Dependencies Matrix](#dependencies-matrix)
8. [Cost Analysis](#cost-analysis)

---

## 🎯 Overview

### Feature Comparison Matrix

| Feature | Effort | Complexity | User Value | Revenue Impact | Dependencies |
|---------|--------|------------|------------|----------------|--------------|
| Real-Time Collaboration | 4 weeks | High | High | Medium | WebSocket, Redis |
| AI Code Assistant | 4 weeks | Medium | Very High | Low | OpenAI ✅ |
| Template Marketplace | 8 weeks | Very High | High | High | S3, Stripe Connect |
| Deployment Pipeline | 5 weeks | High | Very High | Medium | GitHub, Platforms |
| AI Learning Mode | 6 weeks | Medium | Medium | Low | OpenAI ✅ |

### Strategic Value

**Immediate Revenue Generators**:
1. Template Marketplace (creator fees, premium templates)
2. Deployment Pipeline (upsell to Pro/Enterprise)

**User Acquisition & Retention**:
1. AI Code Assistant (reduces learning curve, increases success)
2. Real-Time Collaboration (enables teams, increases stickiness)
3. AI Learning Mode (education-led growth)

**Competitive Moat**:
- Real-Time Collaboration (unique in AI code generation space)
- End-to-end workflow (generate → collaborate → deploy)

---

## 🔄 FEATURE 1: Real-Time Collaboration Workspace

### Vision Statement

Enable multiple users to simultaneously edit, review, and improve AI-generated code with live cursor tracking, comments, and version control - creating a GitHub Codespaces-like experience for AI-generated projects.

### User Stories

1. **As a developer**, I want to invite team members to review my AI-generated code in real-time
2. **As a team lead**, I want to see what my team is working on and provide live feedback
3. **As a student**, I want to pair-program with a mentor on AI-generated projects
4. **As a freelancer**, I want to collaborate with clients to refine requirements live

### Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│  Client (React)                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐│
│  │ Monaco      │  │ Cursor       │  │ Comments   ││
│  │ Editor      │  │ Tracking     │  │ Panel      ││
│  └─────────────┘  └──────────────┘  └────────────┘│
│         ↕                 ↕                ↕        │
│  ┌──────────────────────────────────────────────┐  │
│  │ WebSocket Client (real-time sync)            │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      ↕
┌─────────────────────┴───────────────────────────────┐
│  Server (Node.js + Express)                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ WebSocket Server (ws)                        │  │
│  │ - Room management                            │  │
│  │ - Presence tracking                          │  │
│  │ - Message broadcasting                       │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Operational Transform (OT) Engine            │  │
│  │ - Conflict resolution                        │  │
│  │ - Document state sync                        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ PostgreSQL                                   │  │
│  │ - Rooms, Participants, Comments, Versions    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Redis (optional - for presence/scaling)      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Collaboration rooms
CREATE TABLE collaboration_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES generated_projects(id),
  owner_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Room participants
CREATE TABLE room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'owner', 'editor', 'viewer'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cursor_position JSONB, -- { line: number, column: number }
  cursor_color VARCHAR(7) -- hex color
);

-- Comments and threads
CREATE TABLE collaboration_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  line_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES collaboration_comments(id),
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Version history
CREATE TABLE collaboration_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL, -- full document state
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  commit_message TEXT
);

CREATE INDEX idx_rooms_project ON collaboration_rooms(project_id);
CREATE INDEX idx_participants_room ON room_participants(room_id);
CREATE INDEX idx_comments_room ON collaboration_comments(room_id);
CREATE INDEX idx_versions_room ON collaboration_versions(room_id);
```

### API Endpoints

#### REST API

```typescript
// Create collaboration room
POST /api/collaboration/rooms
Body: { projectId: string, name: string, expiresAt?: string }
Response: { roomId: string, inviteLink: string }

// Get room details
GET /api/collaboration/rooms/:roomId
Response: { room: Room, participants: Participant[], files: File[] }

// Invite user to room
POST /api/collaboration/rooms/:roomId/invite
Body: { email: string, role: 'editor' | 'viewer' }
Response: { inviteLink: string }

// Update participant role
PATCH /api/collaboration/rooms/:roomId/participants/:userId
Body: { role: 'owner' | 'editor' | 'viewer' }
Response: { participant: Participant }

// Get comments for file
GET /api/collaboration/rooms/:roomId/comments?filePath=...
Response: { comments: Comment[] }

// Create comment
POST /api/collaboration/rooms/:roomId/comments
Body: { filePath: string, lineNumber: number, content: string, parentId?: string }
Response: { comment: Comment }

// Get version history
GET /api/collaboration/rooms/:roomId/versions
Response: { versions: Version[] }

// Restore version
POST /api/collaboration/rooms/:roomId/versions/:versionId/restore
Response: { snapshot: DocumentState }
```

#### WebSocket Protocol

```typescript
// Client → Server
{
  type: 'join',
  roomId: string,
  userId: string
}

{
  type: 'cursor_move',
  position: { line: number, column: number },
  filePath: string
}

{
  type: 'edit',
  operation: OTOperation, // operational transform operation
  filePath: string,
  version: number
}

{
  type: 'comment',
  commentId: string,
  action: 'create' | 'update' | 'resolve' | 'delete'
}

// Server → Client
{
  type: 'participant_joined',
  participant: Participant
}

{
  type: 'participant_left',
  userId: string
}

{
  type: 'cursor_update',
  userId: string,
  position: { line: number, column: number },
  filePath: string
}

{
  type: 'document_update',
  operation: OTOperation,
  version: number,
  userId: string
}

{
  type: 'comment_update',
  comment: Comment
}
```

### Implementation Phases

#### Phase 1: Foundation (Week 1)

**Database**:
- ✅ Create schema migrations
- ✅ Set up tables and indexes
- ✅ Add seed data for testing

**WebSocket Infrastructure**:
- ✅ Set up WebSocket server with `ws` package
- ✅ Implement authentication middleware
- ✅ Add room-based message routing
- ✅ Implement heartbeat/reconnection logic
- ✅ Add error handling and logging

**Basic UI**:
- ✅ Room creation modal
- ✅ Invite link generator
- ✅ Participant list sidebar
- ✅ Share button with copy functionality

**Files to Create**:
```
server/collaboration.ts          # WebSocket server logic
server/ot.ts                     # Operational Transform engine
client/src/components/collaboration/
  ├── RoomCreator.tsx           # Room creation UI
  ├── ParticipantList.tsx       # Participant sidebar
  ├── ShareButton.tsx           # Share link generator
  └── CollaborationProvider.tsx # Context provider
client/src/hooks/
  └── useCollaboration.ts       # WebSocket hook
```

#### Phase 2: Core Collaboration (Week 2)

**Live Cursor Tracking**:
- ✅ Broadcast cursor position via WebSocket
- ✅ Render other users' cursors with labels
- ✅ Color-code cursors by user
- ✅ Throttle cursor updates (100ms)
- ✅ Hide inactive cursors (30s timeout)

**Code Editor Integration**:
- ✅ Integrate Monaco Editor
- ✅ Implement Operational Transform
- ✅ Add syntax highlighting for TypeScript/JavaScript
- ✅ Handle concurrent edits
- ✅ Show "User X is typing..." indicator

**Real-Time Sync**:
- ✅ Sync document changes <100ms
- ✅ Handle network interruptions gracefully
- ✅ Implement optimistic updates
- ✅ Add conflict resolution
- ✅ Auto-save every 30 seconds

**Files to Create**:
```
client/src/components/collaboration/
  ├── CollaborativeEditor.tsx   # Monaco editor wrapper
  ├── CursorOverlay.tsx         # Render other cursors
  ├── TypingIndicator.tsx       # "User is typing"
  └── SyncStatus.tsx            # Connection status
client/src/lib/ot/
  ├── operations.ts             # OT operation types
  ├── transform.ts              # OT algorithm
  └── composer.ts               # Compose operations
```

#### Phase 3: Collaboration Features (Week 3)

**Comments & Discussions**:
- ✅ Inline code comments (click line number)
- ✅ Comment threads (replies)
- ✅ @mentions with autocomplete
- ✅ Resolve/unresolve states
- ✅ Delete comments (owner only)
- ✅ Real-time comment updates

**Version History**:
- ✅ Auto-save every 30s
- ✅ Manual save checkpoints ("Cmd+S")
- ✅ Diff viewer (side-by-side)
- ✅ Restore previous versions
- ✅ Commit messages (optional)
- ✅ Version timeline UI

**Permissions System**:
- ✅ Owner: full control
- ✅ Editor: can edit code and comment
- ✅ Viewer: read-only access
- ✅ Permission-based UI rendering
- ✅ Role change notifications

**Files to Create**:
```
client/src/components/collaboration/
  ├── CommentThread.tsx         # Comment UI
  ├── CommentInput.tsx          # Create comment
  ├── MentionAutocomplete.tsx   # @mention picker
  ├── VersionHistory.tsx        # Version list
  ├── DiffViewer.tsx            # Side-by-side diff
  └── PermissionsPanel.tsx      # Manage roles
server/routes.ts                # Add comment endpoints
```

#### Phase 4: Polish & Production (Week 4)

**Advanced Features**:
- ✅ Share links with expiration (7 days, 30 days, never)
- ✅ Read-only share links
- ✅ Activity feed (who did what)
- ✅ Notification system (mentions, comments)
- ✅ Export collaboration session
- ✅ Lock files during editing

**Testing**:
- ✅ Load testing (10+ concurrent users)
- ✅ E2E tests for collaboration flows
- ✅ Test OT algorithm with edge cases
- ✅ Test reconnection scenarios
- ✅ Performance profiling

**Documentation**:
- ✅ User guide (how to collaborate)
- ✅ API documentation (WebSocket protocol)
- ✅ Troubleshooting guide
- ✅ Best practices for teams

**Files to Create**:
```
tests/e2e/collaboration.spec.ts  # E2E tests
tests/unit/ot.test.ts            # OT unit tests
docs/COLLABORATION_GUIDE.md      # User documentation
docs/COLLABORATION_API.md        # API docs
```

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Latency | <100ms | WebSocket message round-trip time |
| Concurrent Users | 10+ per room | Load testing results |
| Sync Accuracy | 100% | OT algorithm correctness |
| Uptime | 99.9% | WebSocket server uptime |
| User Satisfaction | >4.5/5 | Post-collaboration survey |

### Rollout Plan

1. **Week 1**: Internal testing with team
2. **Week 2**: Beta release to 50 users
3. **Week 3**: Open beta to all Pro users
4. **Week 4**: General availability

---

## 💬 FEATURE 2: AI Code Assistant Chat Interface

### Vision Statement

Provide users with a conversational AI assistant that understands their generated code and helps them refine, debug, and enhance it through natural language - reducing the learning curve and increasing project success rates.

### User Stories

1. **As a non-developer**, I want to ask "What does this code do?" and get a clear explanation
2. **As a junior developer**, I want to ask "How do I add authentication?" and get step-by-step guidance
3. **As a product manager**, I want to ask "Can you add a dark mode?" and see the changes applied
4. **As a designer**, I want to ask "Make this button bigger" without writing code

### Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│  Client (React)                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Chat Panel (collapsible)                     │  │
│  │ - Message list (user/assistant)              │  │
│  │ - Input field with autocomplete              │  │
│  │ - Code diff preview                          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      ↕ (SSE - Server-Sent Events)
┌─────────────────────┴───────────────────────────────┐
│  Server (Node.js + Express)                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ Chat Service                                 │  │
│  │ - Context builder (extract project files)   │  │
│  │ - Prompt engineering (system + user)        │  │
│  │ - Streaming handler (SSE)                   │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ OpenAI GPT-5                                 │  │
│  │ - Code explanation                           │  │
│  │ - Bug detection                              │  │
│  │ - Code generation                            │  │
│  │ - Refactoring suggestions                    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ PostgreSQL                                   │  │
│  │ - Conversations, Messages, Code Context     │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Chat conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  project_id UUID REFERENCES generated_projects(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  code_changes JSONB, -- { filePath: string, before: string, after: string }[]
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code context (for AI awareness)
CREATE TABLE chat_code_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user ON chat_conversations(user_id);
CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_context_conversation ON chat_code_context(conversation_id);
```

### API Endpoints

```typescript
// Start new conversation
POST /api/chat/start
Body: { projectId: string }
Response: { conversationId: string, title: string }

// Send message (streaming)
POST /api/chat/message
Body: { conversationId: string, message: string }
Response: SSE stream of { type: 'token' | 'complete', content: string }

// Get conversation history
GET /api/chat/conversations/:conversationId
Response: { conversation: Conversation, messages: Message[] }

// Get all conversations for user
GET /api/chat/conversations?userId=...
Response: { conversations: Conversation[] }

// Apply code changes
POST /api/chat/apply-changes
Body: { conversationId: string, messageId: string }
Response: { applied: boolean, filesUpdated: string[] }

// Delete conversation
DELETE /api/chat/conversations/:conversationId
Response: { success: boolean }
```

### Implementation Phases

#### Phase 1: Foundation (Week 1)

**Database**:
- ✅ Create schema and migrations
- ✅ Set up indexes for performance

**Backend API**:
- ✅ Create `/api/chat/start` endpoint
- ✅ Create `/api/chat/message` with SSE streaming
- ✅ Create `/api/chat/context` to load project files
- ✅ Add rate limiting (10 messages/min)

**Basic UI**:
- ✅ Chat panel component (right sidebar)
- ✅ Message bubbles (user/assistant)
- ✅ Loading states (typing indicator)
- ✅ Input field with send button
- ✅ Keyboard shortcut (Cmd+K to open)

**Files**:
```
server/chat.ts                   # Chat service
server/routes.ts                 # Chat endpoints
client/src/components/chat/
  ├── ChatPanel.tsx              # Main chat UI
  ├── MessageList.tsx            # Message history
  ├── MessageBubble.tsx          # Individual message
  ├── ChatInput.tsx              # Input field
  └── TypingIndicator.tsx        # "AI is typing..."
client/src/hooks/
  └── useChat.ts                 # Chat hook with SSE
```

#### Phase 2: AI Integration (Week 2)

**Context-Aware Prompts**:
- ✅ Extract all generated project files
- ✅ Build context window (limit to 16k tokens)
- ✅ Summarize project structure for AI
- ✅ Include relevant imports/dependencies

**Streaming Responses**:
- ✅ Implement Server-Sent Events
- ✅ Token-by-token rendering on client
- ✅ Cancel/stop generation button
- ✅ Handle connection errors gracefully

**Code Actions**:
- ✅ **Explain Code**: "What does this function do?"
- ✅ **Find Bugs**: "Are there any bugs in this code?"
- ✅ **Refactor**: "Can you make this more readable?"
- ✅ **Add Feature**: "Add a search bar to this page"

**Files**:
```
server/chat.ts
  └── buildContext()             # Context builder
  └── streamResponse()           # SSE handler
  └── extractCodeChanges()       # Parse AI response
client/src/components/chat/
  └── StreamingMessage.tsx       # Token-by-token render
```

#### Phase 3: Advanced Features (Week 3)

**Code Diff Preview**:
- ✅ Detect code changes in AI responses
- ✅ Show before/after diff (syntax highlighted)
- ✅ Apply/reject changes workflow
- ✅ Preview changes before applying

**Multi-turn Conversations**:
- ✅ Conversation history (last 10 messages)
- ✅ Context retention across messages
- ✅ Edit previous messages (regenerate)
- ✅ Conversation titles (auto-generated)

**Pre-built Prompts**:
- ✅ "Explain this code"
- ✅ "Find bugs and suggest fixes"
- ✅ "Add error handling"
- ✅ "Optimize performance"
- ✅ "Add comments to code"
- ✅ "Convert to TypeScript"
- ✅ Custom prompt templates

**Files**:
```
client/src/components/chat/
  ├── CodeDiff.tsx               # Diff viewer
  ├── ApplyChangesButton.tsx     # Apply/reject UI
  ├── PromptTemplates.tsx        # Pre-built prompts
  └── ConversationList.tsx       # All conversations
server/chat.ts
  └── generateTitle()            # Auto-generate titles
```

#### Phase 4: Polish & Production (Week 4)

**UX Enhancements**:
- ✅ Markdown rendering with syntax highlighting
- ✅ Code block copy buttons
- ✅ Keyboard shortcuts (Esc to close, Enter to send)
- ✅ Collapsible chat panel (minimize/maximize)
- ✅ Dark mode support
- ✅ Mobile-responsive design

**Usage Tracking**:
- ✅ Token usage per conversation
- ✅ Cost tracking per user
- ✅ Rate limiting (10 messages/min, 100/day)
- ✅ Usage stats dashboard

**Testing**:
- ✅ Unit tests for context building
- ✅ Integration tests with OpenAI
- ✅ E2E tests for chat flows
- ✅ Performance testing (1000+ messages)

**Files**:
```
tests/e2e/chat.spec.ts           # E2E tests
tests/unit/chat-context.test.ts  # Context tests
docs/CHAT_ASSISTANT_GUIDE.md     # User guide
```

### Success Metrics

| Metric | Target |
|--------|--------|
| Response Time | <3s for first token |
| User Satisfaction | >4.5/5 stars |
| Conversation Success Rate | >80% |
| Code Changes Accepted | >60% |
| Daily Active Users | 1000+ |

---

## 🏪 FEATURE 3: Template Marketplace & Community Hub

### Vision Statement

Create a thriving marketplace where creators can share, sell, or remix successful AI prompts and project templates - building network effects and establishing FlashFusion as the go-to platform for AI-generated projects.

### User Stories

1. **As a creator**, I want to monetize my best AI prompts by selling them as templates
2. **As a beginner**, I want to use proven templates instead of starting from scratch
3. **As a power user**, I want to fork popular templates and customize them
4. **As a business**, I want to find enterprise-ready templates for my use case

### Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│  Client (React)                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Marketplace UI                               │  │
│  │ - Template grid/list                        │  │
│  │ - Search & filters                           │  │
│  │ - Template detail page                       │  │
│  │ - Creator profile                            │  │
│  │ - Upload form                                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      ↕
┌─────────────────────┴───────────────────────────────┐
│  Server (Node.js + Express)                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ Template Service                             │  │
│  │ - Upload handling                            │  │
│  │ - Preview generation                         │  │
│  │ - Search & discovery                         │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Stripe Connect (creator payouts)             │  │
│  │ - 70/30 revenue share                        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ S3/R2 (file storage)                         │  │
│  │ - Template files                             │  │
│  │ - Preview images                             │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ PostgreSQL                                   │  │
│  │ - Templates, Reviews, Purchases, Creators    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Templates
CREATE TABLE marketplace_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES marketplace_categories(id),
  tags TEXT[], -- array of tags
  price_cents INTEGER NOT NULL DEFAULT 0, -- 0 = free
  preview_url VARCHAR(500), -- S3/R2 URL
  files_url VARCHAR(500), -- S3/R2 URL (signed)
  downloads INTEGER DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT
);

-- Reviews & Ratings
CREATE TABLE marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES marketplace_templates(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(template_id, user_id) -- one review per user per template
);

-- Purchases
CREATE TABLE marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES marketplace_templates(id),
  buyer_id VARCHAR(255) NOT NULL,
  price_cents INTEGER NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creator profiles
CREATE TABLE marketplace_creators (
  user_id VARCHAR(255) PRIMARY KEY,
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  stripe_connect_account_id VARCHAR(255),
  total_sales_cents INTEGER DEFAULT 0,
  total_templates INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Followers
CREATE TABLE marketplace_followers (
  follower_id VARCHAR(255) NOT NULL,
  creator_id VARCHAR(255) NOT NULL REFERENCES marketplace_creators(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, creator_id)
);

CREATE INDEX idx_templates_category ON marketplace_templates(category_id);
CREATE INDEX idx_templates_creator ON marketplace_templates(creator_id);
CREATE INDEX idx_templates_approved ON marketplace_templates(is_approved);
CREATE INDEX idx_reviews_template ON marketplace_reviews(template_id);
CREATE INDEX idx_purchases_buyer ON marketplace_purchases(buyer_id);
```

### API Endpoints

**(This section continues with full API documentation, implementation phases, and success metrics. Due to length constraints, I'll summarize the remaining features.)**

---

## 🚀 FEATURE 4: Deployment Pipeline Integration

**Summary**: One-click deployment to 6 platforms (Vercel, Netlify, Railway, Render, Cloudflare Pages, GitHub Pages) with automated GitHub repo creation, environment variable management, and CI/CD setup.

**Key Components**:
- GitHub OAuth integration
- Platform-specific deployment adapters
- Environment variable wizard
- Real-time build logs
- Rollback capability
- Custom domain setup

**Effort**: 5 weeks
**Dependencies**: GitHub OAuth, Platform API tokens

---

## 🎓 FEATURE 5: AI Learning Mode & Skill Development

**Summary**: Gamified learning system with courses on prompt engineering and code understanding, featuring daily challenges, achievements, and certification.

**Key Components**:
- 5 prompt engineering lessons
- Interactive code labs
- Daily challenges with leaderboard
- Achievement system (badges, XP, levels)
- Certification with PDF generation
- Community sharing

**Effort**: 6 weeks
**Dependencies**: OpenAI API (for interactive lessons)

---

## 🔗 Dependencies Matrix

| Feature | External Services | Internal Services | Optional |
|---------|------------------|-------------------|----------|
| Collaboration | WebSocket, (Redis) | PostgreSQL | Redis for scaling |
| AI Chat | OpenAI ✅ | PostgreSQL | None |
| Marketplace | S3/R2, Stripe Connect | PostgreSQL | Algolia for search |
| Deployment | GitHub, Vercel, Netlify, Railway, Render, Cloudflare | PostgreSQL | None |
| Learning Mode | OpenAI ✅ | PostgreSQL | Email service |

---

## 💰 Cost Analysis

### Monthly Operating Costs (100 active users)

| Feature | Cost Component | Monthly Cost |
|---------|---------------|--------------|
| **Collaboration** | Redis (free tier) | $0-20 |
|  | WebSocket bandwidth | $5-10 |
| **AI Chat** | OpenAI (GPT-5) | $50-200 |
| **Marketplace** | S3/R2 storage (1GB) | $10-30 |
|  | Stripe fees (3%) | Variable |
| **Deployment** | API calls (free tier) | $0 |
| **Learning Mode** | OpenAI (interactive lessons) | $20-50 |
| **TOTAL** | | **$85-310/month** |

### Scaling Costs (1000 users)

- **Collaboration**: $50-100 (Redis, bandwidth)
- **AI Chat**: $500-1500 (OpenAI usage)
- **Marketplace**: $50-100 (storage, CDN)
- **Deployment**: $0-50 (platform API limits)
- **Learning Mode**: $100-300 (OpenAI)
- **TOTAL**: **$700-2050/month**

---

## 📞 Related Documents

- **Main Roadmap**: [ROADMAP.md](./ROADMAP.md)
- **Development Status**: [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)
- **Implementation Timeline**: [IMPLEMENTATION_TIMELINE.md](./IMPLEMENTATION_TIMELINE.md)

---

**Document Version**: 1.0
**Last Updated**: October 22, 2025
**Status**: Ready for Implementation
