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

export const schemaBarangUpdate = yupResolver(
    yup.object({
        product_name: yup.string().required("Nama Barang wajib diisi!"),
        brand: yup.string().required("Brand wajib diisi!"),
        price: yup.number().required("Harga wajib diisi!"),
        model_no: yup
            .string()
            .min(5, "Minimal 5 karakter")
            .max(10, "Maksimal 10 karakter")
            .required("Model No wajib diisi!"),
    })
);

export const schemaNomorSeri = yupResolver(
    yup.object({
        serial_no: yup
            .string()
            .min(10, "Minimal 10 karakter")
            .max(10, "Maksimal 10 karakter")
            .required("Serial No wajib diisi!"),
        price: yup.number().required("Harga wajib diisi!"),
        prod_date: yup.date().required("Tanggal produksi wajib diisi!"),
        warranty_start: yup.string().required("Tanggal Garansi wajib diisi!"),
        warranty_duration: yup.number().required("Durasi Garansi wajib diisi!"),
        // used: yup.number(),
    })
);
