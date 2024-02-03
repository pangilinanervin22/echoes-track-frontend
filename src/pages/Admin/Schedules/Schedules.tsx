import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDeleteSchedule, useGetSchedules } from "./useSchedules";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import scheduleStyle from "./scheduleStyle.module.scss"

const content: TableStructure = {
    id: "id",
    title: "Schedule",
    searchPath: "room",
    structure: [
        { label: "ID", path: "id", width: "300px", fontSize: "16px" },
        { label: "Room ", path: "room", width: "200px", fontSize: "16px" },
        { label: "Subject", path: "subject", width: "200px", fontSize: "16px" },
    ]
};


export default function Schedule() {
    const navigate = useNavigate();
    const path = useLocation();
    const schedules = useGetSchedules();
    const { deleteSchedule } = useDeleteSchedule();


    return (
        <main className={scheduleStyle.mainContainer}>
            <div className={scheduleStyle.centered}>
                {path.pathname.endsWith("/admin/schedule") ? <MainTable
                    data={schedules}
                    isEditable={true}
                    structure={content}
                    handleUpdate={onHandleUpdate}
                    handleDelete={onHandleDelete}
                    handleAdd={onHandleAdd}
                /> :
                    <Outlet />
                }
            </div>

        </main>
    );

    function onHandleDelete(data: any) {
        deleteSchedule(data.id || " ")
    }

    function onHandleAdd() {
        navigate("/admin/schedule/add");
    }

    function onHandleUpdate(data: any) {
        navigate(`/admin/schedule/${data.id}`);
    }
}
