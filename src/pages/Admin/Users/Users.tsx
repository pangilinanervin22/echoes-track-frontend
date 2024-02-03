import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDeleteUser, useGetUsers } from "./useUsers";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import { ClassNames } from "@emotion/react";
import userStyle from "./userStyle.module.scss"

const content: TableStructure = {
    id: "id",
    title: "Users",
    searchPath: "name",
    structure: [
        { label: "Rfid", path: "rfid", width: "300px", fontSize: "16px" },
        { label: "Name ", path: "name", width: "200px", fontSize: "16px" },
        { label: "Role", path: "role", width: "200px", fontSize: "16px" },
    ]
};

export default function Users() {
    const navigate = useNavigate();
    const { users, loading } = useGetUsers();
    const { deleteUser } = useDeleteUser();
    const path = useLocation();

    console.log(users, path);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={userStyle.mainContainer}>
            <div className={userStyle.centeredd}>
                {path.pathname.endsWith("/admin/user") ?  <MainTable
                    data={users}
                    isEditable={true}
                    structure={content}
                    handleUpdate={onHandleUpdate}
                    handleDelete={onHandleDelete}
                    handleAdd={onHandleAdd}
                   />  :         
                   <Outlet /> 
                }
            </div>
        </div>
    );

    function onHandleDelete(data: any) {
        deleteUser(data.id);
    }

    function onHandleAdd() {
        navigate("/admin/user/add");
    }

    function onHandleUpdate(data: any) {
        navigate(`/admin/user/${data.id}`);
    }
}