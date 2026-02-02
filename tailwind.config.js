/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['"Outfit"', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                brand: {
                    50: '#FDF2F8',
                    100: '#FCE7F3',
                    200: '#FBCFE8',
                    300: '#F9A8D4',
                    400: '#F472B6', // Soft Pink
                    500: '#EC4899', // Primary Pink (Neon)
                    600: '#DB2777',
                    700: '#BE185D',
                    800: '#9D174D',
                    900: '#831843',
                    950: '#500724',
                },
                dark: {
                    bg: '#0A0A0A',      // Deepest Black
                    surface: '#121212', // Dark Charcoal
                    card: '#18181B',    // Lighter Charcoal
                    border: '#27272A',  // Subtle Border
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #0A0A0A 0deg, #18181B 180deg, #0A0A0A 360deg)',
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)' },
                }
            }
        },
    },
    plugins: [],
}
