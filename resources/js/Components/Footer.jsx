import React from "react";
import { Footer as AFooter } from "flowbite-react";
import dayjs from "dayjs";

export default function Footer() {
    return (
        <AFooter container={true} className="border-t mt-8">
            <AFooter.Copyright
                href="#"
                by="Exam Web Programming"
                year={dayjs().format("YYYY")}
            />
        </AFooter>
    );
}
