import { useState } from "react";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import Dialog from "../../../Components/Dialog/Dialog";
import { useNavigate } from "react-router-dom";
import { User } from "../Users/useUsers";
import { toast } from "react-toastify";
import { Attendance, useDeleteAttendance, useGetAttendance } from "./useAttendance";
import style from "./attendance.module.scss";

const content: TableStructure = {
    id: "id",
    title: "Attendance",
    searchPath: "name",
    structure: [
        { label: "Name", path: "name", width: "250px", fontSize: "16px" },
        { label: "Subject", path: "subject", width: "150px", fontSize: "16px" },
        { label: "Section", path: "section", width: "150px", fontSize: "16px" },
        { label: "Role", path: "role", width: "100px", fontSize: "16px" },
        {
            label: "Date", path: "date", width: "150px", fontSize: "16px",
            element: (data: any) => {
                // const timestamp = data.date;
                // Convert the Timestamp to a JavaScript Date object
                // const date = timestamp.toDate();
                // Get the month, day, and year
                const date = data.date;
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                return <div>{month}/{day}/{year}</div>
            }
        }
    ]
};

export default function Schedule() {
    const navigate = useNavigate();
    const [currentDeleteId, setCurrentDeleteId] = useState("");
    const attendance = useGetAttendance();
    const { deleteAttendance } = useDeleteAttendance();
    console.log(attendance);

    return (
        <main className={style.mainContainer}>

            <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting attendance...");
                const res = await deleteAttendance(currentDeleteId);

                if (res.ok)
                    toast.update(loading, { type: "success", render: res.message });
                else if (res.error)
                    toast.update(loading, { type: "error", render: res.message });
                else
                    toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div>
                    <h4>Are you sure want to delete?</h4>
                    <p>This schedule will delete. You cannot undo this action.</p>
                </div>
            </Dialog>
            <div className={style.centered}>
                <div className={style.printContainer}>
                    <button className={style.printButton}
                        onClick={() => {
                            autoTable(doc, {
                                head: [['Name', "Section", 'Date', 'Subject']],
                                body: attendance.map(item => [
                                    item.name,
                                    item.section,
                                    format(item.date, 'yyyy-MM-dd'),
                                    item.subject
                                ])
                            });

                            doc.save('attendance_report.pdf');
                        }}>Print</button>
                </div>
                <MainTable
                    data={attendance}
                    isEditable={true}
                    structure={content}
                    // handleUpdate={onHandleUpdate}
                    handleDelete={onHandleDelete}
                />
            </div>
        </main>

    );

    function onHandleDelete(data: User) {
        setCurrentDeleteId(data.id || "");
        // setCurrentDeleteImage(data.image || "");
        navigate("/admin/attendance?showDialog=y");
    }

    // function onHandleAdd() {
    //     navigate("/admin/user/add");
    // }

    // function onHandleUpdate(data: User) {
    //     navigate(`/admin/user/${data.id}`);
    // }
}

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";

const doc = new jsPDF();

