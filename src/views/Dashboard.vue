<template>
  <div class="space-y-6">
    <div class="p-4 bg-white rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 items-start">
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank</label>
          <Multiselect
            v-model="stagedFilters.banks"
            @select="handleSelectAll('banks', $event)"
            mode="tags"
            :options="bankOptions"
            :searchable="true"
            placeholder="Pilih Bank"
            :close-on-select="false"
          />
        </div>
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <Multiselect
            v-model="stagedFilters.projects"
            @select="handleSelectAll('projects', $event)"
            mode="tags"
            :options="projectOptions"
            :searchable="true"
            placeholder="Pilih Proyek"
            :close-on-select="false"
          />
        </div>
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">PIC</label>
          <Multiselect
            v-model="stagedFilters.pics"
            @select="handleSelectAll('pics', $event)"
            mode="tags"
            :options="picOptions"
            :searchable="true"
            placeholder="Pilih PIC"
            :close-on-select="false"
          />
        </div>
        <div class="flex items-end gap-2 pt-[29px]">
          <button @click="applyFilters" class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Apply Filters</button>
          <button @click="clearFilters" class="w-full px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors">Clear</button>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
      <div v-for="card in reactiveSummaryData" :key="card.title" 
        class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
      >
        <div class="flex flex-col">
          <h4 class="text-lg font-bold text-gray-800">{{ card.value }}</h4>
          <span class="text-sm font-medium text-gray-500">{{ card.title }}</span>
        </div>
        <div class="flex items-center justify-center w-12 h-12 rounded-full" :class="card.iconBgColor">
          <component :is="card.icon" class="w-6 h-6" :class="card.iconColor" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="p-4 bg-white rounded-lg shadow-md">
        <h3 class="font-semibold text-center text-slate-600 uppercase tracking-wider">Status Proyek</h3>
        <div class="h-80"><Doughnut :data="reactiveProjectStatusData" :options="doughnutOptions" :plugins="[ChartDataLabels]" /></div>
      </div>
      <div class="p-4 bg-white rounded-lg shadow-md">
        <h3 class="font-semibold text-center text-slate-600 uppercase tracking-wider">Status Tugas</h3>
        <div class="h-80"><Doughnut :data="reactiveTaskStatusData" :options="doughnutOptions" :plugins="[ChartDataLabels]" /></div>
      </div>
      <div class="p-4 bg-white rounded-lg shadow-md">
        <h3 class="font-semibold text-center text-slate-600 uppercase tracking-wider">Beban Kerja (Proyek)</h3>
        <div class="h-80"><Bar :data="reactiveWorkloadByProjectData" :options="barOptions" :plugins="[ChartDataLabels]" /></div>
      </div>
      <div class="p-4 bg-white rounded-lg shadow-md">
        <h3 class="font-semibold text-center text-slate-600 uppercase tracking-wider">Beban Kerja (Tugas)</h3>
        <div class="h-80"><Bar :data="reactiveWorkloadByPersonData" :options="barOptions" :plugins="[ChartDataLabels]" /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import Multiselect from '@vueform/multiselect';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { masterData } from '../data/mockData';
import type { Task, ProjectStatus, TaskStatus } from '../data/mockData';

// --- TAMBAHKAN IMPORT IKON INI ---
import { 
  FolderIcon, 
  CheckCircleIcon, 
  RocketLaunchIcon, 
  ClockIcon, 
  QueueListIcon 
} from '@heroicons/vue/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

// --- State & Fungsi untuk Filter ---
const stagedFilters = reactive({ banks: [] as string[], projects: [] as string[], pics: [] as string[] });
const appliedFilters = reactive({ banks: [] as string[], projects: [] as string[], pics: [] as string[] });

const applyFilters = () => {
  // Cek setiap proyek yang dipilih, apakah nilainya masih ada di dalam daftar opsi yang valid
  stagedFilters.projects = stagedFilters.projects.filter(p => 
    projectOptions.value.some(option => option.value === p)
  );
  
  // Lakukan hal yang sama untuk PIC
  stagedFilters.pics = stagedFilters.pics.filter(p => 
    picOptions.value.some(option => option.value === p)
  );
  
  appliedFilters.banks = [...stagedFilters.banks];
  appliedFilters.projects = [...stagedFilters.projects];
  appliedFilters.pics = [...stagedFilters.pics];
};
const clearFilters = () => {
  stagedFilters.banks = []; stagedFilters.projects = []; stagedFilters.pics = [];
  applyFilters();
};

