import axios from "axios";

const instance = axios.create({
    baseURL: "https://api-for-testing-gujp.onrender.com/api/account",
    headers:{
        "Content-Type": "application/json",
    },
});

export default instance;