// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track page load time
  trackPageLoad(pageName: string, startTime: number) {
    const loadTime = performance.now() - startTime
    this.addMetric(`page_load_${pageName}`, loadTime)
    console.log(`📊 Page Load: ${pageName} took ${loadTime.toFixed(2)}ms`)
  }

  // Track API call time
  trackApiCall(endpoint: string, startTime: number) {
    const responseTime = performance.now() - startTime
    this.addMetric(`api_${endpoint}`, responseTime)
    console.log(`🌐 API Call: ${endpoint} took ${responseTime.toFixed(2)}ms`)
  }

  // Track component render time
  trackRender(componentName: string, startTime: number) {
    const renderTime = performance.now() - startTime
    this.addMetric(`render_${componentName}`, renderTime)
    console.log(`⚡ Render: ${componentName} took ${renderTime.toFixed(2)}ms`)
  }

  private addMetric(key: string, value: number) {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    this.metrics.get(key)!.push(value)
  }

  // Get average metrics
  getAverageMetric(key: string): number {
    const values = this.metrics.get(key)
    if (!values || values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  // Get all metrics
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {}
    for (const [key] of this.metrics) {
      result[key] = this.getAverageMetric(key)
    }
    return result
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear()
  }
}

// Convenience functions
export const perfMonitor = PerformanceMonitor.getInstance()

// Higher-order component for performance tracking
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    const startTime = performance.now()
    
    React.useEffect(() => {
      perfMonitor.trackRender(componentName, startTime)
    })

    return <WrappedComponent {...props} />
  }
}

import { useCallback } from 'react'

// Hook for tracking API calls
export function useApiPerformance() {
  const trackApiCall = useCallback((endpoint: string, startTime: number) => {
    perfMonitor.trackApiCall(endpoint, startTime)
  }, [])

  return { trackApiCall }
}

// Hook for tracking page loads
export function usePagePerformance() {
  const trackPageLoad = useCallback((pageName: string, startTime: number) => {
    perfMonitor.trackPageLoad(pageName, startTime)
  }, [])

  return { trackPageLoad }
} 