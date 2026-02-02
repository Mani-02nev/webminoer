import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ShieldCheck, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CertificatePreviewPage = () => {
    const { id } = useParams();
    const [participantName, setParticipantName] = useState('Your Name'); // Default for demo
    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);

    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

    useEffect(() => {
        if (id) {
            const fetchCertificate = async () => {
                try {
                    const { data, error } = await supabase
                        .from('certificates')
                        .select('*')
                        .eq('certificate_id', id)
                        .single();

                    if (error) throw error;

                    if (!data) {
                        setError('Certificate not found');
                    } else if (!data.is_completed) {
                        setError('Certificate is not yet issued');
                    } else {
                        setCertificateData(data);
                        setParticipantName(data.name);
                    }
                } catch (err) {
                    console.error('Error fetching certificate:', err);
                    setError('Unable to load certificate');
                } finally {
                    setLoading(false);
                }
            };
            fetchCertificate();
        }
    }, [id]);

    const webinarTitle = certificateData?.webinar_title || "React Roadmap to Students – Webinar";
    const dateIssued = "Feb 16, 2026"; // Hardcoded as per user request
    const certificateId = certificateData?.certificate_id || "DEMO-1234-5678";

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center">
                <Loader2 size={48} className="text-brand-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading certificate...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Unavailable</h1>
                <p className="text-gray-400 max-w-md">{error}</p>
                <Link to="/" className="mt-8 btn-outline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg pt-28 pb-20 overflow-hidden relative">

            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="layout-container relative z-10">

                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-300 text-xs font-bold uppercase tracking-wider mx-auto">
                        <Award size={14} /> Official Document
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Certificate Card */}
                    <motion.div
                        style={{ scale, opacity }}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Glow behind card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 blur-xl transform scale-[1.02] rounded-xl" />

                        {/* Main Card Content */}
                        {/* Main Card Content */}
                        <div className="relative bg-white text-black p-6 md:p-16 rounded-xl shadow-2xl md:aspect-[1.414/1] w-full flex flex-col items-center text-center justify-between border-8 md:border-[12px] border-double border-gray-100 overflow-hidden">

                            {/* Watermark / Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
                                <span className="text-[15vw] font-bold rotate-[-15deg] whitespace-nowrap">CERTIFIED</span>
                            </div>

                            {/* Top Header */}
                            <div className="w-full relative z-10 shrink-0">
                                <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-brand-500/30 pb-4 md:pb-6 mb-2">
                                    <div className="text-center md:text-left w-full md:w-auto">
                                        <h2 className="text-3xl md:text-5xl font-serif font-black tracking-wide text-gray-900">CERTIFICATE</h2>
                                        <p className="text-xs md:text-base text-brand-600 tracking-[0.2em] md:tracking-[0.4em] font-bold uppercase mt-1 md:mt-2">Of Participation</p>
                                    </div>
                                    <div className="hidden md:flex w-20 h-20 bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-full items-center justify-center shadow-lg">
                                        <Award size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Main Body */}
                            <div className="flex-1 flex flex-col justify-center items-center py-6 md:py-8 z-10 w-full min-h-[160px]">
                                <p className="text-gray-500 uppercase tracking-widest text-[10px] md:text-sm font-semibold mb-4 md:mb-6">Proudly Presented To</p>

                                <h3 className="text-2xl md:text-5xl lg:text-6xl font-serif italic text-black mb-6 md:mb-8 px-2 break-words max-w-full relative">
                                    <span className="relative z-10 px-2 leading-tight block">{participantName}</span>
                                    {/* Name underline decoration */}
                                    <span className="absolute bottom-1 left-0 w-full h-2 md:h-3 bg-brand-200/50 -z-0 -rotate-1"></span>
                                </h3>

                                <p className="max-w-xl mx-auto text-gray-600 leading-relaxed text-sm md:text-lg px-2">
                                    For successfully participating in the webinar
                                    <br className="hidden md:block" />
                                    <span className="md:hidden"> </span>
                                    <strong className="text-brand-700 block text-base md:text-xl mt-1 md:mt-2">{webinarTitle}</strong>
                                </p>
                            </div>

                            {/* Footer Section */}
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-gray-200 relative z-10 shrink-0">
                                <div className="text-center md:text-left space-y-1">
                                    <p className="text-gray-900 font-bold text-sm md:text-lg font-heading">KARUPPASAMY M</p>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-semibold uppercase tracking-wider">– Computer Engineering Student</p>
                                    <p className="text-[10px] md:text-xs text-gray-400 font-medium">Times Tech Pvt Ltd</p>
                                </div>

                                <div className="text-center md:text-right flex flex-col items-center md:items-end justify-center">
                                    <p className="text-gray-900 font-bold text-base md:text-lg">{dateIssued}</p>
                                    <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Date Issued</p>
                                    <p className="text-[10px] text-gray-400 mt-1 md:mt-2 font-mono">ID: {certificateId}</p>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-4 md:absolute md:bottom-2 md:left-0 w-full text-center">
                                <p className="text-[8px] md:text-[10px] text-gray-400 px-4">
                                    This certificate recognizes participation in a peer-led educational webinar and does not represent professional or government accreditation.
                                </p>
                            </div>

                        </div>
                    </motion.div>

                    {/* Actions Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        {/* Verify Link - Highlighted */}
                        <div className="card-glass p-6 flex flex-col md:flex-row items-center justify-between gap-4 group hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white">Verify Authenticity</h4>
                                    <p className="text-xs text-gray-400">Check certificate validity online</p>
                                </div>
                            </div>
                            <Link
                                to={`/verify/${certificateId}`}
                                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                            >
                                Verify Now <ExternalLink size={14} />
                            </Link>
                        </div>

                        {/* Share / Info */}
                        <div className="card-glass p-6 flex items-center justify-between gap-4 text-left">
                            <div>
                                <h4 className="font-bold text-white mb-1">Share Achievement</h4>
                                <p className="text-xs text-gray-400">
                                    Copy the URL to share your verified certificate with others.
                                </p>
                            </div>
                        </div>
                    </div>

                    {!id && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm bg-yellow-500/10 inline-block px-4 py-2 rounded-lg border border-yellow-500/20 text-yellow-500">
                                Preview Mode: You are viewing a demo layout. Real certificates will fetch participant data.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificatePreviewPage;
