#!/usr/bin/env node

/**
 * Build optimization script
 * Runs additional optimizations after Vite build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

class BuildOptimizer {
  constructor() {
    this.stats = {
      originalSize: 0,
      compressedSize: 0,
      filesProcessed: 0,
      compressionRatio: 0
    };
  }

  async optimize() {
    console.log('🔧 Starting build optimization...');
    
    try {
      // Check if dist directory exists
      if (!fs.existsSync(DIST_DIR)) {
        console.error('❌ Dist directory not found. Run build first.');
        process.exit(1);
      }

      // Run optimizations
      await this.compressAssets();
      await this.generateManifest();
      await this.optimizeImages();
      await this.createServiceWorkerCache();
      
      // Generate report
      this.generateReport();
      
      console.log('✅ Build optimization complete!');
    } catch (error) {
      console.error('❌ Build optimization failed:', error);
      process.exit(1);
    }
  }

  // Compress static assets
  async compressAssets() {
    console.log('📦 Compressing assets...');
    
    const files = this.getAllFiles(ASSETS_DIR);
    const compressibleExtensions = ['.js', '.css', '.html', '.json', '.svg'];
    
    for (const file of files) {
      const ext = path.extname(file);
      if (compressibleExtensions.includes(ext)) {
        await this.compressFile(file);
      }
    }
  }

  // Compress individual file
  async compressFile(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      const compressed = gzipSync(content, { level: 9 });
      
      // Only create .gz file if compression is beneficial
      if (compressed.length < content.length * 0.9) {
        fs.writeFileSync(`${filePath}.gz`, compressed);
        
        this.stats.originalSize += content.length;
        this.stats.compressedSize += compressed.length;
        this.stats.filesProcessed++;
      }
    } catch (error) {
      console.warn(`⚠️ Failed to compress ${filePath}:`, error.message);
    }
  }

  // Generate asset manifest
  async generateManifest() {
    console.log('📋 Generating asset manifest...');
    
    const manifest = {
      version: Date.now(),
      assets: {},
      chunks: {},
      preload: [],
      prefetch: []
    };

    // Scan assets directory
    const files = this.getAllFiles(ASSETS_DIR);
    
    files.forEach(file => {
      const relativePath = path.relative(DIST_DIR, file);
      const stats = fs.statSync(file);
      const ext = path.extname(file);
      
      manifest.assets[relativePath] = {
        size: stats.size,
        hash: this.getFileHash(file),
        type: this.getAssetType(ext),
        critical: this.isCriticalAsset(file)
      };

      // Categorize chunks
      if (ext === '.js') {
        const filename = path.basename(file, ext);
        if (filename.includes('vendor')) {
          manifest.chunks.vendor = relativePath;
        } else if (filename.includes('index')) {
          manifest.chunks.main = relativePath;
        }
      }

      // Mark for preloading
      if (manifest.assets[relativePath].critical) {
        manifest.preload.push(relativePath);
      }
    });

    // Write manifest
    fs.writeFileSync(
      path.join(DIST_DIR, 'asset-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
  }

  // Optimize images (basic implementation)
  async optimizeImages() {
    console.log('🖼️ Optimizing images...');
    
    const imageFiles = this.getAllFiles(DIST_DIR)
      .filter(file => /\.(png|jpg|jpeg|gif|svg)$/i.test(file));
    
    for (const imageFile of imageFiles) {
      await this.optimizeImage(imageFile);
    }
  }

  // Optimize individual image
  async optimizeImage(imagePath) {
    try {
      const stats = fs.statSync(imagePath);
      const ext = path.extname(imagePath).toLowerCase();
      
      // For SVG files, minify
      if (ext === '.svg') {
        let content = fs.readFileSync(imagePath, 'utf8');
        
        // Basic SVG minification
        content = content
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .replace(/\s*=\s*/g, '=')
          .trim();
        
        fs.writeFileSync(imagePath, content);
        
        const newStats = fs.statSync(imagePath);
        console.log(`  📉 ${path.basename(imagePath)}: ${stats.size} → ${newStats.size} bytes`);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to optimize ${imagePath}:`, error.message);
    }
  }

  // Create service worker cache list
  async createServiceWorkerCache() {
    console.log('🔄 Creating service worker cache list...');
    
    const cacheList = {
      static: [],
      dynamic: [],
      images: []
    };

    const files = this.getAllFiles(DIST_DIR);
    
    files.forEach(file => {
      const relativePath = '/' + path.relative(DIST_DIR, file).replace(/\\/g, '/');
      const ext = path.extname(file);
      
      if (['.js', '.css'].includes(ext)) {
        cacheList.static.push(relativePath);
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
        cacheList.images.push(relativePath);
      } else if (['.html', '.json'].includes(ext)) {
        cacheList.dynamic.push(relativePath);
      }
    });

    // Write cache list
    fs.writeFileSync(
      path.join(DIST_DIR, 'sw-cache-list.json'),
      JSON.stringify(cacheList, null, 2)
    );
  }

  // Generate optimization report
  generateReport() {
    this.stats.compressionRatio = this.stats.originalSize > 0 
      ? ((this.stats.originalSize - this.stats.compressedSize) / this.stats.originalSize * 100)
      : 0;

    const report = {
      timestamp: new Date().toISOString(),
      optimization: {
        filesProcessed: this.stats.filesProcessed,
        originalSize: this.formatBytes(this.stats.originalSize),
        compressedSize: this.formatBytes(this.stats.compressedSize),
        compressionRatio: `${this.stats.compressionRatio.toFixed(1)}%`,
        spaceSaved: this.formatBytes(this.stats.originalSize - this.stats.compressedSize)
      },
      bundleAnalysis: this.analyzeBundleSize(),
      recommendations: this.getOptimizationRecommendations()
    };

    // Write report
    fs.writeFileSync(
      path.join(DIST_DIR, 'optimization-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Console output
    console.log('\n📊 Optimization Report:');
    console.log(`   Files processed: ${report.optimization.filesProcessed}`);
    console.log(`   Original size: ${report.optimization.originalSize}`);
    console.log(`   Compressed size: ${report.optimization.compressedSize}`);
    console.log(`   Compression ratio: ${report.optimization.compressionRatio}`);
    console.log(`   Space saved: ${report.optimization.spaceSaved}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`   • ${rec}`));
    }
  }

  // Analyze bundle size
  analyzeBundleSize() {
    const jsFiles = this.getAllFiles(ASSETS_DIR)
      .filter(file => file.endsWith('.js'));
    
    const analysis = {
      totalChunks: jsFiles.length,
      chunks: []
    };

    jsFiles.forEach(file => {
      const stats = fs.statSync(file);
      const filename = path.basename(file);
      
      analysis.chunks.push({
        name: filename,
        size: stats.size,
        sizeFormatted: this.formatBytes(stats.size),
        type: this.getChunkType(filename)
      });
    });

    // Sort by size
    analysis.chunks.sort((a, b) => b.size - a.size);
    
    return analysis;
  }

  // Get optimization recommendations
  getOptimizationRecommendations() {
    const recommendations = [];
    const bundleAnalysis = this.analyzeBundleSize();
    
    // Check for large chunks
    const largeChunks = bundleAnalysis.chunks.filter(chunk => chunk.size > 200000); // > 200KB
    if (largeChunks.length > 0) {
      recommendations.push(`Consider splitting large chunks: ${largeChunks.map(c => c.name).join(', ')}`);
    }

    // Check compression ratio
    if (this.stats.compressionRatio < 30) {
      recommendations.push('Low compression ratio - consider optimizing asset content');
    }

    // Check total bundle size
    const totalSize = bundleAnalysis.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (totalSize > 1000000) { // > 1MB
      recommendations.push('Total bundle size is large - consider lazy loading more features');
    }

    return recommendations;
  }

  // Utility methods
  getAllFiles(dir) {
    const files = [];
    
    // Use dist directory if assets directory doesn't exist
    const targetDir = dir === ASSETS_DIR && !fs.existsSync(ASSETS_DIR) ? DIST_DIR : dir;
    
    if (!fs.existsSync(targetDir)) {
      console.warn(`Directory ${targetDir} does not exist, skipping...`);
      return files;
    }
    
    const scan = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          scan(fullPath);
        } else {
          files.push(fullPath);
        }
      });
    };
    
    scan(targetDir);
    return files;
  }

  getFileHash(filePath) {
    // Simple hash based on file size and modification time
    const stats = fs.statSync(filePath);
    return `${stats.size}-${stats.mtime.getTime()}`;
  }

  getAssetType(ext) {
    const types = {
      '.js': 'script',
      '.css': 'stylesheet',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.gif': 'image',
      '.svg': 'image',
      '.woff': 'font',
      '.woff2': 'font',
      '.ttf': 'font',
      '.eot': 'font'
    };
    return types[ext] || 'other';
  }

  isCriticalAsset(filePath) {
    const filename = path.basename(filePath);
    return filename.includes('index') || filename.includes('vendor') || filename.includes('main');
  }

  getChunkType(filename) {
    if (filename.includes('vendor')) return 'vendor';
    if (filename.includes('index') || filename.includes('main')) return 'entry';
    return 'chunk';
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run optimization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new BuildOptimizer();
  optimizer.optimize();
}

export default BuildOptimizer;