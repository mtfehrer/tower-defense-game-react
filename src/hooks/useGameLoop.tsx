import { useState, useRef, useEffect } from "react";

const useGameLoop = (callback: () => void, framerate: number) => {
    const [frameTime, setFrameTime] = useState<number>();
    const startTime = useRef<number | null>(null);

    useEffect(() => {
        let frameId: number;
        const frame = (currentTime: number) => {
            setFrameTime(currentTime);
            frameId = requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        return () => cancelAnimationFrame(frameId);
    }, []);

    useEffect(() => {
        if (startTime.current === null) {
            startTime.current = frameTime as number;
        }
        const elapsed = (frameTime as number) - startTime.current;
        if (elapsed > 1 / framerate) {
            callback();
            startTime.current = null;
            console.log(`update, frametime: ${frameTime}`);
        }
    }, [frameTime]);
};

export default useGameLoop;
