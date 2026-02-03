import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ShieldCheck, ExternalLink, Loader2, CheckCircle, Download, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateCertificatePDF } from '../utils/generateCertificate';
import { REACT_LOGO_BASE64 } from '../assets/logoBase64'; // Use same source

const CertificatePreviewPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const autoDownload = searchParams.get('download') === 'true';

    const [certificateData, setCertificateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    // DEMO DATA Fallback (without certificate ID to prevent confusion)
    const DEMO_DATA = {
        name: "Your Name",
        webinar_title: "React Roadmap to Students – Webinar",
        issued_date: new Date().toISOString(),
        certificate_id: "", // Empty for demo mode
        is_completed: true
    };

    // Data Loading
    useEffect(() => {
        const fetchCertificate = async () => {
            if (!id || id === 'demo') {
                setCertificateData(DEMO_DATA);
                setIsDemo(true);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('certificate_id', id)
                    .single();

                if (error || !data) {
                    setCertificateData(DEMO_DATA);
                    setIsDemo(true);
                } else if (!data.is_completed) {
                    setCertificateData(DEMO_DATA);
                    setIsDemo(true);
                } else {
                    setCertificateData(data);
                    setIsDemo(false);
                }
            } catch (err) {
                console.error("Error fetching certificate:", err);
                setCertificateData(DEMO_DATA);
                setIsDemo(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
    }, [id]);

    // Derived Data
    const webinarTitle = certificateData?.webinar_title || DEMO_DATA.webinar_title;
    const certificateId = certificateData?.certificate_id || DEMO_DATA.certificate_id;
    const dateIssued = certificateData?.issued_date
        ? new Date(certificateData.issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : "16 Feb 2026";
    const displayName = certificateData?.name || DEMO_DATA.name;

    // Auto-Download Effect
    useEffect(() => {
        if (autoDownload && !isDemo && certificateData && !loading) {
            handleDownload();
        }
    }, [autoDownload, isDemo, certificateData, loading]);

    // Downloader
    const handleDownload = async () => {
        if (!certificateData || isDemo) return;

        setGeneratingPdf(true);
        setTimeout(async () => {
            try {
                const pdfBlob = await generateCertificatePDF(certificateData);
                const url = window.URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${certificateData.name.replace(/\s+/g, '_')}_Certificate.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (e) {
                console.error("PDF Gen Error", e);
                alert("Failed to generate PDF");
            } finally {
                setGeneratingPdf(false);
            }
        }, 10);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
            <Loader2 className="animate-spin mr-2" /> Loading Certificate...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center font-sans relative overflow-x-hidden p-6 pb-24">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] -z-10"></div>

            {/* Navbar (Clean) */}
            <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
                <Link to="/" className="text-xl font-bold tracking-tight text-white pointer-events-auto opacity-70 hover:opacity-100 transition">
                    Time's Tech
                </Link>
            </div>

            {/* PREVIEW CONTAINER - Responsive */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[900px] lg:max-w-[1000px] aspect-[1.414/1] bg-white text-slate-800 shadow-2xl shadow-black/50 rounded-lg overflow-hidden border border-gray-200 mt-16 p-4 sm:p-6 md:p-12 lg:p-16"
                style={{ fontFamily: 'Helvetica, sans-serif' }}
            >
                {/* --- WATERMARK (Center PNG) --- */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="Watermark" className="w-[40%] h-auto animate-[spin_60s_linear_infinite]" />
                </div>

                {/* --- CONTENT LAYER --- */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between">

                    {/* Header Row */}
                    <div className="flex justify-between items-start w-full">
                        {/* Title Block (Left) */}
                        <div className="text-left w-2/3">
                            <h1 className="text-5xl md:text-[56px] font-serif font-bold text-[#0F172A] leading-tight">CERTIFICATE</h1>
                            <p className="text-xs md:text-sm text-pink-500 font-sans tracking-[0.3em] font-semibold mt-2 uppercase">Of Participation</p>
                            {/* Line */}
                            <div className="w-[85%] h-px bg-pink-500 mt-6 opacity-40"></div>
                        </div>

                        {/* Top Right Logo (Right) */}
                        <div className="w-[75px] h-[75px] flex justify-end items-start -mt-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" alt="React Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>


                    {/* Body Row (Center) */}
                    <div className="flex flex-col items-center justify-center flex-1 -mt-4">
                        <p className="text-slate-500 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase mb-8">Proudly Presented To</p>

                        <h2 className="text-5xl md:text-[64px] font-serif italic text-[#0F172A] mb-8 text-center leading-none">
                            {displayName}
                        </h2>

                        <div className="text-center space-y-3">
                            <p className="text-slate-500 text-sm md:text-base">For successfully participating in the webinar</p>
                            <h3 className="text-xl md:text-2xl font-bold text-pink-500 tracking-wide">{webinarTitle}</h3>
                        </div>
                    </div>


                    {/* Footer Row (Bottom) */}
                    <div className="flex justify-between items-end pt-4 mb-2">
                        {/* Left */}
                        <div className="text-left">
                            <p className="text-[#0F172A] font-bold text-sm md:text-[13px] uppercase tracking-wide">KARUPPASAMY M</p>
                            <p className="text-slate-500 text-[9px] md:text-[9px] font-bold uppercase tracking-wider mt-1">– Computer Engineering Student</p>
                            <p className="text-slate-600 text-xs mt-1 font-medium">Time’s Tech Learning Platform</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">(Student Learning Initiative)</p>
                        </div>

                        {/* Right */}
                        <div className="text-right">
                            <p className="text-[#0F172A] font-bold text-sm md:text-[14px]">{dateIssued}</p>
                            <p className="text-slate-500 text-[9px] md:text-[9px] font-bold uppercase tracking-wider mt-1">DATE ISSUED</p>
                            <p className="text-slate-400 text-[10px] font-mono mt-1 tracking-wider">ID: {certificateId}</p>
                        </div>
                    </div>

                    {/* Disclaimer Row */}
                    <div className="w-full text-center border-t border-transparent pt-0 text-[8px] text-gray-300">
                        This certificate recognizes participation in a peer-led educational webinar and does not represent professional or government accreditation.
                    </div>
                </div>

            </motion.div>

            {/* --- BOTTOM ACTION AREA --- */}
            <div className="mt-12 w-full flex justify-center">
                {isDemo && (
                    <div className="text-center">
                        <p className="text-gray-400 mb-2">This is a preview. Only verified participants can download their certificate.</p>
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
                            <ShieldCheck size={16} /> Certificate Preview
                        </div>
                    </div>
                )}

                {!isDemo && (
                    <button
                        onClick={handleDownload}
                        disabled={generatingPdf}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-bold shadow-2xl shadow-indigo-500/40 transition-all transform hover:scale-105 flex items-center gap-3 text-lg"
                    >
                        {generatingPdf ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                        {generatingPdf ? "Generating PDF..." : "Download Certificate PDF"}
                    </button>
                )}
            </div>

        </div>
    );
};

export default CertificatePreviewPage;
