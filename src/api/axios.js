import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const api = axios.create({
    baseURL: API_KEY
})

export const getDevelopers = async (pageParam = 1, option = {}) => {
    const response = await api.get(`/developers?key=${API_KEY}&page=${pageParam}&page_size=12`, option);
    return response.data
}