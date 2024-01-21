import { useEffect, useState } from "react";
import { Schedule, isScheduleValid, useGetSchedule, useUpdateSchedule } from "../useSchedules";
import { useGetRooms } from "../../Rooms/useRooms";
import { useParams } from 'react-router-dom';
import TimePicker from "../TimePicker";
import style from './AddSchedule.module.css';

function EditSchedule() {
    const { id } = useParams<{ id: string }>();
    const { rooms } = useGetRooms();
    const { schedule: initialData, error } = useGetSchedule(id || "");
    const { updateSchedule } = useUpdateSchedule();
    const [formSchedule, setFormSchedule] = useState<Schedule>(
        { day: "", room: "", section: "", start: "", end: "", subject: "" }
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormSchedule({
            ...formSchedule,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your logic to save the schedule here

        if (isScheduleValid(formSchedule))
            updateSchedule(id || "",
                {
                    day: formSchedule.day,
                    room: formSchedule.room,
                    section: formSchedule.section,
                    start: formSchedule.start,
                    end: formSchedule.end,
                    subject: formSchedule.subject
                });
        else {
            alert("Invalid Schedule");
            return;
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormSchedule(initialData);
        }
    }, [initialData]);


    if (error) {
        return <div>{"Schedule not found"}</div>;
    }

    return (
        <>
            <br />
            <p>Edit Schedule</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Room:
                    <select name="room" value={formSchedule.room} onChange={handleChange}
                        required>
                        <option value="" disabled> Select Room  </option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.name}>{room.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Subject:
                    <input type="text" name="subject" value={formSchedule.subject} onChange={handleChange} required />
                </label>
                <label>
                    Section:
                    <input type="text" name="section" value={formSchedule.section} onChange={handleChange} required />
                </label>
                <label>
                    Day:
                    <select name="day" value={formSchedule.day} onChange={handleChange} required>
                        <option value="">Select a day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </label>
                <TimePicker
                    changeInTime={(timeString: string) =>
                        setFormSchedule(prevSchedule => ({ ...prevSchedule, start: timeString }))
                    }
                    changeOutTime={(timeString: string) =>
                        setFormSchedule(prevSchedule => ({ ...prevSchedule, end: timeString }))
                    }
                    initialInTime={formSchedule.start}
                    initialOutTime={formSchedule.end}
                />
                <button type="submit">Edit Schedule</button>
            </form>
        </>
    );
}

export default EditSchedule;