import { useState } from "react";
import { Room, useDeleteRoom, useGetRooms } from "./useRooms";
import AddRoom from "./AddRoom";
import EditRoom from "./EditRoom";

export default function Room() {
    const rooms = useGetRooms();
    const { deleteRoom } = useDeleteRoom();
    const [modifyStatus, setModifyStatus] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState({} as Room);
    const [searchRoomName, setSearchRoomName] = useState('');

    const filteredRooms = rooms
        .filter(room => room.name && room.name.toLowerCase().includes(searchRoomName.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));


    if (!rooms.length) return <div>No room available</div>
    if (modifyStatus === "isAdding") return <AddRoom changeStatus={setModifyStatus} />
    if (modifyStatus === "isEditing") return <EditRoom room={selectedRoom} changeStatus={setModifyStatus} />

    return (
        <main>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchRoomName}
                    onChange={event => setSearchRoomName(event.target.value)}
                />
                <button onClick={() => setModifyStatus("isAdding")}>Add Room</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.name}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setSelectedRoom(room);
                                        setModifyStatus("isEditing");
                                    }}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => { deleteRoom(room.id) }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}



