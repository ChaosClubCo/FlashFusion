import { useEffect, useState } from 'react';
import { Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPaletteHint() {
  const [isVisible, setIsVisible] = useState(false);
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  useEffect(() => {
    // Render after idle to not affect TTI
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Command palette logic would go here
        console.log('Command palette triggered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 right-6 z-50"
          aria-live="polite"
          aria-label="Keyboard shortcut hint"
        >
          <div className="bg-card border border-card-border rounded-md px-3 py-2 shadow-lg flex items-center gap-2 text-sm">
            <Command className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Press{' '}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded">
                {isMac ? '⌘' : 'Ctrl'}
              </kbd>
              {' '}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded">
                K
              </kbd>
              {' '}for commands
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
