import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import React from "react";
import dayjs from "dayjs";
import { registerLocale } from "react-datepicker";
import idLocale from "date-fns/locale/id";
import "flowbite";
import "dayjs/locale/id";
import "react-datepicker/dist/react-datepicker.css";

dayjs.locale("id");
dayjs().locale("id").format();
registerLocale("id", idLocale);

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
