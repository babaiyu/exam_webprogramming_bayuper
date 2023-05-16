import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const schemaLogin = yupResolver(
    yup.object({
        email: yup
            .string()
            .email("Format email tidak valid!")
            .required("Email wajib diisi!"),
        password: yup
            .string()
            .min(6, "Password harus minimal 6 karakter!")
            .required("Password wajib diisi!"),
    })
);
