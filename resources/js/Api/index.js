import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    timeout: 36000, // timeout 1s
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Auth
export async function apiLogin(body) {
    return await instance.post("/login", body);
}

export async function apiGetUser(token) {
    return await instance.get("/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiLogout(token) {
    return await instance.delete("/logout", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Barang
export async function apiBarangAll(token, page) {
    return await instance.get(`/barangs?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiBarangByID(token, id) {
    return await instance.get(`/barang/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiBarangAdd(token, body) {
    return await instance.post("/barang", body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiBarangUpdate(token, id, body) {
    return await instance.patch(`/barang/${id}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiBarangDelete(token, id) {
    return await instance.delete(`/barang/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiBarangAllSimple(token) {
    return await instance.get("/barangs-all", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Nomor Seri
export async function apiNomorSeri(token, product_id) {
    return await instance.get(`/nomor-seris/${product_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiNomorSeriAdd(token, body) {
    return await instance.post(`/nomor-seri`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiNomorSeriId(token, id) {
    return await instance.get(`/nomor-seri/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiNomorSeriUpdate(token, id, body) {
    return await instance.patch(`/nomor-seri/${id}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiNomorSeriDelete(token, id) {
    return await instance.delete(`/nomor-seri/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiNomorSeriUsed(token, product_id) {
    return await instance.get(`/nomor-seris/${product_id}/used`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Transaksi
export async function apiTransaksis(token) {
    return await instance.get("/transaksis", {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function apiTransaksiAdd(token, body) {
    return await instance.post("/transaksi", body, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function apiTransaksiDelete(token, id) {
    return await instance.delete(`/transaksi/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function apiTransaksiDetail(token, id) {
    return await instance.get(`/transaksi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
