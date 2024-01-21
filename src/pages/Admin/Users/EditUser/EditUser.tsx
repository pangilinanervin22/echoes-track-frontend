import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, useGetUser, useUpdateUser } from "../useUsers";

export default function EditUser() {
    const params = useParams();
    const { user, loading } = useGetUser(params.id || "");
    const { updateUser } = useUpdateUser();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [rfid, setRfid] = useState(""); // Add state variable for RFID

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role);
            setRfid(user.rfid); // Update RFID state when user changes
        }
    }, [user]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        updateUser({ ...user as User, id: params.id, name, role, rfid }); // Include RFID in update
    };

    if (loading) {
        return <div>Loading...</div>;
    } else if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <h1>Edit User {params.id}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Role:
                    <input id="role" type="text" value={role} onChange={e => setRole(e.target.value)} />
                </label>
                <label>
                    RFID:
                    <input id="rfid" type="text" value={rfid} onChange={e => setRfid(e.target.value)} /> {/* Add input for RFID */}
                </label>
                <button type="submit">Update User</button>
            </form>
        </div>
    );
}