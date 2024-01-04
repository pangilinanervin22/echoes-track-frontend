import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <div>
            <div>NavBar</div>
            <Link to="about">About Us</Link>
            <Link to="search">Search</Link>
            <Link to="admin">Admin</Link>
            <Outlet />
            <div>Footer</div>
        </div>
    )
}
