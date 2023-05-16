import React from "react";
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

    return (
        <Nav fluid={true} rounded={true}>
            <Nav.Brand href="https://flowbite.com/">
                {/* <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="mr-3 h-6 sm:h-9"
                    alt="Flowbite Logo"
                /> */}
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
                            alt="User Menu"
                            img="/images/avatar.jpg"
                            className="object-cover"
                            rounded={true}
                        />
                    }
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{user?.name}</span>
                        <span className="block truncate text-sm font-medium">
                            {user?.email}
                        </span>
                    </Dropdown.Header>
                    <Dropdown.Item onClick={onLogout}>Sign out</Dropdown.Item>
                </Dropdown>
                <Nav.Toggle />
            </div>
        </Nav>
    );
}
