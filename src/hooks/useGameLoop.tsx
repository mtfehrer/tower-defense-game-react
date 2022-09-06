import { useState, useRef, useEffect } from "react";

const useGameLoop = (
    frameUpdateCallback: () => void,
    eventUpdateCallback: () => void,
    framerate: number,
    eventUpdateTime: number
) => {
    const [frameTime, setFrameTime] = useState<number>(0);
    const startTime = useRef<number | null>(null);

    useEffect(() => {
        let frameId: number;
        const frame = (time: number) => {
            setFrameTime(time);
            frameId = requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        return () => cancelAnimationFrame(frameId);
    }, []);

    //Calls the callback function every time the frame time is updated
    useEffect(() => {
        frameUpdateCallback();
        if (startTime.current === null) {
            startTime.current = frameTime;
        }
        const elapsed = frameTime - startTime.current;
        if (elapsed > eventUpdateTime) {
            eventUpdateCallback();
            startTime.current = null;
        }
    }, [frameTime]);
};

export default useGameLoop;
