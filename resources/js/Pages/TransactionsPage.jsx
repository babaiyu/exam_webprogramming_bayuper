import React, { useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button, Table, Modal } from "flowbite-react";
import {
    ExclamationCircleIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { LayoutAdmin } from "../Components";
import { apiTransaksiDelete, apiTransaksis } from "../Api";
import { stringFirstCapital } from "../Helpers/helper";

const TransactionsPage = () => {
    const [transaksis, setTransaksis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalDelete, setModalDelete] = useState(null);

    const onShowModalDelete = (data) => () => {
        setModalDelete(data);
    };

    const onGetTransaksis = async () => {
        await apiTransaksis().then((res) => {
            const response = res.data?.data;
            setTransaksis(response?.data);
        });
    };

    const onGoDetailTransaksi = (id) => () => {
        router.visit(`/transactions/${id}`);
    };

    const onDeleteTransaksi = async () => {
        setLoading(true);
        await apiTransaksiDelete(modalDelete?.id)
            .then((res) => {
                alert("Berhasil menghapus transaksi!");
            })
            .catch((err) => {
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(async () => {
                setLoading(false);
                setModalDelete(null);
                await onGetTransaksis();
            });
    };

    useEffect(() => {
        (async () => {
            await onGetTransaksis();
        })();
    }, []);

    return (
        <>
            <div className="flex justify-between mt-4">
                <h1 className="text-4xl">Transaksi</h1>
                <Link href="/transactions/add">
                    <Button>Buat Transaksi</Button>
                </Link>
            </div>

            <Table hoverable={true} className="mt-4 overflow-x-auto relative">
                <Table.Head>
                    <Table.HeadCell>No. Trans</Table.HeadCell>
                    <Table.HeadCell>Tanggal</Table.HeadCell>
                    <Table.HeadCell>Customer / Vendor</Table.HeadCell>
                    <Table.HeadCell>Tipe Trans</Table.HeadCell>
                    <Table.HeadCell>Harga</Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {transaksis.map((item) => (
                        <Table.Row
                            key={item?.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {item?.no_trans}
                            </Table.Cell>
                            <Table.Cell>
                                {dayjs(item?.tanggal).format("YYYY-MM-DD")}
                            </Table.Cell>
                            <Table.Cell>{item?.customer_vendor}</Table.Cell>
                            <Table.Cell>
                                {stringFirstCapital(item?.tipe_trans)}
                            </Table.Cell>
                            <Table.Cell>Rp. {item?.price}</Table.Cell>
                            <Table.Cell>
                                <button
                                    onClick={onGoDetailTransaksi(item?.id)}
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
                            Anda yakin ingin menghapus transaksi ini?{" "}
                            <strong>
                                Seluruh detail transaksi akan ikut terhapus!
                            </strong>
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={onDeleteTransaksi}
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

TransactionsPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Transaksi" />
);

export default TransactionsPage;
