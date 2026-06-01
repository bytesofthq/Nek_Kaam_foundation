import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const AdminDashboard = () => {
  const { admin, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAdminLoggedIn) {
    navigate('/');
    return null;
  }

  const adminTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'members', label: 'Members' },
    { id: 'activities', label: 'Activities' },
    { id: 'funds', label: 'Funds' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Welcome back, {admin?.username}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm">Total Projects</p>
                  <p className="text-3xl font-bold text-blue-600">15</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm">Total Members</p>
                  <p className="text-3xl font-bold text-green-600">500</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm">Active Activities</p>
                  <p className="text-3xl font-bold text-yellow-600">8</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-gray-600 text-sm">Funds Collected</p>
                  <p className="text-3xl font-bold text-purple-600">$100K</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>
              <Button variant="primary" className="mb-6">
                Create New Project
              </Button>
              <p className="text-gray-600">Project management interface would go here</p>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Manage Members</h2>
              <Button variant="primary" className="mb-6">
                View All Members
              </Button>
              <p className="text-gray-600">Member management interface would go here</p>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Manage Activities</h2>
              <Button variant="primary" className="mb-6">
                Create New Activity
              </Button>
              <p className="text-gray-600">Activity management interface would go here</p>
            </div>
          )}

          {activeTab === 'funds' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Fund Management</h2>
              <Button variant="primary" className="mb-6">
                Add Fund Collection
              </Button>
              <p className="text-gray-600">Fund management interface would go here</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <p className="text-gray-600">Admin settings would go here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
