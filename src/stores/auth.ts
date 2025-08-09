import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  // Aksi-aksi ini nanti akan memanggil API menggunakan Axios
  function login(payload) {
    console.log('Action login dipanggil', payload)
    // this.user = ...
  }
  function logout() {
    console.log('Action logout dipanggil')
    // this.user = null
  }
  return { user, login, logout }
})