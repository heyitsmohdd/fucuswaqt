import { useState, useCallback } from 'react';

export function useShortcutHint(storageKey: string) {
    const [visible, setVisible] = useState(false);

    const trigger = useCallback(() => {
        if (typeof window === 'undefined') return;
        if (localStorage.getItem(storageKey)) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;
        localStorage.setItem(storageKey, '1');
        setVisible(true);
        setTimeout(() => setVisible(false), 2000);
    }, [storageKey]);

    return { visible, trigger };
}
