import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { triggerRegistrationEmail, triggerWhatsAppMessage } from '../utils/emailTrigger';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeWebinar, setActiveWebinar] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        status: '', // Student | Fresher | Professional
        college_org: '', // College or Organization
        year_exp: '', // Year of study or Years of Exp
        consent: false
    });

    const [focusedField, setFocusedField] = useState(null);

    // Fetch active webinar
    useEffect(() => {
        fetchActiveWebinar();
    }, []);

    const fetchActiveWebinar = async () => {
        try {
            const { data, error } = await supabase
                .from('webinars')
                .select('*')
                .eq('registration_open', true)
                .order('program_date', { ascending: true })
                .limit(1)
                .single();

            if (!error && data) {
                setActiveWebinar(data);
            }
        } catch (err) {
            console.error('Error fetching webinar:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        if (!formData.name || !formData.email || !formData.whatsapp || !formData.status || !formData.college_org || !formData.year_exp) {
            setError('Please fill in all required fields.');
            return false;
        }
        if (!formData.consent) {
            setError('You must agree to the terms.');
            return false;
        }
        if (!formData.email.endsWith('@gmail.com')) {
            setError('Please use a valid Gmail address.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;
        setLoading(true);

        try {
            // Check existing
            const { data: existing } = await supabase
                .from('participants')
                .select('email')
                .eq('email', formData.email.toLowerCase())
                .single();

            if (existing) throw new Error('This email is already registered.');

            // Insert
            const { error: insertError } = await supabase.from('participants').insert([{
                name: formData.name,
                email: formData.email.toLowerCase(),
                whatsapp: formData.whatsapp,
                experience: formData.status, // Keeping simple status here
                current_year: formData.year_exp, // Explicitly saving year
                college: formData.college_org,
                webinar_id: activeWebinar?.id || null,
                created_at: new Date().toISOString()
            }]);

            if (insertError) throw insertError;

            // Trigger Confirmation Email & WhatsApp
            await triggerRegistrationEmail({ name: formData.name, email: formData.email.toLowerCase() });
            await triggerWhatsAppMessage({ name: formData.name, phone: formData.whatsapp });

            navigate('/confirmation', { state: { userData: { name: formData.name, email: formData.email, whatsapp: formData.whatsapp } } });
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const webinarType = activeWebinar?.webinar_type === 'masterclass' ? 'Master Class' : 'Webinar';
    const isRegistrationOpen = activeWebinar?.registration_open;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-dark-bg flex items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-brand-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="layout-container w-full max-w-2xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-10 space-y-4">
                        <h1 className="heading-lg">
                            {activeWebinar ? `Register for ${webinarType}` : 'Registration'}
                        </h1>
                        <p className="text-lg text-gray-300">
                            {activeWebinar ? (
                                <>Join <span className="font-bold text-white">{activeWebinar.program_name}</span></>
                            ) : (
                                'Join 5,000+ developers mastering React.'
                            )}
                        </p>
                        {!isRegistrationOpen && (
                            <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-300 text-sm">
                                Registration is currently closed
                            </div>
                        )}
                    </div>

                    <div className="card-glass p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        {/* Top Progress Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-brand-600 to-brand-400"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    focused={focusedField === 'name'}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <FloatingInput
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    focused={focusedField === 'email'}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput
                                    label="WhatsApp Number"
                                    name="whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    focused={focusedField === 'whatsapp'}
                                    onFocus={() => setFocusedField('whatsapp')}
                                    onBlur={() => setFocusedField(null)}
                                />

                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('status')}
                                        onBlur={() => setFocusedField(null)}
                                        className="input-field appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled hidden></option>
                                        <option value="Student">Student</option>
                                        <option value="Fresher">Fresher (Looking for Job)</option>
                                        <option value="Working Professional">Working Professional</option>
                                    </select>
                                    <label className={`absolute left-5 transition-all duration-200 pointer-events-none ${focusedField === 'status' || formData.status
                                        ? 'top-2 text-xs text-brand-400'
                                        : 'top-1/2 -translate-y-1/2 text-gray-500'
                                        }`}>
                                        Current Status
                                    </label>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none rotate-90" size={16} />
                                </div>
                            </div>

                            {/* Conditional Fields Animation */}
                            <AnimatePresence>
                                {formData.status && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                                    >
                                        <FloatingInput
                                            label={formData.status === 'Student' ? "College Name" : "Organization/Company"}
                                            name="college_org"
                                            value={formData.college_org}
                                            onChange={handleChange}
                                            focused={focusedField === 'college_org'}
                                            onFocus={() => setFocusedField('college_org')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <FloatingInput
                                            label={formData.status === 'Student' ? "Current Year (e.g. 3rd Year)" : "Years of Experience"}
                                            name="year_exp"
                                            value={formData.year_exp}
                                            onChange={handleChange}
                                            focused={focusedField === 'year_exp'}
                                            onFocus={() => setFocusedField('year_exp')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-start gap-3 pt-2">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        id="consent"
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/20 bg-white/5 checked:border-brand-500 checked:bg-brand-500 transition-all"
                                    />
                                    <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                                <label htmlFor="consent" className="text-sm text-gray-400 cursor-pointer select-none">
                                    I agree to receive communications about the webinar and future updates.
                                </label>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-300 text-sm"
                                >
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary h-14 text-lg mt-4"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" /> Processing...
                                    </span>
                                ) : 'Unlock Access'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const FloatingInput = ({ label, name, type = "text", value, onChange, focused, onFocus, onBlur }) => (
    <div className="relative">
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className="input-field pt-6 pb-2"
        />
        <label
            className={`absolute left-5 transition-all duration-200 pointer-events-none ${focused || value
                ? 'top-2 text-xs text-brand-400'
                : 'top-1/2 -translate-y-1/2 text-gray-500'
                }`}
        >
            {label}
        </label>
    </div>
);

export default RegistrationPage;
