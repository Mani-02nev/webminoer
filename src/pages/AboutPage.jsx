import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Zap, Database, Server, PenTool, Layout, CheckCircle2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
    const curriculum = [
        {
            icon: Layers,
            title: 'React Fundamentals',
            description: 'Deep dive into Virtual DOM, Reconciliation, and Component Lifecycle.',
        },
        {
            icon: PenTool,
            title: 'Modern UI Systems',
            description: 'Architecture scalable design systems with Tailwind CSS.',
        },
        {
            icon: Zap,
            title: 'Advanced State',
            description: 'Mastering Context API, Reducers, and custom hooks.',
        },
        {
            icon: Database,
            title: 'Data Integration',
            description: 'Robust API handling, optimistic updates, and caching.',
        },
        {
            icon: Server,
            title: 'Production Deployment',
            description: 'CI/CD pipelines, Vercel deployment, and monitoring.',
        },
        {
            icon: Layout,
            title: 'Project Architecture',
            description: 'Folder structure and patterns for large-scale apps.',
        },
    ];

    const projects = [
        'Enterprise Dashboard with Recharts',
        'SaaS Landing Page with Framer Motion',
        'Full-featured E-commerce Platform',
        'Real-time Chat Application',
        'Task Management System (Kanban)',
        'Content Management System (CMS)',
        'Authentication System & Dashboard',
        'Social Media Feed with Infinite Scroll',
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            <div className="layout-container">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="space-y-24"
                >
                    {/* Header */}
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <motion.h1 variants={fadeInUp} className="heading-xl">
                            Curriculum & <br />
                            <span className="text-brand-600">Program Structure</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-body-lg">
                            We don't teach syntax; we teach engineering. This program is designed to bridge the gap between documentation and real-world application.
                        </motion.p>
                    </div>

                    {/* Core Curriculum Grid */}
                    <motion.div variants={fadeInUp} className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
                            <h2 className="heading-lg text-2xl">Core Modules</h2>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {curriculum.map((item, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-300 group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                        <item.icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Outcome Projects */}
                    <motion.div variants={fadeInUp} className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
                            <h2 className="heading-lg text-2xl">Portfolio Outcomes</h2>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <p className="text-body-lg">
                                    You will build 20+ applications, ranging from simple utilities to complex systems.
                                    By the end, you'll have 8 distinct "Hero Projects" for your portfolio.
                                </p>
                                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {projects.map((project, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm font-medium">{project}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 flex flex-col justify-center items-center text-center space-y-6 border border-gray-200 rounded-xl shadow-sm">
                                <h3 className="text-2xl font-bold text-gray-900">Ready to Engineer?</h3>
                                <p className="text-gray-600">
                                    Stop watching tutorials. Start writing code that ships.
                                </p>
                                <Link to="/register" className="btn-primary w-full sm:w-auto hover:shadow-lg hover:shadow-brand-500/20">
                                    Secure Your Spot
                                    <ArrowRight className="ml-2 w-4 h-4 ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
