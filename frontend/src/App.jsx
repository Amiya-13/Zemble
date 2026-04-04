import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, Spin } from 'antd';
import './index.css';

// Lazy-load all page components for code splitting (faster initial load)
const LandingPage = lazy(() => import('./components/LandingPage'));
const SquadBuilder = lazy(() => import('./components/SquadBuilder'));
const FreelancerProfile = lazy(() => import('./components/FreelancerProfile'));
const BackendDemo = lazy(() => import('./components/BackendDemo'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const BrowseProjects = lazy(() => import('./components/BrowseProjects'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const PostProject = lazy(() => import('./components/PostProject'));
const FreelancerDashboard = lazy(() => import('./components/FreelancerDashboard'));
const ClientDashboard = lazy(() => import('./components/ClientDashboard'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spin size="large" />
  </div>
);

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0284c7',
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/browse" element={<BrowseProjects />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/post-project" element={<PostProject />} />
              <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/squad-builder" element={<SquadBuilder />} />
              <Route path="/squad-builder/:projectId" element={<SquadBuilder />} />
              <Route path="/freelancer/:id" element={<FreelancerProfile />} />
              <Route path="/backend-demo" element={<BackendDemo />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
            </Routes>
          </Suspense>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
