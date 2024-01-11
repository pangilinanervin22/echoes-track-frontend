import { useState } from "react";

export default function Rooms() {
    const [rooms, setRooms] = useState(ListRoom);

    return (
        <>
            <div>
                {rooms.map((room) => (
                    <div>
                        <h1>{room.id}</h1>
                        <h1>{room.name}</h1>
                    </div>

                ))}
            </div>
        </>
    )
}

const ListRoom = [
    {
        id: "1",
        name: "Room 1",
    },
    {
        id: "2",
        name: "Room 2",
    },
]