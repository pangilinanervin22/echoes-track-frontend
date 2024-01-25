import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetRoomByName, useGetRoomByNameRealTime } from '../../Admin/Rooms/useRooms';
import { Schedule } from '../../Admin/Schedules/useSchedules';
import { format, getDay, isWithinInterval, parse } from 'date-fns';

export default function ScanRoom() {
    const params = useParams();
    const { getRoomByName, isLoading, room, schedules } = useGetRoomByNameRealTime();
    const [currentSchedule, setCurrentSchedule] = useState<Schedule | undefined>();

    useEffect(() => {
        getRoomByName(params.id || "");
        console.log("render");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    useEffect(() => {
        // Function to update current schedule
        const updateCurrentSchedule = () => {
            const newCurrentSchedule = schedules.find(isCurrentDateInSchedule);
            setCurrentSchedule(newCurrentSchedule);
        };

        // Update current schedule immediately and at the start of every new hour
        updateCurrentSchedule();
        const intervalId = setInterval(updateCurrentSchedule, 1000 * 60 * 60);
        console.log("interval");

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [schedules]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (currentSchedule) {
        console.log(currentSchedule);
        console.log("present");

    } else {
        console.log("No current schedule");
    }

    return (
        <section>
            <h1>ScanRoom</h1>
            <div>Room: {room?.name}</div>
            <div>Schedules: {schedules.length}</div>
            <CurrentTime />
        </section>
    )
}


export function CurrentTime() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time every second
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
            console.log(currentTime.getSeconds());
        }, 1000);


        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [currentTime]);

    return <div>Current time: {format(currentTime, 'h:mm:ss aa')}</div>;
}

function isCurrentDateInSchedule(schedule: Schedule): boolean {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();

    const currentDay = days[getDay(currentDate)];
    console.log(currentDay);

    // Parse schedule start and end times to Date objects for comparison
    const start = parse(schedule.start, 'h:mm aa', new Date());
    const end = parse(schedule.end, 'h:mm aa', new Date());

    // Check if current day and time falls within the schedule
    const isWithinSchedule = currentDay === schedule.day && isWithinInterval(currentDate, { start, end });

    // If the current hour exceeds the end time of the schedule, revalidate the schedule
    if (isWithinSchedule && currentDate > end) {
        return false;
    }

    return isWithinSchedule;
}