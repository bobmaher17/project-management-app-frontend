<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <header class="p-5 border-b flex justify-between items-center flex-shrink-0">
        <h3 class="font-semibold text-lg text-slate-800">{{ isEditing ? 'Ubah Tugas' : 'Tambah Tugas Baru' }}</h3>
        <button @click="$emit('close')" class="p-1 rounded-full hover:bg-slate-100">
          <XMarkIcon class="h-5 w-5 text-slate-400"/>
        </button>
      </header>
      
      <form @submit.prevent="submitForm" class="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
        <div class="p-4 border rounded-md bg-white">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label for="project" class="form-label">Proyek</label>
              <select id="project" v-model="selectedProject" @change="updateBankAndPhase" class="form-input">
                <option disabled value="">Pilih Proyek</option>
                <option v-for="proj in projects" :key="proj.projectName" :value="proj">{{ proj.projectName }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="bank" class="form-label">Bank</label>
              <input id="bank" type="text" :value="form.bank" readonly class="form-input bg-slate-100">
            </div>
            <div class="form-group">
              <label for="phase" class="form-label">Phase</label>
              <select id="phase" v-model="form.phase" required class="form-input">
                <option>DEFINITION</option>
                <option>DEVELOPMENT</option>
                <option>TESTING</option>
                <option>DEPLOYMENT</option>
              </select>
            </div>
             <div class="form-group">
              <label for="pic" class="form-label">PIC</label>
              <input id="pic" type="text" v-model="form.pic" required class="form-input">
            </div>
             <div class="form-group">
              <label for="taskName" class="form-label">Nama Tugas</label>
              <input id="taskName" type="text" v-model="form.taskName" required class="form-input">
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-slate-700 mb-2">Rincian Pekerjaan (Task Definition)</h4>
          </div>
        
        <div>
          <h4 class="font-semibold text-slate-700 mb-2">Dokumen & Referensi (Opsional)</h4>
          </div>
      </form>
      
      <footer class="px-6 py-4 bg-slate-100 flex justify-between items-center flex-shrink-0 rounded-b-lg border-t">
        <div class="text-lg font-bold text-slate-800">
          Total Progres: <span class="text-blue-600">{{ totalProgress.toFixed(2) }}%</span>
        </div>
        <div class="flex gap-4">
          <button type="button" @click="$emit('close')" class="px-5 py-2.5 bg-white text-slate-800 font-semibold rounded-lg border border-slate-300 hover:bg-slate-100">Batal</button>
          <button type="button" @click="submitForm" class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { Task, SubTask, Link, Project } from '../../data/mockData';
import { PlusCircleIcon, LinkIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{ 
  task: Task | null,
  projects: { projectName: string, bank: string }[] 
}>();
const emit = defineEmits(['close', 'save']);

const form = ref<Partial<Task & { projectName: string, bank: string }>>({ taskName: '', pic: '', subTasks: [], links: [] });
const selectedProject = ref<{ projectName: string, bank: string } | null>(null);
const isEditing = computed(() => !!props.task);

onMounted(() => {
  if (isEditing.value && props.task) {
    form.value = JSON.parse(JSON.stringify(props.task));
    const projectMatch = props.projects.find(p => p.projectName === (props.task as any).projectName);
    if(projectMatch) selectedProject.value = projectMatch;
  }
});

const updateBankAndPhase = () => {
  if (selectedProject.value) {
    form.value.projectName = selectedProject.value.projectName;
    form.value.bank = selectedProject.value.bank;
  }
};

const totalProgress = computed(() => {
  if (!form.value.subTasks || form.value.subTasks.length === 0) return 0;
  const sum = form.value.subTasks.reduce((acc, sub) => acc + (Number(sub.progress) || 0), 0);
  return sum / form.value.subTasks.length;
});

const addSubTask = () => {
  if (!form.value.subTasks) form.value.subTasks = [];
  form.value.subTasks.push({ id: Date.now(), description: '', progress: 0 });
};
const removeSubTask = (index: number) => {
  form.value.subTasks?.splice(index, 1);
};
const addLink = () => {
  if (!form.value.links) form.value.links = [];
  form.value.links.push({ id: Date.now(), label: '', url: '' });
};
const removeLink = (index: number) => {
  form.value.links?.splice(index, 1);
};
const submitForm = () => {
  emit('save', form.value);
};
</script>