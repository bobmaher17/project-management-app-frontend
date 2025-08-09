<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <header class="p-5 border-b flex justify-between items-center">
        <h3 class="font-semibold text-lg text-slate-800">{{ isEditing ? 'Ubah Pengguna' : 'Tambah Pengguna Baru' }}</h3>
        <button @click="$emit('close')" class="p-1 rounded-full hover:bg-slate-100">
          <XMarkIcon class="h-5 w-5 text-slate-400"/>
        </button>
      </header>
      <form @submit.prevent="submitForm" class="p-6 space-y-4 bg-slate-50">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nama</label>
          <input type="text" v-model="form.name" required class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" v-model="form.email" required class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Peran</label>
          <select v-model="form.role" required class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3">
            <option>Admin</option>
            <option>Project Manager</option>
            <option>Technical Leader</option>
            <option>Member</option>
          </select>
        </div>
      </form>
      <footer class="px-6 py-4 bg-slate-100 flex justify-end gap-4 rounded-b-lg border-t">
        <button type="button" @click="$emit('close')" class="px-5 py-2.5 bg-white text-slate-800 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100">Batal</button>
        <button type="button" @click="submitForm" class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Simpan</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '../../data/mockData';
import { XMarkIcon } from '@heroicons/vue/24/outline';
const props = defineProps<{ user: User | null }>();
const emit = defineEmits(['close', 'save']);
const form = ref<Partial<User>>({ name: '', email: '', role: 'Member' });
const isEditing = computed(() => !!props.user);
onMounted(() => {
  if (isEditing.value) form.value = JSON.parse(JSON.stringify(props.user));
});
const submitForm = () => emit('save', form.value);
</script>