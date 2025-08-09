<template>
  <div class="space-y-6">
    <div class="p-4 bg-white rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 items-start">
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank</label>
          <Multiselect v-model="stagedFilters.banks" @select="handleSelectAll('banks', $event)" mode="tags" :options="bankOptions" :searchable="true" placeholder="Pilih Bank" :close-on-select="false"/>
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Proyek</label>
          <Multiselect v-model="stagedFilters.projects" @select="handleSelectAll('projects', $event)" mode="tags" :options="projectOptions" :searchable="true" placeholder="Pilih Proyek" :close-on-select="false"/>
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Multiselect v-model="stagedFilters.statuses" @select="handleSelectAll('statuses', $event)" mode="tags" :options="statusOptions" :searchable="true" placeholder="Pilih Status" :close-on-select="false"/>
        </div>
        <div class="flex items-end gap-2 pt-[29px]">
          <button @click="applyFilters" class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Apply Filters</button>
          <button @click="clearFilters" class="w-full px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors">Clear</button>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button @click="openNewProjectModal" class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        + Tambah Proyek
      </button>
    </div>

    <div class="overflow-hidden bg-white shadow-md sm:rounded-lg">
      <table class="min-w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="th-cell w-12"></th>
            <th class="th-cell">Proyek</th>
            <th class="th-cell">Bank</th>
            <th class="th-cell">Status</th>
            <th class="th-cell">Total Progres</th>
            <th class="th-cell text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <template v-for="project in filteredProjects" :key="project.id">
            <tr @click="toggleRow(project.id)" class="hover:bg-slate-50 cursor-pointer">
              <td class="td-cell text-center">
                <ChevronRightIcon class="h-5 w-5 text-slate-400 transition-transform" :class="isRowExpanded(project.id) && 'rotate-90'" />
              </td>
              <td class="td-cell font-medium text-slate-800">{{ project.projectName }}</td>
              <td class="td-cell text-slate-500">{{ project.bank }}</td>
              <td class="td-cell">
                <span :class="['status-badge', getStatusClass(project.projectStatus)]">{{ project.projectStatus }}</span>
              </td>
              <td class="td-cell">
                <div class="flex items-center gap-2">
                  <div class="w-full bg-slate-200 rounded-full h-2.5"><div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${project.totalProgress}%` }"></div></div>
                  <span class="font-medium text-slate-600 text-sm">{{ project.totalProgress.toFixed(0) }}%</span>
                </div>
              </td>
              <td class="td-cell text-center space-x-4">
                <button @click.stop="openEditProjectModal(project)" title="Ubah Proyek" class="text-slate-400 hover:text-green-600"><PencilSquareIcon class="h-5 w-5"/></button>
                <button @click.stop="confirmProjectDelete(project)" title="Hapus Proyek" class="text-slate-400 hover:text-red-600"><TrashIcon class="h-5 w-5"/></button>
              </td>
            </tr>
            <tr v-if="isRowExpanded(project.id)">
              <td colspan="6" class="p-4 bg-slate-50/50">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div v-for="phase in project.phases" :key="phase.name" class="p-3 bg-white rounded border">
                    <p class="text-xs font-bold text-slate-500 uppercase">{{ phase.name }}</p>
                    <div class="flex items-center gap-2 mt-2">
                       <div class="w-full bg-slate-200 rounded-full h-1.5">
                         <div class="bg-green-500 h-1.5 rounded-full" :style="{ width: `${phase.progress}%` }"></div>
                       </div>
                       <span class="font-medium text-slate-600 text-xs">{{ phase.progress.toFixed(0) }}%</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <ProjectFormModal v-if="isFormModalVisible" :project="selectedProject" @close="closeModals" @save="handleSaveProject"/>
    <ConfirmDeleteModal v-if="isDeleteModalVisible" :item-to-delete="{ name: selectedProject?.projectName ?? '', type: 'proyek' }" @close="closeModals" @confirm="handleDeleteProjectConfirmed"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import Multiselect from '@vueform/multiselect';
import { useToast } from 'vue-toastification';
import { masterData } from '../data/mockData';
import type { Project, Task, TaskPhase, ProjectStatus } from '../data/mockData';
import { ChevronRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';
import ProjectFormModal from '../components/modals/ProjectFormModal.vue';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal.vue';

const toast = useToast();
const projectsRef = ref(masterData);
const expandedRows = ref<number[]>([]);
const isFormModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const selectedProject = ref<Project | null>(null);

// --- LOGIKA FILTER (TANPA WATCH) ---
const stagedFilters = reactive({ banks: [] as string[], projects: [] as string[], statuses: [] as ProjectStatus[] });
const appliedFilters = reactive({ banks: [] as string[], projects: [] as string[], statuses: [] as ProjectStatus[] });
const SELECT_ALL_VALUE = 'SELECT_ALL';

const projectSummaries = computed(() => {
  return projectsRef.value.map((project: Project) => {
    const totalTasks = project.tasks.length || 1;
    const doneTasks = project.tasks.filter((t: Task) => t.taskStatus === 'Done').length;
    const totalProgress = (doneTasks / totalTasks) * 100;
    const pics = [...new Set(project.tasks.map((t: Task) => t.pic))];
    const phases: Record<TaskPhase, { done: number, total: number }> = {
      DEFINITION: { done: 0, total: 0 },
      DEVELOPMENT: { done: 0, total: 0 },
      TESTING: { done: 0, total: 0 },
      DEPLOYMENT: { done: 0, total: 0 },
    };
    project.tasks.forEach((task: Task) => {
      phases[task.phase].total++;
      if (task.taskStatus === 'Done') {
        phases[task.phase].done++;
      }
    });
    return {
      ...project,
      totalProgress,
      pics,
      phases: Object.entries(phases).map(([name, data]) => ({
        name,
        progress: (data.done / (data.total || 1)) * 100,
      })),
    };
  });
});

const bankOptions = computed(() => {
    let data = projectSummaries.value;
    if (stagedFilters.projects.length) data = data.filter(p => stagedFilters.projects.includes(p.projectName));
    if (stagedFilters.statuses.length) data = data.filter(p => stagedFilters.statuses.includes(p.projectStatus));
    const banks = [...new Set(data.map(p => p.bank))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...banks.map(b => ({ value: b, label: b }))];
});
const projectOptions = computed(() => {
    let data = projectSummaries.value;
    if (stagedFilters.banks.length) data = data.filter(p => stagedFilters.banks.includes(p.bank));
    if (stagedFilters.statuses.length) data = data.filter(p => stagedFilters.statuses.includes(p.projectStatus));
    const projects = [...new Set(data.map(p => p.projectName))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...projects.map(p => ({ value: p, label: p }))];
});
const statusOptions = computed(() => {
    let data = projectSummaries.value;
    // Saring data berdasarkan filter bank dan proyek yang aktif
    if (stagedFilters.banks.length) data = data.filter(p => stagedFilters.banks.includes(p.bank));
    if (stagedFilters.projects.length) data = data.filter(p => stagedFilters.projects.includes(p.projectName));

    // Ambil hanya status unik dari data yang sudah tersaring
    const statuses = [...new Set(data.map(p => p.projectStatus))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...statuses.map(s => ({ value: s, label: s }))];
});

const handleSelectAll = (filterType: 'banks' | 'projects' | 'statuses', selectedValue: string) => {
  if (selectedValue !== SELECT_ALL_VALUE) return;
  (stagedFilters[filterType] as string[]) = (stagedFilters[filterType] as string[]).filter(val => val !== SELECT_ALL_VALUE);
  
  if (filterType === 'banks') stagedFilters.banks = bankOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
  if (filterType === 'projects') stagedFilters.projects = projectOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
  if (filterType === 'statuses') stagedFilters.statuses = statusOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value as ProjectStatus);
};

const applyFilters = () => {
  // Membersihkan pilihan tidak valid sebelum menerapkan
  stagedFilters.banks = stagedFilters.banks.filter(b => bankOptions.value.some(opt => opt.value === b));
  stagedFilters.projects = stagedFilters.projects.filter(p => projectOptions.value.some(opt => opt.value === p));

  appliedFilters.banks = [...stagedFilters.banks];
  appliedFilters.projects = [...stagedFilters.projects];
  appliedFilters.statuses = [...stagedFilters.statuses];
};

const clearFilters = () => {
  stagedFilters.banks = [];
  stagedFilters.projects = [];
  stagedFilters.statuses = [];
  applyFilters();
};

const filteredProjects = computed(() => {
  return projectSummaries.value.filter(project => {
    const bankMatch = appliedFilters.banks.length === 0 || appliedFilters.banks.includes(project.bank);
    const projectMatch = appliedFilters.projects.length === 0 || appliedFilters.projects.includes(project.projectName);
    const statusMatch = appliedFilters.statuses.length === 0 || appliedFilters.statuses.includes(project.projectStatus); // <-- TAMBAHKAN BARIS INI
    return bankMatch && projectMatch && statusMatch; // <-- Tambahkan statusMatch di sini
  });
});

// --- Sisa Script (tidak berubah) ---
const toggleRow = (projectId: number) => {
  const index = expandedRows.value.indexOf(projectId);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(projectId);
  }
};
const isRowExpanded = (projectId: number) => { return expandedRows.value.includes(projectId); };
const getStatusClass = (status: ProjectStatus) => {
  const statusMap: Record<ProjectStatus, string> = {
    'Live': 'status-live',
    'Closed': 'status-closed',
    'In Progress': 'status-in-progress',
    'Not Yet': 'status-not-yet',
  };
  return statusMap[status] || 'status-not-yet';
};
const closeModals = () => {
  isFormModalVisible.value = false;
  isDeleteModalVisible.value = false;
  selectedProject.value = null;
};
const openNewProjectModal = () => {
  selectedProject.value = null;
  isFormModalVisible.value = true;
};
const openEditProjectModal = (project: Project) => {
  selectedProject.value = project;
  isFormModalVisible.value = true;
};
const confirmProjectDelete = (project: Project) => {
  selectedProject.value = project;
  isDeleteModalVisible.value = true;
};
const handleSaveProject = (projectData: Partial<Project>) => {
  if (projectData.id) {
    const index = projectsRef.value.findIndex(p => p.id === projectData.id);
    if(index !== -1) projectsRef.value[index] = { ...projectsRef.value[index], ...projectData };
    toast.success(`Proyek "${projectData.projectName}" berhasil diperbarui.`);
  } else {
    projectData.id = Date.now();
    projectData.tasks = [];
    projectsRef.value.unshift(projectData as Project);
    toast.success(`Proyek "${projectData.projectName}" berhasil ditambahkan.`);
  }
  closeModals();
};
const handleDeleteProjectConfirmed = () => {
  if (!selectedProject.value) return;
  const projectName = selectedProject.value.projectName;
  projectsRef.value = projectsRef.value.filter(p => p.id !== selectedProject.value?.id);
  toast.success(`Proyek "${projectName}" telah dihapus.`);
  closeModals();
};
</script>
