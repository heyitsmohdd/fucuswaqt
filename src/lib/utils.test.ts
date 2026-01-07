import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
    it('merges class names correctly', () => {
        const result = cn('class1', 'class2');
        expect(result).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
        const isActive = true;
        const isDisabled = false;

        const result = cn(
            'base-class',
            isActive && 'active',
            isDisabled && 'disabled'
        );

        expect(result).toBe('base-class active');
        expect(result).not.toContain('disabled');
    });

    it('handles undefined and null values', () => {
        const result = cn('base', undefined, null, 'end');
        expect(result).toBe('base end');
    });

    it('handles empty strings', () => {
        const result = cn('base', '', 'end');
        expect(result).toBe('base end');
    });

    it('uses tailwind-merge to resolve conflicts', () => {
        // tailwind-merge should keep the last conflicting class
        const result = cn('px-2', 'px-4');
        expect(result).toBe('px-4');
    });

    it('handles array inputs via clsx', () => {
        const result = cn(['class1', 'class2'], 'class3');
        expect(result).toBe('class1 class2 class3');
    });

    it('handles object syntax for conditional classes', () => {
        const result = cn({
            'always-present': true,
            'sometimes-present': true,
            'never-present': false,
        });

        expect(result).toBe('always-present sometimes-present');
    });

    it('merges conflicting Tailwind classes correctly', () => {
        // Background color conflict
        const bgResult = cn('bg-red-500', 'bg-blue-500');
        expect(bgResult).toBe('bg-blue-500');

        // Padding conflict
        const paddingResult = cn('p-4', 'p-2');
        expect(paddingResult).toBe('p-2');
    });
});
