import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Sparkles,
  Terminal,
  Code2,
  Zap,
  Database,
  Layout,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Example prompts with their generated code outputs
const examples = [
  {
    id: 'todo',
    icon: Layout,
    title: 'Todo App',
    prompt: 'Create a modern todo app with local storage',
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodos = [...todos, {
      id: Date.now().toString(),
      text: input,
      completed: false
    }];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
    setInput('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex gap-2 mb-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <div className="space-y-2">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => {/* toggle logic */}}
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}`,
  },
  {
    id: 'dashboard',
    icon: Database,
    title: 'Analytics Dashboard',
    prompt: 'Build a real-time analytics dashboard with charts',
    language: 'typescript',
    code: `import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart } from 'recharts';

interface Analytics {
  visitors: number;
  revenue: number;
  conversions: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics>({
    visitors: 0,
    revenue: 0,
    conversions: 0
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/analytics');

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {data.visitors.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${data.revenue.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            +8% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {data.conversions}%
          </div>
          <p className="text-sm text-muted-foreground">
            +3% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}`,
  },
  {
    id: 'auth',
    icon: Zap,
    title: 'Auth System',
    prompt: 'Create a secure authentication system with JWT',
    language: 'typescript',
    code: `import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthSystem() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </CardContent>
    </Card>
  );
}`,
  },
  {
    id: 'api',
    icon: Code2,
    title: 'REST API',
    prompt: 'Generate a RESTful API with Express and TypeScript',
    language: 'typescript',
    code: `import express, { Request, Response } from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Validation schema
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18)
});

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

let users: User[] = [];

// Get all users
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ users });
});

// Create user
app.post('/api/users', (req: Request, res: Response) => {
  try {
    const data = userSchema.parse(req.body);
    const user: User = {
      id: Date.now().toString(),
      ...data
    };
    users.push(user);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Get user by ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Update user
app.put('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const data = userSchema.parse(req.body);
    users[index] = { ...users[index], ...data };
    res.json({ user: users[index] });
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete user
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});`,
  },
  {
    id: 'form',
    icon: Layout,
    title: 'Form Validation',
    prompt: 'Create a complex form with validation and error handling',
    language: 'typescript',
    code: `import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\\d{10}$/, 'Phone must be 10 digits'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  website: z.string().url('Invalid URL').optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Form submitted successfully!');
      }
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}`,
  },
  {
    id: 'realtime',
    icon: Zap,
    title: 'Real-time Chat',
    prompt: 'Build a real-time chat application with WebSocket',
    language: 'typescript',
    code: `import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

export function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    wsRef.current = new WebSocket('ws://localhost:3000/chat');

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    const message: Message = {
      id: Date.now().toString(),
      user: username,
      text: input,
      timestamp: new Date()
    };

    wsRef.current.send(JSON.stringify(message));
    setInput('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Real-time Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}`,
  },
];

// Simple syntax highlighter
const highlightCode = (code: string, language: string) => {
  const keywords = ['import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'async', 'await', 'interface', 'type', 'class', 'extends', 'implements'];
  const types = ['string', 'number', 'boolean', 'void', 'any', 'unknown', 'never'];

  let highlighted = code;

  // Comments
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-green-500">$1</span>');

  // Strings
  highlighted = highlighted.replace(/(['"`])(.*?)\1/g, '<span class="text-yellow-400">$1$2$1</span>');

  // Keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
  });

  // Types
  types.forEach(type => {
    const regex = new RegExp(`\\b(${type})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span class="text-blue-400">$1</span>');
  });

  // Numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');

  return highlighted;
};

// Typing animation component
function TypingCode({ code, language, isActive }: { code: string; language: string; isActive: boolean }) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayedCode('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedCode('');
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < code.length) {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 5); // Fast typing speed

    return () => clearInterval(typingInterval);
  }, [code, isActive]);

  return (
    <div className="relative">
      <pre className="text-sm font-mono leading-relaxed">
        <code
          dangerouslySetInnerHTML={{
            __html: highlightCode(displayedCode, language)
          }}
        />
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-primary ml-1"
          />
        )}
      </pre>
    </div>
  );
}

export function AgentTeasers() {
  const [activeExample, setActiveExample] = useState(examples[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentExample = examples.find(ex => ex.id === activeExample) || examples[0];

  const handleTryIt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Code Generation</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Watch AI Build Your App
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our AI agents transform your ideas into production-ready code in seconds
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Example selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Choose an Example</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Select a prompt to see AI generate code in real-time
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examples.map((example, index) => {
                    const Icon = example.icon;
                    return (
                      <motion.button
                        key={example.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => {
                          setActiveExample(example.id);
                          setIsGenerating(true);
                          setTimeout(() => setIsGenerating(false), 3000);
                        }}
                        className={cn(
                          "p-4 rounded-lg border-2 text-left transition-all duration-200",
                          "hover:border-primary/50 hover:bg-primary/5",
                          activeExample === example.id
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border bg-card"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-md",
                            activeExample === example.id
                              ? "bg-primary/20"
                              : "bg-muted"
                          )}>
                            <Icon className={cn(
                              "w-5 h-5",
                              activeExample === example.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-1">{example.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {example.prompt}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Try It Now button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mt-6"
                >
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleTryIt}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Generating Code...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Try It Now
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right side - Code preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="overflow-hidden bg-slate-950 border-slate-800">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2">
                    {currentExample.title}.tsx
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-slate-400 hover:text-slate-100"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Code content */}
              <div className="relative">
                {/* Gradient overlay for fade effect */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />

                <div className="p-6 text-slate-100 overflow-x-auto max-h-[600px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentExample.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TypingCode
                        code={currentExample.code}
                        language={currentExample.language}
                        isActive={isGenerating}
                      />

                      {!isGenerating && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                        >
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <Check className="w-4 h-4" />
                            <span>Code generation complete!</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {[
            { label: 'Lines of Code', value: '10K+', icon: Code2 },
            { label: 'Components', value: '60+', icon: Layout },
            { label: 'Generation Speed', value: '<3s', icon: Zap },
            { label: 'Accuracy', value: '99%', icon: Sparkles },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <Card className="text-center p-6">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
