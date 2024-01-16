import { Outlet, useNavigate } from "react-router-dom";
import { useDeleteSchedule, useGetSchedules } from "./useSchedules";

export default function Schedule() {
    const navigate = useNavigate();
    const schedules = useGetSchedules();
    const { deleteSchedule, status } = useDeleteSchedule();
    return (
        <>
            <div>Schedule</div>
            <button onClick={() => navigate("/admin/schedule/add")}>
                Go To Add Schedule
            </button>
            <table>
                <thead>
                    <tr>
                        <th>room</th>
                        <th>subject</th>
                        <th>section</th>
                        <th>day</th>
                        <th>start</th>
                        <th>end</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(schedule => (
                        <tr key={schedule.id}>
                            <td>{schedule.room}</td>
                            <td>{schedule.subject}</td>
                            <td>{schedule.section}</td>
                            <td>{schedule.day}</td>
                            <td>{schedule.start}</td>
                            <td>{schedule.end}</td>
                            <td>
                                <button onClick={() => {
                                    navigate(`/admin/schedule/${schedule.id}`);
                                }}>Edit</button>
                                <button onClick={() => { deleteSchedule(schedule.id || " ") }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Outlet />
        </>
    )
}
