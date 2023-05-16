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
