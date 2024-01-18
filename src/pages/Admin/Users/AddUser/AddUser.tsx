import React from "react";
import { User, useAddUser } from "../useUsers";

export default function AddUser() {
    const { addUser } = useAddUser();

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
        <div>
            <h1>Add User</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input id="name" name="name" type="text" />
                </label>
                <label>
                    RFID:
                    <input id="rfid" name="rfid" type="number" />
                </label>
                <label>
                    Role:
                    <select id="role" name="role">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="employee">Employee   </option>
                        <option value="visitor">Visitor</option>
                    </select>
                </label>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}