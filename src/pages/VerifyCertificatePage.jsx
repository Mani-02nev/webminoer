import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, ShieldCheck, Loader2, Calendar, User, Award, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const VerifyCertificatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management
    const [searchId, setSearchId] = useState(id || '');
    const [status, setStatus] = useState('idle'); // idle, loading, valid, invalid
    const [certificate, setCertificate] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (id) {
            setSearchId(id);
            verifyCertificate(id);
        } else {
            setStatus('idle');
            setCertificate(null);
        }
    }, [id]);

    const verifyCertificate = async (certId) => {
        if (!certId) return;

        setStatus('loading');
        setCertificate(null);
        setErrorMsg('');

        try {
            // Using logic: Check 'certificates' table as requested
            // Matching certificate_id column
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('certificate_id', certId.trim())
                .maybeSingle();

            if (error) {
                console.error('Supabase error:', error);
                setStatus('invalid');
                setErrorMsg('System error during verification.');
                return;
            }

            if (!data) {
                setStatus('invalid');
                setErrorMsg('Certificate not found.');
                return;
            }

            if (!data.is_completed) {
                setStatus('invalid');
                setErrorMsg('Certificate is pending issuance.');
                return;
            }

            setStatus('valid');
            setCertificate(data);

        } catch (err) {
            console.error('Verification error:', err);
            setStatus('invalid');
            setErrorMsg('An unexpected error occurred.');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/verify/${searchId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg pt-32 pb-20 px-6 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-xl mx-auto relative z-10">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <ShieldCheck size={14} /> Official Verification Portal
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                        Verify Certificate
                    </h1>
                    <p className="text-gray-400">
                        Enter a unique certificate ID to validate its authenticity.
                    </p>
                </div>

                {/* Search Box */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="card-glass p-2 mb-8"
                >
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter Certificate ID (e.g., TT-REACT-2026-001)"
                                className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none placeholder-gray-600 font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="btn-primary py-3 sm:py-0 px-8 rounded-xl flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Verify Now'}
                        </button>
                    </form>
                </motion.div>

                {/* Results Section */}
                <div className="min-h-[300px]">
                    {status === 'loading' && (
                        <div className="text-center py-12">
                            <Loader2 size={40} className="text-brand-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">Searching global registry...</p>
                        </div>
                    )}

                    {status === 'invalid' && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Verification Failed</h3>
                            <p className="text-red-200/80 mb-6">{errorMsg || "Certificate not found or invalid."}</p>
                            <p className="text-xs text-gray-500">
                                Please check the ID and try again, or contact support if you believe this is an error.
                            </p>
                        </motion.div>
                    )}

                    {status === 'valid' && certificate && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#0A0A0A] border border-green-500/30 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(34,197,94,0.1)]"
                        >
                            {/* Success Banner */}
                            <div className="bg-green-500/10 border-b border-green-500/20 p-4 flex items-center justify-center gap-2 text-green-500">
                                <CheckCircle size={20} />
                                <span className="font-bold text-sm uppercase tracking-wide">Certificate Verified</span>
                            </div>

                            <div className="p-8 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-serif text-white italic mb-2">{certificate.name}</h2>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                                        <User size={14} /> Verified Recipient
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="mt-1 text-brand-400">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Webinar</p>
                                            <p className="text-white font-medium">{certificate.webinar_title}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="mt-1 text-brand-400">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Cert ID</p>
                                                <p className="text-white font-mono text-sm">{certificate.certificate_id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="mt-1 text-brand-400">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Issued</p>
                                                <p className="text-white text-sm">
                                                    {certificate.issued_date ? new Date(certificate.issued_date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">Conducted By</p>
                                    <p className="text-white text-sm leading-relaxed text-gray-300">
                                        {certificate.conducted_by || "KARUPPASAMY M – Computer Engineering Student | Tech Stack Pvt Ltd"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Return Link */}
                <div className="text-center mt-12">
                    <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                        Back to Home <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificatePage;
