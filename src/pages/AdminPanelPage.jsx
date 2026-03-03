import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Unlock, Plus, Edit2, Trash2, Eye, Upload, Download,
    Calendar, Users, Award, Settings, RefreshCcw, Save, X,
    FileText, Image as ImageIcon, CheckCircle, AlertCircle,
    Loader2, Send, Star, History, Activity, LayoutDashboard
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateCertificatePDF } from '../utils/generateCertificate';
import { triggerCertificateEmail } from '../utils/emailTrigger';

const AdminPanelPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Main navigation
    const [activeSection, setActiveSection] = useState('dashboard');

    // Webinars state
    const [webinars, setWebinars] = useState([]);
    const [loadingWebinars, setLoadingWebinars] = useState(false);
    const [showWebinarForm, setShowWebinarForm] = useState(false);
    const [editingWebinar, setEditingWebinar] = useState(null);
    const [webinarForm, setWebinarForm] = useState({
        program_name: '',
        program_date: '',
        description: '',
        webinar_type: 'webinar',
        registration_open: true,
        attendance_open: false,
        max_participants: 100
    });

    // Certificate Templates state
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [showTemplateForm, setShowTemplateForm] = useState(false);
    const [templateForm, setTemplateForm] = useState({
        template_name: '',
        template_type: 'participation',
        is_active: true,
        logo_url: '',
        background_color: '#1a1a2e',
        primary_color: '#ec4899',
        secondary_color: '#8b5cf6'
    });
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);

    // Records state
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
    const [registrations, setRegistrations] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [selectedWebinar, setSelectedWebinar] = useState(null);

    // Stats
    const [stats, setStats] = useState({
        totalWebinars: 0,
        activeWebinars: 0,
        totalRegistrations: 0,
        totalAttendances: 0,
        certificatesSent: 0,
        communityMembers: 0
    });

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboardData();
        }
    }, [isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'mani02112007') {
            setIsAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('Access Denied: Invalid Credentials');
        }
    };

    const loadDashboardData = async () => {
        await Promise.all([
            fetchWebinars(),
            fetchTemplates(),
            fetchStats()
        ]);
    };

    const fetchStats = async () => {
        try {
            const [webinarsRes, participantsRes, attendanceRes, certificatesRes, communityRes] = await Promise.all([
                supabase.from('webinars').select('*', { count: 'exact' }),
                supabase.from('participants').select('*', { count: 'exact' }),
                supabase.from('attendance').select('*', { count: 'exact' }),
                supabase.from('certificates').select('*', { count: 'exact' }),
                supabase.from('community_members').select('*', { count: 'exact' })
            ]);

            const activeWebinars = webinarsRes.data?.filter(w => w.registration_open).length || 0;

            setStats({
                totalWebinars: webinarsRes.count || 0,
                activeWebinars,
                totalRegistrations: participantsRes.count || 0,
                totalAttendances: attendanceRes.count || 0,
                certificatesSent: certificatesRes.count || 0,
                communityMembers: communityRes.count || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // ============ WEBINAR MANAGEMENT ============
    const fetchWebinars = async () => {
        setLoadingWebinars(true);
        try {
            const { data, error } = await supabase
                .from('webinars')
                .select('*')
                .order('program_date', { ascending: false });

            if (error) throw error;
            setWebinars(data || []);
        } catch (error) {
            console.error('Error fetching webinars:', error);
        } finally {
            setLoadingWebinars(false);
        }
    };

    const handleSaveWebinar = async (e) => {
        e.preventDefault();
        try {
            if (editingWebinar) {
                const { error } = await supabase
                    .from('webinars')
                    .update(webinarForm)
                    .eq('id', editingWebinar.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('webinars')
                    .insert([webinarForm]);
                if (error) throw error;
            }

            setShowWebinarForm(false);
            setEditingWebinar(null);
            setWebinarForm({
                program_name: '',
                program_date: '',
                description: '',
                webinar_type: 'webinar',
                registration_open: true,
                attendance_open: false,
                max_participants: 100
            });
            fetchWebinars();
            fetchStats();
        } catch (error) {
            console.error('Error saving webinar:', error);
            alert('Failed to save webinar');
        }
    };

    const handleDeleteWebinar = async (id) => {
        if (!confirm('Are you sure you want to delete this webinar?')) return;
        try {
            const { error } = await supabase.from('webinars').delete().eq('id', id);
            if (error) throw error;
            fetchWebinars();
            fetchStats();
        } catch (error) {
            console.error('Error deleting webinar:', error);
        }
    };

    const toggleRegistration = async (webinar) => {
        try {
            const { error } = await supabase
                .from('webinars')
                .update({ registration_open: !webinar.registration_open })
                .eq('id', webinar.id);
            if (error) throw error;
            fetchWebinars();
            fetchStats();
        } catch (error) {
            console.error('Error toggling registration:', error);
        }
    };

    const toggleAttendance = async (webinar) => {
        try {
            const { error } = await supabase
                .from('webinars')
                .update({ attendance_open: !webinar.attendance_open })
                .eq('id', webinar.id);
            if (error) throw error;
            fetchWebinars();
        } catch (error) {
            console.error('Error toggling attendance:', error);
        }
    };

    // ============ CERTIFICATE TEMPLATE MANAGEMENT ============
    const fetchTemplates = async () => {
        setLoadingTemplates(true);
        try {
            const { data, error } = await supabase
                .from('certificate_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `logos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('certificates')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('certificates')
                .getPublicUrl(filePath);

            setTemplateForm({ ...templateForm, logo_url: publicUrl });
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSaveTemplate = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('certificate_templates')
                .insert([templateForm]);

            if (error) throw error;

            setShowTemplateForm(false);
            setTemplateForm({
                template_name: '',
                template_type: 'participation',
                is_active: true,
                logo_url: '',
                background_color: '#1a1a2e',
                primary_color: '#ec4899',
                secondary_color: '#8b5cf6'
            });
            fetchTemplates();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template');
        }
    };

    const toggleTemplateActive = async (template) => {
        try {
            const { error } = await supabase
                .from('certificate_templates')
                .update({ is_active: !template.is_active })
                .eq('id', template.id);

            if (error) throw error;
            fetchTemplates();
        } catch (error) {
            console.error('Error toggling template:', error);
        }
    };

    const handlePreviewTemplate = (template) => {
        setPreviewTemplate(template);
    };

    // ============ RECORDS MANAGEMENT ============
    const fetchRecords = async (webinarId) => {
        setLoadingRecords(true);
        try {
            const [regRes, attRes, certRes] = await Promise.all([
                supabase.from('participants').select('*').eq('webinar_id', webinarId),
                supabase.from('attendance').select('*').eq('webinar_id', webinarId),
                supabase.from('certificates').select('*').eq('webinar_id', webinarId)
            ]);

            setRegistrations(regRes.data || []);
            setAttendances(attRes.data || []);
            setCertificates(certRes.data || []);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoadingRecords(false);
        }
    };

    const handleSendCertificate = async (attendee) => {
        if (!window.confirm(`Are you sure you want to send a certificate to ${attendee.name}?`)) {
            return;
        }
        try {
            const certId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const { error } = await supabase.from('certificates').insert([{
                certificate_id: certId,
                name: attendee.name,
                email: attendee.email,
                webinar_id: selectedWebinar?.id,
                webinar_title: selectedWebinar?.program_name,
                issued_date: new Date().toISOString().split('T')[0],
                is_completed: true
            }]);

            if (error) throw error;

            await triggerCertificateEmail(
                { name: attendee.name, email: attendee.email },
                certId
            );

            alert('Certificate sent successfully!');
            fetchRecords(selectedWebinar?.id);
            fetchStats();
        } catch (error) {
            console.error('Error sending certificate:', error);
            alert('Failed to send certificate');
        }
    };

    // ============ UI COMPONENTS ============
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-glass p-8 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Panel Access</h2>
                    <p className="text-gray-400 mb-8">Enter administrator password to continue.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            className="input-field text-center tracking-widest"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {authError && <p className="text-red-400 text-sm">{authError}</p>}
                        <button type="submit" className="btn-primary w-full">
                            Access System <Unlock size={16} className="ml-2" />
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="heading-lg mb-2">Admin Control Panel</h1>
                    <p className="text-gray-400">Manage webinars, certificates, and registrations</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'webinars', label: 'Webinars', icon: Calendar },
                        { id: 'records', label: 'All Records', icon: Users }
                    ].map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeSection === section.id
                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <section.icon size={18} />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeSection === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <StatCard
                                    icon={Calendar}
                                    label="Total Webinars"
                                    value={stats.totalWebinars}
                                    color="blue"
                                />
                                <StatCard
                                    icon={Activity}
                                    label="Active Webinars"
                                    value={stats.activeWebinars}
                                    color="green"
                                />
                                <StatCard
                                    icon={Users}
                                    label="Registrations"
                                    value={stats.totalRegistrations}
                                    color="purple"
                                />
                                <StatCard
                                    icon={CheckCircle}
                                    label="Attendances"
                                    value={stats.totalAttendances}
                                    color="pink"
                                />
                                <StatCard
                                    icon={Award}
                                    label="Certificates Sent"
                                    value={stats.certificatesSent}
                                    color="yellow"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="card-glass p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => {
                                            setActiveSection('webinars');
                                            setShowWebinarForm(true);
                                        }}
                                        className="p-4 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 rounded-xl text-left transition-all group"
                                    >
                                        <Plus className="text-brand-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                        <h4 className="font-bold text-white">Create Webinar</h4>
                                        <p className="text-sm text-gray-400">Add a new webinar program</p>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveSection('templates');
                                            setShowTemplateForm(true);
                                        }}
                                        className="p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-left transition-all group"
                                    >
                                        <Upload className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                        <h4 className="font-bold text-white">Upload Template</h4>
                                        <p className="text-sm text-gray-400">Add certificate template</p>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('records')}
                                        className="p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-left transition-all group"
                                    >
                                        <Eye className="text-green-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                        <h4 className="font-bold text-white">View Records</h4>
                                        <p className="text-sm text-gray-400">Check registrations & attendance</p>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'webinars' && (
                        <motion.div
                            key="webinars"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="card-glass p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Webinar Management</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={fetchWebinars}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <RefreshCcw size={18} className={loadingWebinars ? 'animate-spin' : ''} />
                                        </button>
                                        <button
                                            onClick={() => setShowWebinarForm(true)}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <Plus size={18} />
                                            Add Webinar
                                        </button>
                                    </div>
                                </div>

                                {/* Webinar Form Modal */}
                                <AnimatePresence>
                                    {showWebinarForm && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                                            onClick={() => setShowWebinarForm(false)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                exit={{ scale: 0.9, y: 20 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="card-glass p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                            >
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-2xl font-bold text-white">
                                                        {editingWebinar ? 'Edit Webinar' : 'Create New Webinar'}
                                                    </h3>
                                                    <button
                                                        onClick={() => {
                                                            setShowWebinarForm(false);
                                                            setEditingWebinar(null);
                                                        }}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>

                                                <form onSubmit={handleSaveWebinar} className="space-y-4">
                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Program Name</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="input-field"
                                                            placeholder="e.g., React Roadmap Webinar"
                                                            value={webinarForm.program_name}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, program_name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Program Date</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            className="input-field"
                                                            value={webinarForm.program_date}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, program_date: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Description</label>
                                                        <textarea
                                                            className="input-field min-h-[100px]"
                                                            placeholder="Brief description of the webinar..."
                                                            value={webinarForm.description}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, description: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Webinar Type</label>
                                                        <select
                                                            className="input-field"
                                                            value={webinarForm.webinar_type || 'webinar'}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, webinar_type: e.target.value })}
                                                        >
                                                            <option value="webinar">Webinar</option>
                                                            <option value="masterclass">Master Class</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Max Participants</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            className="input-field"
                                                            value={webinarForm.max_participants}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, max_participants: parseInt(e.target.value) })}
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="registration_open"
                                                            checked={webinarForm.registration_open}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, registration_open: e.target.checked })}
                                                            className="w-4 h-4 rounded border-gray-500 text-brand-500"
                                                        />
                                                        <label htmlFor="registration_open" className="text-sm text-gray-300">
                                                            Registration Open
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="attendance_open"
                                                            checked={webinarForm.attendance_open || false}
                                                            onChange={(e) => setWebinarForm({ ...webinarForm, attendance_open: e.target.checked })}
                                                            className="w-4 h-4 rounded border-gray-500 text-blue-500"
                                                        />
                                                        <label htmlFor="attendance_open" className="text-sm text-gray-300">
                                                            Attendance Open
                                                        </label>
                                                    </div>

                                                    <div className="flex gap-3 pt-4">
                                                        <button type="submit" className="btn-primary flex-1">
                                                            <Save size={18} />
                                                            Save Webinar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowWebinarForm(false);
                                                                setEditingWebinar(null);
                                                            }}
                                                            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Webinars List */}
                                {loadingWebinars ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="animate-spin mx-auto text-brand-500" size={32} />
                                    </div>
                                ) : webinars.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No webinars found. Create your first webinar!
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {webinars.map((webinar) => (
                                            <div
                                                key={webinar.id}
                                                className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-white">{webinar.program_name}</h3>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold ${webinar.registration_open
                                                                    ? 'bg-green-500/20 text-green-400'
                                                                    : 'bg-red-500/20 text-red-400'
                                                                    }`}
                                                            >
                                                                Reg: {webinar.registration_open ? 'Open' : 'Closed'}
                                                            </span>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-bold ${webinar.attendance_open
                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                    : 'bg-gray-500/20 text-gray-500'
                                                                    }`}
                                                            >
                                                                Attend: {webinar.attendance_open ? 'Open' : 'Closed'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-400 text-sm mb-2">{webinar.description}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={14} />
                                                                {new Date(webinar.program_date).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Users size={14} />
                                                                Max: {webinar.max_participants}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleRegistration(webinar)}
                                                            className={`p-2 rounded-lg transition-colors ${webinar.registration_open
                                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                                }`}
                                                            title={webinar.registration_open ? 'Close Registration' : 'Open Registration'}
                                                        >
                                                            {webinar.registration_open ? <Lock size={18} /> : <Unlock size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => toggleAttendance(webinar)}
                                                            className={`p-2 rounded-lg transition-colors ${webinar.attendance_open
                                                                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                                                                : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                                                                }`}
                                                            title={webinar.attendance_open ? 'Close Attendance' : 'Open Attendance'}
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setActiveSection('records');
                                                                setSelectedWebinar(webinar);
                                                                setActiveTab('active');
                                                                fetchRecords(webinar.id);
                                                            }}
                                                            className="p-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                                                            title="View Attendance Records"
                                                        >
                                                            <Users size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingWebinar(webinar);
                                                                setWebinarForm(webinar);
                                                                setShowWebinarForm(true);
                                                            }}
                                                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteWebinar(webinar.id)}
                                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'templates' && (
                        <motion.div
                            key="templates"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="card-glass p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Certificate Templates</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={fetchTemplates}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <RefreshCcw size={18} className={loadingTemplates ? 'animate-spin' : ''} />
                                        </button>
                                        <button
                                            onClick={() => setShowTemplateForm(true)}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <Plus size={18} />
                                            Add Template
                                        </button>
                                    </div>
                                </div>

                                {/* Template Form Modal */}
                                <AnimatePresence>
                                    {showTemplateForm && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                                            onClick={() => setShowTemplateForm(false)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                exit={{ scale: 0.9, y: 20 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="card-glass p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                            >
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-2xl font-bold text-white">Create Certificate Template</h3>
                                                    <button
                                                        onClick={() => setShowTemplateForm(false)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>

                                                <form onSubmit={handleSaveTemplate} className="space-y-4">
                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Template Name</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="input-field"
                                                            placeholder="e.g., Modern Certificate"
                                                            value={templateForm.template_name}
                                                            onChange={(e) => setTemplateForm({ ...templateForm, template_name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Template Type</label>
                                                        <select
                                                            className="input-field"
                                                            value={templateForm.template_type}
                                                            onChange={(e) => setTemplateForm({ ...templateForm, template_type: e.target.value })}
                                                        >
                                                            <option value="participation">Participation</option>
                                                            <option value="completion">Completion</option>
                                                            <option value="achievement">Achievement</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="text-sm text-gray-400 mb-1 block">Logo / Course Image</label>
                                                        <div className="flex gap-3">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleLogoUpload}
                                                                className="hidden"
                                                                id="logo-upload"
                                                            />
                                                            <label
                                                                htmlFor="logo-upload"
                                                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                {uploadingLogo ? (
                                                                    <>
                                                                        <Loader2 size={18} className="animate-spin" />
                                                                        Uploading...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload size={18} />
                                                                        Upload Logo
                                                                    </>
                                                                )}
                                                            </label>
                                                            {templateForm.logo_url && (
                                                                <img
                                                                    src={templateForm.logo_url}
                                                                    alt="Logo preview"
                                                                    className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="text-sm text-gray-400 mb-1 block">Background Color</label>
                                                            <input
                                                                type="color"
                                                                className="w-full h-12 rounded-lg cursor-pointer"
                                                                value={templateForm.background_color}
                                                                onChange={(e) => setTemplateForm({ ...templateForm, background_color: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-400 mb-1 block">Primary Color</label>
                                                            <input
                                                                type="color"
                                                                className="w-full h-12 rounded-lg cursor-pointer"
                                                                value={templateForm.primary_color}
                                                                onChange={(e) => setTemplateForm({ ...templateForm, primary_color: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-sm text-gray-400 mb-1 block">Secondary Color</label>
                                                            <input
                                                                type="color"
                                                                className="w-full h-12 rounded-lg cursor-pointer"
                                                                value={templateForm.secondary_color}
                                                                onChange={(e) => setTemplateForm({ ...templateForm, secondary_color: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="is_active"
                                                            checked={templateForm.is_active}
                                                            onChange={(e) => setTemplateForm({ ...templateForm, is_active: e.target.checked })}
                                                            className="w-4 h-4 rounded border-gray-500 text-brand-500"
                                                        />
                                                        <label htmlFor="is_active" className="text-sm text-gray-300">
                                                            Set as Active Template
                                                        </label>
                                                    </div>

                                                    <div className="flex gap-3 pt-4">
                                                        <button type="submit" className="btn-primary flex-1">
                                                            <Save size={18} />
                                                            Save Template
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowTemplateForm(false)}
                                                            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Preview Modal */}
                                <AnimatePresence>
                                    {previewTemplate && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                                            onClick={() => setPreviewTemplate(null)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.9 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="max-w-4xl w-full"
                                            >
                                                <div className="mb-4 flex justify-between items-center">
                                                    <h3 className="text-2xl font-bold text-white">Certificate Preview</h3>
                                                    <button
                                                        onClick={() => setPreviewTemplate(null)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <X size={24} className="text-white" />
                                                    </button>
                                                </div>
                                                <div
                                                    className="w-full aspect-[1.414/1] rounded-2xl p-12 flex flex-col items-center justify-center"
                                                    style={{ backgroundColor: previewTemplate.background_color }}
                                                >
                                                    {previewTemplate.logo_url && (
                                                        <img
                                                            src={previewTemplate.logo_url}
                                                            alt="Logo"
                                                            className="w-24 h-24 object-contain mb-8"
                                                        />
                                                    )}
                                                    <h1
                                                        className="text-5xl font-bold mb-4"
                                                        style={{ color: previewTemplate.primary_color }}
                                                    >
                                                        CERTIFICATE
                                                    </h1>
                                                    <p className="text-xl text-gray-300 mb-8">OF {previewTemplate.template_type.toUpperCase()}</p>
                                                    <p className="text-gray-400 mb-4">This certificate is presented to</p>
                                                    <h2 className="text-4xl font-bold text-white mb-8">XXXX XXXX</h2>
                                                    <p className="text-gray-400 text-center max-w-2xl">
                                                        For successfully completing the course <span className="font-bold">XXXX</span>
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Templates List */}
                                {loadingTemplates ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="animate-spin mx-auto text-brand-500" size={32} />
                                    </div>
                                ) : templates.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No templates found. Create your first template!
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                className="p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white mb-1">{template.template_name}</h3>
                                                        <span className="text-sm text-gray-400 capitalize">{template.template_type}</span>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${template.is_active
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-gray-500/20 text-gray-400'
                                                            }`}
                                                    >
                                                        {template.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>

                                                {template.logo_url && (
                                                    <img
                                                        src={template.logo_url}
                                                        alt="Template logo"
                                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                                    />
                                                )}

                                                <div className="flex gap-2 mb-4">
                                                    <div
                                                        className="w-8 h-8 rounded border border-white/10"
                                                        style={{ backgroundColor: template.background_color }}
                                                        title="Background"
                                                    />
                                                    <div
                                                        className="w-8 h-8 rounded border border-white/10"
                                                        style={{ backgroundColor: template.primary_color }}
                                                        title="Primary"
                                                    />
                                                    <div
                                                        className="w-8 h-8 rounded border border-white/10"
                                                        style={{ backgroundColor: template.secondary_color }}
                                                        title="Secondary"
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handlePreviewTemplate(template)}
                                                        className="flex-1 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Eye size={16} />
                                                        Preview
                                                    </button>
                                                    <button
                                                        onClick={() => toggleTemplateActive(template)}
                                                        className={`px-4 py-2 rounded-lg transition-colors ${template.is_active
                                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                            }`}
                                                    >
                                                        {template.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'records' && (
                        <motion.div
                            key="records"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="card-glass p-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Records Management</h2>

                                {/* Webinar Selector */}
                                <div className="mb-6">
                                    <label className="text-sm text-gray-400 mb-2 block">Select Webinar</label>
                                    <select
                                        className="input-field"
                                        value={selectedWebinar?.id || ''}
                                        onChange={(e) => {
                                            const webinar = webinars.find(w => w.id === parseInt(e.target.value));
                                            setSelectedWebinar(webinar);
                                            if (webinar) fetchRecords(webinar.id);
                                        }}
                                    >
                                        <option value="">Choose a webinar...</option>
                                        {webinars.map((webinar) => (
                                            <option key={webinar.id} value={webinar.id}>
                                                {webinar.program_name} - {new Date(webinar.program_date).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedWebinar && (
                                    <>
                                        {/* Tabs */}
                                        <div className="flex gap-2 mb-6">
                                            {[
                                                { id: 'active', label: 'Active Records', icon: Activity },
                                                { id: 'history', label: 'History', icon: History }
                                            ].map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id
                                                        ? 'bg-brand-500 text-white'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <tab.icon size={18} />
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Records Content */}
                                        {loadingRecords ? (
                                            <div className="text-center py-12">
                                                <Loader2 className="animate-spin mx-auto text-brand-500" size={32} />
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Registrations */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                        <Users size={20} />
                                                        Registrations ({registrations.length})
                                                    </h3>
                                                    {registrations.length === 0 ? (
                                                        <p className="text-gray-500 text-center py-8">No registrations yet</p>
                                                    ) : (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                                                        <th className="py-3 px-4">Name</th>
                                                                        <th className="py-3 px-4">Email</th>
                                                                        <th className="py-3 px-4">College/Org</th>
                                                                        <th className="py-3 px-4">Year/Exp</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-white/5">
                                                                    {registrations.map((reg, idx) => (
                                                                        <tr key={idx} className="hover:bg-white/5">
                                                                            <td className="py-3 px-4 text-white">{reg.name}</td>
                                                                            <td className="py-3 px-4 text-gray-400">{reg.email}</td>
                                                                            <td className="py-3 px-4 text-gray-400">{reg.college}</td>
                                                                            <td className="py-3 px-4 text-gray-400">{reg.current_year}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Attendances */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                        <CheckCircle size={20} />
                                                        Attendances ({attendances.length})
                                                    </h3>
                                                    {attendances.length === 0 ? (
                                                        <p className="text-gray-500 text-center py-8">No attendance records yet</p>
                                                    ) : (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-left border-collapse">
                                                                <thead>
                                                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                                                        <th className="py-3 px-4">Name</th>
                                                                        <th className="py-3 px-4">Email</th>
                                                                        <th className="py-3 px-4">Rating</th>
                                                                        <th className="py-3 px-4">Feedback</th>
                                                                        <th className="py-3 px-4 text-right">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-white/5">
                                                                    {attendances.map((att, idx) => (
                                                                        <tr key={idx} className="hover:bg-white/5">
                                                                            <td className="py-3 px-4 text-white">{att.name}</td>
                                                                            <td className="py-3 px-4 text-gray-400">{att.email}</td>
                                                                            <td className="py-3 px-4">
                                                                                <div className="flex gap-1">
                                                                                    {[...Array(att.rating || 0)].map((_, i) => (
                                                                                        <Star key={i} size={14} fill="currentColor" className="text-yellow-500" />
                                                                                    ))}
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-3 px-4 text-gray-400 max-w-xs truncate">{att.feedback}</td>
                                                                            <td className="py-3 px-4 text-right">
                                                                                <button
                                                                                    onClick={() => handleSendCertificate(att)}
                                                                                    className="px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors flex items-center gap-2 ml-auto"
                                                                                >
                                                                                    <Send size={14} />
                                                                                    Send Certificate
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Certificates */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                        <Award size={20} />
                                                        Certificates Issued ({certificates.length})
                                                    </h3>
                                                    {certificates.length === 0 ? (
                                                        <p className="text-gray-500 text-center py-8">No certificates issued yet</p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {certificates.map((cert, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                                                                >
                                                                    <h4 className="font-bold text-white mb-1">{cert.name}</h4>
                                                                    <p className="text-sm text-gray-400 mb-2">{cert.email}</p>
                                                                    <p className="text-xs text-gray-500 mb-3">ID: {cert.certificate_id}</p>
                                                                    <div className="flex gap-2">
                                                                        <a
                                                                            href={`/certificate/${cert.certificate_id}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex-1 px-3 py-2 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-lg text-xs font-bold text-center transition-colors"
                                                                        >
                                                                            View
                                                                        </a>
                                                                        <button
                                                                            onClick={() => triggerCertificateEmail({ name: cert.name, email: cert.email }, cert.certificate_id)}
                                                                            className="px-3 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-colors"
                                                                        >
                                                                            <Send size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        green: 'bg-green-500/10 text-green-400 border-green-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    };

    return (
        <div className={`p-6 rounded-xl border ${colorClasses[color]} transition-all hover:scale-105`}>
            <Icon size={24} className="mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    );
};

export default AdminPanelPage;
