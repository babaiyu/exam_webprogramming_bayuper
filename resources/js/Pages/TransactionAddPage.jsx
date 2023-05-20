import React, { useEffect, useMemo, useState } from "react";
import { Label, TextInput, Button, Select, Modal } from "flowbite-react";
import { useFieldArray, useForm } from "react-hook-form";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { LayoutAdmin } from "../Components";
import { apiBarangAllSimple, apiNomorSeriUsed, apiTransaksiAdd } from "../Api";
import { schemaTransaksi } from "../Helpers/schema";
import { TrashIcon } from "@heroicons/react/24/solid";

const TransactionAddPage = () => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: schemaTransaksi,
        defaultValues: {
            no_trans: "",
            customer_vendor: "",
            tipe_trans: "pembelian",
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "transactions",
    });

    const [modalTambah, setModalTambah] = useState(false);
    const [barangs, setBarangs] = useState([]);
    const [nomorSeri, setNomorSeri] = useState([]);
    const [idBarang, setIdBarang] = useState(null);
    const [idNomorSeri, setIdNomorSeri] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSetModalTambah = () => {
        setModalTambah((v) => !v);
        setIdBarang(null);
        setIdNomorSeri(null);
    };

    const onAddField = () => {
        let payload = {
            product_id: idBarang,
            serial_no: String(dayjs().unix()),
            price: 0,
            discount: 0,
            nomor_seri_id: null,
            prod_date: new Date(),
            warranty_start: new Date(),
            warranty_duration: 1,
        };

        if (idNomorSeri !== null && watch("tipe_trans") === "penjualan") {
            const indexNomorSeri = nomorSeri.findIndex(
                (el) => el.id === +idNomorSeri
            );
            const selectedNomorSeri = nomorSeri[indexNomorSeri];
            payload.serial_no = selectedNomorSeri?.serial_no;
            payload.price = selectedNomorSeri?.price;
            payload.nomor_seri_id = selectedNomorSeri?.id;
            payload.prod_date = dayjs(selectedNomorSeri?.prod_date).toDate();
            payload.warranty_start = dayjs(
                selectedNomorSeri?.warranty_start
            ).toDate();
            payload.warranty_duration = selectedNomorSeri?.warranty_duration;
        } else {
            const indexBarang = barangs.findIndex((el) => el.id === +idBarang);
            const selectedBarang = barangs[indexBarang];
            payload.price = selectedBarang?.price ?? 0;
        }

        append(payload);
        onSetModalTambah();
    };

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);

        const payload = {
            transaksi: {
                no_trans: data?.no_trans,
                tanggal: dayjs().format(),
                customer_vendor: data?.customer_vendor,
                tipe_trans: data?.tipe_trans,
            },
            transaksi_detail: data?.transactions?.map((item) => ({
                product_id: +item?.product_id,
                serial_no: item?.serial_no,
                price: parseInt(item?.price),
                discount: parseInt(item?.discount),
                nomor_seri: {
                    nomor_seri_id: item?.nomor_seri_id,
                    product_id: +item?.product_id,
                    serial_no: item?.serial_no,
                    price: item?.price,
                    prod_date: dayjs(item?.prod_date).format(),
                    warranty_start: dayjs(item?.warranty_start).format(),
                    warranty_duration: item?.warranty_duration,
                },
            })),
        };

        await apiTransaksiAdd(payload)
            .then((res) => {
                alert("Berhasil membuat transaksi");
                router.visit("/transactions");
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    useEffect(() => {
        setValue("no_trans", "TRANS-" + dayjs().unix());
        setValue("tanggal", dayjs().toDate());

        (async () => {
            await apiBarangAllSimple().then((res) => {
                setBarangs(res.data?.data ?? []);
            });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (idBarang !== null && watch("tipe_trans") === "penjualan") {
                await apiNomorSeriUsed(idBarang).then((res) => {
                    setNomorSeri(res.data?.data ?? []);
                });
            }
        })();
    }, [idBarang, watch("tipe_trans")]);

    const renderTitleArr = (product_id) => {
        const index = barangs.findIndex((el) => el.id === +product_id);
        return barangs[index]?.product_name;
    };

    return (
        <>
            <h1 className="text-4xl mt-4">Buat Transaksi</h1>

            {/* Form Tambah Barang */}
            <section className="mt-8">
                <form onSubmit={onSubmit}>
                    {/* Core Form */}
                    <>
                        <div className="mb-2">
                            <Label htmlFor="no_trans" value="No. Transaksi" />
                            <TextInput
                                {...register("no_trans")}
                                id="no_trans"
                                placeholder="Masukkan nomor transaksi"
                                disabled
                                helperText={
                                    <span className="text-sm text-red-500">
                                        {errors?.no_trans?.message}
                                    </span>
                                }
                            />
                        </div>

                        {/* <div className="mb-2">
                            <Label htmlFor="tanggal" value="Tanggal" />
                            <TextInput
                                {...register("tanggal")}
                                id="tanggal"
                                placeholder="Masukkan tanggal"
                                disabled
                                helperText={
                                    <span className="text-sm text-red-500">
                                        {errors?.tanggal?.message}
                                    </span>
                                }
                            />
                        </div> */}

                        <div className="mb-2">
                            <Label
                                htmlFor="customer_vendor"
                                value="Customer / Vendor"
                            />
                            <TextInput
                                {...register("customer_vendor")}
                                id="customer_vendor"
                                placeholder="Masukkan nama customer / vendor"
                                helperText={
                                    <span className="text-sm text-red-500">
                                        {errors?.customer_vendor?.message}
                                    </span>
                                }
                            />
                        </div>

                        <div className="mb-2">
                            <Label
                                htmlFor="tipe_trans"
                                value="Tipe Transaksi"
                            />
                            <Select
                                id="tipe_trans"
                                onChange={(val) =>
                                    setValue("tipe_trans", val?.target?.value)
                                }
                                disabled={
                                    (watch("transactions") ?? []).length > 0
                                }
                            >
                                <option value="pembelian">Pembelian</option>
                                <option value="penjualan">Penjualan</option>
                            </Select>
                        </div>

                        <div className="flex justify-end my-4">
                            <Button
                                type="button"
                                onClick={onSetModalTambah}
                                disabled={
                                    watch("transactions")?.length > 0 &&
                                    watch("tipe_trans") === "penjualan" &&
                                    watch("transactions")?.length ===
                                        nomorSeri?.length
                                }
                            >
                                Tambah Form Barang
                            </Button>
                        </div>
                    </>

                    {/* Array Form */}
                    <>
                        {fields.map((field, index) => (
                            <aside
                                key={field.id}
                                className="border-b mb-4 pb-4"
                            >
                                <div className="flex justify-between">
                                    <h3 className="text-2xl">
                                        Barang ke {index + 1} -{" "}
                                        {renderTitleArr(field.product_id)}
                                    </h3>
                                    <button
                                        type="button"
                                        className="w-8 h-6"
                                        onClick={() => remove(index)}
                                    >
                                        <TrashIcon className="w-6 h-6 text-red-500" />
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <Label
                                        htmlFor={"price" + field.id}
                                        value="Harga"
                                    />
                                    <TextInput
                                        {...register(
                                            `transactions.${index}.price`
                                        )}
                                        id={"price" + field.id}
                                        type="number"
                                        placeholder="Masukkan harga"
                                        disabled
                                        // helperText={
                                        //     <span className="text-sm text-red-500">
                                        //         {
                                        //             errors?.transactions[index]
                                        //                 .price?.message
                                        //         }
                                        //     </span>
                                        // }
                                    />
                                </div>

                                {watch("tipe_trans") === "penjualan" ? (
                                    <div className="mb-2">
                                        <Label
                                            htmlFor={"discount" + field.id}
                                            value="Discount (%)"
                                        />
                                        <TextInput
                                            {...register(
                                                `transactions.${index}.discount`
                                            )}
                                            id={"discount" + field.id}
                                            type="number"
                                            min={1}
                                            max={100}
                                            maxLength={100}
                                            placeholder="Masukkan persentase discount"
                                            // helperText={
                                            //     <span className="text-sm text-red-500">
                                            //         {
                                            //             errors?.transactions[index]
                                            //                 .discount?.message
                                            //         }
                                            //     </span>
                                            // }
                                        />
                                    </div>
                                ) : null}

                                <div className="mb-2">
                                    <Label
                                        htmlFor={"prod_date" + field.id}
                                        value="Tanggal Produksi"
                                    />
                                    <DatePicker
                                        id={"prod_date" + field.id}
                                        selected={watch(
                                            `transactions.${index}.prod_date`
                                        )}
                                        onChange={(date) =>
                                            setValue(
                                                `transactions.${index}.prod_date`,
                                                date
                                            )
                                        }
                                        className="text-black"
                                        dateFormat="yyyy/MM/dd"
                                        disabled={
                                            watch("tipe_trans") === "penjualan"
                                        }
                                        locale="id"
                                    />
                                    {/* <span className="text-sm text-red-500">
                                        {errors?.prod_date?.message}
                                    </span> */}
                                </div>

                                <div className="mb-2">
                                    <Label
                                        htmlFor={"warranty_start" + field.id}
                                        value="Tanggal Garansi"
                                    />
                                    <DatePicker
                                        id={"warranty_start" + field.id}
                                        selected={watch(
                                            `transactions.${index}.warranty_start`
                                        )}
                                        onChange={(date) =>
                                            setValue(
                                                `transactions.${index}.warranty_start`,
                                                date
                                            )
                                        }
                                        className="text-black"
                                        dateFormat="yyyy/MM/dd"
                                        locale="id"
                                    />
                                    {/* <span className="text-sm text-red-500">
                                        {errors?.warranty_start?.message}
                                    </span> */}
                                </div>

                                <div className="mb-2">
                                    <Label
                                        htmlFor={"warranty_duration" + field.id}
                                        value="Durasi Garansi (/bulan)"
                                    />
                                    <TextInput
                                        {...register(
                                            `transactions.${index}.warranty_duration`
                                        )}
                                        id={"warranty_duration" + field.id}
                                        type="number"
                                        placeholder="Masukkan harga"
                                        // helperText={
                                        //     <span className="text-sm text-red-500">
                                        //         {
                                        //             errors?.transactions[index]
                                        //                 .warranty_duration?.message
                                        //         }
                                        //     </span>
                                        // }
                                    />
                                </div>
                            </aside>
                        ))}
                    </>

                    <Button
                        type="submit"
                        className="mt-4"
                        isProcessing={loading}
                        onClick={onSubmit}
                    >
                        Buat Transaksi
                    </Button>
                </form>
            </section>

            {/* Modal choose barang */}
            <Modal show={modalTambah} onClose={onSetModalTambah}>
                <Modal.Header>Pilih Barang</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        {/* Get all barang & choose one for add */}
                        <div className="mb-2">
                            <Label
                                htmlFor="choose_barang"
                                value="Pilih barang untuk transaksi"
                            />
                            <Select
                                id="choose_barang"
                                onChange={(val) => {
                                    val.preventDefault();
                                    setIdBarang(val?.target?.value);
                                }}
                                value={idBarang ?? ""}
                            >
                                <option value={null}>
                                    Pilih barang untuk transaksi
                                </option>
                                {barangs.map((item) => (
                                    <option key={item?.id} value={item?.id}>
                                        {item?.product_name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {idBarang !== null &&
                        watch("tipe_trans") === "penjualan" ? (
                            <div className="mb-2">
                                <Label
                                    htmlFor="choose_nomor_seri"
                                    value="Pilih nomor seri"
                                />
                                <Select
                                    id="choose_nomor_seri"
                                    onChange={(val) => {
                                        val.preventDefault();
                                        setIdNomorSeri(val?.target?.value);
                                    }}
                                >
                                    <option value={null}>
                                        Pilih nomor seri
                                    </option>
                                    {nomorSeri.map((item) => (
                                        <option key={item?.id} value={item?.id}>
                                            {item?.serial_no}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        ) : null}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onAddField}
                        disabled={idBarang === null || idBarang === ""}
                    >
                        Pilih
                    </Button>
                    <Button color="gray" onClick={onSetModalTambah}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

TransactionAddPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Buat Transaksi" />
);

export default TransactionAddPage;
