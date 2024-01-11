import { Outlet } from "react-router-dom";

export default function Admin() {
    return (
        <main>
            <h1>Admin</h1>
            <Outlet />
        </main>
    )
}
