<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-slate-800">User Management</h2>
      <button v-if="activeTab === 'users'" @click="openNewUserModal" class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        + Tambah Pengguna
      </button>
       <button v-else class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        + Tambah Peran
      </button>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button 
          @click="activeTab = 'users'" 
          :class="[activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']"
        >
          Pengguna
        </button>
        <button 
          @click="activeTab = 'roles'" 
          :class="[activeTab === 'roles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']"
        >
          Peran & Hak Akses
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'users'">
      <div class="overflow-hidden bg-white shadow-md sm:rounded-lg">
        <table class="min-w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="th-cell">Pengguna</th>
              <th class="th-cell">Peran</th>
              <th class="th-cell">Status</th>
              <th class="th-cell">Login Terakhir</th>
              <th class="th-cell text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50">
              <td class="td-cell">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" :src="user.avatar" alt="">
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-slate-900">{{ user.name }}</div>
                    <div class="text-slate-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="td-cell text-slate-500">{{ user.role }}</td>
              <td class="td-cell">
                <span :class="['status-badge', user.status === 'Active' ? 'status-active' : 'status-inactive']">{{ user.status }}</span>
              </td>
              <td class="td-cell text-slate-500">{{ user.lastLogin }}</td>
              <td class="td-cell text-center space-x-4">
                <button @click="openEditUserModal(user)" title="Ubah Pengguna" class="text-slate-400 hover:text-green-600"><PencilSquareIcon class="h-5 w-5"/></button>
                <button @click="forceLogout(user)" title="Paksa Logout" class="text-slate-400 hover:text-orange-600"><ArrowLeftOnRectangleIcon class="h-5 w-5"/></button>
                <button @click="confirmUserDelete(user)" title="Hapus Pengguna" class="text-slate-400 hover:text-red-600"><TrashIcon class="h-5 w-5"/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'roles'" class="flex gap-6">
      <div class="w-1/3">
        <h3 class="font-semibold text-slate-700 mb-2">Daftar Peran</h3>
        <div class="bg-white rounded-lg shadow-md p-2 space-y-1">
            <a 
                v-for="role in roles" :key="role.id" href="#"
                @click.prevent="selectedRole = role"
                class="block px-4 py-2 text-sm rounded-md"
                :class="selectedRole?.id === role.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
            >
                {{ role.name }}
            </a>
        </div>
      </div>
      <div class="w-2/3">
        <h3 class="font-semibold text-slate-700 mb-2">
            Hak Akses untuk: <span class="text-blue-600">{{ selectedRole?.name || '...' }}</span>
        </h3>
        <div v-if="selectedRole" class="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div v-for="module in groupedPermissions" :key="module.name">
                <h4 class="font-medium text-slate-800 border-b pb-2 mb-2">{{ module.name }}</h4>
                <div class="grid grid-cols-2 gap-2">
                    <label v-for="permission in module.permissions" :key="permission.id" class="flex items-center space-x-3">
                        <input type="checkbox" :checked="selectedRole.permissions.includes(permission.id)" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        <span class="text-sm text-slate-600">{{ permission.name }}</span>
                    </label>
                </div>
            </div>
        </div>
      </div>
    </div>

    <UserFormModal v-if="isFormModalVisible" :user="selectedUser" @close="closeModals" @save="handleSaveUser" />
    <ConfirmDeleteModal 
      v-if="isDeleteModalVisible" 
      :item-to-delete="{ name: selectedUser?.name ?? '', type: 'pengguna' }" 
      @close="closeModals" 
      @confirm="handleDeleteUserConfirmed" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { usersData, rolesData, permissionsData } from '../data/mockData';
import type { User, Role } from '../data/mockData';
import { PencilSquareIcon, TrashIcon, ArrowLeftOnRectangleIcon } from '@heroicons/vue/24/outline';
import UserFormModal from '../components/modals/UserFormModal.vue';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal.vue';

const toast = useToast();
const activeTab = ref('users');
const users = ref(usersData);
const roles = ref(rolesData);
const selectedRole = ref<Role | null>(roles.value[0]);
const isFormModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const selectedUser = ref<User | null>(null);
const itemToDelete = ref<{ name: string, type: string } | null>(null);

// --- LOGIKA CRUD UNTUK PERAN & HAK AKSES ---
const addRole = () => {
  const roleName = prompt("Masukkan nama peran baru:");
  if (roleName) {
    const newRole = {
      id: Date.now(),
      name: roleName as Role['name'],
      permissions: []
    };
    roles.value.push(newRole);
    selectedRole.value = newRole;
    toast.success(`Peran "${roleName}" berhasil ditambahkan.`);
  }
};
const updatePermission = (permissionId: string) => {
  if (!selectedRole.value) return;
  const index = selectedRole.value.permissions.indexOf(permissionId);
  if (index > -1) {
    selectedRole.value.permissions.splice(index, 1);
  } else {
    selectedRole.value.permissions.push(permissionId);
  }
};
const confirmRoleDelete = (role: Role) => {
  itemToDelete.value = { name: role.name, type: 'peran' };
  isDeleteModalVisible.value = true;
}
const handleDeleteRoleConfirmed = () => {
  if (!itemToDelete.value) return;
  roles.value = roles.value.filter(r => r.name !== itemToDelete.value?.name);
  toast.success(`Peran "${itemToDelete.value.name}" telah dihapus.`);
  selectedRole.value = roles.value[0] || null;
  closeModals();
};

// --- LOGIKA CRUD UNTUK PENGGUNA ---
const groupedPermissions = computed(() => {
    const modules: Record<string, any[]> = {};
    permissionsData.forEach(p => {
        if (!modules[p.module]) modules[p.module] = [];
        modules[p.module].push(p);
    });
    return Object.entries(modules).map(([name, permissions]) => ({ name, permissions }));
});
const forceLogout = (user: User) => {
    toast.warning(`Pengguna "${user.name}" telah dipaksa logout (simulasi).`);
}
const closeModals = () => {
  isFormModalVisible.value = false;
  isDeleteModalVisible.value = false;
  selectedUser.value = null;
  itemToDelete.value = null; // Pastikan itemToDelete juga di-reset
};
const openNewUserModal = () => {
  selectedUser.value = null;
  isFormModalVisible.value = true;
};
const openEditUserModal = (user: User) => {
  selectedUser.value = user;
  isFormModalVisible.value = true;
};

// ===== INI ADALAH FUNGSI YANG BENAR =====
const confirmUserDelete = (user: User) => {
  selectedUser.value = user; // Kita masih butuh ini untuk tahu siapa yang dihapus
  itemToDelete.value = { name: user.name, type: 'pengguna' };
  isDeleteModalVisible.value = true;
};
// =======================================

const handleSaveUser = (userData: Partial<User>) => {
  if (userData.id) {
    const index = users.value.findIndex(u => u.id === userData.id);
    if(index !== -1) users.value[index] = { ...users.value[index], ...userData };
    toast.success(`Pengguna "${userData.name ?? 'Pengguna'}" berhasil diperbarui.`);
  } else {
    userData.id = Date.now();
    users.value.unshift(userData as User);
    toast.success(`Pengguna "${userData.name ?? 'Pengguna Baru'}" berhasil ditambahkan.`);
  }
  closeModals();
};

const handleDeleteUserConfirmed = () => {
  if (!selectedUser.value) return;
  users.value = users.value.filter(u => u.id !== selectedUser.value?.id);
  toast.success(`Pengguna "${selectedUser.value.name}" telah dihapus.`);
  closeModals();
};
</script>