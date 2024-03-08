import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Account, useDeleteAccount, useGetAccounts } from "./useAccount";
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import userStyle from "./userStyle.module.scss"
import Dialog from "../../../Components/Dialog/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";

const content: TableStructure = {
    id: "id",
    title: "Account",
    searchPath: "name",

    structure: [
        {
            label: "", width: "120px", fontSize: "16px", element: (data: Account) => {
                return <img src={data.image} alt="user" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
            }
        },
        { label: "Email", path: "email", width: "100px", fontSize: "16px" },
        { label: "Name ", path: "name", width: "300px", fontSize: "16px" },
        { label: "Role", path: "role", width: "100px", fontSize: "16px" },
    ]
};

export default function Users() {
    const navigate = useNavigate();
    const { accounts, loading } = useGetAccounts();
    const { deleteAccount } = useDeleteAccount();
    const path = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={userStyle.mainContainer}>
            <div className={userStyle.centered}>
                {path.pathname.endsWith("/admin/account") ?
                    <MainTable
                        data={accounts}
                        isEditable={true}
                        structure={content}
                        handleUpdate={onHandleUpdate}
                        handleAdd={onHandleAdd}
                    /> :
                    <Outlet />
                }
            </div>
        </div>
    );


    function onHandleAdd() {
        navigate("/admin/account/add");
    }

    function onHandleUpdate(data: Account) {
        navigate(`/admin/account/${data.id}`);
    }
}