import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { X, Maximize2, Play, Code2, Sparkles, Zap, Gift, Clock } from 'lucide-react';

interface DemoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoPreviewModal({ isOpen, onClose }: DemoPreviewModalProps) {
  const [, setLocation] = useLocation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0" data-testid="modal-demo-preview">
        <div className="relative bg-background border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <Play className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold" data-testid="heading-demo-preview">
                  Interactive Demo Preview
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Experience FlashFusion in action</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-demo"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Video/Preview Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-background to-card border border-border rounded-lg overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-12 h-12 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Watch FlashFusion in Action</h3>
                    <p className="text-muted-foreground">
                      See how AI transforms your ideas into production-ready apps
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Corner Badges */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-pink-500 text-white border-0 flex items-center gap-1.5">
                  <Gift className="w-3 h-3" />
                  50% OFF
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-card/80 backdrop-blur-sm flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  2-5 min setup
                </Badge>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                className="p-6 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover-elevate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                data-testid="demo-feature-ai"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-2">AI Code Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Watch GPT-5 generate production-ready code with real-time streaming
                </p>
              </motion.div>

              <motion.div
                className="p-6 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover-elevate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                data-testid="demo-feature-workflow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Interactive Workflows</h4>
                <p className="text-sm text-muted-foreground">
                  Experience our step-by-step wizard system for guided development
                </p>
              </motion.div>

              <motion.div
                className="p-6 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover-elevate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                data-testid="demo-feature-deploy"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">One-Click Deploy</h4>
                <p className="text-sm text-muted-foreground">
                  See how fast you can go from idea to live application
                </p>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-pink-500/10 to-accent/10 border border-pink-500/20">
              <div>
                <h4 className="text-lg font-semibold mb-1">Ready to start building?</h4>
                <p className="text-sm text-muted-foreground">
                  Join 10,000+ creators transforming ideas into reality
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => {
                  onClose();
                  setLocation('/workflows');
                }}
                data-testid="button-start-building-demo"
              >
                Start Building
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
