import React from 'react';

// Participation Certificate Template (for Webinars)
export const ParticipationTemplate = ({ name, title, date, certificateId }) => {
    return (
        <div className="w-full aspect-[1.414/1] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            {/* Border */}
            <div className="absolute inset-4 border-4 border-double border-yellow-500/50 rounded-lg"></div>
            <div className="absolute inset-6 border border-yellow-500/30 rounded-lg"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                {/* Logo/Badge */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                        <svg className="w-12 h-12 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4 tracking-wider">
                    CERTIFICATE
                </h1>
                <p className="text-xl text-gray-300 mb-8 tracking-widest uppercase">
                    of Participation
                </p>

                {/* Divider */}
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-8"></div>

                {/* Body Text */}
                <p className="text-gray-400 mb-4 text-lg">This certificate is proudly presented to</p>

                {/* Name */}
                <h2 className="text-5xl font-bold text-white mb-6 font-serif italic">
                    {name || 'YYYY YYYY'}
                </h2>

                {/* Underline */}
                <div className="w-96 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent mb-8"></div>

                {/* Description */}
                <p className="text-gray-300 max-w-2xl leading-relaxed mb-8">
                    For successfully participating in the <span className="font-bold text-brand-400">{title || 'YYYY YYYY YYYY'}</span>.
                    <br />
                    Demonstrating commitment to professional development and continuous learning.
                </p>

                {/* Footer */}
                <div className="flex justify-between items-end w-full mt-auto pt-8">
                    <div className="text-left">
                        <div className="w-48 h-0.5 bg-gray-600 mb-2"></div>
                        <p className="text-sm font-bold text-white">KARUPPASAMY M</p>
                        <p className="text-xs text-gray-400">Computer Engineering Student</p>
                        <p className="text-xs text-gray-400">Tech Stack Pvt Ltd</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-500">Verified</p>
                    </div>

                    <div className="text-right">
                        <div className="w-48 h-0.5 bg-gray-600 mb-2"></div>
                        <p className="text-sm font-bold text-white">{date || 'DD/MM/YYYY'}</p>
                        <p className="text-xs text-gray-400">Date Issued</p>
                        <p className="text-xs text-gray-500">ID: {certificateId || 'XXXX-XXXX-XXXX'}</p>
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-yellow-500/50"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-yellow-500/50"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-yellow-500/50"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-yellow-500/50"></div>
        </div>
    );
};

// Completion Certificate Template (for Master Classes) - Professional Gold/Black
export const CompletionTemplate = ({ name, title, date, certificateId, duration }) => {
    return (
        <div className="w-full aspect-[1.414/1] bg-[#141414] relative overflow-hidden">
            {/* Decorative Golden Fabric/Ribbon - Top Left */}
            <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                        <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#f4d03f', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#c9a227', stopOpacity: 1 }} />
                        </linearGradient>
                        <pattern id="fabricTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="0.5" fill="#000" opacity="0.1" />
                        </pattern>
                    </defs>
                    <path d="M 0,0 Q 80,40 100,100 Q 60,80 0,100 Z" fill="url(#goldGradient1)" opacity="0.95" />
                    <path d="M 0,0 Q 80,40 100,100 Q 60,80 0,100 Z" fill="url(#fabricTexture)" />
                    <path d="M 5,5 Q 75,42 95,95 Q 58,78 5,95 Z" fill="none" stroke="#f4d03f" strokeWidth="0.5" opacity="0.6" />
                </svg>
            </div>

            {/* Decorative Golden Fabric/Ribbon - Bottom Right */}
            <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none rotate-180">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M 0,0 Q 80,40 100,100 Q 60,80 0,100 Z" fill="url(#goldGradient1)" opacity="0.95" />
                    <path d="M 0,0 Q 80,40 100,100 Q 60,80 0,100 Z" fill="url(#fabricTexture)" />
                    <path d="M 5,5 Q 75,42 95,95 Q 58,78 5,95 Z" fill="none" stroke="#f4d03f" strokeWidth="0.5" opacity="0.6" />
                </svg>
            </div>

            {/* Main Gold Border (Outer - Thick) */}
            <div className="absolute inset-[10px] border-[3px] border-[#d4af37] rounded-sm z-10"></div>

            {/* Inner Gold Border (Thin) */}
            <div className="absolute inset-[13px] border border-[#d4af37]/60 rounded-sm z-10"></div>

            {/* Decorative corner elements */}
            <div className="absolute top-[13px] left-[13px] w-12 h-12 z-10">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#d4af37]"></div>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-[#d4af37]"></div>
            </div>
            <div className="absolute top-[13px] right-[13px] w-12 h-12 z-10">
                <div className="absolute top-0 right-0 w-full h-[2px] bg-[#d4af37]"></div>
                <div className="absolute top-0 right-0 w-[2px] h-full bg-[#d4af37]"></div>
            </div>
            <div className="absolute bottom-[13px] left-[13px] w-12 h-12 z-10">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37]"></div>
                <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#d4af37]"></div>
            </div>
            <div className="absolute bottom-[13px] right-[13px] w-12 h-12 z-10">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#d4af37]"></div>
                <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#d4af37]"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-between p-16 text-center z-20">

                {/* Top Section */}
                <div className="flex flex-col items-center">
                    {/* Top decorative badge - Changed to KS */}
                    <div className="mb-6">
                        <div className="w-16 h-16 border-2 border-[#d4af37] rounded-full flex items-center justify-center bg-[#141414]">
                            <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-[#141414]">KS</span>
                            </div>
                        </div>
                    </div>

                    {/* CERTIFICATE - Large, elegant, white */}
                    <h1 className="text-8xl font-bold text-white mb-4 tracking-[0.3em] font-serif">
                        CERTIFICATE
                    </h1>

                    {/* OF COMPLETION - Smaller, spaced */}
                    <p className="text-2xl text-white mb-2 tracking-[0.4em] uppercase">
                        OF COMPLETION
                    </p>

                    {/* Subtitle */}
                    <p className="text-sm text-gray-400 mb-6 tracking-wider uppercase">
                        Master Class Achievement
                    </p>

                    {/* Decorative line */}
                    <div className="w-32 h-[1px] bg-[#d4af37] mb-6"></div>
                </div>

                {/* Middle Section - Name and Course */}
                <div className="flex flex-col items-center flex-1 justify-center -mt-12">
                    {/* "This certifies that" */}
                    <p className="text-gray-400 mb-6 text-lg">This certifies that</p>

                    {/* Name - Large, Elegant Script */}
                    <h2 className="text-7xl font-bold text-white mb-4 font-serif italic">
                        {name || 'Estelle Darcy'}
                    </h2>

                    {/* Elegant underline */}
                    <div className="w-96 h-[2px] bg-[#d4af37] mb-8"></div>

                    {/* Date - Prominent */}
                    <p className="text-xl font-bold text-white mb-6 tracking-wider">
                        {date || '29 NOVEMBER, 2030'}
                    </p>

                    {/* Description paragraph */}
                    <p className="text-gray-400 max-w-3xl leading-relaxed text-base">
                        Has successfully completed the <span className="font-bold text-white">{title || 'React Roadmap Master Class'}</span>.
                        <br />
                        Demonstrating exceptional dedication, skill mastery, and professional excellence in the subject matter.
                    </p>
                </div>

                {/* Footer Section */}
                <div className="w-full">
                    {/* Gold seal/badge with lines */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex-1 h-[1px] bg-[#d4af37]"></div>
                        <div className="mx-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#ffd700] rounded-full flex items-center justify-center relative shadow-lg shadow-[#d4af37]/50">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#ffd700] to-[#d4af37] rounded-full"></div>
                                {/* Ribbon */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-[#d4af37]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 h-[1px] bg-[#d4af37]"></div>
                    </div>

                    {/* Author Information - Same as Webinar Certificate */}
                    <div className="flex justify-between items-start mb-6 px-8">
                        {/* Left - Author Details */}
                        <div className="text-left">
                            <div className="w-48 h-[1px] bg-[#d4af37] mb-2"></div>
                            <p className="text-sm font-bold text-white">KARUPPASAMY M</p>
                            <p className="text-xs text-gray-400">Computer Engineering Student</p>
                            <p className="text-xs text-gray-400">Time's Tech Learning Platform</p>
                            <p className="text-xs text-gray-500">(Student Learning Initiative)</p>
                        </div>

                        {/* Right - Date */}
                        <div className="text-right">
                            <div className="w-48 h-[1px] bg-[#d4af37] mb-2"></div>
                            <p className="text-sm font-bold text-white">{date || '16 Feb 2026'}</p>
                            <p className="text-xs text-gray-400">Date Issued</p>
                            <p className="text-xs text-gray-500">ID: {certificateId || 'CERT-2024-001'}</p>
                        </div>
                    </div>

                    {/* Bottom Information Bar - Certificate ID and Duration */}
                    <div className="border-t border-[#d4af37]/30 pt-3">
                        <div className="flex justify-between items-start text-xs px-8">
                            {/* Certificate ID */}
                            <div className="text-left">
                                <p className="text-[#d4af37] font-bold mb-1 tracking-wider">CERTIFICATE ID</p>
                                <p className="text-gray-400">{certificateId || 'CERT-2024-001'}</p>
                            </div>

                            {/* Duration */}
                            <div className="text-right">
                                <p className="text-[#d4af37] font-bold mb-1 tracking-wider">DURATION</p>
                                <p className="text-gray-400">{duration || '2 Hours'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
