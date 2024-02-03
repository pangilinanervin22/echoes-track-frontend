import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Schedule, useDeleteSchedule, useGetSchedules } from "./useSchedules";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import scheduleStyle from "./scheduleStyle.module.scss"
import Dialog from "../../../Components/Dialog/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";

const content: TableStructure = {
    id: "id",
    title: "Schedule",
    searchPath: "room",
    structure: [
        { label: "Room ", path: "room", width: "100px", fontSize: "16px" },
        { label: "Subject", path: "subject", width: "150px", fontSize: "16px" },
        { label: "Day ", path: "day", width: "100px", fontSize: "16px" },
        { label: "Start Time", path: "start", width: "150px", fontSize: "16px" },
        { label: "End Time", path: "end", width: "150px", fontSize: "16px" },
    ]
};

export default function Schedule() {
    const navigate = useNavigate();
    const path = useLocation();
    const schedules = useGetSchedules();
    const { deleteSchedule } = useDeleteSchedule();
    const [currentDeleteId, setCurrentDeleteId] = useState("");

    return (
        <main className={scheduleStyle.mainContainer}>
            <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting schedule...");
                const res = await deleteSchedule(currentDeleteId);

                if (res.ok)
                    toast.update(loading, { type: "success", render: res.message });
                else if (res.error)
                    toast.update(loading, { type: "error", render: res.message });
                else
                    toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div className={scheduleStyle.dialog}>
                    <h4>Are you sure want to delete?</h4>
                    <p>This will schedule will delete. You cannot undo this action.</p>
                </div>
            </Dialog>
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

    function onHandleDelete(data: Schedule) {
        setCurrentDeleteId(data.id || "");
        navigate("/admin/schedule?showDialog=y");
    }

    function onHandleAdd() {
        navigate("/admin/schedule/add");
    }

    function onHandleUpdate(data: Schedule) {
        navigate(`/admin/schedule/${data.id}`);
    }
}
