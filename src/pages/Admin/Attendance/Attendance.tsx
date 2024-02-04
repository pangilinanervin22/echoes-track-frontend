import { useState } from "react";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import Dialog from "../../../Components/Dialog/Dialog";
import { useNavigate } from "react-router-dom";
import { User } from "../Users/useUsers";
import { toast } from "react-toastify";
import { useGetAttendance } from "./useAttendance";
import style from "./attendance.module.scss";

interface Attendance {
    studentId: string;
    room: string;
    section: string;
    subject: string;
    id?: string;
    // student_ref?: DocumentReference;
}

const content: TableStructure = {
    id: "id",
    title: "Attendance",
    searchPath: "room",
    structure: [
        { label: "Room ", path: "room", width: "120px", fontSize: "16px" },
        { label: "Subject", path: "subject", width: "150px", fontSize: "16px" },
        { label: "Section", path: "section", width: "150px", fontSize: "16px" },
        { label: "Name", path: "name", width: "250px", fontSize: "16px" },
        { label: "Role", path: "role", width: "100px", fontSize: "16px" },
    ]
};

export default function Schedule() {
    const navigate = useNavigate();
    const [currentDeleteId, setCurrentDeleteId] = useState<any>("");
    const attendance = useGetAttendance();

    return (
        <main className={style.mainContainer}>
            <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting room...");
                //

                // if (res.ok)
                //     toast.update(loading, { type: "success", render: res.message });
                // else if (res.error)
                //     toast.update(loading, { type: "error", render: res.message });
                // else
                //     toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div>
                    <h4>Are you sure want to delete?</h4>
                    <p>This will schedule will delete. You cannot undo this action.</p>
                </div>
            </Dialog>
            <div className={style.centered}>
                <MainTable
                    data={attendance}
                    isEditable={true}
                    structure={content}
                    handleUpdate={onHandleUpdate}
                    handleDelete={onHandleDelete}
                />
            </div>
        </main>

    );

    function onHandleDelete(data: User) {
        setCurrentDeleteId(data.id || "");
        // setCurrentDeleteImage(data.image || "");
        navigate("/admin/user?showDialog=y");
    }

    function onHandleAdd() {
        navigate("/admin/user/add");
    }

    function onHandleUpdate(data: User) {
        navigate(`/admin/user/${data.id}`);
    }
}