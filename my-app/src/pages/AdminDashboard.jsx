import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { impactStoryAPI, dashboardAPI } from '../services/api';
import { Plus, Trash2, Calendar, MapPin, User, FileText, Image as ImageIcon, Upload, X } from 'lucide-react';

const AdminDashboard = () => {
  const { admin, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Impact Stories state
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [storyForm, setStoryForm] = useState({
    title: '',
    personName: '',
    story: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submittingStory, setSubmittingStory] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalActivities: 0,
    totalFundsReceived: 0
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
    setFileInputKey(Date.now());
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/member-login');
    }
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    if (activeTab === 'impactStories') {
      fetchStories();
    }
  }, [activeTab]);

  const fetchStories = async () => {
    setLoadingStories(true);
    try {
      const response = await impactStoryAPI.getAll();
      // Backend response is { success: true, stories: [...], pagination: {...} }
      setStories(response.data.stories || []);
    } catch (error) {
      console.error('Failed to fetch impact stories:', error);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    setSubmittingStory(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    formData.append('title', storyForm.title);
    formData.append('personName', storyForm.personName);
    formData.append('story', storyForm.story);
    formData.append('location', storyForm.location);
    formData.append('date', storyForm.date);
    formData.append('isApproved', 'true');
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      await impactStoryAPI.create(formData);
      setFormSuccess('Impact story created successfully!');
      setStoryForm({
        title: '',
        personName: '',
        story: '',
        location: '',
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      setImagePreview('');
      setShowCreateForm(false);
      fetchStories();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create impact story');
    } finally {
      setSubmittingStory(false);
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this impact story?')) return;
    try {
      await impactStoryAPI.delete(id);
      fetchStories();
    } catch (error) {
      alert('Failed to delete story');
    }
  };

  if (!isAdminLoggedIn) {
    return null;
  }

  const adminTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'members', label: 'Members' },
    { id: 'activities', label: 'Activities' },
    { id: 'impactStories', label: 'Impact Stories' },
    { id: 'funds', label: 'Funds' },
    { id: 'settings', label: 'Settings' },
  ];


useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.log("Error loading dashboard stats:", error);
    }
  };

  if (isAdminLoggedIn) {
    fetchDashboardStats();
  }
}, [isAdminLoggedIn]);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-green-100">Welcome back, {admin?.name || admin?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 transition hover:shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Total Projects</p>
                  <p className="text-3xl font-extrabold text-green-700 mt-2">{stats.totalProjects}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 transition hover:shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Total Members</p>
                  <p className="text-3xl font-extrabold text-green-700 mt-2">{stats.totalMembers}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 transition hover:shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Active Activities</p>
                  <p className="text-3xl font-extrabold text-yellow-700 mt-2">{stats.totalActivities}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 transition hover:shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Funds Collected</p>
                  <p className="text-3xl font-extrabold text-purple-700 mt-2">₹{stats.totalFundsReceived?.toLocaleString() || "0"}</p>
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

          {activeTab === 'impactStories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Impact Stories</h2>
                <Button
                  onClick={() => {
                    setShowCreateForm(!showCreateForm);
                    setFormSuccess(null);
                    setFormError(null);
                    handleRemoveImage();
                  }}
                  variant="primary"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Plus size={18} />
                  {showCreateForm ? 'View Stories List' : 'Create New Story'}
                </Button>
              </div>

              {formSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 text-sm">
                  {formSuccess}
                </div>
              )}

              {showCreateForm ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Create Impact Story</h3>
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4 text-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleCreateStory} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                        <FileText size={16} className="text-gray-400" /> Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={storyForm.title}
                        onChange={handleInputChange}
                        required
                        minLength={5}
                        maxLength={150}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="e.g. Clean Water Initiative Success"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <User size={16} className="text-gray-400" /> Beneficiary / Person Name
                        </label>
                        <input
                          type="text"
                          name="personName"
                          value={storyForm.personName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                          placeholder="e.g. Ramesh Kumar / Sharma Family"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <MapPin size={16} className="text-gray-400" /> Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={storyForm.location}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                          placeholder="e.g. Patna, Bihar"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <Calendar size={16} className="text-gray-400" /> Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={storyForm.date}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <ImageIcon size={16} className="text-gray-400" /> Upload Image
                        </label>
                        {imagePreview ? (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition transform hover:scale-110 active:scale-95 z-10"
                              title="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                            <input
                              key={fileInputKey}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload size={20} className="text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500 font-semibold">Click to upload image</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Story Description</label>
                      <textarea
                        name="story"
                        value={storyForm.story}
                        onChange={handleInputChange}
                        required
                        maxLength={2000}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="Detail the story of transformation..."
                      />
                    </div>

                    <div className="flex gap-4 justify-end pt-2">
                      <Button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        variant="outline"
                        className="px-5 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submittingStory}
                        variant="primary"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700"
                      >
                        {submittingStory ? 'Submitting...' : 'Save Story'}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  {loadingStories ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : stories.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200 bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Beneficiary</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {stories.map((story) => (
                            <tr key={story._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-semibold text-gray-900">{story.personName}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 font-medium line-clamp-1">{story.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {story.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(story.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteStory(story._id)}
                                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center"
                                  title="Delete story"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-500 text-lg">No impact stories found</p>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4 text-green-600 hover:underline font-semibold"
                      >
                        Create the first story
                      </button>
                    </div>
                  )}
                </div>
              )}
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
