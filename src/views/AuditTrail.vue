<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div class="flex flex-col md:flex-row gap-4 justify-between">
        <h2 class="text-2xl font-semibold text-slate-800">Audit Trail</h2>
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input type="date" class="filter-input">
          <select class="filter-input">
            <option value="">Semua Pengguna</option>
            <option v-for="user in userOptions" :key="user">{{ user }}</option>
          </select>
          <select class="filter-input">
            <option value="">Semua Aksi</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
            <option>LOGIN</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="th-cell">Timestamp</th>
              <th class="th-cell">Pengguna</th>
              <th class="th-cell">Aksi</th>
              <th class="th-cell">Objek</th>
              <th class="th-cell">Detail</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-slate-50">
              <td class="td-cell text-slate-500">{{ log.timestamp }}</td>
              <td class="td-cell">
                <div class="flex items-center">
                  <div class="font-medium text-slate-800">{{ log.user.name }}</div>
                </div>
              </td>
              <td class="td-cell">
                <span :class="['status-badge', getActionClass(log.action)]">{{ log.action }}</span>
              </td>
              <td class="td-cell">
                <div class="font-medium text-slate-800">{{ log.targetName }}</div>
                <div class="text-slate-500 text-xs">{{ log.targetType }}</div>
              </td>
              <td class="td-cell text-slate-500">{{ log.details }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center pt-4">
        <span class="text-sm text-slate-600">
          Menampilkan {{ paginatedLogs.length }} dari {{ logs.length }} log
        </span>
        <div class="inline-flex items-center gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn"><ChevronLeftIcon class="h-4 w-4" /></button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn"><ChevronRightIcon class="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { auditLogData } from '../data/mockData';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const logs = ref(auditLogData);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const userOptions = computed(() => [...new Set(logs.value.map(log => log.user.name))]);

// Logika Paginasi
const totalPages = computed(() => Math.ceil(logs.value.length / itemsPerPage.value));
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return logs.value.slice(start, end);
});
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// Helper untuk Styling
const getActionClass = (action: string) => {
  const classMap: Record<string, string> = {
    'CREATE': 'status-create',
    'UPDATE': 'status-update',
    'DELETE': 'status-delete',
    'LOGIN': 'status-login',
  };
  return classMap[action] || 'bg-slate-100 text-slate-800';
};
</script>
