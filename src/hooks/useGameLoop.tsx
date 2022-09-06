import { useState, useEffect } from "react";

const useGameLoop = (callback: () => void, framerate: number) => {
    const [frameTime, setFrameTime] = useState<number>();

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
        callback();
    }, [frameTime]);
};

export default useGameLoop;
