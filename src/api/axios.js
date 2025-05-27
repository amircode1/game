import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: BASE_URL
})

export const getDevelopers = async (pageParam = 1, option = {}) => {
    const response = await api.get(`/developers?key=${API_KEY}&page=${pageParam}&page_size=12`, option);
    return response.data
}