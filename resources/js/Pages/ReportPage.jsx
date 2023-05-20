import React, { useEffect, useMemo, useState } from "react";
import { Label, Select, Spinner, Table } from "flowbite-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    Bar,
    Tooltip,
} from "recharts";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { LayoutAdmin } from "../Components";
import { apiReports, apiReportsProducts } from "../Api";
import { rupiah, stringFirstCapital } from "../Helpers/helper";
import {
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";

const RADIAN = Math.PI / 180;

const ReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [barangs, setBarangs] = useState([]);
    const [filter, setFilter] = useState({
        tipe_trans: "pembelian",
        monthYear: new Date(),
    });

    const onFilterMonthYear = (date) => {
        setFilter({ ...filter, monthYear: date });
    };

    const onFilterTipeTrans = (val) => {
        setFilter({
            ...filter,
            tipe_trans: val?.target?.value,
        });
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { tipe_trans, monthYear } = filter;
            await apiReports(
                tipe_trans,
                dayjs(monthYear).format("MM"),
                dayjs(monthYear).format("YYYY")
            )
                .then((res) => {
                    setData(res.data);
                })
                .finally(() => {
                    setLoading(false);
                });
        })();
    }, [filter.tipe_trans, filter.monthYear]);

    useEffect(() => {
        (async () => {
            await apiReportsProducts().then((res) => {
                setBarangs(res.data?.data ?? []);
            });
        })();
    }, []);

    const dataValuation = useMemo(() => {
        const dataVal = [
            { name: "Pemasukan", value: data?.info?.month_income },
            { name: "Pengeluaran", value: data?.info?.month_outcome },
        ];

        return {
            data: dataVal,
            colors: ["#00C49F", "#F44336"],
            radiant: RADIAN,
        };
    }, [data]);

    const renderLabelValuation = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <>
            <h1 className="text-4xl mt-4">Laporan</h1>

            {/* Filter */}
            <section className="mt-8">
                <div className="flex space-x-4">
                    <div className="w-[25%]">
                        <Label value="Pilih Tipe Transaksi" />
                        <Select id="tipe_trans" onChange={onFilterTipeTrans}>
                            <option value="pembelian">Pembelian</option>
                            <option value="penjualan">Penjualan</option>
                        </Select>
                    </div>
                    <div className="w-[25%]">
                        <Label value="Pilih Bulan dan Tahun" />
                        <DatePicker
                            selected={filter.monthYear}
                            onChange={onFilterMonthYear}
                            showMonthYearPicker
                            dateFormat="MM/yyyy"
                            locale="id"
                        />
                    </div>
                </div>
            </section>

            <section className="mt-8">
                {loading ? (
                    <Spinner size="xl" />
                ) : (
                    <>
                        {/* Data Chart */}
                        <aside className="mb-8 md:flex">
                            <div className="md:w-1/2">
                                <h2 className="text-xl font-semibold">
                                    Valuasi pada{" "}
                                    {dayjs(filter.monthYear).format("MMM YYYY")}
                                </h2>
                                <p>
                                    <span className="text-green-500">
                                        Pemasukan =
                                        {rupiah(data?.info?.month_income ?? 0)}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-red-500">
                                        Pengeluaran =
                                        {rupiah(data?.info?.month_outcome ?? 0)}
                                    </span>
                                </p>

                                <PieChart width={300} height={300}>
                                    <Pie
                                        data={dataValuation.data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderLabelValuation}
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        {dataValuation.data.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        dataValuation.colors[
                                                            index %
                                                                dataValuation
                                                                    .colors
                                                                    .length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                </PieChart>
                            </div>

                            <div className="w-1/2 h-96">
                                <h2 className="text-xl font-semibold">
                                    Semua Barang
                                </h2>

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={300}
                                        height={300}
                                        data={barangs ?? []}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                        barSize={20}
                                    >
                                        <XAxis
                                            dataKey="product_name"
                                            scale="point"
                                            padding={{ left: 10, right: 10 }}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Bar
                                            dataKey="stocks"
                                            fill="#8884d8"
                                            background={{ fill: "#EEEEEE" }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </aside>

                        {/* Data Table */}
                        <aside className="mb-8">
                            <h2 className="text-xl font-semibold">
                                Data Laporan
                            </h2>

                            <Table
                                hoverable={true}
                                className="mt-2 overflow-x-auto relative"
                            >
                                <Table.Head>
                                    <Table.HeadCell>No. Trans</Table.HeadCell>
                                    <Table.HeadCell>Tanggal</Table.HeadCell>
                                    <Table.HeadCell>
                                        Customer / Vendor
                                    </Table.HeadCell>
                                    <Table.HeadCell>Tipe Trans</Table.HeadCell>
                                    <Table.HeadCell>Harga</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Info</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {(data?.reports ?? []).map((item) => (
                                        <Table.Row
                                            key={item?.id}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {item?.no_trans}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {dayjs(item?.tanggal).format(
                                                    "YYYY-MM-DD"
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item?.customer_vendor}
                                            </Table.Cell>
                                            <Table.Cell className="flex">
                                                <span className="mr-2">
                                                    {stringFirstCapital(
                                                        item?.tipe_trans
                                                    )}
                                                </span>
                                                {item?.tipe_trans ===
                                                "pembelian" ? (
                                                    <ArrowTrendingDownIcon className="w-6 h-6 text-red-700" />
                                                ) : null}
                                                {item?.tipe_trans ===
                                                "penjualan" ? (
                                                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-700" />
                                                ) : null}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {rupiah(item?.price ?? 0)}
                                            </Table.Cell>
                                            <Table.Cell></Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </aside>
                    </>
                )}
            </section>
        </>
    );
};

ReportPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Laporan" />
);

export default ReportPage;
