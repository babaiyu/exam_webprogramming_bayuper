import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label, Button } from "flowbite-react";
import { Head } from "../Components";
import { schemaLogin } from "../Helpers/schema";
import { apiLogin } from "../Api";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: schemaLogin,
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        await apiLogin(data)
            .then((res) => {
                const response = res.data;
                localStorage.setItem("TOKEN", response?.token);

                window.location.href = "/dashboard";
            })
            .catch((err) => {
                setValue("password", "");
                alert(err?.response?.data?.message ?? err?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    });

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");

        if (token) {
            window.location.href = "/dashboard";
        }
    }, []);

    return (
        <>
            <Head title="Exam - Login" />

            <main>
                <section className="bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                        <a
                            href="/login"
                            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
                        >
                            Exam Web Programming
                        </a>
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                    Masuk dengan akunmu
                                </h1>
                                <form
                                    className="space-y-4 md:space-y-6"
                                    onSubmit={onSubmit}
                                >
                                    <div>
                                        <Label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                            value="Email"
                                        />
                                        <input
                                            {...register("email")}
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            placeholder="Masukkan email (eg: nama@mail.com)"
                                        />
                                        <p className="text-sm text-red-500">
                                            {errors?.email?.message}
                                        </p>
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900"
                                            value="Password"
                                        />
                                        <input
                                            {...register("password")}
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Masukkan password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                        />
                                        <p className="text-sm text-red-500">
                                            {errors?.password?.message}
                                        </p>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        isProcessing={loading}
                                        disabled={loading}
                                    >
                                        Masuk
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
