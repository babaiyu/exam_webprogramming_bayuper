import React, { useEffect } from "react";
import { Head } from "../Components";

export default function HomePage() {
    useEffect(() => {
        const token = localStorage.getItem("TOKEN");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        window.location.href = "/dashboard";
        return;
    }, []);

    return (
        <>
            <Head title="Exam Web Programming" />
            <div className="w-screen h-screen bg-gray-900" />
        </>
    );
}
