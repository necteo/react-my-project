import axios from "axios";

const boardClient = axios.create({
  baseURL: 'http://localhost:3355',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default boardClient;