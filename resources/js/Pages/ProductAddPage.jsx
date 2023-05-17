import React, { useMemo } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { LayoutAdmin } from "../Components";
import { apiBarangAdd } from "../Api";
import { schemaBarangUpdate } from "../Helpers/schema";
import { router } from "@inertiajs/react";

const ProductAddPage = () => {
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

    const onSubmitBarang = formBarang.handleSubmit(async (data) => {
        await apiBarangAdd(token, data)
            .then(async (res) => {
                alert(`Success - ${res?.data?.message}`);
                router.visit("/products");
            })
            .catch((err) => {
                console.log("Err => ", err?.response ?? err?.message);
            });
    });

    return (
        <>
            <h1 className="text-4xl mt-4">Tambah Barang</h1>

            {/* Form Tambah Barang */}
            <section className="mt-8">
                <form onSubmit={onSubmitBarang}>
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
                        Tambah Barang
                    </Button>
                </form>
            </section>
        </>
    );
};

ProductAddPage.layout = (page) => (
    <LayoutAdmin children={page} title="Exam - Tambah Barang" />
);

export default ProductAddPage;
