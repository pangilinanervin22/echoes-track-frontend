import React, { useState } from "react";
import { getRoomByName } from "../Admin/Rooms/useRooms";
import { Outlet, useNavigate } from "react-router-dom";

export default function Scan() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Handle the roomId here
        console.log(roomId);
        const res = await getRoomByName(roomId);
        if (res.room) {
            navigate(`/scan/${res.room.name}`);
        } else {
            alert("Room not found!");
        }
    };

    return (
        <main>
            <h1>Scan</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Room ID:
                    <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
            <Outlet />
        </main>
    );
}