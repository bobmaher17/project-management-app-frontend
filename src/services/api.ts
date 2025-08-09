import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Alamat backend API Anda
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getTasks() {
    console.log('Memanggil API untuk getTasks...');
    return apiClient.get('/tasks');
  }
};