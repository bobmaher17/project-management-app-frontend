<template>
  <div class="space-y-6">
    <div class="p-4 bg-white rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 items-start">
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank</label>
          <Multiselect v-model="stagedFilters.banks" @select="handleSelectAll('banks', $event)" mode="tags" :options="bankOptions" :searchable="true" placeholder="Pilih Bank" :close-on-select="false"/>
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <Multiselect v-model="stagedFilters.projects" @select="handleSelectAll('projects', $event)" mode="tags" :options="projectOptions" :searchable="true" placeholder="Pilih Proyek" :close-on-select="false"/>
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">PIC</label>
          <Multiselect v-model="stagedFilters.pics" @select="handleSelectAll('pics', $event)" mode="tags" :options="picOptions" :searchable="true" placeholder="Pilih PIC" :close-on-select="false"/>
        </div>
        <div class="flex items-end gap-2 pt-[29px]">
          <button @click="applyFilters" class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Apply Filters</button>
          <button @click="clearFilters" class="w-full px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors">Clear</button>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end">
      <button @click="openNewTaskModal" class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        + Tambah Tugas
      </button>
    </div>

    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th scope="col" class="th-cell sm:pl-6" @click="handleSort('id')">
                    <div class="flex items-center gap-1">No <span v-if="sortKey === 'id'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell" @click="handleSort('bank')">
                    <div class="flex items-center gap-1">Bank <span v-if="sortKey === 'bank'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell" @click="handleSort('projectName')">
                    <div class="flex items-center gap-1">Proyek <span v-if="sortKey === 'projectName'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell" @click="handleSort('taskName')">
                    <div class="flex items-center gap-1">Tugas <span v-if="sortKey === 'taskName'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell" @click="handleSort('endDate')">
                    <div class="flex items-center gap-1">Countdown <span v-if="sortKey === 'endDate'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell" @click="handleSort('taskStatus')">
                    <div class="flex items-center gap-1">Status <span v-if="sortKey === 'taskStatus'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell" @click="handleSort('pic')">
                    <div class="flex items-center gap-1">PIC <span v-if="sortKey === 'pic'"><ArrowUpIcon v-if="sortDirection === 'asc'" class="h-4 w-4" /><ArrowDownIcon v-else class="h-4 w-4" /></span></div>
                  </th>
                  <th scope="col" class="th-cell text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(task, index) in paginatedTasks" :key="task.id" class="hover:bg-gray-50">
                  <td class="td-cell sm:pl-6">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="td-cell">{{ task.bank }}</td>
                  <td class="td-cell">
                    <div class="font-medium text-gray-900">{{ task.projectName }}</div>
                    <div class="text-gray-500">{{ task.phase }}</div>
                  </td>
                  <td class="td-cell">
                    <div class="font-medium text-gray-900">{{ task.taskName }}</div>
                    <div class="text-gray-500">{{ task.startDate }} → {{ task.endDate }}</div>
                  </td>
                  <td class="td-cell">
                     <span :class="getCountdownClass(task.endDate)">
                       {{ calculateCountdown(task.endDate) }}
                     </span>
                  </td>
                  <td class="td-cell">
                    <span :class="['status-badge', getStatusClass(task.taskStatus)]">{{ task.taskStatus }}</span>
                  </td>
                  <td class="td-cell">{{ task.pic }}</td>
                  <td class="td-cell text-center space-x-2">
                    <button @click="openDetailModal(task)" title="Lihat Detail" class="p-1 text-slate-400 rounded-md hover:bg-slate-100 hover:text-blue-600">
                      <EyeIcon class="h-5 w-5"/>
                    </button>
                    <button @click="openEditModal(task)" title="Ubah Tugas" class="p-1 text-slate-400 rounded-md hover:bg-slate-100 hover:text-green-600">
                      <PencilSquareIcon class="h-5 w-5"/>
                    </button>
                    <button @click="confirmDelete(task)" title="Hapus Tugas" class="p-1 text-slate-400 rounded-md hover:bg-slate-100 hover:text-red-600">
                      <TrashIcon class="h-5 w-5"/>
                    </button>
                    <button v-if="isTaskAtRisk(task.endDate)" @click="showAiInsight(task)" title="Insight dari AI" class="p-1 text-amber-500 rounded-md hover:bg-amber-100 hover:text-amber-600">
                      <SparklesIcon class="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-between items-center pt-4">
        <span class="text-sm text-gray-600">
            Menampilkan {{ paginatedTasks.length }} dari {{ filteredTasks.length }} tugas
        </span>
        <div class="inline-flex items-center gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-100">
                <ChevronLeftIcon class="h-4 w-4" />
            </button>
            <span class="text-sm text-gray-600">
                Page <span class="font-semibold">{{ currentPage }}</span> of <span class="font-semibold">{{ totalPages }}</span>
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-100">
                <ChevronRightIcon class="h-4 w-4" />
            </button>
        </div>
    </div>
    
    <TaskDetailModal v-if="isDetailModalVisible" :task="selectedTask" @close="closeModals" />
    <ConfirmDeleteModal 
      v-if="isDeleteModalVisible" 
      :item-to-delete="{ name: selectedTask?.taskName ?? '', type: 'tugas' }" 
      @close="closeModals" 
      @confirm="handleDeleteConfirmed" 
    />
    <AiInsightModal v-if="isAiModalVisible" :task="selectedTask" @close="closeModals" />
    <TaskFormModal 
      v-if="isFormModalVisible" 
      :task="selectedTask"
      :projects="projectOptionsForModal" 
      @close="closeModals" 
      @save="handleSaveTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useToast } from 'vue-toastification';
