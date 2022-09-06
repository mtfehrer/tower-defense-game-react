import { useState, useEffect } from "react";

const useGameLoop = (callback: () => void, framerate: number) => {
    const [frameTime, setFrameTime] = useState<number>();

    // if (start === undefined) {
    //     start = timestamp;
    // }
    // const elapsed = timestamp - start;

    // if (elapsed > framerate???) {
    //     // do something
    // }

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
