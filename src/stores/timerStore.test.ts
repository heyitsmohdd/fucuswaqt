import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimerStore } from './timerStore';
import { TIMER_DEFAULTS } from '@/constants';

describe('timerStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useTimerStore.setState({
            isRunning: false,
            timeLeft: TIMER_DEFAULTS.FOCUS_DURATION,
            mode: 'focus',
            completedSessions: 0,
        });
    });

    describe('initial state', () => {
        it('should have correct initial values', () => {
            const state = useTimerStore.getState();
            expect(state.isRunning).toBe(false);
            expect(state.timeLeft).toBe(TIMER_DEFAULTS.FOCUS_DURATION);
            expect(state.mode).toBe('focus');
            expect(state.completedSessions).toBe(0);
        });
    });

    describe('startTimer', () => {
        it('should set isRunning to true', () => {
            const { startTimer } = useTimerStore.getState();
            startTimer();
            expect(useTimerStore.getState().isRunning).toBe(true);
        });
    });

    describe('pauseTimer', () => {
        it('should set isRunning to false', () => {
            useTimerStore.setState({ isRunning: true });
            const { pauseTimer } = useTimerStore.getState();
            pauseTimer();
            expect(useTimerStore.getState().isRunning).toBe(false);
        });
    });

    describe('resetTimer', () => {
        it('should reset timeLeft to focus duration', () => {
            useTimerStore.setState({ timeLeft: 100, isRunning: true });
            const { resetTimer } = useTimerStore.getState();
            resetTimer();

            const state = useTimerStore.getState();
            expect(state.timeLeft).toBe(TIMER_DEFAULTS.FOCUS_DURATION);
            expect(state.isRunning).toBe(false);
        });

        it('should reset to break duration when in break mode', () => {
            useTimerStore.setState({ mode: 'break', timeLeft: 100 });
            const { resetTimer } = useTimerStore.getState();
            resetTimer();

            expect(useTimerStore.getState().timeLeft).toBe(TIMER_DEFAULTS.BREAK_DURATION);
        });
    });

    describe('tick', () => {
        it('should decrement timeLeft by 1 when running', () => {
            const initialTime = 1000;
            useTimerStore.setState({ isRunning: true, timeLeft: initialTime });
            const { tick } = useTimerStore.getState();
            tick();

            expect(useTimerStore.getState().timeLeft).toBe(initialTime - 1);
        });

        it('should not decrement when not running', () => {
            const initialTime = 1000;
            useTimerStore.setState({ isRunning: false, timeLeft: initialTime });
            const { tick } = useTimerStore.getState();
            tick();

            expect(useTimerStore.getState().timeLeft).toBe(initialTime);
        });

        it('should stop running and increment sessions when timer completes in focus mode', () => {
            // Mock Audio as a class constructor
            const mockPlay = vi.fn().mockResolvedValue(undefined);
            vi.stubGlobal('Audio', class {
                play = mockPlay;
            });

            useTimerStore.setState({ isRunning: true, timeLeft: 1, mode: 'focus', completedSessions: 2 });
            const { tick } = useTimerStore.getState();
            tick();

            const state = useTimerStore.getState();
            expect(state.timeLeft).toBe(0);
            expect(state.isRunning).toBe(false);
            expect(state.completedSessions).toBe(3);
        });
    });

    describe('switchMode', () => {
        it('should switch to break mode with correct duration', () => {
            const { switchMode } = useTimerStore.getState();
            switchMode('break');

            const state = useTimerStore.getState();
            expect(state.mode).toBe('break');
            expect(state.timeLeft).toBe(TIMER_DEFAULTS.BREAK_DURATION);
            expect(state.isRunning).toBe(false);
        });

        it('should switch to longBreak mode with correct duration', () => {
            const { switchMode } = useTimerStore.getState();
            switchMode('longBreak');

            const state = useTimerStore.getState();
            expect(state.mode).toBe('longBreak');
            expect(state.timeLeft).toBe(TIMER_DEFAULTS.LONG_BREAK_DURATION);
        });
    });
});
