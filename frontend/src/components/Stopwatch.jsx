import React, { useEffect, useRef, useState } from "react";
import "../styles/components/Stopwatch.css";
import { FaPlay, FaPause, FaReply } from "react-icons/fa";

const Stopwatch = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
                setTimeElapsed(Date.now() - startTimeRef.current);
            }, 10);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        };
    }, [isRunning]);

    const startStopTime = () => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = Date.now() - timeElapsed;
        } else {
            setIsRunning(false);
        }
    };

    const resetTime = () => {
        setTimeElapsed(0);
        setIsRunning(false);
    };

    const formatTime = () => {
        let hours = Math.floor(timeElapsed / (1000 * 60 * 60));
        let minutes = Math.floor((timeElapsed / (1000 * 60)) % 60);
        let seconds = Math.floor((timeElapsed / 1000) % 60);

        hours = String(hours).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="stopwatch">
            <div className="stopwatch-display">
                <h1>{formatTime()}</h1>
            </div>
            <div className="stopwatch-controls">
                <button
                    className={!isRunning ? "start-button" : "stop-button"}
                    onClick={startStopTime}
                >
                    {!isRunning ? <FaPlay /> : <FaPause />}
                </button>
                {timeElapsed > 0 && !isRunning && (
                    <button className="reset-button" onClick={resetTime}>
                        <FaReply />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Stopwatch;
