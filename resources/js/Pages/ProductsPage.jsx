import React, { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Button, Table, Modal } from "flowbite-react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { LayoutAdmin } from "../Components";
import { apiBarangAll, apiBarangDelete } from "../Api";
import {
    ExclamationCircleIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/solid";

const ProductsPage = () => {
    const [page, setPage] = useState(1);
    const [barang, setBarang] = useState([]);
    const [modalDelete, setModalDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = useMemo(() => {
        return localStorage.getItem("TOKEN");
    }, []);

    const onGoDetail = (id) => () => {
        const route = `/products/${id}`;
        router.visit(route);
    };

    const onShowModalDelete = (data) => () => {
        setModalDelete(data);
    };

    const onDeleteBarang = async () => {
        setLoading(true);

        await apiBarangDelete(token, modalDelete?.id)
            .then((res) => {
                alert("Berhasil hapus barang!");
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(async () => {
                setLoading(false);
                setModalDelete(null);
                await apiBarangAll(token, page).then((res) => {
                    const response = res.data?.data;
                    setBarang(response?.data ?? []);
                });
            });
    };

    useEffect(() => {
        (async () => {
            await apiBarangAll(token, page).then((res) => {
                const response = res.data?.data;
                setBarang(response?.data ?? []);
            });
        })();
    }, []);

    return (
        <>
            <div className="flex justify-between mt-4">
                <h1 className="text-4xl">Barang</h1>
                <Link href="/products/add">
                    <Button>Tambah Barang</Button>
                </Link>
            </div>

            <Table hoverable={true} className="mt-4 overflow-x-auto relative">
                <Table.Head>
                    <Table.HeadCell>Nama Barang</Table.HeadCell>
                    <Table.HeadCell>Brand</Table.HeadCell>
                    <Table.HeadCell>Model No.</Table.HeadCell>
                    <Table.HeadCell>Harga</Table.HeadCell>
                    <Table.HeadCell>Stok</Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {barang.map((item) => (
                        <Table.Row
                            key={item?.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {item?.product_name}
                            </Table.Cell>
                            <Table.Cell>{item?.brand}</Table.Cell>
                            <Table.Cell>{item?.model_no}</Table.Cell>
                            <Table.Cell>Rp. {item?.price}</Table.Cell>
                            <Table.Cell>{item?.stocks}</Table.Cell>
                            <Table.Cell>
                                <button
                                    onClick={onGoDetail(item?.id)}
                                    className="flex items-center font-medium text-blue-600 hover:underline"
                                >
                                    <PencilSquareIcon className="w-4 h-4" />
                                    Detail
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
                            Anda yakin ingin menghapus barang ini?{" "}
                            <strong>
                                Seluruh nomor seri akan ikut terhapus!
                            </strong>
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={onDeleteBarang}
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

ProductsPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Barang" />
);

export default ProductsPage;
