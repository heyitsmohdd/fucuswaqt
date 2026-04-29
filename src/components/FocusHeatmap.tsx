'use client';

import { useEffect, useState, useMemo } from 'react';
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

    // Memoize all days — only recalculates when focusData changes
    const allDays = useMemo(() => {
        const days: { date: string; data: FocusDay | null }[] = [];
        const currentYear = new Date().getFullYear();
        const todayStr = new Date().toISOString().split('T')[0];
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        const current = new Date(startDate);

        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            const dayData = focusData.find(d => d.date === dateStr);
            const isFuture = dateStr > todayStr;
            days.push({ date: dateStr, data: isFuture ? null : (dayData || null) });
            current.setDate(current.getDate() + 1);
        }

        return days;
    }, [focusData]);

    // Memoize stats
    const { totalHours, activeDays, currentStreak, longestStreak } = useMemo(() => {
        const totalMinutes = focusData.reduce((sum, day) => sum + day.focus_minutes, 0);
        const active = focusData.filter(day => day.focus_minutes > 0).length;

        // Current streak
        let cStreak = 0;
        const todayStr = new Date().toISOString().split('T')[0];
        for (let i = 0; i <= 365; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            const dayData = focusData.find(fd => fd.date === dStr);
            if (dayData && dayData.focus_minutes > 0) {
                cStreak++;
            } else if (dStr !== todayStr) {
                break;
            }
        }

        // Longest streak
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

        return {
            totalHours: Math.floor(totalMinutes / 60),
            activeDays: active,
            currentStreak: cStreak,
            longestStreak: longest,
        };
    }, [focusData, allDays]);

    function getColorClass(minutes: number | undefined): string {
        if (!minutes || minutes === 0) return 'bg-gray-800/30';
        if (minutes < 30) return 'bg-green-900/50';
        if (minutes < 60) return 'bg-green-700/70';
        if (minutes < 120) return 'bg-green-600/85';
        return 'bg-green-500';
    }

    function formatTime(minutes: number): string {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    if (loading) {
        return (
            <div className={`p-4 rounded-xl bg-white/4 backdrop-blur-sm ${className}`}>
                <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-white/8 rounded w-36" />
                    <div className="h-24 bg-white/8 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-xl bg-white/4 backdrop-blur-sm border border-white/6 ${className}`}>
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-sm font-semibold text-white/90 tracking-tight">Focus Activity</h2>
                <div className="flex gap-4 text-xs">
                    {[
                        { label: 'Total', value: `${totalHours}h` },
                        { label: 'Days', value: activeDays },
                        { label: 'Streak', value: `${currentStreak}🔥` },
                        { label: 'Best', value: longestStreak },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <div className="text-white/35 text-[10px] uppercase tracking-wider">{label}</div>
                            <div className="text-white font-semibold mt-0.5">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="relative overflow-x-auto">
                {/* Month labels */}
                <div className="flex mb-1.5 text-[10px] text-white/30 ml-10 min-w-[650px]">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                        <div key={month} className="flex-1 text-left">{month}</div>
                    ))}
                </div>

                <div className="flex gap-1.5 min-w-[650px]">
                    {/* Day labels */}
                    <div className="flex flex-col gap-0.5 text-[10px] text-white/30 justify-around h-[90px]">
                        <div>Mon</div>
                        <div>Wed</div>
                        <div>Fri</div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-flow-col grid-rows-7 gap-0.5 flex-1 relative">
                        {allDays.map(({ date, data }) => (
                            <div
                                key={date}
                                className="group relative w-[12px] h-[12px] rounded-sm cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-white/40 hover:scale-125"
                            >
                                <div className={`w-full h-full rounded-sm ${getColorClass(data?.focus_minutes)}`} />

                                {/* Tooltip */}
                                <div className="invisible group-hover:visible absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black/95 text-white rounded-lg px-2.5 py-2 shadow-xl border border-white/15 z-[99999] pointer-events-none text-xs whitespace-nowrap">
                                    <div className="font-medium text-white/70 mb-0.5">
                                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {data && data.focus_minutes > 0 ? (
                                        <>
                                            <div className="text-green-400 font-semibold">{formatTime(data.focus_minutes)}</div>
                                            <div className="text-white/35 text-[10px] mt-0.5">{data.sessions_completed} sessions</div>
                                        </>
                                    ) : (
                                        <div className="text-white/35">No focus</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-white/30">
                <span>Less</span>
                <div className="flex gap-0.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gray-800/30" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-900/50" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-700/70" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-600/85" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
