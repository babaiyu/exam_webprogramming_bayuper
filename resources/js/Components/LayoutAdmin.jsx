import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { Sidebar } from "flowbite-react";
import { ChartPieIcon, InboxIcon } from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import { apiGetUser } from "../Api";
import Head from "./Head";

export default function LayoutAdmin({ children, title = "" }) {
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
            <Head title={title} />

            <Navbar user={user} />

            <main className="w-full flex flex-row justify-between">
                <Sidebar className="w-[20%]">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Link href="/dashboard">
                                <Sidebar.Item href="#" icon={ChartPieIcon}>
                                    Dashboard
                                </Sidebar.Item>
                            </Link>
                            <Link href="/products">
                                <Sidebar.Item icon={InboxIcon}>
                                    Barang
                                </Sidebar.Item>
                            </Link>
                            <Sidebar.Item href="/transactions" icon={InboxIcon}>
                                Transaksi
                            </Sidebar.Item>
                            <Sidebar.Item href="/report" icon={InboxIcon}>
                                Laporan
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>

                <main className="w-[80%] container mx-4">{children}</main>
            </main>
        </>
    );
}
