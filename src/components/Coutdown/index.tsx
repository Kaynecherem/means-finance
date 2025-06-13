import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface CountdownProps {
    from: moment.Moment;
    countDownCompleted?: () => void
}

const Countdown: React.FC<CountdownProps> = ({ from, countDownCompleted }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    useEffect(() => {

        const countdownDuration = moment.duration(2, 'minutes');
        const targetTime = moment(from).add(countdownDuration);

        const updateCountdown = () => {
            const currentTime = moment();
            const timeLeft = targetTime.diff(currentTime);

            if (timeLeft > 0) {
                setTimeRemaining(timeLeft);
            } else {
                setTimeRemaining(0);
                clearInterval(interval);  // Stop the countdown when time is up
                if (countDownCompleted) {
                    countDownCompleted()
                }
            }
        };

        // Start the countdown
        const interval = setInterval(updateCountdown, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from]);
    // Calculate minutes and seconds from `timeRemaining`
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

    return (
        <>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</>
    );
};

export default Countdown;
