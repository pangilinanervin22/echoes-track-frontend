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
    const [currentDeleteId, setCurrentDeleteId] = useState("");

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={userStyle.mainContainer}>
            <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting user...");
                const res = await deleteAccount(currentDeleteId);
                console.log(currentDeleteId);

                if (res.ok)
                    toast.update(loading, { type: "success", render: res.message });
                else if (res.error)
                    toast.update(loading, { type: "error", render: res.message });
                else
                    toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div>
                    <h4>Are you sure want to delete?</h4>
                    <p>This user will delete. You cannot undo this action.</p>
                </div>
            </Dialog>
            <div className={userStyle.centered}>
                {path.pathname.endsWith("/admin/account") ? <MainTable
                    data={accounts}
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

    function onHandleDelete(data: Account) {
        setCurrentDeleteId(data.id || "");
        navigate("/admin/account?showDialog=y");
    }

    function onHandleAdd() {
        navigate("/admin/account/add");
    }

    function onHandleUpdate(data: Account) {
        navigate(`/admin/account/${data.id}`);
    }
}