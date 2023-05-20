import React, { useEffect, useMemo, useState } from "react";
import { Timeline } from "flowbite-react";
import {
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    CubeIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import clsx from "clsx";
import { LayoutAdmin } from "../Components";
import { apiTransaksiDetail } from "../Api";
import { rupiah, stringFirstCapital } from "../Helpers/helper";

const TransactionIdPage = ({ id }) => {
    const [transaksi, setTransaksi] = useState(null);

    useEffect(() => {
        (async () => {
            await apiTransaksiDetail(id).then((res) => {
                setTransaksi(res.data?.data);
            });
        })();
    }, []);

    const renderIconTipeTrans = useMemo(() => {
        const tipeTrans = transaksi?.transaksi?.tipe_trans ?? "";

        if (tipeTrans.includes("pembelian")) {
            return <ArrowTrendingDownIcon className="w-6 h-6 text-red-700" />;
        }

        if (tipeTrans.includes("penjualan")) {
            return <ArrowTrendingUpIcon className="w-6 h-6 text-green-700" />;
        }

        return null;
    }, [transaksi]);

    return (
        <>
            <div className="flex justify-between mt-4">
                <h1 className="text-4xl">Transaksi Detail</h1>
            </div>

            <section className="mt-4">
                <div className="mb-4 border-b pb-2">
                    <p>No. Transaksi</p>
                    <h2 className="text-xl font-bold">
                        {transaksi?.transaksi?.no_trans}
                    </h2>
                </div>

                <div className="mb-4 border-b pb-2">
                    <p>Tanggal Transaksi</p>
                    <h2 className="text-xl font-bold">
                        {dayjs(transaksi?.transaksi?.tanggal).format(
                            "DD MMMM YYYY"
                        )}
                    </h2>
                </div>

                <div className="mb-4 border-b pb-2">
                    <p>Customer / Vendor</p>
                    <h2 className="text-xl font-bold">
                        {transaksi?.transaksi?.customer_vendor}
                    </h2>
                </div>

                <div className="mb-4 border-b pb-2">
                    <p>Tipe Transaksi</p>
                    <div className="flex items-center">
                        <h2
                            className={clsx("text-xl font-bold mr-2", {
                                "text-green-700":
                                    transaksi?.transaksi?.tipe_trans ===
                                    "penjualan",
                                "text-red-700":
                                    transaksi?.transaksi?.tipe_trans ===
                                    "pembelian",
                            })}
                        >
                            {stringFirstCapital(
                                transaksi?.transaksi?.tipe_trans ?? ""
                            )}
                        </h2>
                        {renderIconTipeTrans}
                    </div>
                </div>
            </section>

            <section className="mt-4">
                <Timeline>
                    {(transaksi?.transaksi_detail ?? []).map((item) => (
                        <Timeline.Item key={item?.id}>
                            <Timeline.Point icon={CubeIcon} />
                            <Timeline.Content>
                                <Timeline.Time>
                                    Serial No: {item?.serial_no}
                                </Timeline.Time>
                                <Timeline.Title>
                                    {item?.product_name}
                                </Timeline.Title>
                                <Timeline.Body>
                                    <p>
                                        Harga:{" "}
                                        <span className="font-bold">
                                            {rupiah(item?.price ?? 0)}
                                        </span>
                                    </p>
                                    <p>
                                        Discount:{" "}
                                        <span className="font-bold">
                                            {item?.discount}%
                                        </span>
                                    </p>
                                    <p>
                                        Tanggal Produksi:{" "}
                                        <span className="font-bold">
                                            {dayjs(item?.prod_date).format(
                                                "DD MMM YYYY"
                                            )}
                                        </span>
                                    </p>
                                    <p>
                                        Tanggal Mulai Garansi:{" "}
                                        <span className="font-bold">
                                            {dayjs(item?.warranty_start).format(
                                                "DD MMM YYYY"
                                            )}
                                        </span>
                                    </p>
                                    <p>
                                        Durasi Garansi:{" "}
                                        <span className="font-bold">
                                            {item?.warranty_duration} /bulan
                                        </span>
                                    </p>
                                </Timeline.Body>
                            </Timeline.Content>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </section>
        </>
    );
};

TransactionIdPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Transaksi Detail" />
);

export default TransactionIdPage;
