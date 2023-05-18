import React, { useMemo } from "react";
import { Navbar as Nav, Avatar, Dropdown } from "flowbite-react";
import { apiLogout } from "../Api";

export default function Navbar({ user = null }) {
    const onLogout = async () => {
        const token = localStorage.getItem("TOKEN");
        await apiLogout(token).finally(() => {
            localStorage.clear();
            window.location.href = "/login";
        });
    };

    const renderPlaceholderInitials = useMemo(() => {
        switch (user?.roles?.role_value ?? "") {
            case "SUPER_ADMIN":
                return "SA";
            default:
                return "A";
        }
    }, [user]);

    return (
        <Nav fluid={true} rounded={true} className="sticky top-0 z-40 border-b">
            <Nav.Brand href="/dashboard">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    Exam Web Programming
                </span>
            </Nav.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline={true}
                    label={
                        <Avatar
                            rounded
                            alt="User Menu"
                            placeholderInitials={renderPlaceholderInitials}
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{user?.name}</span>
                        <span className="block truncate text-sm font-medium">
                            {user?.email}
                        </span>
                    </Dropdown.Header>
                    <Dropdown.Item onClick={onLogout}>Keluar</Dropdown.Item>
                </Dropdown>
            </div>
        </Nav>
    );
}
