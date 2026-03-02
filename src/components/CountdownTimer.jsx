import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate: propTarget }) => {

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!propTarget) return;

        // Force time to 7:00 PM IST (19:00) if no time is provided
        let dateString = propTarget;
        if (dateString.length <= 10) {
            dateString += 'T19:00:00+05:30';
        } else if (!dateString.includes('T')) {
            // E.g., '2026-03-15'
            dateString = dateString.split(' ')[0] + 'T19:00:00+05:30';
        }

        const targetDate = new Date(dateString);

        const calculateTimeLeft = () => {
            const difference = targetDate - new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [propTarget]);

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center group">
            <div className="card-glass px-4 py-4 md:px-6 md:py-5 min-w-[80px] md:min-w-[110px] flex items-center justify-center mb-3 group-hover:border-brand-500/30 transition-all">
                <span className="text-3xl md:text-5xl font-bold text-white tabular-nums tracking-tight font-heading drop-shadow-lg">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] group-hover:text-brand-400 transition-colors">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex items-start justify-center gap-4 md:gap-6">
            <TimeBox value={timeLeft.days} label="Days" />
            <TimeBox value={timeLeft.hours} label="Hours" />
            <TimeBox value={timeLeft.minutes} label="Mins" />
            <TimeBox value={timeLeft.seconds} label="Secs" />
        </div>
    );
};

export default CountdownTimer;
