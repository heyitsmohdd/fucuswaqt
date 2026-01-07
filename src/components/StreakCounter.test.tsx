import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StreakCounter } from './StreakCounter';

// Mock the useAppStore hook
vi.mock('@/stores/appStore', () => ({
    useAppStore: vi.fn(),
}));

import { useAppStore } from '@/stores/appStore';

describe('StreakCounter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the flame icon', () => {
        vi.mocked(useAppStore).mockReturnValue({ streakDays: 5 });

        render(<StreakCounter />);

        // The Flame icon should be present (as an SVG)
        const container = screen.getByText('5').closest('div');
        expect(container).toBeInTheDocument();
        expect(container?.querySelector('svg')).toBeInTheDocument();
    });

    it('displays the correct streak count', () => {
        vi.mocked(useAppStore).mockReturnValue({ streakDays: 7 });

        render(<StreakCounter />);

        expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('displays zero streak correctly', () => {
        vi.mocked(useAppStore).mockReturnValue({ streakDays: 0 });

        render(<StreakCounter />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
        vi.mocked(useAppStore).mockReturnValue({ streakDays: 10 });

        render(<StreakCounter />);

        const container = screen.getByText('10').closest('div');
        expect(container).toHaveClass('rounded-full');
        expect(container).toHaveClass('bg-black/40');
    });
});
