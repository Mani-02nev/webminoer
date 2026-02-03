import { Zap, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0f0f10] border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-50"></div>
            <div className="layout-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <a href="https://times-tech.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                            {/* Placeholder for Logo Asset - using generic for now */}
                            <div className="w-8 h-8 bg-brand-600/20 text-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                <Zap size={18} fill="currentColor" />
                            </div>
                            <span className="text-xl font-heading font-bold text-white tracking-wide uppercase group-hover:text-brand-500 transition-colors">
                                Time's Tech Learning Platform
                            </span>
                        </a>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Premier Tech Learning Platform. Detailed guidance for Frontend, React, and No-Code careers.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {['Courses', 'Workshops', 'Mentorship', 'Pricing'].map(item => (
                                <li key={item}><a href="#" className="hover:text-brand-400 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {['About Us', 'Careers', 'Blog', 'Contact'].map(item => (
                                <li key={item}><a href="#" className="hover:text-brand-400 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                                <li key={item}><a href="#" className="hover:text-brand-400 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">© 2026 Time's Tech Learning Platform. All rights reserved.</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Times Tech Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
