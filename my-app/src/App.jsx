import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Projects from './pages/Projects';
import Transparency from './pages/Transparency';
import Committee from './pages/Committee';
import Gallery from './pages/Gallery';
import ImpactStories from './pages/ImpactStories';
import Contact from './pages/Contact';
import MemberRegister from './pages/MemberRegister';
import MemberLogin from './pages/MemberLogin';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="activities" element={<Activities />} />
        <Route path="projects" element={<Projects />} />
        <Route path="transparency" element={<Transparency />} />
        <Route path="committee" element={<Committee />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="impact-stories" element={<ImpactStories />} />
        <Route path="contact" element={<Contact />} />
        <Route path="member-register" element={<MemberRegister />} />
        <Route path="member-login" element={<MemberLogin />} />
        <Route path="member-dashboard" element={<MemberDashboard />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;