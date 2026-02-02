import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Trophy, Users, Star } from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';
import CountdownTimer from '../components/CountdownTimer';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen bg-dark-bg text-white overflow-hidden">
            <AmbientBackground />

            {/* HERO SECTION */}
            <section className="relative z-10 pt-40 pb-32">
                <div className="layout-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-semibold tracking-wide uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                            Live Global Session
                        </div>

                        <h1 className="heading-xl">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">React Roadmap</span> Webinar
                        </h1>

                        <p className="text-body-lg text-gray-400 max-w-xl">
                            Join the elite developer network. Build enterprise-grade applications with advanced patterns, performance optimization, and scalable architecture.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="btn-primary group">
                                <span className="relative z-10 flex items-center gap-2">
                                    Reserve Your Spot <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <a href="#details" className="btn-outline">
                                View Curriculum
                            </a>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <CountdownTimer />
                        </div>
                    </motion.div>

                    {/* Right Side Visual/3D Placeholder */}
                    <div className="hidden lg:block relative h-[600px]">
                        {/* The AmbientBackground handles the visuals, this space reserves layout */}
                    </div>
                </div>
            </section>

            {/* STATS GLASS STRIP */}
            <div id="details" className="relative z-20 py-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
                <div className="layout-container grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Date', value: 'Feb 16, 2026' },
                        { label: 'Time', value: '7:00 PM IST' },
                        { label: 'Platform', value: 'Google Meet' },
                        { label: 'Cost', value: 'Free for Students' }
                    ].map((item, i) => (
                        <div key={i} className="text-center md:text-left">
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{item.label}</p>
                            <p className="text-lg md:text-xl font-heading font-bold text-white">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <section className="relative z-10 py-32">
                <div className="layout-container">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <h2 className="heading-lg">Why Top Developers Choose NeoTech</h2>
                        <p className="text-gray-400 text-lg">Detailed, production-focused training that goes beyond the basics.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Trophy, title: 'Industry Recognized', desc: 'Curriculum designed by ex-Meta & Google engineers.', color: 'text-yellow-400' },
                            { icon: Zap, title: 'Production Ready', desc: 'Learn to ship code that handles millions of users.', color: 'text-brand-400' },
                            { icon: Users, title: 'Elite Network', desc: 'Join a community of ambitious 10x developers.', color: 'text-green-400' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="card-glass p-8 space-y-6 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold font-heading">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CERTIFICATE PREVIEW TEASER */}
            <section className="relative z-10 py-24 bg-dark-bg">
                <div className="layout-container">
                    <div className="card-glass p-12 md:p-16 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        <div className="max-w-xl space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
                                <Star size={12} fill="currentColor" /> Certified
                            </div>
                            <h2 className="heading-lg">Earn Your Credential</h2>
                            <p className="text-gray-400 text-lg">
                                Receive a verifiable certificate upon completion. Add it to your LinkedIn/Resume to showcase your advanced React architectural skills.
                            </p>
                            <Link to="/certificate-preview" className="btn-primary">
                                Preview Certificate
                            </Link>
                        </div>

                        <div className="relative z-10 w-full max-w-md hidden md:block">
                            {/* Abstract representation of cert */}
                            <div className="aspect-[4/3] bg-white rounded-lg shadow-2xl p-6 rotate-3 hover:rotate-0 transition-transform duration-500 scale-90 opacity-90 hover:opacity-100 hover:scale-100 origin-center text-dark-bg cursor-pointer">
                                <div className="border border-gray-200 h-full p-6 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-12 h-12 bg-dark-bg text-white rounded-full flex items-center justify-center font-bold text-xl">N</div>
                                    <div className="h-1 w-20 bg-gray-200"></div>
                                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                    <div className="h-2 w-1/2 bg-gray-50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VERIFY CERTIFICATE CTA */}
            <section className="relative z-10 py-20 border-t border-white/5 bg-white/5 backdrop-blur-md">
                <div className="layout-container flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="heading-lg text-3xl mb-2">Already Certified?</h3>
                        <p className="text-gray-400">Validate your credentials or check a candidate's certificate authenticity instantly.</p>
                    </div>
                    <Link to="/verify" className="btn-outline px-8 py-4 flex items-center gap-2 group bg-dark-bg/50">
                        <CheckCircle2 size={20} className="text-green-400" />
                        Verify A Certificate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative z-10 py-32 text-center">
                <div className="layout-container max-w-4xl space-y-8">
                    <h2 className="heading-lg">Ready to Scale Your Career?</h2>
                    <p className="text-xl text-gray-400">Limited seats available for the upcoming cohort.</p>
                    <Link to="/register" className="btn-primary px-10 py-5 text-lg shadow-2xl shadow-brand-500/20">
                        Secure Your Seat Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