import Multiselect from '@vueform/multiselect';
import { differenceInBusinessDays, format } from 'date-fns';
import { masterData } from '../data/mockData';
import type { Task } from '../data/mockData';
import TaskDetailModal from '../components/modals/TaskDetailModal.vue';
import TaskFormModal from '../components/modals/TaskFormModal.vue';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal.vue';
import AiInsightModal from '../components/modals/AiInsightModal.vue'; // <-- Import modal AI
import { 
  EyeIcon, 
  PencilSquareIcon, 
  TrashIcon,
  SparklesIcon, // <-- Ikon baru untuk AI
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon, 
  ArrowDownIcon
} from '@heroicons/vue/24/outline';

// --- DATA & STATE ---
const toast = useToast(); // Inisialisasi toast
const allTasksFlat = ref(masterData.flatMap(project => 
  project.tasks.map(task => ({ ...task, bank: project.bank, projectName: project.projectName }))
));
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref('endDate'); // Default sorting
const sortDirection = ref('asc'); // Default direction
const isDetailModalVisible = ref(false);
const isFormModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isAiModalVisible = ref(false); // <-- State baru
const selectedTask = ref<any>(null);

// --- FUNGSI AKSI BARU ---
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

// --- LOGIKA FILTER (Sama seperti Dashboard) ---
const stagedFilters = reactive({ banks: [] as string[], projects: [] as string[], pics: [] as string[] });
const appliedFilters = reactive({ banks: [] as string[], projects: [] as string[], pics: [] as string[] });
const SELECT_ALL_VALUE = 'SELECT_ALL';

const bankOptions = computed(() => {
    let data = allTasksFlat.value;
    if (stagedFilters.projects.length) data = data.filter(i => stagedFilters.projects.includes(i.projectName));
    if (stagedFilters.pics.length) data = data.filter(p => stagedFilters.pics.includes(p.pic));
    const banks = [...new Set(data.map(item => item.bank))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...banks.map(b => ({ value: b, label: b }))];
});
const projectOptions = computed(() => {
    let data = allTasksFlat.value;
    if (stagedFilters.banks.length) data = data.filter(i => stagedFilters.banks.includes(i.bank));
    if (stagedFilters.pics.length) data = data.filter(p => stagedFilters.pics.includes(p.pic));
    const projects = [...new Set(data.map(item => item.projectName))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...projects.map(p => ({ value: p, label: p }))];
});
const picOptions = computed(() => {
    let data = allTasksFlat.value;
    if (stagedFilters.banks.length) data = data.filter(i => stagedFilters.banks.includes(i.bank));
    if (stagedFilters.projects.length) data = data.filter(i => stagedFilters.projects.includes(i.projectName));
    const pics = [...new Set(data.map(t => t.pic))];
    return [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...pics.map(p => ({ value: p, label: p }))];
});

const projectOptionsForModal = computed(() => {
    const uniqueProjects = [...new Map(masterData.map(item => [item.projectName, item])).values()];
    return uniqueProjects.map(p => ({ projectName: p.projectName, bank: p.bank }));
});

const handleSelectAll = (filterType: 'banks' | 'projects' | 'pics', selectedValue: string) => {
  if (selectedValue !== SELECT_ALL_VALUE) return;
  stagedFilters[filterType] = stagedFilters[filterType].filter(val => val !== SELECT_ALL_VALUE);
  if (filterType === 'banks') stagedFilters.banks = bankOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
  if (filterType === 'projects') stagedFilters.projects = projectOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
  if (filterType === 'pics') stagedFilters.pics = picOptions.value.filter(o => o.value !== SELECT_ALL_VALUE).map(o => o.value);
};

const applyFilters = () => {
  appliedFilters.banks = [...stagedFilters.banks];
  appliedFilters.projects = [...stagedFilters.projects];
  appliedFilters.pics = [...stagedFilters.pics];
  currentPage.value = 1; // Selalu reset ke halaman pertama
};
const clearFilters = () => {
  stagedFilters.banks = []; stagedFilters.projects = []; stagedFilters.pics = [];
  applyFilters();
};

