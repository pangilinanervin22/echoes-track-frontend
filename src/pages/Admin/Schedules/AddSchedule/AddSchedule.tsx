import { useState } from "react";
import { useGetRooms } from "../../Rooms/useRooms";
import TimePicker from "../TimePicker";
import { Schedule, isScheduleValid, useAddSchedule } from "../useSchedules";
import { useNavigate } from "react-router-dom";

function AddSchedule() {
  const navigate = useNavigate();
  const { rooms } = useGetRooms();
  const { addSchedule } = useAddSchedule();
  const [schedule, setSchedule] = useState<Schedule>({
    day: '',
    room: '',
    section: '',
    start: '',
    end: '',
    subject: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your logic to save the schedule here

    if (isScheduleValid(schedule))
      addSchedule({
        day: schedule.day,
        room: schedule.room,
        section: schedule.section,
        start: schedule.start,
        end: schedule.end,
        subject: schedule.subject
      });
    else {
      alert("Invalid Schedule");
      return;
    }
  };

  return (
    <>
      <button onClick={() => { navigate("/admin/user") }}>back to table</button>

      <p>Add Schedule</p>
      <form onSubmit={handleSubmit}>
        <label>
          Room:
          <select name="room" value={schedule.room} onChange={handleChange}
            required>
            <option value="" disabled> Select Room  </option>
            {rooms.map(room => (
              <option key={room.id} value={room.name}>{room.name}</option>
            ))}
          </select>
        </label>
        <label>
          Subject:
          <input type="text" name="subject" value={schedule.subject} onChange={handleChange} required />
        </label>
        <label>
          Section:
          <input type="text" name="section" value={schedule.section} onChange={handleChange} required />
        </label>
        <label>
          Day:
          <select name="day" value={schedule.day} onChange={handleChange} required>
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
            setSchedule(prevSchedule => ({ ...prevSchedule, start: timeString }))
          }
          changeOutTime={(timeString: string) =>
            setSchedule(prevSchedule => ({ ...prevSchedule, end: timeString }))
          }
          initialInTime={schedule.start}
          initialOutTime={schedule.end}
        />
        <button type="submit">Add Schedule</button>
      </form>
    </>
  );
}

export default AddSchedule;