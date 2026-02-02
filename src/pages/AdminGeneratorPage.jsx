import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, User, Mail, Calendar, FileText, CheckCircle, Loader2, AlertCircle, RefreshCcw, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';
import { triggerCertificateEmail } from '../utils/emailTrigger';

const AdminGeneratorPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'manual'
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);

    // Manual Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        webinar_title: 'React Roadmap to Students – Webinar',
        issued_date: new Date().toISOString().split('T')[0]
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

    // Fetch participants on load if authenticated
    useEffect(() => {
        if (isAuthenticated && activeTab === 'list') {
            fetchParticipants();
        }
    }, [isAuthenticated, activeTab]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'mani02112007') {
            setIsAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('Access Denied: Invalid Credentials');
        }
    };

    const fetchParticipants = async () => {
        setLoadingParticipants(true);
        try {
            const { data, error } = await supabase
                .from('participants')
                .select('name, email, college, whatsapp, current_year')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setParticipants(data || []);
        } catch (err) {
            console.error('Error fetching participants:', err);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const generateCertificateId = () => {
        const year = new Date().getFullYear();
        const randomInfo = Math.floor(1000 + Math.random() * 9000);
        return `TT-REACT-${year}-${randomInfo}`;
    };

    const generatePDF = (certData) => {
        // Create a new PDF document (Landscape A4)
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Set dimensions
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();

        // Background Color (Very Light Gray)
        doc.setFillColor(252, 252, 252);
        doc.rect(0, 0, width, height, 'F');

        // Border (Double)
        doc.setLineWidth(1.5);
        doc.setDrawColor(20, 20, 20); // Almost black
        doc.rect(10, 10, width - 20, height - 20);

        doc.setLineWidth(0.5);
        doc.rect(12, 12, width - 24, height - 24);

        // Header
        doc.setFont('times', 'bold');
        doc.setFontSize(40);
        doc.setTextColor(30, 30, 30);
        doc.text('CERTIFICATE', width / 2, 50, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'bold');
        doc.text('OF PARTICIPATION', width / 2, 60, { align: 'center' });

        // Body
        doc.setFont('times', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(80, 80, 80);
        doc.text('PROUDLY PRESENTED TO', width / 2, 85, { align: 'center' });

        // Name
        doc.setFont('times', 'italic');
        doc.setFontSize(48);
        doc.setTextColor(219, 39, 119); // Brand Pink-ish
        doc.text(certData.name, width / 2, 110, { align: 'center' });

        // Underline
        doc.setDrawColor(219, 39, 119);
        doc.setLineWidth(0.5);
        doc.line((width / 2) - 60, 115, (width / 2) + 60, 115);

        // Description
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        const text = `For successfully participating in the webinar "${certData.webinar_title}".\nDemonstrating commitment to professional development and continuous learning.`;
        doc.text(text, width / 2, 135, { align: 'center', maxWidth: 200, lineHeightFactor: 1.5 });

        // Footer Signatures
        const footerY = 170;

        // Left Signature
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('KARUPPASAMY M', 40, footerY);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Computer Engineering Student', 40, footerY + 5);
        doc.text('Times Tech Pvt Ltd', 40, footerY + 10);

        // Right Date/ID
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(certData.issued_date, width - 40, footerY, { align: 'right' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('DATE ISSUED', width - 40, footerY + 5, { align: 'right' });
        doc.text(`ID: ${certData.certId}`, width - 40, footerY + 10, { align: 'right' });

        // Disclaimer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('This certificate recognizes participation in a peer-led educational webinar and does not represent professional or government accreditation.', width / 2, height - 15, { align: 'center' });

        return doc.output('blob');
    };

    const handleCreateCertificate = async (participant) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Pre-fill form data for feedback
        const currentData = {
            name: participant.name,
            email: participant.email,
            webinar_title: 'React Roadmap to Students – Webinar',
            issued_date: '2026-02-16'
        };

        try {
            // 1. Check if already exists? (Optional, skipping for speed as per user request to "force create")

            const newCertId = generateCertificateId();

            const payload = {
                certificate_id: newCertId,
                name: currentData.name,
                email: currentData.email,
                webinar_title: currentData.webinar_title,
                issued_date: currentData.issued_date,
                is_completed: true,
                conducted_by: 'KARUPPASAMY M – Computer Engineering Student | Times Tech Pvt Ltd'
            };

            // 2. Insert into DB
            const { error: dbError } = await supabase
                .from('certificates')
                .insert([payload]);

            if (dbError) throw dbError;

            // 3. Generate PDF Blob
            const pdfBlob = generatePDF({ ...currentData, certId: newCertId });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPreviewPdfUrl(pdfUrl);

            // 4. Trigger Email (Simulated with PDF Link concept)
            const emailResult = await triggerCertificateEmail({ name: currentData.name, email: currentData.email }, newCertId);

            setSuccess({
                id: newCertId,
                name: currentData.name,
                email: currentData.email,
                link: `${window.location.origin}/certificate/${newCertId}`,
                pdf: pdfUrl,
                emailStatus: emailResult.success ? 'sent' : 'failed'
            });

        } catch (err) {
            console.error('Generation Error:', err);
            setError(err.message || 'Failed to generate certificate');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        handleCreateCertificate(formData);
    };

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
                    <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
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
        <div className="min-h-screen bg-dark-bg pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="heading-lg mb-2">Certificate Manager</h1>
                    <p className="text-gray-400">Manage registrations and issue certificates.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        Registered Users
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'manual' ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        Manual Creation
                    </button>
                </div>

                {/* Success Feedback Block (Sticky/Floating) */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-left relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-500/20 p-3 rounded-full text-green-500">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Certificate Issued!</h3>
                                    <p className="text-green-200">
                                        Generated for <strong className="text-white">{success.name}</strong>.
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">ID: {success.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {success.emailStatus === 'sent' && (
                                    <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold uppercase tracking-wider">
                                        Email Sent to {success.email}
                                    </div>
                                )}
                                {success.emailStatus === 'failed' && (
                                    <div className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-bold uppercase tracking-wider">
                                        Email Failed to Send
                                    </div>
                                )}

                                <a
                                    href={success.link}
                                    target="_blank"
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-colors"
                                >
                                    View Link
                                </a>
                                {success.pdf && (
                                    <a
                                        href={success.pdf}
                                        download={`${success.name}-Certificate.pdf`}
                                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 rounded-lg text-white text-sm font-bold transition-colors flex items-center gap-2"
                                    >
                                        Download PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Content Area */}
                <div className="card-glass p-8 min-h-[400px]">

                    {activeTab === 'list' ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Participants ({participants.length})</h3>
                                <button
                                    onClick={fetchParticipants}
                                    className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Refresh List"
                                >
                                    <RefreshCcw size={18} className={loadingParticipants ? 'animate-spin' : ''} />
                                </button>
                            </div>

                            {loadingParticipants ? (
                                <div className="text-center py-12">
                                    <Loader2 className="animate-spin mx-auto text-brand-500" size={32} />
                                    <p className="text-gray-500 mt-4">Loading registered users...</p>
                                </div>
                            ) : participants.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No participants found in the database.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                                <th className="py-4 px-4">Name</th>
                                                <th className="py-4 px-4">Email</th>
                                                <th className="py-4 px-4">Phone</th>
                                                <th className="py-4 px-4">College</th>
                                                <th className="py-4 px-4">Year</th>
                                                <th className="py-4 px-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {participants.map((p) => (
                                                <tr key={p.email} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4 font-medium text-white">{p.name}</td>
                                                    <td className="py-4 px-4 text-gray-400 max-w-[150px] truncate" title={p.email}>{p.email}</td>
                                                    <td className="py-4 px-4 text-gray-400 text-sm">{p.whatsapp}</td>
                                                    <td className="py-4 px-4 text-gray-500 text-sm hidden sm:table-cell max-w-[150px] truncate">{p.college}</td>
                                                    <td className="py-4 px-4 text-gray-500 text-sm hidden md:table-cell">{p.current_year}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => handleCreateCertificate(p)}
                                                            disabled={loading}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-all text-sm font-bold"
                                                        >
                                                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                            Generate
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleManualSubmit} className="space-y-6 max-w-xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">Manual Entry</h3>
                            {/* Reusing manual form logic but simplified structure */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Participant Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g. John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="input-field"
                                        placeholder="e.g. john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Issued Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.issued_date}
                                        onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                            >
                                {loading ? 'Processing...' : 'Generate & Send'}
                            </button>
                        </form>
                    )}
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-center text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGeneratorPage;
