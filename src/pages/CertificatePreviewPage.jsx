import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, Eye } from 'lucide-react';
import { ParticipationTemplate, CompletionTemplate } from '../components/CertificateTemplates';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificatePreviewPage = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('participation');
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const element = document.getElementById('certificate-preview');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${selectedTemplate}_certificate_preview.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to download certificate');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-4 bg-brand-500/10 rounded-full mb-6">
                        <Award size={48} className="text-brand-500" />
                    </div>
                    <h1 className="heading-lg mb-4">
                        Certificate <span className="text-brand-500">Templates</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Preview our premium certificate designs. All certificates are downloadable and verifiable.
                    </p>
                </motion.div>

                {/* Template Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-4 mb-12"
                >
                    <button
                        onClick={() => setSelectedTemplate('participation')}
                        className={`px-8 py-4 rounded-xl font-bold transition-all ${selectedTemplate === 'participation'
                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Eye size={20} />
                            Participation Certificate
                        </div>
                        <div className="text-xs mt-1 opacity-70">For Webinars</div>
                    </button>

                    <button
                        onClick={() => setSelectedTemplate('completion')}
                        className={`px-8 py-4 rounded-xl font-bold transition-all ${selectedTemplate === 'completion'
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Award size={20} />
                            Completion Certificate
                        </div>
                        <div className="text-xs mt-1 opacity-70">For Master Classes</div>
                    </button>
                </motion.div>

                {/* Certificate Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="card-glass p-4 md:p-8 rounded-2xl overflow-x-auto">
                        <div id="certificate-preview" className="w-full max-w-5xl mx-auto">
                            <div className="transform scale-[0.4] sm:scale-[0.5] md:scale-[0.7] lg:scale-100 origin-top">
                                {selectedTemplate === 'participation' ? (
                                    <ParticipationTemplate
                                        name="YOUR NAME"
                                        title="Course Name"
                                        date={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        certificateId="XXXX-XXXX-XXXX"
                                    />
                                ) : (
                                    <CompletionTemplate
                                        name="YOUR NAME"
                                        title="Course Name"
                                        date={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        certificateId="XXXX-XXXX-XXXX"
                                        duration="2 Hours"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-3"
                    >
                        <Download size={24} />
                        {downloading ? 'Generating PDF...' : 'Download Preview'}
                    </button>

                    <Link
                        to="/register"
                        className="btn-outline px-8 py-4 text-lg flex items-center justify-center gap-3"
                    >
                        Register for Webinar
                    </Link>
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    <div className="card-glass p-8">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                            <Award className="text-yellow-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Participation Certificate</h3>
                        <p className="text-gray-400 mb-4">
                            Awarded to participants who attend our webinars. Features a premium gold and dark theme design.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                                For webinar participation
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                                Verifiable certificate ID
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                                Downloadable PDF format
                            </li>
                        </ul>
                    </div>

                    <div className="card-glass p-8">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
                            <Award className="text-cyan-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Completion Certificate</h3>
                        <p className="text-gray-400 mb-4">
                            Awarded upon successful completion of our master classes. Features a premium cyan and purple theme design.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                For master class completion
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                Blockchain verified
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                Premium design
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        <strong>Note:</strong> This is a preview. "YOUR NAME" and "Course Name" are placeholders. The date shown is today's date in DD-MM-YYYY format. Actual certificates will contain participant's name and course details.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default CertificatePreviewPage;
