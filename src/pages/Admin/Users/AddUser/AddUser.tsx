import React from "react";
import { User, useAddUser } from "../useUsers";
import { useNavigate } from "react-router-dom";
import adduserStyle from "../AddUser/adduserStyle.module.scss"

export default function AddUser() {
    const { addUser } = useAddUser();
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(event.target as HTMLFormElement);
        // Create a new user object
        const newUser: User = {
            name: formData.get("name") as string,
            rfid: formData.get("rfid") as string,
            role: formData.get("role") as string,
            room: "",
            section: "",
        };

        // Call the addUser function to add the user
        addUser(newUser);

        // Reset the form
        (event.target as HTMLFormElement).reset();
    };

    return (
            <div className={adduserStyle.center}>
                <div className={adduserStyle.anotherCenter}>
                    <h1>Add User</h1>
                    <form onSubmit={handleSubmit}>
                            <input id="name" placeholder="Name" name="name" type="text" />

                            <input id="rfid" placeholder="RFID" name="rfid" type="number" />
                        <label>
                            <h1>Role</h1>
                            <select id="role" name="role">
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="employee">Employee   </option>
                                <option value="visitor">Visitor</option>
                            </select>
                        </label>
                        <div className={adduserStyle.wow}>
                            <button className={adduserStyle.addBtn} type="submit">Confirm</button>
                            <button className={adduserStyle.backBtn} onClick={() => { navigate("/admin/user")}}>Back</button>
                        </div>
                    </form>
                </div>
            </div>
    );
}