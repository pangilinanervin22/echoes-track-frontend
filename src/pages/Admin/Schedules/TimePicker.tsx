import React from 'react';
import { parse, isAfter } from 'date-fns';

interface Props {
    changeInTime: (time: string) => void;
    changeOutTime: (time: string) => void;
    initialInTime?: string;
    initialOutTime?: string;
}

const TimePicker: React.FC<Props> = ({ changeInTime, changeOutTime, initialInTime, initialOutTime }) => {
    // State to hold the selected In and Out times

    // Array of hours (12-hour format)
    const hours: number[] = [12, ...Array.from({ length: 11 }, (_, index) => index + 1)];
    // Array of periods (AM/PM)
    const periods: string[] = ['AM', 'PM'];

    // Event handlers for time selection
    const handleInTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;

        changeInTime(value);
        changeOutTime("");
    };

    const handleOutTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;

        // Parse the In and Out times
        const inTime = parse(initialInTime || "", 'h:mm a', new Date());
        const outTime = parse(value, 'h:mm a', new Date());

        // Validate that the Out time is ahead of the In time
        if (!isAfter(outTime, inTime)) {
            alert('Out time must be later than In time');
            return;
        }

        changeOutTime(value);
    };

    return (
        <div>
            <label htmlFor="inTimePicker">Select In Time:</label>
            <select id="inTimePicker" value={initialInTime} onChange={handleInTimeChange} required>
                <option value="" disabled>
                    Select a Time
                </option>
                {periods.map((period) =>
                    hours.map((hour) => (
                        <option key={`in-${hour}${period}`} value={`${hour}:00 ${period}`}>
                            {`${hour.toString().padStart(2, '0')}:00 ${period}`}
                        </option>
                    ))
                )}
            </select>

            <label htmlFor="outTimePicker">Select Out Time:</label>
            <select id="outTimePicker" value={initialOutTime} onChange={handleOutTimeChange} required>
                <option value="" disabled>
                    Select a Time
                </option>
                {periods.map((period) =>
                    hours.map((hour) => (
                        <option key={`in-${hour}${period}`} value={`${hour}:00 ${period}`}>
                            {`${hour.toString().padStart(2, '0')}:00 ${period}`}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

export default TimePicker;
