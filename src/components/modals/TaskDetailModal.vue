<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <header class="p-5 border-b flex justify-between items-center flex-shrink-0">
        <div>
          <h3 class="font-semibold text-lg text-slate-800">Detail Tugas</h3>
          <p class="text-sm text-blue-600 font-semibold">{{ task.taskName }}</p>
        </div>
        <button @click="$emit('close')" class="p-1 rounded-full hover:bg-slate-100">
          <XMarkIcon class="h-5 w-5 text-slate-400"/>
        </button>
      </header>
      
      <div class="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
        <div>
          <h4 class="font-semibold text-slate-700 mb-2">Rincian Pekerjaan</h4>
          <div v-if="task.subTasks && task.subTasks.length > 0" class="space-y-3">
            <div v-for="sub in task.subTasks" :key="sub.id" class="p-3 border rounded-md bg-white">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-slate-600">{{ sub.description }}</span>
                <span class="text-sm font-medium text-slate-800">{{ sub.progress.toFixed(2) }}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${sub.progress}%` }"></div></div>
            </div>
          </div>
          <p v-else class="text-sm text-slate-500 italic">Tidak ada rincian pekerjaan.</p>
        </div>
        <div>
          <h4 class="font-semibold text-slate-700 mb-2">Dokumen & Referensi</h4>
          <ul v-if="task.links && task.links.length > 0" class="space-y-1">
            <li v-for="link in task.links" :key="link.id" class="text-sm flex items-center">
              <LinkIcon class="h-4 w-4 mr-2 text-slate-400"/>
              <a :href="link.url" target="_blank" class="text-blue-600 hover:underline">{{ link.label }}</a>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500 italic">Tidak ada link referensi.</p>
        </div>
      </div>

      <footer class="px-6 py-4 bg-slate-100 flex justify-between items-center flex-shrink-0 rounded-b-lg">
        <div class="text-lg font-bold text-slate-800">
          Total Progres: <span class="text-blue-600">{{ totalProgress.toFixed(2) }}%</span>
        </div>
        <button @click="$emit('close')" class="px-5 py-2.5 bg-white text-slate-800 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100">Tutup</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../../data/mockData';
import { LinkIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{ task: Task | any }>();
defineEmits(['close']);

const totalProgress = computed(() => {
  if (!props.task?.subTasks || props.task.subTasks.length === 0) return 0;
  const sum = props.task.subTasks.reduce((acc: number, sub: any) => acc + (Number(sub.progress) || 0), 0);
  return sum / props.task.subTasks.length;
});
</script>