'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchFocusHeatmap, type FocusDay } from '@/actions/fetchFocusHeatmap';

interface HeatmapProps {
    className?: string;
}

export function FocusHeatmap({ className = '' }: HeatmapProps) {
    const [focusData, setFocusData] = useState<FocusDay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHeatmapData();
    }, []);

    async function loadHeatmapData() {
        setLoading(true);
        const data = await fetchFocusHeatmap(365);
        setFocusData(data);
        setLoading(false);
    }

    // Generate all days in the current calendar year (GitHub style: Jan 1 to Dec 31)
    function generateAllDays() {
        const days: { date: string; data: FocusDay | null }[] = [];
        const currentYear = new Date().getFullYear();
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Start from January 1st of current year
        const startDate = new Date(currentYear, 0, 1);
        // End at December 31st of current year (or today if we're in current year)
        const endDate = new Date(currentYear, 11, 31);

        // Fill in days from start of year to end of year
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = focusData.find(d => d.date === dateStr);

            // Mark future days differently (compare date strings, not Date objects)
            const isFuture = dateStr > todayStr;
            days.push({
                date: dateStr,
                data: isFuture ? null : (dayData || null),
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    }

    // Get color intensity based on focus minutes
    function getColorClass(minutes: number | undefined): string {
        if (!minutes || minutes === 0) return 'bg-gray-800/30';
        if (minutes < 30) return 'bg-green-900/40';
        if (minutes < 60) return 'bg-green-700/60';
        if (minutes < 120) return 'bg-green-600/80';
        return 'bg-green-500';
    }

    // Get color description for tooltip
    function getColorName(minutes: number | undefined): string {
        if (!minutes || minutes === 0) return 'No focus';
        if (minutes < 30) return 'Light';
        if (minutes < 60) return 'Moderate';
        if (minutes < 120) return 'Good';
        return 'Excellent';
    }

    // Format minutes to hours and minutes
    function formatTime(minutes: number): string {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    // Format date for display
    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    const allDays = generateAllDays();

    // Calculate stats
    const totalMinutes = focusData.reduce((sum, day) => sum + day.focus_minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const activeDays = focusData.filter(day => day.focus_minutes > 0).length;
    const currentStreak = calculateCurrentStreak();
    const longestStreak = calculateLongestStreak();

    function calculateCurrentStreak(): number {
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];

        for (let i = 0; i <= 365; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = focusData.find(d => d.date === dateStr);
            if (dayData && dayData.focus_minutes > 0) {
                streak++;
            } else if (dateStr !== today) {
                // Allow today to be  0 without breaking streak
                break;
            }
        }

        return streak;
    }

    function calculateLongestStreak(): number {
        let longest = 0;
        let current = 0;

        allDays.forEach(({ data }) => {
            if (data && data.focus_minutes > 0) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
        });

        return longest;
    }

    if (loading) {
        return (
            <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-48 mb-4"></div>
                    <div className="h-24 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm ${className}`}>
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-lg font-semibold text-white">Focus Activity</h2>
                <div className="flex gap-3 text-sm">
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Total</div>
                        <div className="text-white font-semibold text-sm">{totalHours}h</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Days</div>
                        <div className="text-white font-semibold text-sm">{activeDays}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Streak</div>
                        <div className="text-white font-semibold text-sm">{currentStreak}🔥</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Best</div>
                        <div className="text-white font-semibold text-sm">{longestStreak}</div>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative overflow-x-auto">
                {/* Month labels */}
                <div className="flex mb-1.5 text-xs text-gray-400 ml-10 min-w-[650px]">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                        <div key={month} className="flex-1 text-left">
                            {month}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1.5 min-w-[650px]">
                    {/* Day of week labels */}
                    <div className="flex flex-col gap-0.5 text-xs text-gray-400 justify-around h-[90px]">
                        <div>Mon</div>
                        <div>Wed</div>
                        <div>Fri</div>
                    </div>

                    {/* Grid of squares */}
                    <div className="grid grid-flow-col grid-rows-7 gap-0.5 flex-1 relative">
                        {allDays.map(({ date, data }) => (
                            <div
                                key={date}
                                className="group relative w-[12px] h-[12px] rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-white/40 hover:scale-110"
                            >
                                {/* Square */}
                                <div className={`w-full h-full rounded-sm ${getColorClass(data?.focus_minutes)}`} />

                                {/* Tooltip - appears to the RIGHT to avoid clipping */}
                                <div className="invisible group-hover:visible absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white rounded px-2.5 py-1.5 shadow-xl border border-white/20 z-[99999] pointer-events-none text-xs whitespace-nowrap">
                                    <div className="font-medium mb-0.5">
                                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {data && data.focus_minutes > 0 ? (
                                        <>
                                            <div className="text-green-400 font-semibold">
                                                {formatTime(data.focus_minutes)}
                                            </div>
                                            <div className="text-gray-400 text-[10px] mt-0.5">
                                                {data.sessions_completed} sessions
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400">No time</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-0.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gray-800/30"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-900/40"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-700/60"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-600/80"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