const filteredTasks = computed(() => {
  return allTasksFlat.value.filter(task => {
    const bankMatch = appliedFilters.banks.length === 0 || appliedFilters.banks.includes(task.bank);
    const projectMatch = appliedFilters.projects.length === 0 || appliedFilters.projects.includes(task.projectName);
    const picMatch = appliedFilters.pics.length === 0 || appliedFilters.pics.includes(task.pic);
    return bankMatch && projectMatch && picMatch;
  });
});


// --- Paginasi ---
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / itemsPerPage.value));
const sortedTasks = computed(() => {
  return [...filteredTasks.value].sort((a, b) => {
    const key = sortKey.value as keyof typeof a;
    let valA = a[key];
    let valB = b[key];

    // Logika khusus untuk sorting countdown berdasarkan selisih hari
    if (key === 'endDate') {
        valA = differenceInBusinessDays(new Date(a.endDate), new Date());
        valB = differenceInBusinessDays(new Date(b.endDate), new Date());
    }

    if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    // Paginasi sekarang berdasarkan data yang sudah diurutkan
    return sortedTasks.value.slice(start, end);
});
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// --- FUNGSI MODAL (PLACEHOLDER) ---
const openNewTaskModal = () => {
  selectedTask.value = null;
  isFormModalVisible.value = true;
};
const openDetailModal = (task: any) => {
  selectedTask.value = task;
  isDetailModalVisible.value = true;
};
const openEditModal = (task: any) => {
  selectedTask.value = task;
  isFormModalVisible.value = true;
};
const confirmDelete = (task: any) => {
  selectedTask.value = task;
  isDeleteModalVisible.value = true;
};
const closeModals = () => {
  isDetailModalVisible.value = false;
  isFormModalVisible.value = false;
  isDeleteModalVisible.value = false;
  isAiModalVisible.value = false; // <-- Tambahkan
  selectedTask.value = null;
};
const handleSaveTask = (taskData: Partial<Task>) => {
  if (taskData.id) { // Mode Edit
    console.log('edit sukses')
    const index = allTasksFlat.value.findIndex(t => t.id === taskData.id);
    if (index !== -1) allTasksFlat.value[index] = { ...allTasksFlat.value[index], ...taskData };
    toast.success(`Tugas "${taskData.taskName}" berhasil diperbarui.`);
  } else { // Mode Tambah Baru
    console.log('tambah baru')
    const newId = Math.max(...allTasksFlat.value.map(t => t.id)) + 1;
    allTasksFlat.value.unshift({
      // ...
    } as any);
    console.log('tambah sukses')
    toast.success(`Tugas "${taskData.taskName}" berhasil ditambahkan.`);
  }
  closeModals();
};

const handleDeleteConfirmed = () => {
  if (!selectedTask.value) return;
  const taskName = selectedTask.value.taskName;
  
  // Buat array baru daripada memodifikasi yang lama
  const newTasks = allTasksFlat.value.filter(t => t.id !== selectedTask.value.id);
  allTasksFlat.value = newTasks;
  
  toast.success(`Tugas "${taskName}" telah berhasil dihapus.`);
  closeModals();
};

// --- FUNGSI HELPERS (TERMASUK YANG HILANG) ---
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

const calculateCountdown = (endDate: string) => {
  const diff = differenceInBusinessDays(new Date(endDate), new Date());
  if (diff < 0) return `Terlambat ${Math.abs(diff)} hari`;
  if (diff === 0) return 'Hari ini';
  return `${diff} hari kerja`;
};

const getCountdownClass = (endDate: string) => {
  const diff = differenceInBusinessDays(new Date(endDate), new Date());
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full';
  if (diff < 0) return `${baseClasses} bg-red-100 text-red-800`;
  if (diff <= 7) return `${baseClasses} bg-amber-100 text-amber-800`;
  return 'text-slate-500';
};

// PERBAIKAN DI SINI: Fungsi ini sekarang mengembalikan string class Tailwind lengkap
const getStatusClass = (status: string) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full';
  const statusMap: Record<string, string> = {
    'Done': `${baseClasses} bg-emerald-100 text-emerald-800`,
    'In Progress': `${baseClasses} bg-amber-100 text-amber-800`,
    'Not Yet': `${baseClasses} bg-slate-100 text-slate-800`,
  };
  return statusMap[status] || statusMap['Not Yet'];
};

// --- FUNGSI AI (YANG SEBELUMNYA HILANG) ---
const isTaskAtRisk = (endDate: string) => {
  return differenceInBusinessDays(new Date(endDate), new Date()) < 0;
};

const showAiInsight = (task: any) => {
  selectedTask.value = task;
  isAiModalVisible.value = true;
};
</script>