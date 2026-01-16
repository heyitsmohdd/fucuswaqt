'use client';

import { useEffect, useState } from 'react';
import { fetchFocusHeatmap, type FocusDay } from '@/actions/fetchFocusHeatmap';

interface HeatmapProps {
    className?: string;
}

export function FocusHeatmap({ className = '' }: HeatmapProps) {
    const [focusData, setFocusData] = useState<FocusDay[]>([]);
    const [hoveredDay, setHoveredDay] = useState<{ date: string; data: FocusDay | null } | null>(null);
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

    // Generate all days in the last 365 days
    function generateAllDays() {
        const days: { date: string; data: FocusDay | null }[] = [];
        const today = new Date();

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = focusData.find(d => d.date === dateStr);
            days.push({ date: dateStr, data: dayData || null });
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
                // Allow today to be 0 without breaking streak
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
            <div className={`p-6 rounded-lg bg-white/5 backdrop-blur-sm ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-48 mb-4"></div>
                    <div className="h-32 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-lg bg-white/5 backdrop-blur-sm ${className}`}>
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-semibold text-white">Focus Activity</h2>
                <div className="flex gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Total</div>
                        <div className="text-white font-semibold">{totalHours}h</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Days</div>
                        <div className="text-white font-semibold">{activeDays}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Streak</div>
                        <div className="text-white font-semibold">{currentStreak}🔥</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-400 text-xs">Best</div>
                        <div className="text-white font-semibold">{longestStreak}</div>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative overflow-x-auto">
                {/* Month labels */}
                <div className="flex mb-2 text-xs text-gray-400 ml-12 min-w-[700px]">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                        <div key={month} className="flex-1 text-left">
                            {month}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 min-w-[700px]">
                    {/* Day of week labels */}
                    <div className="flex flex-col gap-1 text-xs text-gray-400 justify-around h-[105px]">
                        <div>Mon</div>
                        <div>Wed</div>
                        <div>Fri</div>
                    </div>

                    {/* Grid of squares */}
                    <div className="grid grid-flow-col grid-rows-7 gap-1 flex-1">
                        {allDays.map(({ date, data }) => (
                            <div
                                key={date}
                                className={`
                  w-[15px] h-[15px] rounded-sm cursor-pointer transition-all duration-200
                  hover:ring-2 hover:ring-white/40 hover:scale-110
                  ${getColorClass(data?.focus_minutes)}
                `}
                                onMouseEnter={() => setHoveredDay({ date, data })}
                                onMouseLeave={() => setHoveredDay(null)}
                                title={`${formatDate(date)}: ${data?.focus_minutes || 0} minutes`}
                            />
                        ))}
                    </div>
                </div>

                {/* Tooltip */}
                {hoveredDay && (
                    <div className="fixed bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl border border-white/10 z-50 min-w-[200px] pointer-events-none"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -120%)'
                        }}>
                        <div className="font-semibold mb-1">{formatDate(hoveredDay.date)}</div>
                        <div className="text-gray-300">
                            {hoveredDay.data && hoveredDay.data.focus_minutes > 0 ? (
                                <>
                                    <div className="flex justify-between gap-4">
                                        <span>Focus time:</span>
                                        <span className="font-semibold text-green-400">
                                            {formatTime(hoveredDay.data.focus_minutes)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span>Sessions:</span>
                                        <span className="font-semibold">{hoveredDay.data.sessions_completed}</span>
                                    </div>
                                    {hoveredDay.data.tasks_completed > 0 && (
                                        <div className="flex justify-between gap-4">
                                            <span>Tasks:</span>
                                            <span className="font-semibold">{hoveredDay.data.tasks_completed}</span>
                                        </div>
                                    )}
                                    <div className="mt-2 text-xs text-gray-400">
                                        {getColorName(hoveredDay.data.focus_minutes)} activity
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500">No focus time recorded</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-800/30"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-900/40"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-700/60"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-600/80"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
