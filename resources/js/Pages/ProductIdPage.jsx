import React, { useEffect, useMemo, useState } from "react";
import { Table, Label, TextInput, Button, Modal } from "flowbite-react";
import {
    TrashIcon,
    ExclamationCircleIcon,
    PencilSquareIcon,
} from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { LayoutAdmin } from "../Components";
import {
    apiBarangByID,
    apiBarangUpdate,
    apiNomorSeri,
    apiNomorSeriDelete,
} from "../Api";
import { schemaBarangUpdate } from "../Helpers/schema";
import { Link, router } from "@inertiajs/react";

const ProductIdPage = ({ id }) => {
    const [nomorSeri, setNomorSeri] = useState([]);
    const [modalDelete, setModalDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    const formBarang = useForm({
        resolver: schemaBarangUpdate,
        defaultValues: {
            product_name: "",
            brand: "",
            price: 0,
            model_no: "",
        },
    });

    const token = useMemo(() => {
        return localStorage.getItem("TOKEN");
    }, []);

    const onShowModalDelete = (data) => () => {
        setModalDelete(data);
    };

    const onGetBarangByID = async () => {
        await apiBarangByID(token, id).then((res) => {
            const data = res.data?.data;
            formBarang.setValue("product_name", data?.product_name);
            formBarang.setValue("brand", data?.brand);
            formBarang.setValue("price", data?.price);
            formBarang.setValue("model_no", data?.model_no);
        });
    };

    const onGetNomorSeri = async () => {
        await apiNomorSeri(token, id).then((res) => {
            setNomorSeri(res.data?.data ?? []);
        });
    };

    const onDeleteNomorSeri = async () => {
        setLoading(true);
        await apiNomorSeriDelete(token, modalDelete?.id)
            .then((res) => {
                alert("Berhasil menghapus nomor seri!");
                Promise.all([onGetBarangByID(), onGetNomorSeri()]);
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(() => {
                setLoading(false);
                setModalDelete(null);
            });
    };

    const onSubmitBarangUpdate = formBarang.handleSubmit(async (data) => {
        await apiBarangUpdate(token, id, data)
            .then(async (res) => {
                alert(`Success - ${res?.data?.message}`);
                await onGetBarangByID();
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            });
    });

    const onGoNomorSeriDetail = (route) => () => {
        router.visit(route);
    };

    useEffect(() => {
        (async () => {
            await Promise.all([onGetBarangByID(), onGetNomorSeri()]);
        })();
    }, []);

    return (
        <>
            <h1 className="text-4xl">Barang Detail</h1>

            {/* Form Update Barang */}
            <section className="mt-8">
                <form onSubmit={onSubmitBarangUpdate}>
                    <div className="mb-2">
                        <Label htmlFor="product_name" value="Nama Barang" />
                        <TextInput
                            {...formBarang.register("product_name")}
                            id="product_name"
                            placeholder="Masukkan nama barang"
                            helperText={
                                <span className="text-sm text-red-500">
                                    {
                                        formBarang?.formState?.errors
                                            ?.product_name?.message
                                    }
                                </span>
                            }
                        />
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="brand" value="Brand" />
                        <TextInput
                            {...formBarang.register("brand")}
                            id="brand"
                            placeholder="Masukkan brand"
                            helperText={
                                <span className="text-sm text-red-500">
                                    {
                                        formBarang?.formState?.errors?.brand
                                            ?.message
                                    }
                                </span>
                            }
                        />
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="price" value="Harga" />
                        <TextInput
                            {...formBarang.register("price")}
                            id="price"
                            type="number"
                            placeholder="Masukkan harga"
                            helperText={
                                <span className="text-sm text-red-500">
                                    {
                                        formBarang?.formState?.errors?.price
                                            ?.message
                                    }
                                </span>
                            }
                        />
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="model_no" value="Model No" />
                        <TextInput
                            {...formBarang.register("model_no")}
                            id="model_no"
                            placeholder="Masukkan model no"
                            helperText={
                                <span className="text-sm text-red-500">
                                    {
                                        formBarang?.formState?.errors?.model_no
                                            ?.message
                                    }
                                </span>
                            }
                        />
                    </div>

                    <Button type="submit" className="mt-4">
                        Update Barang
                    </Button>
                </form>
            </section>

            <section className="mt-8">
                <div className="flex justify-between">
                    <h2 className="text-2xl">Nomor Seri</h2>
                    <Link href={`/nomor-seri/${id}/add`}>
                        <Button>Tambah Nomor Seri</Button>
                    </Link>
                </div>

                <Table
                    hoverable={true}
                    className="mt-4 overflow-x-auto relative"
                >
                    <Table.Head>
                        <Table.HeadCell>Serial No</Table.HeadCell>
                        <Table.HeadCell>Tgl Produksi</Table.HeadCell>
                        <Table.HeadCell>Tgl Garansi</Table.HeadCell>
                        <Table.HeadCell>Durasi Garansi</Table.HeadCell>
                        <Table.HeadCell>Harga</Table.HeadCell>
                        <Table.HeadCell>Used?</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {nomorSeri.map((item) => (
                            <Table.Row
                                key={item?.id}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {item?.serial_no}
                                </Table.Cell>
                                <Table.Cell>
                                    {dayjs(item?.prod_date).format(
                                        "YYYY-MM-DD"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {dayjs(item?.warranty_start).format(
                                        "YYYY-MM-DD"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {item?.warranty_duration} /bulan
                                </Table.Cell>
                                <Table.Cell>Rp. {item?.price}</Table.Cell>
                                <Table.Cell>
                                    {item?.used >= 1 ? "Terjual" : "Ditambahkan"}
                                </Table.Cell>
                                <Table.Cell>
                                    <button
                                        onClick={onGoNomorSeriDetail(
                                            `/nomor-seri/${id}/${item?.id}`
                                        )}
                                        className="flex items-center font-medium text-blue-600 hover:underline"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={onShowModalDelete(item)}
                                        className="flex items-center font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Hapus
                                    </button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </section>

            {/* Modal Delete */}
            <Modal
                show={modalDelete !== null}
                size="md"
                popup={true}
                onClose={onShowModalDelete(null)}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Anda yakin ingin menghapus nomor seri ini?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={onDeleteNomorSeri}
                                isProcessing={loading}
                            >
                                Ya, hapus
                            </Button>
                            <Button
                                color="gray"
                                onClick={onShowModalDelete(null)}
                            >
                                Tidak, batalkan
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

ProductIdPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Barang Detail" />
);

export default ProductIdPage;
