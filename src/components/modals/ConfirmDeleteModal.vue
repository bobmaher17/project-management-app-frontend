<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
       <div class="p-5 border-b flex justify-between items-center">
        <h3 class="font-semibold text-lg text-slate-800">Konfirmasi Penghapusan</h3>
        <button @click="$emit('close')" class="p-1 rounded-full hover:bg-slate-100">
          <XMarkIcon class="h-5 w-5 text-slate-400"/>
        </button>
      </div>
      <div class="p-6">
        <p class="text-sm text-slate-600">
          Apakah Anda yakin ingin menghapus {{ itemToDelete.type }}
          <strong class="font-semibold text-slate-900">"{{ itemToDelete.name }}"</strong>?
        </p>
      </div>
      <div class="px-6 py-4 bg-slate-50 flex justify-end gap-4 rounded-b-lg">
        <button @click="$emit('close')" class="btn-secondary">Batal</button>
        <button @click="$emit('confirm')" class="btn-danger">Ya, Hapus</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

// Props sekarang menjadi lebih generik
defineProps<{
  itemToDelete: {
    name: string;
    type: string; // 'tugas', 'pengguna', dll.
  }
}>();

defineEmits(['close', 'confirm']);
</script>