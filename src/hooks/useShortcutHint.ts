import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useShortcutHint(storageKey: string, toastMessage?: string) {
    const [visible, setVisible] = useState(false);

    const trigger = useCallback(() => {
        if (typeof window === 'undefined') return;
        if (localStorage.getItem(storageKey)) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;
        localStorage.setItem(storageKey, '1');
        setVisible(true);
        if (toastMessage) toast(toastMessage, { duration: 3000 });
        setTimeout(() => setVisible(false), 2000);
    }, [storageKey, toastMessage]);

    return { visible, trigger };
}
