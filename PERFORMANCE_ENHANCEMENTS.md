# Enhanced Performance Monitoring for MintPuts

## Overview

The MintPuts development server has been enhanced with comprehensive performance monitoring that replaces CPU cycle counting with high-resolution millisecond timing. This provides more accurate and meaningful performance metrics for development workflows.

## Key Changes

### 1. Server-Side Performance Monitoring (`WebExecute.c`)

**Before:**
- Used CPU cycles for performance measurement
- Less accurate across different CPU architectures
- Harder to interpret for developers

**After:**
- Uses `QueryPerformanceCounter` and `QueryPerformanceFrequency` for high-resolution timing
- All measurements now in milliseconds (ms)
- More accurate and cross-platform compatible

**Enhanced Features:**
- File scan performance tracking
- Request serving time measurement
- Memory usage monitoring
- Real-time performance logging

### 2. Client-Side Performance Monitoring (`live-reload.js`)

**Enhanced Features:**
- Detailed request timing statistics
- Average response time calculation
- Error tracking and reporting
- Visual indicators with emojis for better readability
- Performance stats every 10 requests

**Example Output:**
```
🚀 Live reload enabled with enhanced performance monitoring
📊 Live Reload Stats: 10 requests, 0 errors, Avg: 15.23ms, Last: 12.45ms
🔄 File changed, reloading... (Memory: 2048576 bytes, Response: 8.67ms)
```

### 3. MintUtils Performance Tools (`MintUtils.js`)

#### AdjustHook Enhancement
- Built-in performance monitoring
- Configurable monitoring options
- Detailed statistics tracking
- Enhanced return object with stats and control methods

#### PerformanceMonitor Utility
```javascript
import { PerformanceMonitor } from './mintkit/MintUtils.js';

// Simple timing
PerformanceMonitor.start('operation');
// ... do work ...
PerformanceMonitor.end('operation');

// Function measurement
PerformanceMonitor.measure('dataProcessing', () => {
    // Your code here
    return result;
});

// Async function measurement
PerformanceMonitor.measureAsync('apiCall', async () => {
    const response = await fetch('/api/data');
    return response.json();
});
```

#### ReloadPerformanceTracker
```javascript
import { ReloadPerformanceTracker } from './mintkit/MintUtils.js';

// Record reload performance
ReloadPerformanceTracker.recordReload(duration, fileCount, memoryUsage);

// Get statistics
const stats = ReloadPerformanceTracker.getStats();
console.log(`Average reload time: ${stats.averageTime.toFixed(2)}ms`);

// Log comprehensive stats
ReloadPerformanceTracker.logStats();
```

## Usage Examples

### Basic Performance Monitoring
```javascript
import { AdjustHook, PerformanceMonitor } from './mintkit/MintUtils.js';

// Enhanced hot reload with performance monitoring
const reloadController = AdjustHook({
    interval: 1000,
    performanceMonitoring: true,
    onReload: () => {
        console.log('🔄 Reloading...');
        location.reload();
    }
});

// Get performance stats
const stats = reloadController.getStats();
console.log(`Average response time: ${stats.avgTime.toFixed(2)}ms`);
```

### Custom Performance Tracking
```javascript
import { PerformanceMonitor } from './mintkit/MintUtils.js';

// Track custom operations
PerformanceMonitor.start('dataProcessing');
// ... perform data processing ...
PerformanceMonitor.end('dataProcessing');

// Measure function execution
const result = PerformanceMonitor.measure('complexCalculation', () => {
    return performComplexCalculation();
});
```

### Reload Performance Analysis
```javascript
import { ReloadPerformanceTracker } from './mintkit/MintUtils.js';

// Record reload events
window.addEventListener('beforeunload', () => {
    const reloadTime = performance.now() - window.reloadStartTime;
    ReloadPerformanceTracker.recordReload(reloadTime, 1, performance.memory?.usedJSHeapSize || 0);
});

// Analyze performance trends
setInterval(() => {
    ReloadPerformanceTracker.logStats();
}, 30000);
```

## Performance Metrics Available

