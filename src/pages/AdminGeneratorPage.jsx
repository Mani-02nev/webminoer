import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, User, Mail, Calendar, FileText, CheckCircle, Loader2, AlertCircle, RefreshCcw, Send, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateCertificatePDF } from '../utils/generateCertificate'; // Imported utility
import { triggerCertificateEmail, triggerRegistrationEmail } from '../utils/emailTrigger';

const AdminGeneratorPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'manual'
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [attendanceList, setAttendanceList] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);
    const [sendingBulk, setSendingBulk] = useState(false);
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });

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
        if (isAuthenticated) {
            if (activeTab === 'list') fetchParticipants();
            if (activeTab === 'attendance') fetchAttendance();
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

    // Fetch Attendance
    const fetchAttendance = async () => {
        setLoadingAttendance(true);
        try {
            const { data, error } = await supabase
                .from('attendance')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setAttendanceList(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingAttendance(false);
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

    const [sendEmailOnGenerate, setSendEmailOnGenerate] = useState(true);

    // BULK SEND CERTIFICATES
    const handleBulkSendCertificates = async () => {
        if (!confirm(`This will generate and email certificates to ALL ${attendanceList.length} attendees. Are you sure?`)) return;

        setSendingBulk(true);
        setBulkProgress({ current: 0, total: attendanceList.length, success: 0, failed: 0 });
        let s = 0;
        let f = 0;

        for (let i = 0; i < attendanceList.length; i++) {
            const attendee = attendanceList[i];
            setBulkProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                // Reuse the creation logic but ensure email is SENT
                await handleCreateCertificate(attendee, true); // Force email True
                s++;
            } catch (e) {
                console.error("Bulk Error for " + attendee.email, e);
                f++;
            }

            // Small delay to prevent rate limits
            await new Promise(r => setTimeout(r, 500));
        }

        setBulkProgress(prev => ({ ...prev, success: s, failed: f }));
        setSendingBulk(false);
        alert(`Bulk Process Complete!\nSuccess: ${s}\nFailed: ${f}`);
    };

    // 1. Resend Registration Email (Manual)
    const handleResendRegistration = async (participant) => {
        if (!confirm(`Resend Registration Confirmation to ${participant.name}?`)) return;
        setLoading(true);
        try {
            const result = await triggerRegistrationEmail({ name: participant.name, email: participant.email });
            if (result.success) alert("Registration email sent successfully!");
            else alert("Failed to send email. Check console.");
        } catch (e) {
            console.error(e);
            alert("Error sending email");
        } finally {
            setLoading(false);
        }
    };

    // 2. Resend Certificate Email (Manual from Success Block)
    const handleManualResendCertificate = async () => {
        if (!success || !success.id) return;
        setLoading(true);
        try {
            // 4. Trigger Email
            const emailResult = await triggerCertificateEmail({ name: success.name, email: success.email }, success.id);

            setSuccess(prev => ({
                ...prev,
                emailStatus: emailResult.success ? 'sent' : 'failed'
            }));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCertificate = async (participant, forceEmail = false) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Pre-fill form data for feedback
        const currentData = {
            name: participant.name,
            email: participant.email,
            webinar_title: 'React Roadmap to Students – Webinar',
            issued_date: '2026-02-15'
        };

        try {
            // 1. Check if certificate already exists (avoid duplicates in bulk)
            const { data: existing } = await supabase
                .from('certificates')
                .select('certificate_id')
                .eq('email', currentData.email)
                .single();

            let newCertId;
            let emailResult = { success: false, skipped: true };

            if (existing) {
                newCertId = existing.certificate_id;
                console.log("Certificate exists, skipping creation:", newCertId);

                // If it exists, but we are Forcing Email (Bulk or Manual), send it again
                if (forceEmail || sendEmailOnGenerate) {
                    emailResult = await triggerCertificateEmail({ name: currentData.name, email: currentData.email }, newCertId);
                }
            } else {
                newCertId = generateCertificateId();
                const payload = {
                    certificate_id: newCertId,
                    name: currentData.name,
                    email: currentData.email,
                    webinar_title: currentData.webinar_title,
                    issued_date: currentData.issued_date,
                    is_completed: true,
                    conducted_by: 'KARUPPASAMY M – Computer Engineering Student | Time\'s Tech Learning Platform'
                };

                const { error: dbError } = await supabase.from('certificates').insert([payload]);
                if (dbError) throw dbError;

                // Send Email?
                if (forceEmail || sendEmailOnGenerate) {
                    emailResult = await triggerCertificateEmail({ name: currentData.name, email: currentData.email }, newCertId);
                }
            }

            // 3. Generate PDF Blob using the new utility
            const pdfBlob = generateCertificatePDF({
                ...currentData,
                certificate_id: newCertId
            });

            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPreviewPdfUrl(pdfUrl);

            setSuccess({
                id: newCertId,
                name: currentData.name,
                email: currentData.email,
                link: `${window.location.origin}/certificate/${newCertId}`,
                pdf: pdfUrl,
                emailStatus: emailResult.skipped ? 'skipped' : (emailResult.success ? 'sent' : 'failed')
            });

        } catch (err) {
            console.error('Generation Error:', err);
            // Don't set global error in bulk mode to avoid blocking UI
            if (!forceEmail) setError(err.message || 'Failed to generate certificate');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        handleCreateCertificate(formData, sendEmailOnGenerate);
    };

    if (!isAuthenticated) return (<div className="min-h-screen bg-dark-bg flex items-center justify-center px-6"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-glass p-8 max-w-md w-full text-center"><div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={32} /></div><h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2><p className="text-gray-400 mb-8">Enter administrator password to continue.</p><form onSubmit={handleLogin} className="space-y-4"><input type="password" className="input-field text-center tracking-widest" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />{authError && <p className="text-red-400 text-sm">{authError}</p>}<button type="submit" className="btn-primary w-full">Access System <Unlock size={16} className="ml-2" /></button></form></motion.div></div>);


    return (
        <div className="min-h-screen bg-dark-bg pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="heading-lg mb-2">Certificate Manager</h1>
                    <p className="text-gray-400">Manage registrations, attendance, and certificates.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    {['list', 'attendance', 'manual'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {tab === 'list' ? 'Registered Users' : tab}
                        </button>
                    ))}
                </div>

                {/* Success Feedback Block */}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-left relative overflow-hidden"><div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"><div className="flex items-start gap-4"><div className="bg-green-500/20 p-3 rounded-full text-green-500"><CheckCircle size={24} /></div><div><h3 className="text-xl font-bold text-white">Processed: {success.name}</h3><p className="text-green-200 text-sm">{success.email}</p></div></div><div className="flex items-center gap-3">{success.emailStatus === 'sent' && <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-bold uppercase tracking-wider">Email Sent</div>}{success.emailStatus === 'failed' && <div className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-bold uppercase tracking-wider">Email Failed</div>}{success.emailStatus === 'skipped' && <button onClick={handleManualResendCertificate} className="px-3 py-1 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors text-xs rounded-full font-bold uppercase tracking-wider flex items-center gap-1"><Mail size={12} /> Send Email Now</button>}<a href={success.pdf} download={`${success.name}-Certificate.pdf`} className="px-4 py-2 bg-brand-500 hover:bg-brand-600 rounded-lg text-white text-sm font-bold transition-colors flex items-center gap-2">Download PDF</a></div></div></motion.div>
                )}

                {/* Bulk Progress */}
                {sendingBulk && (
                    <div className="mb-8 p-6 card-glass animate-pulse border-brand-500/50">
                        <h3 className="text-lg font-bold text-white mb-2">Processing Bulk Certificates...</h3>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}></div>
                        </div>
                        <p className="text-sm text-gray-400">Processing {bulkProgress.current} of {bulkProgress.total} (Success: {bulkProgress.success}, Failed: {bulkProgress.failed})</p>
                    </div>
                )}


                {/* Content Area */}
                <div className="card-glass p-8 min-h-[400px]">

                    {activeTab === 'list' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-4">
                                <h3 className="text-xl font-bold text-white">Participants ({participants.length})</h3>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={sendEmailOnGenerate}
                                            onChange={(e) => setSendEmailOnGenerate(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-500 text-brand-500 focus:ring-brand-500 focus:ring-offset-dark-bg"
                                        />
                                        <span className="text-sm text-gray-300 select-none">Auto-send Certificate Email</span>
                                    </label>

                                    <button
                                        onClick={fetchParticipants}
                                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        title="Refresh List"
                                    >
                                        <RefreshCcw size={18} className={loadingParticipants ? 'animate-spin' : ''} />
                                    </button>
                                </div>
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
                                                <th className="py-4 px-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {participants.map((p) => (
                                                <tr key={p.email} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4 font-medium text-white">{p.name}</td>
                                                    <td className="py-4 px-4 text-gray-400 max-w-[150px] truncate" title={p.email}>{p.email}</td>
                                                    <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleResendRegistration(p)}
                                                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold"
                                                            title="Resend Registration Confirmation Email"
                                                        >
                                                            <Mail size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCreateCertificate(p, sendEmailOnGenerate)}
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
                    )}

                    {activeTab === 'attendance' && (
                        /* NEW: Attendance List */
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-4">
                                <h3 className="text-xl font-bold text-white">Attendance ({attendanceList.length})</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleBulkSendCertificates}
                                        disabled={sendingBulk || attendanceList.length === 0}
                                        className="btn-primary px-4 py-2 flex items-center gap-2 text-sm"
                                    >
                                        <Send size={16} /> Send Certificates to ALL
                                    </button>
                                    <button onClick={fetchAttendance} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><RefreshCcw size={18} /></button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider"><th className="py-4 px-4">Name</th><th className="py-4 px-4">Email</th><th className="py-4 px-4">Rating</th><th className="py-4 px-4">Feedback</th><th className="py-4 px-4 text-right">Action</th></tr></thead>
                                    <tbody className="divide-y divide-white/5">
                                        {attendanceList.map((p) => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 font-medium text-white">{p.name}</td>
                                                <td className="py-4 px-4 text-gray-400">{p.email}</td>
                                                <td className="py-4 px-4 text-yellow-500 flex gap-1">{[...Array(p.rating || 0)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</td>
                                                <td className="py-4 px-4 text-gray-500 text-sm max-w-[200px] truncate">{p.feedback}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button onClick={() => handleCreateCertificate(p, true)} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white text-sm font-bold">Send Cert</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'manual' && (
                        /* Manual Form (Existing) */
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
