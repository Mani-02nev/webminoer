import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Code, Video, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgramsPage = () => {
    const programs = [
        {
            title: "AI + Web Development - Live AI Chatbot Build Webinar",
            date: "Mar 22, 2026",
            status: "Current",
            type: "Webinar",
            desc: "Learn to build a live AI chatbot from scratch and mastering Web Development alongside.",
            icon: Code,
            link: "/register",
            active: true
        },
        {
            title: "Roadmap to React Webinar",
            date: "Feb 15, 2026",
            status: "Completed",
            type: "Webinar",
            desc: "The ultimate guide to mastering React in 2026. Covers hooks, patterns, and performance.",
            icon: Zap,
            link: "#",
            active: false
        },
        {
            title: "Frontend Career Guidance",
            date: "Jan 28, 2026",
            status: "Completed",
            type: "Mentorship",
            desc: "How to crack top product-based companies as a Frontend Engineer.",
            icon: Users,
            link: "#",
            active: false
        },
        {
            title: "No-Code IT Placement",
            date: "Dec 10, 2025",
            status: "Completed",
            type: "Webinar",
            desc: "Break into IT without writing complex code. Low-code/No-code revolution.",
            icon: Video,
            link: "#",
            active: false
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-dark-bg">
            <div className="layout-container">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="heading-lg">Available Programs</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Choose the right path for your career. From free webinars to intensive masterclasses.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`card-glass p-8 relative overflow-hidden group ${!program.active ? 'opacity-70' : ''}`}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-6 right-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${program.status === 'Current' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                                    program.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                    {program.status}
                                </span>
                            </div>

                            <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:bg-brand-500 group-hover:scale-110 transition-all duration-300`}>
                                <program.icon size={28} />
                            </div>

                            <h3 className="text-2xl font-heading font-bold text-white mb-2">{program.title}</h3>
                            <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm font-medium">
                                <Calendar size={14} />
                                <span>{program.date}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>{program.type}</span>
                            </div>

                            <p className="text-gray-400 mb-8 leading-relaxed">
                                {program.desc}
                            </p>

                            {program.active ? (
                                <Link to={program.link} className="btn-primary w-full shadow-none">
                                    Register Now
                                </Link>
                            ) : (
                                <button disabled className="btn-outline w-full opacity-50 cursor-not-allowed">
                                    {program.status}
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgramsPage;
