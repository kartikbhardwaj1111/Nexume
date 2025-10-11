/**
 * Image optimization utilities for web performance
 */

import { useState, useEffect, useRef } from 'react';

// Image compression and optimization
export class ImageOptimizer {
  constructor(options = {}) {
    this.defaultOptions = {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'webp',
      ...options
    };
  }

  // Compress image file
  async compressImage(file, options = {}) {
    const config = { ...this.defaultOptions, ...options };
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = this.calculateDimensions(
          img.width, 
          img.height, 
          config.maxWidth, 
          config.maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: blob.type }));
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          `image/${config.format}`,
          config.quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Calculate optimal dimensions
  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Generate responsive image sizes
  generateResponsiveSizes(originalWidth, originalHeight) {
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    const sizes = [];

    breakpoints.forEach(breakpoint => {
      if (breakpoint <= originalWidth) {
        const ratio = breakpoint / originalWidth;
        sizes.push({
          width: breakpoint,
          height: Math.round(originalHeight * ratio),
          breakpoint
        });
      }
    });

    return sizes;
  }

  // Create WebP version with fallback
  async createWebPWithFallback(file) {
    try {
      const webpFile = await this.compressImage(file, { format: 'webp' });
      const jpegFile = await this.compressImage(file, { format: 'jpeg' });
      
      return {
        webp: webpFile,
        fallback: jpegFile
      };
    } catch (error) {
      console.warn('WebP conversion failed, using original format:', error);
      return {
        webp: null,
        fallback: file
      };
    }
  }
}

// Lazy loading image component
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {} 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && !hasError && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {placeholder}
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
      
      {hasError && (
        <div className="flex items-center justify-center bg-gray-100 text-gray-500 p-4">
          Failed to load image
        </div>
      )}
    </div>
  );
};

// Asset preloader
export class AssetPreloader {
  constructor() {
    this.preloadedAssets = new Set();
    this.preloadQueue = [];
    this.isProcessing = false;
  }

  // Preload critical assets
  async preloadCriticalAssets(assets) {
    const promises = assets.map(asset => this.preloadAsset(asset));
    return Promise.allSettled(promises);
  }

  // Preload single asset
  async preloadAsset(src) {
    if (this.preloadedAssets.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      
      // Determine asset type
      if (src.match(/\.(png|jpe?g|gif|svg|webp)$/i)) {
        link.as = 'image';
      } else if (src.match(/\.(woff2?|ttf|eot)$/i)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      } else if (src.match(/\.css$/i)) {
        link.as = 'style';
      } else if (src.match(/\.js$/i)) {
        link.as = 'script';
      }

      link.onload = () => {
        this.preloadedAssets.add(src);
        resolve();
      };
      
      link.onerror = () => reject(new Error(`Failed to preload: ${src}`));
      
      document.head.appendChild(link);
    });
  }

  // Progressive asset loading
  async progressiveLoad(assets, batchSize = 3) {
    for (let i = 0; i < assets.length; i += batchSize) {
      const batch = assets.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(asset => this.preloadAsset(asset))
      );
      
      // Small delay between batches to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

// Font loading optimization
export const optimizeFontLoading = () => {
  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-var-italic.woff2'
  ];

  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Font display optimization
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }
};

// CSS optimization utilities
export const optimizeCSS = {
  // Remove unused CSS classes (basic implementation)
  removeUnusedClasses: (usedClasses) => {
    const styleSheets = Array.from(document.styleSheets);
    
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules);
        rules.forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selector = rule.selectorText;
            if (selector && !usedClasses.some(cls => selector.includes(cls))) {
              // Mark for removal (implementation depends on build tool)
              console.log('Unused CSS rule:', selector);
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets can't be accessed
        console.warn('Cannot access stylesheet:', sheet.href);
      }
    });
  },

  // Critical CSS extraction
  extractCriticalCSS: () => {
    const criticalElements = document.querySelectorAll('[data-critical]');
    const criticalClasses = new Set();
    
    criticalElements.forEach(element => {
      element.classList.forEach(cls => criticalClasses.add(cls));
    });
    
    return Array.from(criticalClasses);
  }
};

export default {
  ImageOptimizer,
  LazyImage,
  AssetPreloader,
  optimizeFontLoading,
  optimizeCSS
};