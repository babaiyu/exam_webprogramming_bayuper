import React, { useEffect, useMemo, useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { LayoutAdmin } from "../Components";
import { schemaNomorSeri } from "../Helpers/schema";
import { apiNomorSeriAdd, apiNomorSeriId, apiNomorSeriUpdate } from "../Api";
import { router } from "@inertiajs/react";

const NomorSeriIdPage = ({ product_id, id }) => {
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

    const token = useMemo(() => {
        return localStorage.getItem("TOKEN");
    }, []);

    const onSubmitNomorSeri = handleSubmit(async (data) => {
        setLoading(true);

        const payload = {
            product_id: +product_id,
            ...data,
            prod_date: dayjs(data.prod_date).format(),
            warranty_start: dayjs(data.warranty_start).format(),
        };

        await apiNomorSeriUpdate(token, id, payload)
            .then((res) => {
                alert("Berhasil mengubah nomor seri!");
                router.visit(`/products/${product_id}`);
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    useEffect(() => {
        (async () => {
            await apiNomorSeriId(token, id).then((res) => {
                const theData = res.data?.data;
                setValue("serial_no", theData?.serial_no);
                setValue("price", theData?.price);
                setValue("prod_date", dayjs(theData?.prod_date).toDate());
                setValue(
                    "warranty_start",
                    dayjs(theData?.warranty_start).toDate()
                );
                setValue("warranty_duration", theData?.warranty_duration);
                setValue("used", theData?.used);
            });
        })();
    }, []);

    return (
        <>
            <h1 className="text-4xl mt-4">Update Nomor Seri</h1>

            <form onSubmit={onSubmitNomorSeri}>
                <div className="mb-2">
                    <Label htmlFor="serial_no" value="Nomor Seri" />
                    <TextInput
                        {...register("serial_no")}
                        id="serial_no"
                        placeholder="Masukkan nomor seri"
                        disabled
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
                    Update Nomor Seri
                </Button>
            </form>
        </>
    );
};

NomorSeriIdPage.layout = (page) => (
    <LayoutAdmin
        children={page}
        title="Exam - Nomor Seri Detail"
        roleFor="SUPER_ADMIN"
    />
);

export default NomorSeriIdPage;
