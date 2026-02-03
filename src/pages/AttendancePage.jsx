import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Loader2, Star, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendancePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        rating: 5,
        feedback: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if already submitted
            const { data: existing } = await supabase
                .from('attendance')
                .select('id')
                .eq('email', formData.email.toLowerCase())
                .single();

            if (existing) {
                setCompleted(true);
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase
                .from('attendance')
                .insert([{
                    name: formData.name,
                    email: formData.email.toLowerCase(),
                    whatsapp: formData.whatsapp,
                    rating: formData.rating,
                    feedback: formData.feedback
                }]);

            if (insertError) throw insertError;

            setCompleted(true);
        } catch (err) {
            console.error(err);
            setError('Failed to mark attendance. Please try again or contact support.');
        } finally {
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-dark-bg flex items-center justify-center relative overflow-hidden px-6">
                <div className="card-glass p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Attendance Marked!</h2>
                    <p className="text-gray-400 mb-6">
                        Thank you for joining the session. Your certificate will be processed shortly.
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary w-full">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-dark-bg relative overflow-hidden px-6">
            <div className="layout-container max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="heading-lg mb-4">Webinar Attendance</h1>
                    <p className="text-gray-400">Please fill this form to mark your presence and claim your certificate.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-glass p-8 md:p-10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name (for Certificate)</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="Same as registration"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                            <input
                                type="tel"
                                required
                                className="input-field"
                                placeholder="+91 98765 43210"
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">How would you rate the session?</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className={`p-3 rounded-lg transition-all ${formData.rating >= star
                                                ? 'bg-yellow-500/20 text-yellow-500'
                                                : 'bg-white/5 text-gray-600 hover:bg-white/10'
                                            }`}
                                    >
                                        <Star fill={formData.rating >= star ? "currentColor" : "none"} size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Feedback / Key Takeaways</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                placeholder="What did you learn today?"
                                value={formData.feedback}
                                onChange={e => setFormData({ ...formData, feedback: e.target.value })}
                            ></textarea>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary w-full h-14 text-lg flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            Submit Attendance
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AttendancePage;
