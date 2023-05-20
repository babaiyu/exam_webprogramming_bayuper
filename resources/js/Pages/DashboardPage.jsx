import React, { useMemo } from "react";
import { Button, Card } from "flowbite-react";
import { router } from "@inertiajs/react";
import { LayoutAdmin } from "../Components";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

const MENU_DASHBOARD = [
    {
        id: 1,
        title: "Barang",
        description: "Menampilkan list barang dan nomor seri",
        route: "/products",
        bgColor: "bg-cyan-600",
        bgColorHover: "hover:bg-cyan-500",
        roleFor: "SUPER_ADMIN",
    },
    {
        id: 2,
        title: "Transaksi",
        description: "Menampilkan transaksi dan detailnya",
        route: "/transactions",
        bgColor: "bg-green-600",
        bgColorHover: "hover:bg-green-500",
        roleFor: "ADMIN",
    },
    {
        id: 3,
        title: "Laporan",
        description: "Menampilkan laporan dari transaksi dan barang",
        route: "/report",
        bgColor: "bg-purple-600",
        bgColorHover: "hover:bg-purple-500",
        roleFor: "SUPER_ADMIN",
    },
];

const DashboardPage = () => {
    const user = useMemo(() => {
        const obj = localStorage.getItem("USER");
        return JSON.parse(obj);
    }, [localStorage.getItem("USER")]);

    const onGoMenu = (route) => () => {
        router.visit(route);
    };

    return (
        <>
            <h1 className="text-4xl mt-4 mb-4">Dashboard</h1>

            <section className="flex flex-wrap justify-between mb-4 h-screen">
                {MENU_DASHBOARD.map((item) => (
                    <div
                        key={item?.id}
                        onClick={onGoMenu(item?.route)}
                        className={clsx(
                            "md:w-[49%] lg:w-[30%] w-full h-32 mb-8 px-4 py-6 rounded-lg cursor-pointer text-white border",
                            "transition-colors duration-75",
                            item.bgColor,
                            item.bgColorHover,
                            {
                                hidden:
                                    user?.roles?.role_value === "SUPER_ADMIN"
                                        ? false
                                        : user?.roles?.role_value !==
                                          item?.roleFor,
                            }
                        )}
                    >
                        <h5 className="text-2xl font-bold tracking-tight">
                            {item?.title}{" "}
                        </h5>
                        <p>{item?.description}</p>
                    </div>
                ))}
            </section>
        </>
    );
};

DashboardPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Dashboard" />
);

export default DashboardPage;
