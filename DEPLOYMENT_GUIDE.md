# 🚀 Nexume Deployment Guide

## Quick Start

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-username/nexume.git
cd nexume

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your environment variables (optional)
# Edit .env file with your API keys
```

### 2. Development
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```

### 3. Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build with optimization analysis
npm run build:analyze
```

## Environment Variables

### Required (Optional - Fallbacks Available)
- `VITE_GEMINI_API_KEY`: Google Gemini API key for enhanced AI analysis
- `VITE_ADZUNA_APP_ID`: Adzuna job search API ID
- `VITE_ADZUNA_APP_KEY`: Adzuna job search API key

### Optional
- `VITE_ANALYTICS_ID`: Analytics tracking ID
- `VITE_APP_ENVIRONMENT`: Application environment (development/production)

## Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 2. Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Set environment variables in Netlify dashboard
```

### 3. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

### 4. Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Performance Optimization

### Automatic Optimizations
- ✅ Code splitting with lazy loading
- ✅ Asset compression (gzip)
- ✅ Image optimization
- ✅ Bundle analysis
- ✅ Service worker caching
- ✅ Tree shaking

### Manual Optimizations
1. **API Keys**: Add your own API keys for better performance
2. **CDN**: Use a CDN for static assets
3. **Caching**: Configure proper cache headers
4. **Monitoring**: Set up performance monitoring

## Security Considerations

### Implemented
- ✅ No hardcoded API keys in production
- ✅ Input validation and sanitization
- ✅ File type restrictions
- ✅ File size limits
- ✅ CORS protection

### Recommendations
1. Use HTTPS in production
2. Implement rate limiting
3. Add CSP headers
4. Regular security audits

## Monitoring & Analytics

### Built-in Features
- Performance monitoring
- Error boundary handling
- Build optimization reports
- Bundle size analysis

### External Services
- Google Analytics (optional)
- Sentry for error tracking
- Lighthouse for performance audits

## Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache and reinstall
npm run clean
npm install
npm run build
```

#### Large Bundle Size
```bash
# Analyze bundle
npm run build:analyze

# Check optimization report in dist/optimization-report.json
```

#### API Errors
- Check environment variables
- Verify API key validity
- Check network connectivity
- Review fallback mechanisms

### Performance Issues
1. Check bundle size in build report
2. Enable compression on server
3. Use CDN for assets
4. Optimize images
5. Enable lazy loading

## Support

### Documentation
- [README.md](./README.md) - Project overview
- [ANALYSIS_PAGE_FIX.md](./ANALYSIS_PAGE_FIX.md) - Analysis improvements
- [UI_UX_ENHANCEMENT_GUIDE.md](./UI_UX_ENHANCEMENT_GUIDE.md) - UI enhancements

### Community
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Pull requests welcome

## License

MIT License - see [LICENSE](./LICENSE) file for details.