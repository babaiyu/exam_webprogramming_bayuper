import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { LayoutAdmin } from "../Components";
import { schemaNomorSeri } from "../Helpers/schema";
import { apiNomorSeriAdd } from "../Api";
import { router } from "@inertiajs/react";

const NomorSeriAddPage = ({ product_id }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        resolver: schemaNomorSeri,
        defaultValues: {
            serial_no: "",
            price: 0,
            prod_date: "",
            warranty_start: null,
            warranty_duration: null,
            used: 0,
        },
    });
    const [loading, setLoading] = useState(false);

    const onSubmitNomorSeri = handleSubmit(async (data) => {
        setLoading(true);

        const payload = {
            product_id: +product_id,
            ...data,
            prod_date: dayjs(data.prod_date).format(),
        };

        await apiNomorSeriAdd(payload)
            .then((res) => {
                alert("Berhasil menambahkan nomor seri!");
                router.visit(`/products/${product_id}`);
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    return (
        <>
            <h1 className="text-4xl mt-4">Tambah Nomor Seri</h1>

            <form onSubmit={onSubmitNomorSeri}>
                <div className="mb-2">
                    <Label htmlFor="serial_no" value="Nomor Seri" />
                    <TextInput
                        {...register("serial_no")}
                        id="serial_no"
                        placeholder="Masukkan nomor seri"
                        helperText={
                            <span className="text-sm text-red-500">
                                {errors?.serial_no?.message}
                            </span>
                        }
                    />
                </div>

                <div className="mb-2">
                    <Label htmlFor="price" value="Harga" />
                    <TextInput
                        {...register("price")}
                        id="price"
                        type="number"
                        placeholder="Masukkan harga"
                        helperText={
                            <span className="text-sm text-red-500">
                                {errors?.price?.message}
                            </span>
                        }
                    />
                </div>

                <div className="mb-2">
                    <Label htmlFor="prod_date" value="Tanggal Produksi" />
                    <DatePicker
                        id="prod_date"
                        selected={watch("prod_date")}
                        onChange={(date) => setValue("prod_date", date)}
                        className="text-black"
                        dateFormat="yyyy/MM/dd"
                        locale="id"
                    />
                    <span className="text-sm text-red-500">
                        {errors?.prod_date?.message}
                    </span>
                </div>

                <div className="mb-2">
                    <Label
                        htmlFor="warranty_start"
                        value="Tanggal Garansi Dimulai"
                    />
                    <DatePicker
                        id="warranty_start"
                        selected={watch("warranty_start")}
                        onChange={(date) => setValue("warranty_start", date)}
                        className="text-black"
                        dateFormat="yyyy/MM/dd"
                        locale="id"
                    />
                    <span className="text-sm text-red-500">
                        {errors?.warranty_start?.message}
                    </span>
                </div>

                <div className="mb-2">
                    <Label htmlFor="warranty_duration" value="Durasi Garansi" />
                    <TextInput
                        {...register("warranty_duration")}
                        id="warranty_duration"
                        type="number"
                        placeholder="Masukkan durasi garansi"
                        helperText={
                            <span className="text-sm text-red-500">
                                {errors?.warranty_duration?.message}
                            </span>
                        }
                    />
                </div>

                <Button
                    type="submit"
                    className="mt-4"
                    isProcessing={loading}
                    disabled={loading}
                >
                    Tambah Nomor Seri
                </Button>
            </form>
        </>
    );
};

NomorSeriAddPage.layout = (page) => (
    <LayoutAdmin
        children={page}
        title="Exam - Tambah Nomor Seri"
        roleFor="SUPER_ADMIN"
    />
);

export default NomorSeriAddPage;
