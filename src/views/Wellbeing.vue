<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-3xl font-bold text-slate-800">Kesejahteraan Tim</h2>
      <p class="mt-1 text-slate-500">Pantau beban kerja tim dan kelola fokus Anda untuk menjaga produktivitas yang sehat.</p>
    </div>

    <div class="p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-emerald-100 rounded-full">
          <BellSlashIcon class="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-700">Mode Fokus</h3>
          <p class="text-sm text-slate-500 mt-1">Aktifkan untuk menjeda semua notifikasi aplikasi selama 1 jam.</p>
        </div>
        <button @click="activateFocusMode" class="ml-auto px-4 py-2 bg-emerald-500 text-white rounded-md font-semibold text-sm hover:bg-emerald-600">
          Aktifkan Fokus
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-700 mb-4">Peringatan Burnout (AI)</h3>
        <div class="space-y-4">
          <div v-for="warning in burnoutWarnings" :key="warning.pic" class="flex items-start gap-3">
            <div class="p-2 bg-amber-100 rounded-full mt-1">
              <ExclamationTriangleIcon class="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p class="font-semibold text-slate-800">{{ warning.pic }}</p>
              <p class="text-sm text-slate-500">{{ warning.message }}</p>
            </div>
          </div>
          <p v-if="burnoutWarnings.length === 0" class="text-sm text-slate-500 italic">
            Tidak ada peringatan burnout terdeteksi. Kerja tim saat ini terpantau sehat.
          </p>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-700 mb-4">Visualisasi Beban Kerja</h3>
        <div class="space-y-5">
          <div v-for="member in teamWorkload" :key="member.pic">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-slate-700">{{ member.pic }}</span>
              <span class="text-sm font-medium text-slate-500">{{ member.taskCount }} Tugas Aktif</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div class="h-2.5 rounded-full" :class="getWorkloadBarClass(member.loadPercentage)" :style="{ width: `${member.loadPercentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { masterData } from '../data/mockData';
import { BellSlashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const toast = useToast();

const activateFocusMode = () => {
    toast.success("Mode Fokus Diaktifkan");
};

// --- LOGIKA UNTUK BEBAN KERJA & PERINGATAN (SIMULASI DARI mockData) ---
const teamWorkload = computed(() => {
    const workload: Record<string, number> = {};
    
    // Hitung tugas 'In Progress' untuk setiap PIC
    masterData.flatMap(p => p.tasks)
        .filter(t => t.taskStatus === 'In Progress')
        .forEach(task => {
            if (!workload[task.pic]) workload[task.pic] = 0;
            workload[task.pic]++;
        });
        
    const maxTasks = Math.max(...Object.values(workload), 5); // Anggap beban maksimal adalah 5 tugas aktif
    
    return Object.entries(workload)
        .map(([pic, taskCount]) => ({
            pic,
            taskCount,
            loadPercentage: Math.min((taskCount / maxTasks) * 100, 100)
        }))
        .sort((a, b) => b.taskCount - a.taskCount);
});

const burnoutWarnings = computed(() => {
    return teamWorkload.value
        .filter(member => member.loadPercentage >= 80) // Anggap burnout jika beban kerja >= 80%
        .map(member => ({
            pic: member.pic,
            message: `Memiliki ${member.taskCount} tugas aktif. Pertimbangkan untuk meredistribusi pekerjaan.`
        }));
});

// Helper untuk warna progress bar
const getWorkloadBarClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
}
</script>