### Server-Side Metrics
- **File Scan Time**: Time taken to check for file modifications
- **Request Serving Time**: Time to serve individual files
- **Memory Usage**: Current memory pool allocation
- **File Change Detection**: Real-time file modification tracking

### Client-Side Metrics
- **Request Response Time**: Time for each reload check
- **Average Response Time**: Rolling average of response times
- **Error Rate**: Percentage of failed requests
- **Reload Frequency**: How often reloads occur
- **Memory Usage**: JavaScript heap usage during reloads

### Development Metrics
- **Page Load Time**: Initial page load performance
- **DOM Ready Time**: Time to DOM content loaded
- **Reload Performance**: Historical reload timing data
- **Memory Trends**: Memory usage patterns over time

## Configuration Options

### AdjustHook Configuration
```javascript
const reloadController = AdjustHook({
    interval: 1000,                    // Check interval in ms
    endpoint: "/reload",               // Reload endpoint
    performanceMonitoring: true,       // Enable performance tracking
    onReload: () => location.reload(), // Custom reload handler
    onError: (error) => console.warn(error) // Error handler
});
```

### PerformanceMonitor Options
- **start(label)**: Start timing an operation
- **end(label)**: End timing and log results
- **measure(label, fn)**: Measure synchronous function execution
- **measureAsync(label, fn)**: Measure asynchronous function execution
- **getStats()**: Get current timing statistics
- **clear()**: Clear all timers

### ReloadPerformanceTracker Options
- **recordReload(duration, fileCount, memoryUsage)**: Record a reload event
- **getStats()**: Get comprehensive reload statistics
- **logStats()**: Log formatted statistics to console
- **clear()**: Clear performance history

## Benefits

1. **More Accurate Measurements**: Millisecond precision vs CPU cycles
2. **Better Developer Experience**: Clear, readable performance metrics
3. **Cross-Platform Compatibility**: Works consistently across different systems
4. **Comprehensive Monitoring**: Both server and client-side performance tracking
5. **Historical Analysis**: Track performance trends over time
6. **Real-Time Insights**: Immediate feedback on performance issues
7. **Memory Monitoring**: Track memory usage patterns
8. **Error Tracking**: Monitor and report performance-related errors

## Console Output Examples

### Server Console
```
[Performance] File scan completed in 2.345 ms
[Request Served] index.html (1024 bytes) - 1.234 ms
[Hot Reload] 14:30:25 - Changes detected, reloading...
```

### Browser Console
```
🚀 Live reload enabled with enhanced performance monitoring
📊 Live Reload Stats: 10 requests, 0 errors, Avg: 15.23ms, Last: 12.45ms
🔄 File changed, reloading... (Memory: 2048576 bytes, Response: 8.67ms)
⏱️ dataProcessing: 45.67ms
📊 Reload Performance Stats:
   Total reloads: 5
   Average time: 125.34ms
   Min time: 89.12ms
   Max time: 234.56ms
   Last reload: 156.78ms
```

## Migration Guide

### For Existing Code
1. **No Breaking Changes**: All existing functionality remains the same
2. **Enhanced Metrics**: Performance data is now more accurate and readable
3. **Optional Features**: New performance monitoring is opt-in
4. **Backward Compatibility**: All existing APIs continue to work

### For New Development
1. **Use PerformanceMonitor**: For custom timing needs
2. **Enable AdjustHook Monitoring**: For hot reload performance tracking
3. **Track Reload Performance**: Use ReloadPerformanceTracker for analysis
4. **Monitor Memory Usage**: Track memory patterns during development

## Technical Details

### High-Resolution Timing
- Uses `QueryPerformanceCounter` on Windows
- Provides microsecond precision
- Consistent across CPU frequency changes
- More accurate than `gettimeofday` or `clock()`

### Memory Management
- Tracks JavaScript heap usage
- Monitors memory pool allocation
- Provides memory usage statistics
- Helps identify memory leaks

### Error Handling
- Graceful degradation if performance APIs unavailable
- Comprehensive error tracking
- Detailed error reporting
- Non-blocking error handling

This enhancement significantly improves the development experience by providing accurate, meaningful performance metrics that help developers optimize their workflows and identify performance bottlenecks early in the development process. 