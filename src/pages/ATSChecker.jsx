import Layout from '@/components/Layout';
import { OptimizedATSChecker } from '@/components/OptimizedATSChecker';

export default function ATSChecker() {
  return (
    <Layout customBreadcrumbs={[
      { path: '/', label: 'Home' },
      { path: '/ats-checker', label: 'ATS Checker' }
    ]}>
      <div className="relative z-10 py-10 max-w-7xl mx-auto px-4">
        <OptimizedATSChecker />
      </div>
    </Layout>
  );
}