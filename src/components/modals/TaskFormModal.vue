<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <form @submit.prevent="submitForm" class="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50">
        <div class="p-4 border rounded-md bg-white">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label for="taskName" class="form-label">Nama Tugas</label>
              <input id="taskName" type="text" v-model="form.taskName" required class="form-input">
            </div>
            <div class="form-group">
              <label for="pic" class="form-label">PIC</label>
              <input id="pic" type="text" v-model="form.pic" required class="form-input">
            </div>
            <div class="form-group">
              <label for="startDate" class="form-label">Tanggal Mulai</label>
              <input id="startDate" type="date" v-model="form.startDate" required class="form-input">
            </div>
            <div class="form-group">
              <label for="endDate" class="form-label">Tanggal Selesai</label>
              <input id="endDate" type="date" v-model="form.endDate" required class="form-input">
            </div>
          </div>
        </div>
        </form>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Task, SubTask, Link } from '../../data/mockData';
import { PlusCircleIcon, LinkIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{ task: Task | null }>();
const emit = defineEmits(['close', 'save']);

const form = ref<Partial<Task>>({ taskName: '', pic: '', subTasks: [], links: [] });
const isEditing = computed(() => !!props.task);

onMounted(() => {
  if (isEditing.value) {
    form.value = JSON.parse(JSON.stringify(props.task));
  }
});

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