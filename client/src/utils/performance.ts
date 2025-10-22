// Performance monitoring utilities

interface PerformanceMetrics {
  ttfb: number; // Time to First Byte
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  tti: number;  // Time to Interactive
}

// Web Vitals tracking
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Time to First Byte (TTFB)
  const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationTiming) {
    const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
    reportMetric('TTFB', ttfb);
  }

  // First Contentful Paint (FCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        reportMetric('FCP', entry.startTime);
      }
    }
  });

  observer.observe({ entryTypes: ['paint'] });

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    reportMetric('LCP', lastEntry.startTime);
  });

  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fidEntry = entry as PerformanceEventTiming;
      const fid = fidEntry.processingStart - fidEntry.startTime;
      reportMetric('FID', fid);
    }
  });

  fidObserver.observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShift = entry as any;
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value;
      }
    }
    reportMetric('CLS', clsValue);
  });

  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Report on page unload
  window.addEventListener('beforeunload', () => {
    reportMetrics();
  });
}

// Track long tasks
export function trackLongTasks(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const longTask = entry as PerformanceEntry;
      console.warn('Long task detected:', {
        duration: longTask.duration,
        startTime: longTask.startTime,
      });

      // Report to analytics
      reportMetric('LongTask', longTask.duration);
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
}

// Track resource timing
export function trackResourceTiming(): void {
  if (typeof window === 'undefined') return;

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  const byType: Record<string, number[]> = {};

  resources.forEach((resource) => {
    const type = resource.initiatorType;
    if (!byType[type]) {
      byType[type] = [];
    }
    byType[type].push(resource.duration);
  });

  Object.entries(byType).forEach(([type, durations]) => {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    console.log(`Average ${type} load time: ${avg.toFixed(2)}ms`);
  });
}

// Report metric to analytics
function reportMetric(name: string, value: number): void {
  // Send to analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, {
      value: Math.round(value),
      metric_id: name,
      event_category: 'Web Vitals',
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
  }

  // Store locally for reporting
  const metrics = getStoredMetrics();
  metrics[name] = value;
  storeMetrics(metrics);
}

// Get all current metrics
export function getCurrentMetrics(): Partial<PerformanceMetrics> {
  return getStoredMetrics();
}

// Report all metrics
function reportMetrics(): void {
  const metrics = getStoredMetrics();

  // Send to backend analytics
  if (Object.keys(metrics).length > 0) {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metrics,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    }).catch((error) => {
      console.error('Failed to report metrics:', error);
    });
  }
}

// Storage helpers
function getStoredMetrics(): Record<string, number> {
  try {
    const stored = sessionStorage.getItem('performance-metrics');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeMetrics(metrics: Record<string, number>): void {
  try {
    sessionStorage.setItem('performance-metrics', JSON.stringify(metrics));
  } catch {
    // Storage failed
  }
}

// Performance budget checks
export function checkPerformanceBudget(): {
  passed: boolean;
  violations: string[];
} {
  const metrics = getCurrentMetrics();
  const violations: string[] = [];

  // Budget thresholds
  const budgets = {
    ttfb: 800,
    fcp: 1800,
    lcp: 2500,
    fid: 100,
    cls: 0.1,
  };

  Object.entries(budgets).forEach(([metric, threshold]) => {
    const value = metrics[metric as keyof PerformanceMetrics];
    if (value && value > threshold) {
      violations.push(`${metric}: ${value.toFixed(2)}ms (budget: ${threshold}ms)`);
    }
  });

  return {
    passed: violations.length === 0,
    violations,
  };
}

// Get performance score (0-100)
export function getPerformanceScore(): number {
  const metrics = getCurrentMetrics();
  let score = 100;

  // Deduct points for slow metrics
  if (metrics.fcp && metrics.fcp > 1800) score -= 10;
  if (metrics.lcp && metrics.lcp > 2500) score -= 20;
  if (metrics.fid && metrics.fid > 100) score -= 15;
  if (metrics.cls && metrics.cls > 0.1) score -= 15;
  if (metrics.ttfb && metrics.ttfb > 800) score -= 10;

  return Math.max(0, score);
}

// Bundle size tracking
export function trackBundleSize(): void {
  if (typeof window === 'undefined') return;

  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;

  scripts.forEach((script) => {
    const src = (script as HTMLScriptElement).src;
    if (src && src.includes(window.location.origin)) {
      const resource = performance.getEntriesByName(src)[0] as PerformanceResourceTiming;
      if (resource) {
        totalSize += resource.transferSize || 0;
      }
    }
  });

  console.log(`Total JavaScript bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
  reportMetric('BundleSize', totalSize);
}
