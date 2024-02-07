import { useState } from "react";
import { Room, useDeleteRoom, useGetRooms } from "./useRooms";
import AddRoom from "./AddRoom";
import EditRoom from "./EditRoom";
import room from "./Rooms.module.scss"
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";
import Dialog from "../../../Components/Dialog/Dialog";
import { useNavigate } from "react-router-dom";
import { User } from "../Users/useUsers";
import { toast } from "react-toastify";

const content: TableStructure = {
    id: "id",
    title: "Room",
    searchPath: "name",
    structure: [
        { label: "ID", path: "id", width: "300px", fontSize: "16px" },
        { label: "Name ", path: "name", width: "200px", fontSize: "16px" },
    ]
};

export default function Room() {
    const navigate = useNavigate();
    const [currentDeleteId, setCurrentDeleteId] = useState<any>("");
    const { rooms } = useGetRooms();
    const { deleteRoom } = useDeleteRoom();
    const [modifyStatus, setModifyStatus] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState({} as Room);

    if (!rooms.length) return <div>No room available</div>
    if (modifyStatus === "isAdding") return <AddRoom changeStatus={setModifyStatus} />
    if (modifyStatus === "isEditing") return <EditRoom room={selectedRoom} changeStatus={setModifyStatus} />

    return (
        <main className={room.mainContainer}>
            <Dialog onClose={() => { }} onOk={async () => {
                const loading = toast("Deleting room...");
                const res = await deleteRoom(currentDeleteId);

                if (res.ok)
                    toast.update(loading, { type: "success", render: res.message });
                else if (res.error)
                    toast.update(loading, { type: "error", render: res.message });
                else
                    toast.update(loading, { type: "error", render: "Something went wrong!" });
            }}>
                <div>
                    <h4>Are you sure want to delete?</h4>
                    <p>This room will delete. You cannot undo this action.</p>
                </div>
            </Dialog>
            <div className={room.centered}>
                <MainTable
                    data={rooms}
                    isEditable={true}
                    structure={content}
                    handleUpdate={onHandleUpdate}
                    handleDelete={onHandleDelete}
                    handleAdd={onHandleAdd}
                />
            </div>
        </main>

    );

    function onHandleDelete(data: User) {
        setCurrentDeleteId(data.id);
        navigate("/admin/room?showDialog=y");
    }

    function onHandleAdd() {
        setModifyStatus("isAdding")
    }

    function onHandleUpdate(data: any) {
        setSelectedRoom(data);
        setModifyStatus("isEditing");
    }
}