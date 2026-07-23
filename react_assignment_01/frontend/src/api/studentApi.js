import axios from "axios";

const BASE_URL = "http://localhost:5000/students";

export const getAllStudents = () => axios.get(BASE_URL);

export const searchStudents = (name) =>
  axios.get(`${BASE_URL}/search?name=${name}`);

export const addStudent = (data) => axios.post(BASE_URL, data);

export const editStudent = (id, data) => axios.put(`${BASE_URL}/${id}`, data);

export const removeStudent = (id) => axios.delete(`${BASE_URL}/${id}`);
