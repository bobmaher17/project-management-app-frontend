<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <header class="p-4 border-b flex items-center gap-3 bg-slate-50 rounded-t-lg">
        <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-amber-100 rounded-full">
          <SparklesIcon class="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h3 class="font-bold text-lg text-slate-800">AI Insight</h3>
          <p class="text-sm text-slate-500">Analisis Proaktif untuk Tugas: "{{ task?.taskName }}"</p>
        </div>
      </header>
      <div class="p-6">
        <p class="text-sm text-slate-600">
          <strong class="text-amber-700">Peringatan:</strong> Tugas ini teridentifikasi memiliki risiko keterlambatan yang akan berdampak pada tugas-tugas dependen lainnya.
        </p>
        <div class="mt-4 p-3 bg-slate-100 rounded-md text-sm">
          Estimasi dampak: **Menunda tugas 'Testing End-to-End' sebesar 80%.**
        </div>
      </div>
      <footer class="px-6 py-3 bg-slate-50 flex justify-end gap-4 rounded-b-lg">
        <button @click="$emit('close')" class="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 font-semibold text-sm">Mengerti</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '../../data/mockData';
import { SparklesIcon } from '@heroicons/vue/24/outline';
defineProps<{ task: Task | null }>();
defineEmits(['close']);
</script>