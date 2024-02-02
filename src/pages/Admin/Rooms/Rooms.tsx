import { useState } from "react";
import { Room, useDeleteRoom, useGetRooms } from "./useRooms";
import AddRoom from "./AddRoom";
import EditRoom from "./EditRoom";
import room from "./Rooms.module.scss"
import MainTable, { TableStructure } from "../../../Components/Table/TableStructure";

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
    const { rooms, isLoading } = useGetRooms();
    const { deleteRoom } = useDeleteRoom();
    const [modifyStatus, setModifyStatus] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState({} as Room);
    const [searchRoomName, setSearchRoomName] = useState('');

    console.log(rooms);
    
    const filteredRooms = rooms
        .filter(room => room.name && room.name.toLowerCase().includes(searchRoomName.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));


    if (!rooms.length) return <div>No room available</div>
    if (modifyStatus === "isAdding") return <AddRoom changeStatus={setModifyStatus} />
    if (modifyStatus === "isEditing") return <EditRoom room={selectedRoom} changeStatus={setModifyStatus} />

    return (
        <main className={room.mainContainer}>
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

    function onHandleDelete(data: any) {
        deleteRoom(data.id)

    }

    function onHandleAdd() {
        setModifyStatus("isAdding")
    }

    function onHandleUpdate(data: any) {
        setSelectedRoom(data);
                                            setModifyStatus("isEditing");
    }
}