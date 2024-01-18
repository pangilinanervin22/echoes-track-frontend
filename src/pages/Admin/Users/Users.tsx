import { Outlet, useNavigate } from "react-router-dom";
import { useGetUsers } from "./useUsers";

export default function Users() {
    const navigate = useNavigate();
    const { users, loading } = useGetUsers();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <h1>Accounts</h1>
                <div>
                    <button onClick={() => { navigate("/admin/user/add"); }}>Add User</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>RFID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Section</th>
                            <th>Room</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.rfid}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                                <td>{user.section}</td>
                                <td>{user.room}</td>
                                <td>
                                    <button onClick={() => navigate("/admin/user/" + user.id)}>Edit</button>
                                    {/* <button onClick={() => handleDelete(user.id)}>Delete</button>  */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Outlet />
        </>
    );
}