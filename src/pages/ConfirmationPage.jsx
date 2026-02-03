import { motion } from 'framer-motion';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Calendar, Clock, Video, ArrowRight, Download } from 'lucide-react';

const ConfirmationPage = () => {
    const location = useLocation();
    const userData = location.state?.userData;

    if (!userData) {
        return <Navigate to="/" replace />;
    }

    const whatsappGroupLink = 'https://chat.whatsapp.com/F0DRqAYW7mR5mZIAID3FeK?mode=gi_c';

    return (
        <div className="min-h-screen pt-32 pb-20 bg-dark-bg relative overflow-hidden">
            {/* Confetti / Celebration placeholder - gradient blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-brand-500/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-green-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="layout-container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-500/40">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="heading-lg mb-4">Registration Confirmed!</h1>
                    <p className="text-gray-400 text-lg mb-12">
                        Welcome to the cohort, <span className="text-white font-bold">{userData.name}</span>.
                        We've sent a ticket to <span className="text-brand-400">{userData.email}</span>.
                    </p>

                    <div className="card-glass text-left p-8 md:p-10 mb-8 border-brand-500/30">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 mb-8">
                            <div>
                                <p className="text-sm font-bold text-brand-400 uppercase tracking-wider mb-2">Webinar Event</p>
                                <h2 className="text-2xl font-bold font-heading text-white">Advanced React Patterns</h2>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm text-gray-500">Ticket ID</p>
                                <p className="font-mono text-white">#AB-{Math.floor(Math.random() * 10000)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center gap-3 text-gray-400 mb-2">
                                    <Calendar size={18} /> <span className="text-sm uppercase font-bold">Date</span>
                                </div>
                                <p className="text-lg font-bold text-white">Feb 16, 2026</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-400 mb-2">
                                    <Clock size={18} /> <span className="text-sm uppercase font-bold">Time</span>
                                </div>
                                <p className="text-lg font-bold text-white">7:00 PM IST</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 text-gray-400 mb-2">
                                    <Video size={18} /> <span className="text-sm uppercase font-bold">Platform</span>
                                </div>
                                <p className="text-lg font-bold text-white">Google Meet</p>
                            </div>
                        </div>
                    </div>

                    {/* Mentor Info */}
                    <div className="card-glass p-6 mb-8 text-left flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-2xl">M</div>
                        <div>
                            <p className="text-gray-400 text-sm">Your Mentor</p>
                            <h3 className="text-xl font-bold text-white">Mani</h3>
                            <a href="https://ks02.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-brand-300 hover:underline mt-1 inline-block">
                                View Portfolio (ks02.vercel.app)
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href={whatsappGroupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] shadow-[0_0_20px_rgba(37,211,102,0.3)] border-transparent"
                        >
                            <MessageCircle size={20} />
                            Join WhatsApp Group
                        </a>
                        <Link to="/" className="btn-outline flex items-center gap-2">
                            Return to Home <ArrowRight size={20} />
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">
                        * Please check your spam folder if you don't see the email within 5 minutes.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