// --- Opsi Filter Dinamis dengan Opsi "Select All" ---
const SELECT_ALL_VALUE = 'SELECT_ALL'; // Nilai khusus untuk "Select All"

const bankOptions = computed(() => {
    let data = masterData;
    if (stagedFilters.projects.length) data = data.filter(i => stagedFilters.projects.includes(i.projectName));
    if (stagedFilters.pics.length) data = data.filter(p => p.tasks.some(t => stagedFilters.pics.includes(t.pic)));
    const banks = [...new Set(data.map(item => item.bank))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...banks.map(b => ({ value: b, label: b }))];
});
const projectOptions = computed(() => {
    let data = masterData;
    if (stagedFilters.banks.length) data = data.filter(i => stagedFilters.banks.includes(i.bank));
    if (stagedFilters.pics.length) data = data.filter(p => p.tasks.some(t => stagedFilters.pics.includes(t.pic)));
    const projects = [...new Set(data.map(item => item.projectName))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...projects.map(p => ({ value: p, label: p }))];
});
const picOptions = computed(() => {
    let data = masterData;
    if (stagedFilters.banks.length) data = data.filter(i => stagedFilters.banks.includes(i.bank));
    if (stagedFilters.projects.length) data = data.filter(i => stagedFilters.projects.includes(i.projectName));
    const pics = [...new Set(data.flatMap(p => p.tasks).map(t => t.pic))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...pics.map(p => ({ value: p, label: p }))];
});

const handleSelectAll = (filterType: 'banks' | 'projects' | 'pics', selectedValue: string) => {
  if (selectedValue !== SELECT_ALL_VALUE) return;

  // Hapus opsi 'SELECT_ALL' dari pilihan agar tidak ikut terpilih
  stagedFilters[filterType] = stagedFilters[filterType].filter(val => val !== SELECT_ALL_VALUE);
  
  // Pilih semua opsi yang tersedia saat itu
  if (filterType === 'banks') stagedFilters.banks = bankOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
  if (filterType === 'projects') stagedFilters.projects = projectOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
  if (filterType === 'pics') stagedFilters.pics = picOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
};

// --- Logika Filter Utama ---
const filteredData = computed(() => {
  return masterData.filter(project => {
    const bankMatch = appliedFilters.banks.length === 0 || appliedFilters.banks.includes(project.bank);
    const projectMatch = appliedFilters.projects.length === 0 || appliedFilters.projects.includes(project.projectName);
    const picMatch = appliedFilters.pics.length === 0 || project.tasks.some(task => appliedFilters.pics.includes(task.pic));
    return bankMatch && projectMatch && picMatch;
  });
});

// --- Helper untuk mendapatkan tugas yang benar-benar tersaring ---
const getFinalFilteredTasks = computed((): Task[] => {
    let tasks = filteredData.value.flatMap(p => p.tasks);
    if (appliedFilters.pics.length > 0) {
        tasks = tasks.filter(task => appliedFilters.pics.includes(task.pic));
    }
    return tasks;
});

