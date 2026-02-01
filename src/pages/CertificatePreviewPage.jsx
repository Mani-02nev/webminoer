import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, Award, ShieldCheck } from 'lucide-react';

const CertificatePreviewPage = () => {
    const [name, setName] = useState('John Doe');
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);

    return (
        <div className="min-h-screen bg-dark-bg pt-32 pb-20 overflow-hidden">

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="layout-container relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-300 text-xs font-bold uppercase tracking-wider mx-auto">
                        <Award size={14} /> Official Credential
                    </div>
                    <h1 className="heading-lg">Your Verification</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Preview how your certificate will legally appear. This credential is blockchain-verified and ISO compliant.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        <div className="card-glass p-8 space-y-6">
                            <h3 className="text-xl font-bold font-heading">Personalize</h3>

                            <div className="space-y-4">
                                <label className="text-sm text-gray-400 font-medium">Participant Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter full name"
                                />
                                <p className="text-xs text-brand-400 italic">
                                    * Name will appear exactly as typed.
                                </p>
                            </div>
                        </div>

                        <div className="card-glass p-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Verified</h4>
                                    <p className="text-xs text-gray-500">Cryptographically signed</p>
                                </div>
                            </div>
                            <div className="h-px bg-white/10 w-full" />
                            <button className="btn-primary w-full flex items-center gap-2 justify-center shadow-none hover:shadow-lg">
                                <Download size={18} />
                                Download PDF Sample
                            </button>
                        </div>
                    </motion.div>

                    {/* Certificate Preview */}
                    <motion.div
                        style={{ scale, opacity }}
                        className="lg:col-span-8 flex justify-center perspective-1000"
                    >
                        <motion.div
                            initial={{ rotateX: 10 }}
                            whileHover={{ rotateX: 0, scale: 1.02 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white text-black p-12 md:p-16 rounded-xl shadow-2xl relative w-full aspect-[1.414/1] flex flex-col items-center text-center justify-between border-8 border-double border-brand-900/10"
                        >
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <span className="text-[200px] font-bold">REACT</span>
                            </div>

                            {/* Header */}
                            <div className="space-y-6 w-full">
                                <div className="flex justify-between items-start w-full border-b-2 border-brand-500 pb-6">
                                    <div className="text-left">
                                        <h2 className="text-4xl font-serif font-black tracking-wide text-brand-900">CERTIFICATE</h2>
                                        <p className="text-sm text-brand-600 tracking-[0.3em] font-bold uppercase mt-1">Of Excellence</p>
                                    </div>
                                    <div className="w-16 h-16 bg-brand-900 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                                        N
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="py-12 space-y-6 flex-1 flex flex-col justify-center">
                                <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold">This guarantees that</p>
                                <h3 className="text-4xl md:text-5xl font-serif italic text-black min-h-[60px]">
                                    {name || "Your Name"}
                                </h3>
                                <p className="max-w-xl mx-auto text-gray-600 leading-relaxed">
                                    Has successfully demonstrated mastery in <strong className="text-brand-700">Advanced React Architecture</strong> by completing the intensive neo-tech engineering program.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="w-full grid grid-cols-2 pt-8 border-t border-gray-200">
                                <div className="text-left">
                                    <p className="text-brand-900 font-bold text-lg font-heading">KS Design</p>
                                    <p className="text-xs text-brand-500 font-bold uppercase tracking-wider mt-1">Lead Instructor</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-900 font-bold text-lg">Feb 15, 2026</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Date Issued</p>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreviewPage;
