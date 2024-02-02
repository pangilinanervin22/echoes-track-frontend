import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, useGetUser, useUpdateUser } from "../useUsers";
import usereditStyle from "./edituserStyle.module.scss"

export default function EditUser() {
    const params = useParams();
    const navigate = useNavigate();
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
            <h1>Edit User: {params.id}</h1>
            <form onSubmit={handleSubmit}>
                    <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
               
                    <input id="role" type="text" value={role} onChange={e => setRole(e.target.value)}  required/>
         
               
                    <input id="rfid" type="text" value={rfid} onChange={e => setRfid(e.target.value)} required/> {/* Add input for RFID */}
                <div className={usereditStyle.wow}>
                    <button className={usereditStyle.editBtn} type="submit">Confirm</button>
                    <button className={usereditStyle.backBtn} onClick={() => { navigate("/admin/user")}}>Back</button>
                </div>
            </form>
        </div>
    );
}