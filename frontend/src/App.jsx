import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import LandingPage from './components/LandingPage';
import SquadBuilder from './components/SquadBuilder';
import FreelancerProfile from './components/FreelancerProfile';
import BackendDemo from './components/BackendDemo';
import AuthPage from './components/AuthPage';
import BrowseProjects from './components/BrowseProjects';
import ProjectDetail from './components/ProjectDetail';
import PostProject from './components/PostProject';
import FreelancerDashboard from './components/FreelancerDashboard';
import ClientDashboard from './components/ClientDashboard';
import HowItWorks from './components/HowItWorks';
import './index.css';

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
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/browse" element={<BrowseProjects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/post-project" element={<PostProject />} />
            <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/squad-builder/:projectId" element={<SquadBuilder />} />
            <Route path="/freelancer/:id" element={<FreelancerProfile />} />
            <Route path="/backend-demo" element={<BackendDemo />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
