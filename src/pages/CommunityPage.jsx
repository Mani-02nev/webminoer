import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Building2, Briefcase, GraduationCap, Calendar, User, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CommunityPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        mobile: '',
        college: '',
        department: '',
        current_year: '',
        employment_status: 'student', // 'student' or 'working'
        company_name: '',
        years_of_experience: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { error: dbError } = await supabase
                .from('community_members')
                .insert([{
                    ...formData,
                    age: parseInt(formData.age),
                    years_of_experience: formData.employment_status === 'working' ? parseInt(formData.years_of_experience) : null,
                    company_name: formData.employment_status === 'working' ? formData.company_name : null,
                    college: formData.employment_status === 'student' ? formData.college : null,
                    department: formData.employment_status === 'student' ? formData.department : null,
                    current_year: formData.employment_status === 'student' ? formData.current_year : null
                }]);

            if (dbError) throw dbError;

            setSuccess(true);
            setFormData({
                name: '',
                age: '',
                email: '',
                mobile: '',
                college: '',
                department: '',
                current_year: '',
                employment_status: 'student',
                company_name: '',
                years_of_experience: ''
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Error joining community:', err);
            setError(err.message || 'Failed to join community. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 bg-brand-500/10 rounded-full mb-6">
                        <Users size={48} className="text-brand-500" />
                    </div>
                    <h1 className="heading-lg mb-4">
                        Join the <span className="text-brand-500">Times Tech</span> Community
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Become a member of our vibrant learning community. Connect with fellow learners,
                        access exclusive resources, and grow together.
                    </p>
                </motion.div>

                {/* Success Message */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4"
                    >
                        <CheckCircle className="text-green-500" size={32} />
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Welcome to the Community!</h3>
                            <p className="text-green-200">Your membership has been successfully registered.</p>
                        </div>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-glass p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <User size={20} className="text-brand-500" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Age *</label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        min="15"
                                        max="100"
                                        className="input-field"
                                        placeholder="25"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Mail size={20} className="text-brand-500" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="input-field"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        required
                                        className="input-field"
                                        placeholder="+91 98765 43210"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Employment Status */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Briefcase size={20} className="text-brand-500" />
                                Current Status *
                            </h3>
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="employment_status"
                                        value="student"
                                        checked={formData.employment_status === 'student'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-brand-500"
                                    />
                                    <span className="text-gray-300">Student</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="employment_status"
                                        value="working"
                                        checked={formData.employment_status === 'working'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-brand-500"
                                    />
                                    <span className="text-gray-300">Working Professional</span>
                                </label>
                            </div>

                            {/* Student Fields */}
                            {formData.employment_status === 'student' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">College/University *</label>
                                        <input
                                            type="text"
                                            name="college"
                                            required
                                            className="input-field"
                                            placeholder="ABC University"
                                            value={formData.college}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Department *</label>
                                        <input
                                            type="text"
                                            name="department"
                                            required
                                            className="input-field"
                                            placeholder="Computer Science"
                                            value={formData.department}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Current Year *</label>
                                        <select
                                            name="current_year"
                                            required
                                            className="input-field"
                                            value={formData.current_year}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                            <option value="5th Year">5th Year</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Working Professional Fields */}
                            {formData.employment_status === 'working' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Company Name *</label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            required
                                            className="input-field"
                                            placeholder="Tech Corp Inc."
                                            value={formData.company_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Years of Experience *</label>
                                        <input
                                            type="number"
                                            name="years_of_experience"
                                            required
                                            min="0"
                                            max="50"
                                            className="input-field"
                                            placeholder="3"
                                            value={formData.years_of_experience}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Joining Community...
                                    </>
                                ) : (
                                    <>
                                        <Users size={24} />
                                        Join Community
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="card-glass p-6 text-center">
                        <div className="w-12 h-12 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="text-brand-500" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Exclusive Learning</h3>
                        <p className="text-sm text-gray-400">
                            Access to premium webinars, master classes, and learning resources
                        </p>
                    </div>

                    <div className="card-glass p-6 text-center">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-purple-500" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Networking</h3>
                        <p className="text-sm text-gray-400">
                            Connect with like-minded learners and industry professionals
                        </p>
                    </div>

                    <div className="card-glass p-6 text-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-500" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Certificates</h3>
                        <p className="text-sm text-gray-400">
                            Earn verified certificates for completed courses and webinars
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CommunityPage;
