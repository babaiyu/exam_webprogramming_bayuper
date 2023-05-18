import React from "react";
import { LayoutAdmin } from "../Components";

const DashboardPage = () => {
    return (
        <>
            <h1 className="text-4xl mt-4">Dashboard</h1>
        </>
    );
};

DashboardPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Dashboard" />
);

export default DashboardPage;
