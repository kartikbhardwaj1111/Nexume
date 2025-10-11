import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { initializeServices } from "./services";
import { FeatureIntegrationService } from "./services/integration/FeatureIntegrationService";
import OfflineIndicator from "./components/OfflineIndicator";
import { initializeOptimizations } from "./utils/performanceOptimizer";
import "./utils/serviceWorker"; // Initialize service worker

// Lazy load all major feature pages
const Index = lazy(() => import("./pages/Index"));
const ApiKeyPage = lazy(() => import("./pages/ApiKeyPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const JobDescriptionPage = lazy(() => import("./pages/JobDescriptionPage"));
const JobAnalysisPage = lazy(() => import("./pages/JobAnalysisPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage").then(module => ({ default: module.AnalyticsPage })));
const ATSChecker = lazy(() => import("./pages/ATSChecker"));
const CareerPage = lazy(() => import("./pages/CareerPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const InterviewPrepPage = lazy(() => import("./pages/InterviewPrepPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Initialize services and optimizations on app startup
Promise.all([
  initializeServices(),
  initializeOptimizations()
]).then(([servicesSuccess]) => {
  if (servicesSuccess) {
    console.log('🚀 Career Acceleration Platform ready!');
    
    // Initialize feature integration service
    window.featureIntegration = new FeatureIntegrationService();
    console.log('🔗 Feature integration service initialized');
    console.log('⚡ Performance optimizations active');
  } else {
    console.warn('⚠️ Some services may not be available');
  }
});

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="nexume-ui-theme">
        <AppProvider>
        <Toaster />
        <Sonner />
        <OfflineIndicator />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ats-checker" element={<ATSChecker />} />
              <Route path="/api-key" element={<ApiKeyPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/job-description" element={<JobDescriptionPage />} />
              <Route path="/job-analysis" element={<JobAnalysisPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/career" element={<CareerPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;