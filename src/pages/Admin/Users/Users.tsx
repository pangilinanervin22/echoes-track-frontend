import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { User, useDeleteUser, useGetUsers } from "./useUsers";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import userStyle from "./userStyle.module.scss"
import Dialog from "../../../Components/Dialog/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";

const content: TableStructure = {
    id: "id",
    title: "Users",
    searchPath: "name",
    structure: [
        { label: "Rfid", path: "rfid", width: "100px", fontSize: "16px" },
        { label: "Name ", path: "name", width: "300px", fontSize: "16px" },
        { label: "Role", path: "role", width: "150px", fontSize: "16px" },
    ]
};

export default function Users() {
    const navigate = useNavigate();
    const { users, loading } = useGetUsers();
    const { deleteUser } = useDeleteUser();
    const path = useLocation();
    const [currentDeleteId, setCurrentDeleteId] = useState("");
    const [currentDeleteImage, setCurrentDeleteImage] = useState("");


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={userStyle.mainContainer}>
            <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting user...");
                const res = await deleteUser(currentDeleteId, currentDeleteImage);

                if (res.ok)
                    toast.update(loading, { type: "success", render: res.message });
                else if (res.error)
                    toast.update(loading, { type: "error", render: res.message });
                else
                    toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div>
                    <h4>Are you sure want to delete?</h4>
                    <p>This will schedule will delete. You cannot undo this action.</p>
                </div>
            </Dialog>
            <div className={userStyle.centeredd}>
                {path.pathname.endsWith("/admin/user") ? <MainTable
                    data={users}
                    isEditable={true}
                    structure={content}
                    handleUpdate={onHandleUpdate}
                    handleDelete={onHandleDelete}
                    handleAdd={onHandleAdd}
                /> :
                    <Outlet />
                }
            </div>
        </div>
    );

    function onHandleDelete(data: User) {
        setCurrentDeleteId(data.id || "");
        setCurrentDeleteImage(data.image || "");
        navigate("/admin/user?showDialog=y");
    }

    function onHandleAdd() {
        navigate("/admin/user/add");
    }

    function onHandleUpdate(data: User) {
        navigate(`/admin/user/${data.id}`);
    }
}