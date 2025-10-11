/**
 * Lazy loading utilities for performance optimization
 */

import { lazy, Suspense } from 'react';

// Lazy load heavy components with error boundaries
export const createLazyComponent = (importFn, fallback = null) => {
  const LazyComponent = lazy(importFn);

  return (props) => (
    <Suspense fallback={fallback || <ComponentLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Component loader for lazy components
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-slate-200 h-4 w-4"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-2 bg-slate-200 rounded w-3/4"></div>
        <div className="h-2 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

// Lazy load services with dynamic imports
export const lazyLoadService = async (servicePath) => {
  try {
    const module = await import(/* @vite-ignore */ servicePath);
    return module.default || module;
  } catch (error) {
    console.warn(`Failed to load service: ${servicePath}`, error);
    return null;
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical components that are likely to be used
  const criticalImports = [
    () => import('../components/FileUpload.jsx'),
    () => import('../components/ATSScoreDisplay.jsx'),
    () => import('../lib/analyzeResume.js'),
  ];

  criticalImports.forEach(importFn => {
    // Start loading but don't wait for completion
    importFn().catch(error => {
      console.warn('Failed to preload critical resource:', error);
    });
  });
};

// Lazy load heavy data sets
export const lazyLoadData = {
  careerPaths: () => import('../data/career-paths/careerData.js'),
  interviewQuestions: () => import('../data/interview-questions/questionDatabase.js'),
  templates: () => import('../templates/categories/index.js'),
  learningResources: () => import('../data/career-paths/learningResources.js'),
};

// Progressive loading for large datasets
export class ProgressiveLoader {
  constructor(dataLoader, chunkSize = 50) {
    this.dataLoader = dataLoader;
    this.chunkSize = chunkSize;
    this.loadedChunks = new Set();
    this.cache = new Map();
  }

  async loadChunk(chunkIndex) {
    if (this.loadedChunks.has(chunkIndex)) {
      return this.cache.get(chunkIndex);
    }

    try {
      const data = await this.dataLoader();
      const startIndex = chunkIndex * this.chunkSize;
      const endIndex = startIndex + this.chunkSize;
      const chunk = data.slice(startIndex, endIndex);

      this.cache.set(chunkIndex, chunk);
      this.loadedChunks.add(chunkIndex);

      return chunk;
    } catch (error) {
      console.error('Failed to load data chunk:', error);
      return [];
    }
  }

  async loadAll() {
    try {
      const data = await this.dataLoader();
      return data;
    } catch (error) {
      console.error('Failed to load all data:', error);
      return [];
    }
  }
}

// Intersection Observer for lazy loading on scroll
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Image lazy loading utility
export const lazyLoadImage = (src, placeholder = null) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export default {
  createLazyComponent,
  lazyLoadService,
  preloadCriticalResources,
  lazyLoadData,
  ProgressiveLoader,
  createIntersectionObserver,
  lazyLoadImage
};