import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
    ChartPieIcon,
    ShoppingBagIcon,
    InboxIcon,
} from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import { apiGetUser } from "../Api";

export default function LayoutAdmin({ children }) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const token = localStorage.getItem("TOKEN");
            await apiGetUser(token)
                .then((res) => {
                    const response = res.data;
                    setUser(response);
                    console.log("Data => ", response);
                })
                .catch((err) => {
                    if (err?.response?.status === 401) {
                        window.location.href = "/login";
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        })();
    }, []);

    if (loading) {
        return <>Loading...</>;
    }

    return (
        <>
            <Navbar user={user} />

            <div className="w-fit flex flex-row">
                <Sidebar>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="/dashboard" icon={ChartPieIcon}>
                                Dashboard
                            </Sidebar.Item>
                            <Sidebar.Item href="/products" icon={InboxIcon}>
                                Barang
                            </Sidebar.Item>
                            <Sidebar.Item href="/transactions" icon={InboxIcon}>
                                Transaksi
                            </Sidebar.Item>
                            <Sidebar.Item href="/report" icon={InboxIcon}>
                                Laporan
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>

                {children}
            </div>
        </>
    );
}
