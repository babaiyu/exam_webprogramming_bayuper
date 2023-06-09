import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
    BanknotesIcon,
    ChartBarIcon,
    ChartPieIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import { apiGetUser } from "../Api";
import Head from "./Head";
import Footer from "./Footer";

export default function LayoutAdmin({
    children,
    title = "",
    roleFor = "ADMIN",
}) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await apiGetUser()
                .then((res) => {
                    const response = res.data;
                    localStorage.setItem('USER', JSON.stringify(response));
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

    const userRoles = useMemo(() => {
        return user?.roles?.role_value;
    }, [user]);

    useEffect(() => {
        if (userRoles === "SUPER_ADMIN") {
            return;
        }

        return;
    }, [roleFor]);

    if (loading) {
        return <>Loading...</>;
    }

    return (
        <>
            <Head title={title} />

            <Navbar user={user} />

            <main className="w-full flex flex-row justify-between">
                <Sidebar className="w-[20%] mr-2 sticky top-12">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="/dashboard" icon={ChartPieIcon}>
                                Dashboard
                            </Sidebar.Item>
                            {userRoles === "SUPER_ADMIN" ? (
                                <Sidebar.Item
                                    href="/products"
                                    icon={ShoppingBagIcon}
                                >
                                    Barang
                                </Sidebar.Item>
                            ) : null}
                            <Sidebar.Item
                                href="/transactions"
                                icon={BanknotesIcon}
                            >
                                Transaksi
                            </Sidebar.Item>
                            {userRoles === "SUPER_ADMIN" ? (
                                <Sidebar.Item
                                    href="/report"
                                    icon={ChartBarIcon}
                                >
                                    Laporan
                                </Sidebar.Item>
                            ) : null}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>

                <main className="w-[80%] container mx-4">{children}</main>
            </main>

            <Footer />
        </>
    );
}
