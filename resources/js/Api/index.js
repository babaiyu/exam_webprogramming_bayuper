import axios from "axios";

const token = localStorage.getItem("TOKEN");

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 36000, // timeout 1s
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    },
});

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error?.response?.status === 401) {
            localStorage.clear();
        }
        return Promise.reject(error);
    }
);

// Auth
export async function apiLogin(body) {
    return await instance.post("/login", body);
}

export async function apiGetUser() {
    return await instance.get("/user");
}

export async function apiLogout() {
    return await instance.delete("/logout");
}

// Barang
export async function apiBarangAll(page) {
    return await instance.get(`/barangs?page=${page}`);
}

export async function apiBarangByID(id) {
    return await instance.get(`/barang/${id}`);
}

export async function apiBarangAdd(body) {
    return await instance.post("/barang", body);
}

export async function apiBarangUpdate(id, body) {
    return await instance.patch(`/barang/${id}`, body);
}

export async function apiBarangDelete(id) {
    return await instance.delete(`/barang/${id}`);
}

export async function apiBarangAllSimple() {
    return await instance.get("/barangs-all");
}

// Nomor Seri
export async function apiNomorSeri(product_id) {
    return await instance.get(`/nomor-seris/${product_id}`);
}

export async function apiNomorSeriAdd(body) {
    return await instance.post(`/nomor-seri`, body);
}

export async function apiNomorSeriId(id) {
    return await instance.get(`/nomor-seri/${id}`);
}

export async function apiNomorSeriUpdate(id, body) {
    return await instance.patch(`/nomor-seri/${id}`, body);
}

export async function apiNomorSeriDelete(id) {
    return await instance.delete(`/nomor-seri/${id}`);
}

export async function apiNomorSeriUsed(product_id) {
    return await instance.get(`/nomor-seris/${product_id}/used`);
}

// Transaksi
export async function apiTransaksis(page) {
    return await instance.get(`/transaksis?page=${page}`);
}

export async function apiTransaksiAdd(body) {
    return await instance.post("/transaksi", body);
}

export async function apiTransaksiDelete(id) {
    return await instance.delete(`/transaksi/${id}`);
}

export async function apiTransaksiDetail(id) {
    return await instance.get(`/transaksi/${id}`);
}

// Laporan
export async function apiReports(tipe_trans, month, year) {
    return await instance.get(
        `/laporans?tipe_trans=${tipe_trans}&month=${month}&year=${year}`
    );
}

export async function apiReportsProducts() {
    return await instance.get("/laporans/products");
}