// --- Data Tampilan Reaktif ---
const reactiveSummaryData = computed(() => {
    const totalProjects = new Set(filteredData.value.map(p => p.projectName)).size;
    const projectClosed = new Set(filteredData.value.filter(p => p.projectStatus === 'Closed').map(p => p.projectName)).size;
    const projectLive = new Set(filteredData.value.filter(p => p.projectStatus === 'Live').map(p => p.projectName)).size;
    const tasksInProgress = getFinalFilteredTasks.value.filter(t => t.taskStatus === 'In Progress').length;
    const totalTasks = getFinalFilteredTasks.value.length;
    
    return [
      { title: 'Total Project', value: totalProjects, icon: FolderIcon, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      { title: 'Project Closed', value: projectClosed, icon: CheckCircleIcon, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
      { title: 'Project Live', value: projectLive, icon: RocketLaunchIcon, iconBgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      { title: 'Tugas Dalam Proses', value: tasksInProgress, icon: ClockIcon, iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      { title: 'Total Tugas', value: totalTasks, icon: QueueListIcon, iconBgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    ];
});
const reactiveProjectStatusData = computed(() => {
    const statuses: Record<ProjectStatus, number> = { 'Closed': 0, 'Not Yet': 0, 'In Progress': 0, 'Live': 0 };
    const uniqueProjects = [...new Map(filteredData.value.map(p => [p.projectName, p])).values()];
    uniqueProjects.forEach(project => statuses[project.projectStatus]++);
    return {
        labels: ['CLOSED', 'NOT YET', 'IN PROGRESS', 'LIVE'],
        datasets: [{ backgroundColor: ['#28a745', '#6c757d', '#ffc107', '#007bff'], data: [statuses.Closed, statuses['Not Yet'], statuses['In Progress'], statuses.Live] }]
    };
});
const reactiveTaskStatusData = computed(() => {
    const statuses: Record<TaskStatus, number> = { 'Done': 0, 'In Progress': 0, 'Not Yet': 0 };
    getFinalFilteredTasks.value.forEach(task => statuses[task.taskStatus]++);
    const total = Object.values(statuses).reduce((s, c) => s + c, 0) || 1;
    return {
        labels: ['DONE', 'IN PROGRESS', 'NOT YET'],
        datasets: [{ backgroundColor: ['#28a745', '#ffc107', '#6c757d'], data: [(statuses.Done/total)*100, (statuses['In Progress']/total)*100, (statuses['Not Yet']/total)*100] }]
    }
});
const reactiveWorkloadByProjectData = computed(() => {
    const workload: Record<string, Set<string>> = {};
    filteredData.value.forEach(project => {
        let tasks = project.tasks;
        if (appliedFilters.pics.length > 0) tasks = tasks.filter(t => appliedFilters.pics.includes(t.pic));
        tasks.forEach(task => {
            if (!workload[task.pic]) workload[task.pic] = new Set();
            workload[task.pic].add(project.projectName);
        });
    });
    const sortedWorkload = Object.entries(workload).map(([pic, projects]) => ({ pic, count: projects.size })).sort((a, b) => b.count - a.count);
    return {
        labels: sortedWorkload.map(item => item.pic),
        datasets: [{ label: 'Jumlah Proyek', backgroundColor: '#007bff', data: sortedWorkload.map(item => item.count), borderRadius: 4 }]
    }
});
const reactiveWorkloadByPersonData = computed(() => {
    const workload: Record<string, number> = {};
    getFinalFilteredTasks.value.forEach(task => {
        if (!workload[task.pic]) workload[task.pic] = 0;
        workload[task.pic]++;
    });
    const sortedWorkload = Object.entries(workload).sort(([, countA], [, countB]) => countB - countA);
    return {
        labels: sortedWorkload.map(([pic]) => pic),
        datasets: [{ label: 'Jumlah Tugas', backgroundColor: '#007bff', data: sortedWorkload.map(([, count]) => count), borderRadius: 4 }]
    }
});

// --- Opsi Grafik ---
const doughnutOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' as const, labels: { boxWidth: 12, padding: 20 } },
    datalabels: { 
      formatter: (value: number) => value > 1 ? `${value.toFixed(1)}%` : '',
      color: 'white', font: { weight: 'bold' as const, size: 12 } 
    }
  }
};
const barOptions = {
  responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    datalabels: { anchor: 'end' as const, align: 'end' as const, color: '#444', font: { weight: 'bold' as const } }
  },
  scales: { x: { grid: { display: false } }, y: { grid: { display: false } } }
};
</script>

<style>
/* Style global override untuk Multiselect. Ditempatkan di sini agar tidak 'scoped'. */
:root {
  --ms-tag-bg: #2563EB;
  --ms-tag-color: white;
  --ms-option-bg-pointed: #EFF6FF;
  --ms-option-bg-selected: #2563EB;
  --ms-ring-color: rgba(37, 99, 235, 0.25);
}
</style>