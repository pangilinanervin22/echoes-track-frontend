import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Room, useDeleteRoom, useGetRooms } from '../../pages/Admin/Rooms/useRooms';
import { useState } from 'react';
import AddRoom from '../../pages/Admin/Rooms/AddRoom';
import EditRoom from '../../pages/Admin/Rooms/EditRoom';

const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function TestUI() {
    return (
        <div style={{ height: 300, width: '50%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
}




export function RoomWithMui() {
    const { rooms, isLoading } = useGetRooms();
    const { deleteRoom } = useDeleteRoom();
    const [modifyStatus, setModifyStatus] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState({} as Room);
    const [searchRoomName, setSearchRoomName] = useState('');

    const filteredRooms = rooms
        .filter(room => room.name && room.name.toLowerCase().includes(searchRoomName.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 300 },
        { field: 'name', headerName: 'Name', width: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <div>
                    <button
                        onClick={() => {
                            setSelectedRoom(params.row as Room);
                            setModifyStatus("isEditing");
                        }}>
                        Edit
                    </button>
                    <button
                        onClick={() => { deleteRoom(params.row.id) }}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];
    if (isLoading) {
        console.log("Loading...");
        return <div>Loading...</div>;
    }

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
            <DataGrid
                rows={filteredRooms}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
            />
        </main>
    )
}