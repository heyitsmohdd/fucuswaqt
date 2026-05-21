'use client';

import { useState, useCallback } from 'react';

const PIXEL_SIZE = 5;
const G = '#72C47A';
const W = '#FFFEF0';
const D = '#1C3A1E';
const _ = null;

const MASCOT_PIXELS: (string | null)[][] = [
    [_, _, _, G, G, G, G, _, _, _],
    [_, _, G, G, G, G, G, G, _, _],
    [_, G, G, G, G, G, G, G, G, _],
    [G, G, G, G, G, G, G, G, G, G],
    [G, G, W, W, G, G, W, W, G, G],
    [G, G, D, W, G, G, D, W, G, G],
    [G, G, G, G, G, G, G, G, G, G],
    [_, G, D, G, G, G, G, D, G, _],
    [_, G, G, D, D, D, D, G, G, _],
    [_, G, G, G, _, _, G, G, G, _],
];

const MASCOT_WIDTH = 10;
const MASCOT_HEIGHT = 10;

export function PixelMascot() {
    const [isJumping, setIsJumping] = useState(false);

    const handleClick = useCallback(() => {
        if (isJumping) return;
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 520);
    }, [isJumping]);

    return (
        <>
            <style>{`
                @keyframes mascot-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes mascot-jump {
                    0%   { transform: translateY(0px) scaleY(1); }
                    20%  { transform: translateY(-16px) scaleY(1.05); }
                    50%  { transform: translateY(-20px) scaleY(1); }
                    80%  { transform: translateY(-6px) scaleY(0.93); }
                    100% { transform: translateY(0px) scaleY(1); }
                }
                .mascot-idle { animation: mascot-float 2.4s ease-in-out infinite; }
                .mascot-jump { animation: mascot-jump 0.52s cubic-bezier(0.34,1.56,0.64,1) forwards; }
            `}</style>
            <button
                onClick={handleClick}
                aria-label="Mascot"
                className={isJumping ? 'mascot-jump' : 'mascot-idle'}
                style={{
                    position: 'fixed',
                    bottom: '4.75rem',
                    left: '1.85rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    zIndex: 21,
                    transformOrigin: 'bottom center',
                }}
            >
                <svg
                    width={MASCOT_WIDTH * PIXEL_SIZE}
                    height={MASCOT_HEIGHT * PIXEL_SIZE}
                    style={{ imageRendering: 'pixelated', display: 'block' }}
                >
                    {MASCOT_PIXELS.flatMap((row, rowIdx) =>
                        row.map((color, colIdx) =>
                            color ? (
                                <rect
                                    key={`${rowIdx}-${colIdx}`}
                                    x={colIdx * PIXEL_SIZE}
                                    y={rowIdx * PIXEL_SIZE}
                                    width={PIXEL_SIZE}
                                    height={PIXEL_SIZE}
                                    fill={color}
                                />
                            ) : null
                        )
                    )}
                </svg>
            </button>
        </>
    );
}
