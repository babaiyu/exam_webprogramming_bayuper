import React from "react";
import { Head as IHead } from "@inertiajs/react";

export default function Head({ title = "", description = "" }) {
    return (
        <IHead>
            <title>{title}</title>
            <meta name="description" content={description} />
        </IHead>
    );
}
