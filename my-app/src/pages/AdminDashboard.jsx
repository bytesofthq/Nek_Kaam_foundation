import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { impactStoryAPI, dashboardAPI, memberAPI, projectAPI, activityAPI, fundAPI, settingAPI } from '../services/api';
import {
  Plus, Trash2, Calendar, MapPin, User, FileText, Image as ImageIcon,
  Upload, X, Search, DollarSign, Award, Check, Loader2,
  BarChart3, FolderGit2, Users, Activity, HeartHandshake,
  CircleDollarSign, Settings2, Bell, TrendingUp, Wallet,
  ShieldAlert, Sparkles, LogOut, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A custom SVG line chart for Member Growth
const MemberGrowthChart = ({ data }) => {
  const months = data.months || [];
  const cumulative = data.cumulative || [];
  
  if (months.length === 0) {
    return <div className="text-gray-400 text-sm text-center py-12">No member growth data available</div>;
  }
  
  const maxVal = Math.max(...cumulative, 10);
  const chartHeight = 180;
  const chartWidth = 500;
  const padding = 35;
  
  const points = cumulative.map((val, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (cumulative.length - 1);
    const y = chartHeight - padding - (val * (chartHeight - padding * 2)) / maxVal;
    return { x, y, val, label: months[idx] };
  });
  
  const pathD = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }, '');
  
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-150 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
          <TrendingUp size={16} className="text-emerald-500" /> Member Growth Trend
        </h4>
        <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">Cumulative</span>
      </div>
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * (chartHeight - padding * 2);
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="10" className="fill-gray-400 font-semibold">{val}</text>
              </g>
            );
          })}
          
          {areaD && <path d={areaD} fill="url(#growthGrad)" />}
          {pathD && <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
          
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4.5" className="fill-white stroke-emerald-500 stroke-2 transition duration-200 group-hover:r-6 group-hover:fill-emerald-500" />
              <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="9" className="fill-gray-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">{p.val}</text>
              <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="9" className="fill-gray-400 font-bold">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// A custom SVG bar chart for Monthly Inflow vs Outflow
const MonthlyFundsChart = ({ data }) => {
  const months = data.months || [];
  const collections = data.collections || [];
  const usages = data.usages || [];
  
  if (months.length === 0) {
    return <div className="text-gray-400 text-sm text-center py-12">No financial data available</div>;
  }
  
  const maxVal = Math.max(...collections, ...usages, 1000);
  const chartHeight = 180;
  const chartWidth = 500;
  const padding = 35;
  const barWidth = 10;
  const barGap = 4;
  
  const points = months.map((month, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (months.length - 1);
    const colVal = collections[idx] || 0;
    const useVal = usages[idx] || 0;
    const colHeight = (colVal * (chartHeight - padding * 2)) / maxVal;
    const useHeight = (useVal * (chartHeight - padding * 2)) / maxVal;
    
    return { month, x, colHeight, useHeight, colVal, useVal };
  });
  
  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-150 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
          <CircleDollarSign size={16} className="text-green-600" /> Monthly Collections vs Expenses
        </h4>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Inflow
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Outflow
          </span>
        </div>
      </div>
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * (chartHeight - padding * 2);
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="9" className="fill-gray-400 font-semibold">₹{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}</text>
              </g>
            );
          })}
          
          {points.map((p, i) => {
            const colX = p.x - barWidth - barGap / 2;
            const useX = p.x + barGap / 2;
            const colY = chartHeight - padding - p.colHeight;
            const useY = chartHeight - padding - p.useHeight;
            
            return (
              <g key={i} className="group cursor-pointer">
                <rect x={colX} y={colY} width={barWidth} height={p.colHeight} rx="2.5" className="fill-emerald-500 hover:fill-emerald-600 transition-colors duration-200" />
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <rect x={colX - 20} y={colY - 22} width="50" height="15" rx="3" className="fill-gray-800" />
                  <text x={colX + 5} y={colY - 12} textAnchor="middle" fontSize="8" className="fill-white font-bold">₹{p.colVal}</text>
                </g>
                
                <rect x={useX} y={useY} width={barWidth} height={p.useHeight} rx="2.5" className="fill-rose-500 hover:fill-rose-600 transition-colors duration-200" />
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <rect x={useX - 20} y={useY - 22} width="50" height="15" rx="3" className="fill-gray-800" />
                  <text x={useX + 5} y={useY - 12} textAnchor="middle" fontSize="8" className="fill-white font-bold">₹{p.useVal}</text>
                </g>
                
                <text x={p.x} y={chartHeight - 8} textAnchor="middle" fontSize="9" className="fill-gray-400 font-bold">{p.month}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { admin, isAdminLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Overview stats & graph state
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalActivities: 0,
    totalFundsReceived: 0,
    totalFundsUsed: 0,
    currentBalance: 0,
    unreadMessages: 0,
    projectStats: { Planned: 0, Ongoing: 0, Completed: 0 }
  });
  const [monthlyFunds, setMonthlyFunds] = useState({ months: [], collections: [], usages: [] });
  const [memberGrowth, setMemberGrowth] = useState({ months: [], monthly: [], cumulative: [] });
  const [categoryUsage, setCategoryUsage] = useState([]);
  const [recentData, setRecentData] = useState({ activities: [], recentMembers: [], recentMessages: [] });
  const [loadingOverviewData, setLoadingOverviewData] = useState(false);

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    siteName: '',
    siteTagline: '',
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    metaDescription: '',
    metaKeywords: '',
    footerText: '',
    darkModeEnabled: false,
    maintenanceMode: false
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [submittingSettings, setSubmittingSettings] = useState(false);

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

  // Members state
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberPage, setMemberPage] = useState(1);
  const [totalMemberPages, setTotalMemberPages] = useState(1);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberLocationLoading, setMemberLocationLoading] = useState(false);
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    phoneNumber: '',
    country: 'India',
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
    isFeatured: false,
    project: ''
  });
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivityPages, setTotalActivityPages] = useState(1);
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [selectedActivityImages, setSelectedActivityImages] = useState([]);
  const [activityImagePreviews, setActivityImagePreviews] = useState([]);
  const [selectedActivityVideo, setSelectedActivityVideo] = useState(null);
  const [activityVideoPreview, setActivityVideoPreview] = useState('');
  const [activityVideoError, setActivityVideoError] = useState(null);

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

  const fetchOverviewData = async () => {
    setLoadingOverviewData(true);
    try {
      const [fundsRes, growthRes, categoryRes, recentRes] = await Promise.all([
        dashboardAPI.getMonthlyFunds(),
        dashboardAPI.getMemberGrowth(),
        dashboardAPI.getCategoryUsage(),
        dashboardAPI.getRecentActivities()
      ]);
      
      if (fundsRes.data.success) setMonthlyFunds(fundsRes.data.data);
      if (growthRes.data.success) setMemberGrowth(growthRes.data.data);
      if (categoryRes.data.success) setCategoryUsage(categoryRes.data.data);
      if (recentRes.data.success) setRecentData(recentRes.data.data);
    } catch (error) {
      console.error("Error loading overview details:", error);
    } finally {
      setLoadingOverviewData(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const response = await settingAPI.getSettings();
      if (response.data && response.data.success) {
        setSettingsForm({
          siteName: response.data.settings.siteName || '',
          siteTagline: response.data.settings.siteTagline || '',
          siteEmail: response.data.settings.siteEmail || '',
          sitePhone: response.data.settings.sitePhone || '',
          siteAddress: response.data.settings.siteAddress || '',
          metaDescription: response.data.settings.metaDescription || '',
          metaKeywords: response.data.settings.metaKeywords || '',
          footerText: response.data.settings.footerText || '',
          darkModeEnabled: response.data.settings.darkModeEnabled || false,
          maintenanceMode: response.data.settings.maintenanceMode || false
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSubmittingSettings(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await settingAPI.updateSettings(settingsForm);
      if (res.data.success) {
        setFormSuccess('Settings updated successfully!');
        fetchSettings();
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSubmittingSettings(false);
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

  const fetchAllProjectsList = async () => {
    try {
      const response = await projectAPI.getAll({ limit: 100 });
      if (response.data && response.data.success) {
        setAllProjectsList(response.data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch all projects list:', error);
    }
  };

  const handleActivityImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Check total limit (max 3 images)
    const newFiles = [...selectedActivityImages, ...files].slice(0, 3);
    setSelectedActivityImages(newFiles);
    
    // Generate previews
    const previews = newFiles.map(file => URL.createObjectURL(file));
    activityImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setActivityImagePreviews(previews);
  };

  const handleRemoveActivityImage = (index) => {
    const newFiles = selectedActivityImages.filter((_, i) => i !== index);
    setSelectedActivityImages(newFiles);
    
    const newPreviews = [...activityImagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setActivityImagePreviews(newPreviews);
  };

  const handleActivityVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setActivityVideoError(null);

    // Enforce 1-minute limit on client side
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;
      if (duration > 60) {
        setActivityVideoError('Video duration must not exceed 1 minute (60 seconds).');
        setSelectedActivityVideo(null);
        setActivityVideoPreview('');
      } else {
        setSelectedActivityVideo(file);
        setActivityVideoPreview(URL.createObjectURL(file));
      }
    };
    videoElement.src = URL.createObjectURL(file);
  };

  const handleRemoveActivityVideo = () => {
    setSelectedActivityVideo(null);
    if (activityVideoPreview) {
      URL.revokeObjectURL(activityVideoPreview);
      setActivityVideoPreview('');
    }
    setActivityVideoError(null);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      activityImagePreviews.forEach(url => URL.revokeObjectURL(url));
      if (activityVideoPreview) URL.revokeObjectURL(activityVideoPreview);
    };
  }, [activityImagePreviews, activityVideoPreview]);

  const handleCreateActivity = async (e) => {
    e.preventDefault();

    if (!activityForm.project) {
      setFormError('Project association is required.');
      return;
    }

    if (selectedActivityImages.length === 0) {
      setFormError('At least 1 photo is required.');
      return;
    }

    if (activityVideoError) {
      setFormError(activityVideoError);
      return;
    }

    setSubmittingActivity(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    formData.append('title', activityForm.title);
    formData.append('description', activityForm.description);
    formData.append('location', activityForm.location);
    formData.append('date', activityForm.date);
    formData.append('isFeatured', activityForm.isFeatured);
    formData.append('project', activityForm.project);

    selectedActivityImages.forEach((img) => {
      formData.append('images', img);
    });

    if (selectedActivityVideo) {
      formData.append('video', selectedActivityVideo);
    }

    try {
      const res = await activityAPI.create(formData);
      if (res.data.success) {
        setFormSuccess('Activity created successfully!');
        setActivityForm({
          title: '',
          description: '',
          location: '',
          date: new Date().toISOString().split('T')[0],
          isFeatured: false,
          project: ''
        });
        setSelectedActivityImages([]);
        setActivityImagePreviews([]);
        setSelectedActivityVideo(null);
        setActivityVideoPreview('');
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
          country: 'India',
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

  const handleUseLiveLocationForMember = () => {
    if (!navigator.geolocation) {
      setFormError('Your browser does not support live location.');
      return;
    }

    setFormError(null);
    setMemberLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
            {
              headers: { Accept: 'application/json' },
            }
          );

          if (!response.ok) {
            throw new Error('Unable to resolve your live location right now.');
          }

          const data = await response.json();
          const address = data.address || {};
          const city = address.city || address.town || address.village || address.county || '';
          const state = address.state || address.region || '';
          const country = address.country || memberForm.country || 'India';
          const addressLine = data.display_name || `${city}, ${state}, ${country}`.replace(/^[,\s]+|[,\s]+$/g, '');

          setMemberForm((prev) => ({
            ...prev,
            country,
            state: state || prev.state,
            city: city || prev.city,
            address: addressLine || prev.address,
          }));
        } catch (locationError) {
          setFormError(locationError.message || 'Unable to use live location.');
        } finally {
          setMemberLocationLoading(false);
        }
      },
      () => {
        setFormError('Location permission was denied.');
        setMemberLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
    if (activeTab === 'overview') {
      fetchDashboardStats();
      fetchOverviewData();
    } else if (activeTab === 'members') {
      fetchMembers();
    } else if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'activities') {
      fetchActivities();
      fetchAllProjectsList();
    } else if (activeTab === 'funds') {
      fetchCollections();
      fetchExpenses();
    } else if (activeTab === 'settings') {
      fetchSettings();
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
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
    { id: 'members', label: 'Members', icon: <Users size={18} /> },
    { id: 'activities', label: 'Activities', icon: <Activity size={18} /> },
    { id: 'impactStories', label: 'Impact Stories', icon: <HeartHandshake size={18} /> },
    { id: 'funds', label: 'Funds', icon: <CircleDollarSign size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings2 size={18} /> },
  ];

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchDashboardStats();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    setFormSuccess(null);
    setFormError(null);
  }, [activeTab]);

  if (!isAdminLoggedIn) {
    return null;
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 text-white py-8 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight flex items-center gap-2">
              <Sparkles className="text-yellow-300 animate-pulse" size={28} /> Admin Console
            </h1>
            <p className="text-green-100/90 text-sm font-medium">Welcome back, {admin?.name || admin?.email}</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> Live Connected
            </span>
            <button
              onClick={logout}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg border border-rose-500/30 cursor-pointer ml-auto md:ml-0"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8 bg-white/70 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-gray-200/80">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 translate-y-[-1px]'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/70'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Financial Balance Summary Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="max-w-4xl relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-emerald-200/90 uppercase flex items-center gap-1.5 mb-1.5">
                      <Wallet size={14} /> Available Balance
                    </span>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight">
                      ₹{((stats.totalFundsReceived || 0) - (stats.totalFundsUsed || 0)).toLocaleString()}
                    </h3>
                    <p className="text-emerald-100/70 text-xs font-semibold mt-2">Global Trust Net Reserves</p>
                  </div>
                  
                  <div className="w-full md:w-3/5 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                    <div className="flex justify-between items-center text-xs font-bold mb-2 text-emerald-100/90">
                      <span>Inflow (Received)</span>
                      <span>Outflow (Spent)</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-lg font-black text-white">₹{(stats.totalFundsReceived || 0).toLocaleString()}</span>
                      <span className="text-lg font-black text-rose-300">₹{(stats.totalFundsUsed || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-emerald-400 h-full transition-all duration-500" 
                        style={{ width: `${stats.totalFundsReceived ? Math.max(10, Math.min(90, (1 - (stats.totalFundsUsed || 0) / stats.totalFundsReceived) * 100)) : 100}%` }} 
                      />
                      <div className="bg-rose-400 h-full flex-grow transition-all duration-500" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-emerald-200/80 mt-2">
                      <span>{(stats.totalFundsReceived && stats.totalFundsUsed) ? `${Math.round((1 - (stats.totalFundsUsed / stats.totalFundsReceived)) * 100)}% Reserves` : '100% Reserves'}</span>
                      <span>{(stats.totalFundsReceived && stats.totalFundsUsed) ? `${Math.round((stats.totalFundsUsed / stats.totalFundsReceived) * 100)}% Used` : '0% Used'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm transition hover:shadow-md flex items-center gap-4">
                  <div className="p-3.5 bg-green-50 text-green-600 rounded-xl">
                    <FolderGit2 size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Projects</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{stats.totalProjects || 0}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm transition hover:shadow-md flex items-center gap-4">
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Members</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{stats.totalMembers || 0}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm transition hover:shadow-md flex items-center gap-4">
                  <div className="p-3.5 bg-yellow-50 text-yellow-600 rounded-xl">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Activities</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{stats.totalActivities || 0}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm transition hover:shadow-md flex items-center gap-4 relative">
                  <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
                    <Bell size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Unread Mail</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{stats.unreadMessages || 0}</p>
                  </div>
                  {stats.unreadMessages > 0 && (
                    <span className="absolute top-4 right-4 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                      {stats.unreadMessages}
                    </span>
                  )}
                </div>
              </div>

              {/* Charts Panel */}
              {loadingOverviewData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center"><Loader /></div>
                  <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center"><Loader /></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MonthlyFundsChart data={monthlyFunds} />
                  <MemberGrowthChart data={memberGrowth} />
                </div>
              )}

              {/* Status and Usage breakdown lists */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Project Status */}
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm md:col-span-1">
                  <h4 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-1.5 border-b border-gray-100 pb-3">
                    <Sparkles size={16} className="text-indigo-500" /> Project Allocations
                  </h4>
                  <div className="space-y-4">
                    {['Planned', 'Ongoing', 'Completed'].map((status) => {
                      const count = stats.projectStats?.[status] || 0;
                      const total = stats.totalProjects || 1;
                      const pct = Math.round((count / total) * 100);
                      const barColors = {
                        Planned: 'bg-yellow-400',
                        Ongoing: 'bg-blue-500',
                        Completed: 'bg-emerald-500'
                      };
                      const textColors = {
                        Planned: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                        Ongoing: 'text-blue-600 bg-blue-50 border-blue-200',
                        Completed: 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      };

                      return (
                        <div key={status} className="p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${textColors[status]}`}>{status}</span>
                            <span className="text-xs font-bold text-gray-600">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${barColors[status]}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm md:col-span-2">
                  <h4 className="text-sm font-bold text-gray-700 mb-5 flex items-center gap-1.5 border-b border-gray-100 pb-3">
                    <CircleDollarSign size={16} className="text-rose-500" /> Category-Wise Expense Distribution
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-56 overflow-y-auto pr-1">
                    {categoryUsage.length > 0 ? (
                      categoryUsage.map((usage) => {
                        const totalExpense = stats.totalFundsUsed || 1;
                        const pct = Math.round(((usage.total || 0) / totalExpense) * 100);
                        return (
                          <div key={usage._id} className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                            <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-gray-600">
                              <span className="truncate max-w-[120px]">{usage._id || 'Other'}</span>
                              <span>₹{(usage.total || 0).toLocaleString()} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-400 text-xs text-center col-span-2 py-10">No categories distribution data logged.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Audit logs Hub */}
              <div className="border-t border-gray-150 pt-8">
                <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                  <ShieldAlert className="text-emerald-600" /> Audit Log & Recent Platform Activities
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activities */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-1">
                      <Activity size={14} className="text-yellow-600" /> Activities Posted
                    </h4>
                    <div className="space-y-3.5">
                      {recentData.activities?.length > 0 ? (
                        recentData.activities.map((act) => (
                          <div key={act._id} className="flex gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                            <Calendar size={14} className="text-gray-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-grow">
                              <p className="font-bold text-gray-800 truncate">{act.title}</p>
                              <p className="text-gray-400 mt-0.5">{act.location} • {new Date(act.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs text-center py-6">No recent activities found.</p>
                      )}
                    </div>
                  </div>

                  {/* New Members */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-1">
                      <Users size={14} className="text-blue-600" /> Newly Registered
                    </h4>
                    <div className="space-y-3.5">
                      {recentData.recentMembers?.length > 0 ? (
                        recentData.recentMembers.map((memb) => (
                          <div key={memb._id} className="flex gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                            <User size={14} className="text-gray-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-grow">
                              <p className="font-bold text-gray-800 truncate">{memb.fullName}</p>
                              <p className="text-gray-400 mt-0.5">{memb.city}, {memb.state} • {memb.phoneNumber}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs text-center py-6">No new members registered.</p>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-1">
                      <Bell size={14} className="text-purple-600" /> Recent Messages
                    </h4>
                    <div className="space-y-3.5">
                      {recentData.recentMessages?.length > 0 ? (
                        recentData.recentMessages.map((msg) => (
                          <div key={msg._id} className="flex gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0 relative">
                            <FileText size={14} className="text-gray-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-grow">
                              <div className="flex justify-between items-baseline">
                                <p className="font-bold text-gray-800 truncate">{msg.name}</p>
                                {!msg.isRead && (
                                  <span className="shrink-0 w-2 h-2 rounded-full bg-rose-500 ml-1.5" />
                                )}
                              </div>
                              <p className="text-gray-500 mt-0.5 truncate">{msg.message}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{msg.email}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs text-center py-6">No incoming messages.</p>
                      )}
                    </div>
                  </div>
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
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-4 flex items-center justify-center gap-2"
                    onClick={handleUseLiveLocationForMember}
                    disabled={submittingMember || memberLocationLoading}
                  >
                    {memberLocationLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                    {memberLocationLoading ? 'Fetching live location...' : 'Use Live Location'}
                  </Button>
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
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Country</label>
                      <input
                        type="text"
                        value={memberForm.country}
                        onChange={(e) => setMemberForm({ ...memberForm, country: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                        placeholder="Country"
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

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm flex items-center gap-1.5">
                        <FolderGit2 size={16} className="text-gray-400" /> Associated Project
                      </label>
                      <select
                        name="project"
                        value={activityForm.project}
                        onChange={(e) => setActivityForm({ ...activityForm, project: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition bg-white"
                      >
                        <option value="">-- Select Project --</option>
                        {allProjectsList.map((proj) => (
                          <option key={proj._id} value={proj._id}>
                            {proj.title}
                          </option>
                        ))}
                      </select>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Photo Upload section */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-1.5">
                          <ImageIcon size={16} className="text-gray-400" /> Upload Photos (1 to 3)
                        </label>
                        <div className="grid grid-cols-3 gap-3 mb-2">
                          {activityImagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-gray-200 group">
                              <img src={preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveActivityImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition transform hover:scale-110 active:scale-95"
                                title="Remove image"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                          {activityImagePreviews.length < 3 && (
                            <div className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleActivityImagesChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <Upload size={16} className="text-gray-400 mb-1" />
                              <p className="text-[9px] text-gray-500 font-semibold">Add Photo</p>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400">At least 1 photo is required. Max 3 photos. PNG, JPG up to 5MB.</p>
                      </div>

                      {/* Video Upload section */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-1.5">
                          <ImageIcon size={16} className="text-gray-400" /> Upload Video (Optional, max 1 min)
                        </label>
                        {activityVideoPreview ? (
                          <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-black">
                            <video src={activityVideoPreview} controls className="w-full h-20 object-contain" />
                            <button
                              type="button"
                              onClick={handleRemoveActivityVideo}
                              className="absolute top-1 right-1 bg-red-650 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition transform hover:scale-110 active:scale-95 z-10"
                              title="Remove video"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleActivityVideoChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload size={16} className="text-gray-400 mb-1" />
                            <p className="text-[9px] text-gray-500 font-semibold">Select Video</p>
                            <p className="text-[8px] text-gray-400 mt-0.5">MP4, WebM up to 15MB. Max 1 min duration.</p>
                          </div>
                        )}
                        {activityVideoError && (
                          <p className="text-rose-500 text-[10px] mt-1 font-semibold flex items-center gap-1">
                            <AlertCircle size={10} /> {activityVideoError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 text-sm">Description</label>
                      <textarea
                        name="description"
                        value={activityForm.description}
                        onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                        required
                        maxLength={2000}
                        rows={4}
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
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Settings2 className="text-green-600" /> Platform Settings
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Manage global platform configs, branding, contact details, and SEO metadata.</p>
                </div>
                {formSuccess && activeTab === 'settings' && (
                  <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 size={14} /> {formSuccess}
                  </div>
                )}
              </div>

              {loadingSettings ? (
                <div className="flex justify-center py-12">
                  <Loader />
                </div>
              ) : (
                <form onSubmit={handleUpdateSettings} className="space-y-8">
                  {formError && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm flex items-center gap-2">
                      <AlertCircle size={18} /> {formError}
                    </div>
                  )}

                  {/* General Configuration */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200/50 pb-2">
                      <Sparkles size={18} className="text-emerald-500" /> General Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Site Name</label>
                        <input
                          type="text"
                          value={settingsForm.siteName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                          placeholder="e.g. Nek Kaam Foundation"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Site Tagline</label>
                        <input
                          type="text"
                          value={settingsForm.siteTagline}
                          onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                          placeholder="e.g. Together We Help Communities"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Primary Email Address</label>
                        <input
                          type="email"
                          value={settingsForm.siteEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, siteEmail: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                          placeholder="e.g. info@nekkaamfoundation.org"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Contact Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.sitePhone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sitePhone: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                          placeholder="e.g. +91XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Physical Office Address</label>
                      <input
                        type="text"
                        value={settingsForm.siteAddress}
                        onChange={(e) => setSettingsForm({ ...settingsForm, siteAddress: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                        placeholder="Office Address"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-gray-200/50">
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Maintenance Mode</p>
                          <p className="text-xs text-gray-500">Temporarily freeze platform public access</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.maintenanceMode}
                            onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Dark Theme Enablement</p>
                          <p className="text-xs text-gray-500">Enable site-wide dark mode for users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.darkModeEnabled}
                            onChange={(e) => setSettingsForm({ ...settingsForm, darkModeEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SEO Configuration */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200/50 pb-2">
                      <Award size={18} className="text-blue-500" /> SEO & Meta Configuration
                    </h3>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Meta Description</label>
                      <textarea
                        value={settingsForm.metaDescription}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                        placeholder="Site SEO description..."
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Meta Keywords (Comma separated)</label>
                      <input
                        type="text"
                        value={settingsForm.metaKeywords}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaKeywords: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                        placeholder="NGO, trust, transparent charity"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-700 font-bold mb-1 text-xs uppercase tracking-wider">Footer Copyright Statement</label>
                      <input
                        type="text"
                        value={settingsForm.footerText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition text-sm font-semibold text-gray-800"
                        placeholder="Footer copyright text"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button
                      type="submit"
                      disabled={submittingSettings}
                      variant="primary"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wide cursor-pointer rounded-xl transition shadow-md"
                    >
                      {submittingSettings ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Saving Settings...
                        </>
                      ) : (
                        <>
                          <Check size={16} /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
