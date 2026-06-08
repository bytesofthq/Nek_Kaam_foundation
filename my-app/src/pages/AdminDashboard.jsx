import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { impactStoryAPI, dashboardAPI, memberAPI, projectAPI, activityAPI, fundAPI } from '../services/api';
import { Plus, Trash2, Calendar, MapPin, User, FileText, Image as ImageIcon, Upload, X, Search, DollarSign, Award, Check } from 'lucide-react';

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
  const [fileInputKey, setFileInputKey] = useState(0);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submittingStory, setSubmittingStory] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalActivities: 0,
    totalFundsReceived: 0
  });

  // Members state
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberPage, setMemberPage] = useState(1);
  const [totalMemberPages, setTotalMemberPages] = useState(1);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });
  const [submittingMember, setSubmittingMember] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    objective: '',
    description: '',
    budget: '',
    location: '',
    status: 'Planned',
    startDate: '',
    endDate: '',
    completionReport: ''
  });
  const [submittingProject, setSubmittingProject] = useState(false);
  const [projectPage, setProjectPage] = useState(1);
  const [totalProjectPages, setTotalProjectPages] = useState(1);

  // Activities state
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    isFeatured: false
  });
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivityPages, setTotalActivityPages] = useState(1);

  // Funds state
  const [fundTab, setFundTab] = useState('collections'); // 'collections' or 'expenses'
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [submittingCollection, setSubmittingCollection] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Marriage Assistance',
    amountUsed: '',
    purpose: '',
    location: '',
    beneficiary: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submittingExpense, setSubmittingExpense] = useState(false);
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

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await memberAPI.getAllMembers({
        page: memberPage,
        limit: 10,
        search: searchQuery
      });
      if (response.data && response.data.success) {
        setMembers(response.data.members || []);
        setTotalMemberPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await projectAPI.getAll({
        page: projectPage,
        limit: 10
      });
      if (response.data && response.data.success) {
        setProjects(response.data.projects || []);
        setTotalProjectPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await activityAPI.getAll({
        page: activityPage,
        limit: 10
      });
      if (response.data && response.data.success) {
        setActivities(response.data.activities || []);
        setTotalActivityPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchCollections = async () => {
    setLoadingCollections(true);
    try {
      const response = await fundAPI.getCollections();
      if (response.data && response.data.success) {
        setCollections(response.data.collections || []);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setLoadingCollections(false);
    }
  };

  const fetchExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const response = await fundAPI.getUsage();
      if (response.data && response.data.success) {
        setExpenses(response.data.usages || []);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  };

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
    setFileInputKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/login');
    }
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    if (activeTab === 'impactStories') {
      fetchStories();
    }
  }, [activeTab]);

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) return;
    try {
      const res = await memberAPI.deleteMember(id);
      if (res.data.success) {
        fetchMembers();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Failed to delete member:', error);
      alert(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectAPI.delete(id);
      fetchProjects();
      fetchDashboardStats();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await activityAPI.delete(id);
      fetchActivities();
      fetchDashboardStats();
    } catch (error) {
      alert('Failed to delete activity');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection entry?')) return;
    try {
      await fundAPI.deleteCollection(id);
      fetchCollections();
      fetchDashboardStats();
    } catch (error) {
      alert('Failed to delete collection entry');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await fundAPI.deleteUsage(id);
      fetchExpenses();
      fetchDashboardStats();
    } catch (error) {
      alert('Failed to delete expense record');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmittingProject(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await projectAPI.create({
        ...projectForm,
        budget: Number(projectForm.budget)
      });
      if (res.data.success) {
        setFormSuccess('Project created successfully!');
        setProjectForm({
          title: '',
          objective: '',
          description: '',
          budget: '',
          location: '',
          status: 'Planned',
          startDate: '',
          endDate: '',
          completionReport: ''
        });
        setShowProjectForm(false);
        fetchProjects();
        fetchDashboardStats();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    setSubmittingActivity(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await activityAPI.create(activityForm);
      if (res.data.success) {
        setFormSuccess('Activity created successfully!');
        setActivityForm({
          title: '',
          description: '',
          location: '',
          date: new Date().toISOString().split('T')[0],
          isFeatured: false
        });
        setShowActivityForm(false);
        fetchActivities();
        fetchDashboardStats();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create activity');
    } finally {
      setSubmittingActivity(false);
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setSubmittingMember(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await memberAPI.register(memberForm);
      if (res.data.success) {
        setFormSuccess(`Member ${res.data.member?.fullName} registered successfully! ID: ${res.data.member?.memberId}`);
        setMemberForm({
          fullName: '',
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          pinCode: ''
        });
        setShowMemberForm(false);
        fetchMembers();
        fetchDashboardStats();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to register member');
    } finally {
      setSubmittingMember(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    setSubmittingCollection(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await fundAPI.createCollection({
        ...collectionForm,
        amount: Number(collectionForm.amount)
      });
      if (res.data.success) {
        setFormSuccess('Fund collection added successfully!');
        setCollectionForm({
          amount: '',
          source: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        setShowCollectionForm(false);
        fetchCollections();
        fetchDashboardStats();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to add collection');
    } finally {
      setSubmittingCollection(false);
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setSubmittingExpense(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await fundAPI.createUsage({
        ...expenseForm,
        amountUsed: Number(expenseForm.amountUsed)
      });
      if (res.data.success) {
        setFormSuccess('Expense/Usage recorded successfully!');
        setExpenseForm({
          title: '',
          category: 'Marriage Assistance',
          amountUsed: '',
          purpose: '',
          location: '',
          beneficiary: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        setShowExpenseForm(false);
        fetchExpenses();
        fetchDashboardStats();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmittingExpense(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers();
    } else if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'activities') {
      fetchActivities();
    } else if (activeTab === 'funds') {
      fetchCollections();
      fetchExpenses();
    }
  }, [activeTab, memberPage, searchQuery, projectPage, activityPage]);

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
    if (isAdminLoggedIn) {
      fetchDashboardStats();
    }
  }, [isAdminLoggedIn]);

  if (!isAdminLoggedIn) {
    return null;
  }
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Projects</h2>
                <Button
                  onClick={() => {
                    setShowProjectForm(!showProjectForm);
                    setFormSuccess(null);
                    setFormError(null);
                  }}
                  variant="primary"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Plus size={18} />
                  {showProjectForm ? 'View Projects List' : 'Create New Project'}
                </Button>
              </div>

              {formSuccess && activeTab === 'projects' && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 text-sm">
                  {formSuccess}
                </div>
              )}

              {showProjectForm ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Create Project</h3>
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4 text-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                        <FileText size={16} className="text-gray-400" /> Project Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        required
                        minLength={5}
                        maxLength={150}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="e.g. Madarsa Renovation Patna"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <DollarSign size={16} className="text-gray-400" /> Budget (INR)
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={projectForm.budget}
                          onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                          required
                          min={1}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                          placeholder="e.g. 150000"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <MapPin size={16} className="text-gray-400" /> Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={projectForm.location}
                          onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                          placeholder="e.g. Patna, Bihar"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm">Status</label>
                        <select
                          name="status"
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <Calendar size={16} className="text-gray-400" /> Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={projectForm.startDate}
                          onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <Calendar size={16} className="text-gray-400" /> End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={projectForm.endDate}
                          onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Objective</label>
                      <input
                        type="text"
                        name="objective"
                        value={projectForm.objective}
                        onChange={(e) => setProjectForm({ ...projectForm, objective: e.target.value })}
                        required
                        maxLength={500}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="Brief objective of this project (max 500 chars)"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Description</label>
                      <textarea
                        name="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        required
                        maxLength={2000}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="Detailed project description..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Completion Report (Optional)</label>
                      <textarea
                        name="completionReport"
                        value={projectForm.completionReport}
                        onChange={(e) => setProjectForm({ ...projectForm, completionReport: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all duration-200"
                        placeholder="Report on project completion (if status is Completed)..."
                      />
                    </div>

                    <div className="flex gap-4 justify-end pt-2">
                      <Button
                        type="button"
                        onClick={() => setShowProjectForm(false)}
                        variant="outline"
                        className="px-5 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submittingProject}
                        variant="primary"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700"
                      >
                        {submittingProject ? 'Submitting...' : 'Save Project'}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  {loadingProjects ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : projects.length > 0 ? (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Title</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {projects.map((project) => (
                              <tr key={project._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-semibold text-gray-900">{project.title}</div>
                                  <div className="text-xs text-gray-500 line-clamp-1">{project.objective}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                                  ₹{project.budget?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {project.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    project.status === 'Completed' ? 'bg-green-105 text-green-800' :
                                    project.status === 'Ongoing' ? 'bg-yellow-105 text-yellow-800' :
                                    'bg-gray-105 text-gray-800'
                                  }`}>
                                    {project.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                  <button
                                    onClick={() => handleDeleteProject(project._id)}
                                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center"
                                    title="Delete Project"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalProjectPages > 1 && (
                        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                          <button
                            onClick={() => setProjectPage((prev) => Math.max(prev - 1, 1))}
                            disabled={projectPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {projectPage} of {totalProjectPages}
                          </span>
                          <button
                            onClick={() => setProjectPage((prev) => Math.min(prev + 1, totalProjectPages))}
                            disabled={projectPage === totalProjectPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-500 text-lg">No projects found</p>
                      <button
                        onClick={() => setShowProjectForm(true)}
                        className="mt-4 text-green-600 hover:underline font-semibold"
                      >
                        Create the first project
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Members</h2>
                <Button
                  onClick={() => {
                    setShowMemberForm(!showMemberForm);
                    setFormSuccess(null);
                    setFormError(null);
                  }}
                  variant="primary"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Plus size={18} />
                  {showMemberForm ? 'View Members List' : 'Register New Member'}
                </Button>
              </div>

              {formSuccess && activeTab === 'members' && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 text-sm">
                  {formSuccess}
                </div>
              )}

              {showMemberForm ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Register New Member</h3>
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4 text-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleCreateMember} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Full Name</label>
                      <input
                        type="text"
                        value={memberForm.fullName}
                        onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Phone Number</label>
                      <input
                        type="tel"
                        value={memberForm.phoneNumber}
                        onChange={(e) => setMemberForm({ ...memberForm, phoneNumber: e.target.value })}
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="10 digit phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Address</label>
                      <input
                        type="text"
                        value={memberForm.address}
                        onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="Street Address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm">City</label>
                        <input
                          type="text"
                          value={memberForm.city}
                          onChange={(e) => setMemberForm({ ...memberForm, city: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm">Pin Code</label>
                        <input
                          type="text"
                          value={memberForm.pinCode}
                          onChange={(e) => setMemberForm({ ...memberForm, pinCode: e.target.value })}
                          required
                          pattern="[0-9]{6}"
                          title="Please enter a valid 6-digit pin code"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                          placeholder="Pin code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">State</label>
                      <input
                        type="text"
                        value={memberForm.state}
                        onChange={(e) => setMemberForm({ ...memberForm, state: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="e.g. Bihar"
                      />
                    </div>

                    <div className="flex gap-4 justify-end pt-2">
                      <Button
                        type="button"
                        onClick={() => setShowMemberForm(false)}
                        variant="outline"
                        className="px-5 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submittingMember}
                        variant="primary"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700"
                      >
                        {submittingMember ? 'Registering...' : 'Register Member'}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-72">
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setMemberPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                      />
                      <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  {loadingMembers ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : members.length > 0 ? (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member ID</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address / City</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Date</th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {members.map((member) => (
                              <tr key={member._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-green-50 text-green-700 rounded-full">
                                    {member.memberId}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-semibold text-gray-900">{member.fullName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                  {member.phoneNumber}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  <div>{member.address}</div>
                                  <div className="text-xs font-semibold text-gray-400">{member.city}, {member.state} - {member.pinCode}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(member.joinDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                  <button
                                    onClick={() => handleDeleteMember(member._id)}
                                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center"
                                    title="Delete Member"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalMemberPages > 1 && (
                        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                          <button
                            onClick={() => setMemberPage((prev) => Math.max(prev - 1, 1))}
                            disabled={memberPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {memberPage} of {totalMemberPages}
                          </span>
                          <button
                            onClick={() => setMemberPage((prev) => Math.min(prev + 1, totalMemberPages))}
                            disabled={memberPage === totalMemberPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-500 text-lg">No members found</p>
                      <button
                        onClick={() => setShowMemberForm(true)}
                        className="mt-4 text-green-600 hover:underline font-semibold"
                      >
                        Register the first member
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Activities</h2>
                <Button
                  onClick={() => {
                    setShowActivityForm(!showActivityForm);
                    setFormSuccess(null);
                    setFormError(null);
                  }}
                  variant="primary"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Plus size={18} />
                  {showActivityForm ? 'View Activities List' : 'Create New Activity'}
                </Button>
              </div>

              {formSuccess && activeTab === 'activities' && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 text-sm">
                  {formSuccess}
                </div>
              )}

              {showActivityForm ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Create Activity</h3>
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4 text-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                        <FileText size={16} className="text-gray-400" /> Activity Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={activityForm.title}
                        onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                        required
                        minLength={5}
                        maxLength={150}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="e.g. Free Eye Checkup Camp"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <MapPin size={16} className="text-gray-400" /> Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={activityForm.location}
                          onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                          placeholder="e.g. Patna, Bihar"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                          <Calendar size={16} className="text-gray-400" /> Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={activityForm.date}
                          onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={activityForm.isFeatured}
                        onChange={(e) => setActivityForm({ ...activityForm, isFeatured: e.target.checked })}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition"
                      />
                      <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
                        Feature this activity on home page
                      </label>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Description</label>
                      <textarea
                        name="description"
                        value={activityForm.description}
                        onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                        required
                        maxLength={2000}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="Provide detailed description of the activity and its outcomes..."
                      />
                    </div>

                    <div className="flex gap-4 justify-end pt-2">
                      <Button
                        type="button"
                        onClick={() => setShowActivityForm(false)}
                        variant="outline"
                        className="px-5 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submittingActivity}
                        variant="primary"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700"
                      >
                        {submittingActivity ? 'Submitting...' : 'Save Activity'}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  {loadingActivities ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity Title</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {activities.map((activity) => (
                              <tr key={activity._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-semibold text-gray-900">{activity.title}</div>
                                  <div className="text-xs text-gray-500 line-clamp-1">{activity.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {activity.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-550">
                                  {new Date(activity.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${activity.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                                    {activity.isFeatured ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                  <button
                                    onClick={() => handleDeleteActivity(activity._id)}
                                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center"
                                    title="Delete Activity"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalActivityPages > 1 && (
                        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                          <button
                            onClick={() => setActivityPage((prev) => Math.max(prev - 1, 1))}
                            disabled={activityPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {activityPage} of {totalActivityPages}
                          </span>
                          <button
                            onClick={() => setActivityPage((prev) => Math.min(prev + 1, totalActivityPages))}
                            disabled={activityPage === totalActivityPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-500 text-lg">No activities found</p>
                      <button
                        onClick={() => setShowActivityForm(true)}
                        className="mt-4 text-green-600 hover:underline font-semibold"
                      >
                        Create the first activity
                      </button>
                    </div>
                  )}
                </div>
              )}
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Fund Management</h2>
              
              {/* Fund Sub-tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => {
                    setFundTab('collections');
                    setShowCollectionForm(false);
                    setShowExpenseForm(false);
                    setFormSuccess(null);
                    setFormError(null);
                  }}
                  className={`py-3 px-6 font-semibold border-b-2 transition duration-200 ${
                    fundTab === 'collections'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-green-600'
                  }`}
                >
                  Collections
                </button>
                <button
                  onClick={() => {
                    setFundTab('expenses');
                    setShowCollectionForm(false);
                    setShowExpenseForm(false);
                    setFormSuccess(null);
                    setFormError(null);
                  }}
                  className={`py-3 px-6 font-semibold border-b-2 transition duration-200 ${
                    fundTab === 'expenses'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-green-600'
                  }`}
                >
                  Expenses (Usages)
                </button>
              </div>

              {formSuccess && activeTab === 'funds' && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 text-sm">
                  {formSuccess}
                </div>
              )}

              {fundTab === 'collections' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 font-medium">Fund Collections</h3>
                    <Button
                      onClick={() => {
                        setShowCollectionForm(!showCollectionForm);
                        setFormSuccess(null);
                        setFormError(null);
                      }}
                      variant="primary"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Plus size={18} />
                      {showCollectionForm ? 'View Collections' : 'Add Collection Entry'}
                    </Button>
                  </div>

                  {showCollectionForm ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto shadow-sm">
                      <h4 className="text-lg font-semibold mb-6 text-gray-800">Add Fund Collection</h4>
                      {formError && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4 text-sm">
                          {formError}
                        </div>
                      )}

                      <form onSubmit={handleCreateCollection} className="space-y-4">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                            <DollarSign size={16} className="text-gray-400" /> Amount (INR)
                          </label>
                          <input
                            type="number"
                            name="amount"
                            value={collectionForm.amount}
                            onChange={(e) => setCollectionForm({ ...collectionForm, amount: e.target.value })}
                            required
                            min={1}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            placeholder="e.g. 5000"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                            <User size={16} className="text-gray-400" /> Source
                          </label>
                          <input
                            type="text"
                            name="source"
                            value={collectionForm.source}
                            onChange={(e) => setCollectionForm({ ...collectionForm, source: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            placeholder="e.g. Local Donation, Govt Grant"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                            <Calendar size={16} className="text-gray-400" /> Date Received
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={collectionForm.date}
                            onChange={(e) => setCollectionForm({ ...collectionForm, date: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1 text-sm">Notes / Remarks</label>
                          <textarea
                            name="notes"
                            value={collectionForm.notes}
                            onChange={(e) => setCollectionForm({ ...collectionForm, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            placeholder="Optional notes or description..."
                          />
                        </div>

                        <div className="flex gap-4 justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => setShowCollectionForm(false)}
                            variant="outline"
                            className="px-5 py-2"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={submittingCollection}
                            variant="primary"
                            className="px-6 py-2 bg-green-600 hover:bg-green-700"
                          >
                            {submittingCollection ? 'Submitting...' : 'Save Collection'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      {loadingCollections ? (
                        <div className="flex justify-center py-12">
                          <Loader />
                        </div>
                      ) : collections.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {collections.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-semibold text-gray-900">{c.source}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                                    ₹{c.amount?.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(c.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={c.notes}>
                                    {c.notes || '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                      onClick={() => handleDeleteCollection(c._id)}
                                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center"
                                      title="Delete Collection"
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
                          <p className="text-gray-500 text-lg">No collection records found</p>
                          <button
                            onClick={() => setShowCollectionForm(true)}
                            className="mt-4 text-green-600 hover:underline font-semibold"
                          >
                            Add the first collection
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {fundTab === 'expenses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 font-medium">Expenses / Usages</h3>
                    <Button
                      onClick={() => {
                        setShowExpenseForm(!showExpenseForm);
                        setFormSuccess(null);
                        setFormError(null);
                      }}
                      variant="primary"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Plus size={18} />
                      {showExpenseForm ? 'View Expenses' : 'Record Expense'}
                    </Button>
                  </div>

                  {showExpenseForm ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto shadow-sm">
                      <h4 className="text-lg font-semibold mb-6 text-gray-800">Record Expense / Fund Usage</h4>
                      {formError && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4 text-sm">
                          {formError}
                        </div>
                      )}

                      <form onSubmit={handleCreateExpense} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                              <FileText size={16} className="text-gray-400" /> Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={expenseForm.title}
                              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                              placeholder="e.g. Ration kits for 10 families"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm">Category</label>
                            <select
                              name="category"
                              value={expenseForm.category}
                              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            >
                              <option value="Marriage Assistance">Marriage Assistance</option>
                              <option value="Medical Support">Medical Support</option>
                              <option value="Education Support">Education Support</option>
                              <option value="Ration Distribution">Ration Distribution</option>
                              <option value="Emergency Relief">Emergency Relief</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                              <DollarSign size={16} className="text-gray-400" /> Amount Used (INR)
                            </label>
                            <input
                              type="number"
                              name="amountUsed"
                              value={expenseForm.amountUsed}
                              onChange={(e) => setExpenseForm({ ...expenseForm, amountUsed: e.target.value })}
                              required
                              min={1}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                              placeholder="e.g. 15000"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                              <User size={16} className="text-gray-400" /> Beneficiary
                            </label>
                            <input
                              type="text"
                              name="beneficiary"
                              value={expenseForm.beneficiary}
                              onChange={(e) => setExpenseForm({ ...expenseForm, beneficiary: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                              placeholder="e.g. Poor families in ward 5"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                              <MapPin size={16} className="text-gray-400" /> Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={expenseForm.location}
                              onChange={(e) => setExpenseForm({ ...expenseForm, location: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                              placeholder="e.g. Patna, Bihar"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                              <Calendar size={16} className="text-gray-400" /> Date
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={expenseForm.date}
                              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1 text-sm">Purpose</label>
                          <input
                            type="text"
                            name="purpose"
                            value={expenseForm.purpose}
                            onChange={(e) => setExpenseForm({ ...expenseForm, purpose: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            placeholder="e.g. Purchase of food items and packaging"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-1 text-sm">Description / Details</label>
                          <textarea
                            name="description"
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                            placeholder="Provide any additional details..."
                          />
                        </div>

                        <div className="flex gap-4 justify-end pt-2">
                          <Button
                            type="button"
                            onClick={() => setShowExpenseForm(false)}
                            variant="outline"
                            className="px-5 py-2"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={submittingExpense}
                            variant="primary"
                            className="px-6 py-2 bg-green-600 hover:bg-green-700"
                          >
                            {submittingExpense ? 'Submitting...' : 'Save Expense'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      {loadingExpenses ? (
                        <div className="flex justify-center py-12">
                          <Loader />
                        </div>
                      ) : expenses.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Category</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Used</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Beneficiary</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {expenses.map((exp) => (
                                <tr key={exp._id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{exp.title}</div>
                                    <div className="text-xs font-semibold text-gray-400">{exp.category}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                                    ₹{exp.amountUsed?.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {exp.beneficiary}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {exp.location}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(exp.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                      onClick={() => handleDeleteExpense(exp._id)}
                                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition inline-flex items-center"
                                      title="Delete Expense"
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
                          <p className="text-gray-500 text-lg">No expense records found</p>
                          <button
                            onClick={() => setShowExpenseForm(true)}
                            className="mt-4 text-green-600 hover:underline font-semibold"
                          >
                            Record the first expense
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
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
