import { useState, useEffect } from 'react';

/**
 * A custom hook that calculates and updates the elapsed time from a given date
 * @param startDate - The start date to calculate elapsed time from
 * @param updateInterval - How often to update the elapsed time (in ms), defaults to 1000 (1 second)
 * @returns A formatted string of elapsed time in days, hours, minutes, seconds
 */
export const useElapsedTime = (
   startDate: string | undefined,
   updateInterval: number = 1000
): string => {
   const [timeElapsed, setTimeElapsed] = useState<string>('');

   useEffect(() => {
      if (!startDate) {
         setTimeElapsed('--');
         return;
      }

      const calculateElapsedTime = () => {
         try {
            const start = new Date(startDate);
            const now = new Date();

            const diffTime = Math.abs(now.getTime() - start.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor(
               (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const diffMinutes = Math.floor(
               (diffTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

            setTimeElapsed(
               `${diffDays}d ${diffHours}h ${diffMinutes}m ${diffSeconds}s`
            );
         } catch (error) {
            console.error('Error calculating elapsed time:', error);
            setTimeElapsed('--');
         }
      };

      calculateElapsedTime();
      const interval = setInterval(calculateElapsedTime, updateInterval);

      return () => clearInterval(interval);
   }, [startDate, updateInterval]);

   return timeElapsed;
};
