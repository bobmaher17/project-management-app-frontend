<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div class="border-b pb-4">
        <h2 class="text-xl font-semibold text-slate-800">Generate Laporan Proyek</h2>
        <p class="mt-1 text-sm text-slate-600">Pilih kriteria di bawah ini untuk membuat laporan proyek dalam format PDF yang siap diunduh.</p>
      </div>
      
      <!-- Opsi Kriteria -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 items-start">
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bank</label>
          <Multiselect v-model="filters.banks" mode="tags" :options="bankOptions" :searchable="true" placeholder="Pilih Bank"/>
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Proyek</label>
          <Multiselect v-model="filters.projects" mode="tags" :options="projectOptions" :searchable="true" placeholder="Pilih Proyek"/>
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Multiselect v-model="filters.statuses" mode="tags" :options="statusOptions" :searchable="true" placeholder="Pilih Status"/>
        </div>
        <div class="flex items-end gap-2 pt-[29px]">
          <button @click="generatePdfReport" :disabled="isLoading" class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">Generating...</span>
            <span v-else>Download Laporan (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import Multiselect from '@vueform/multiselect';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { masterData } from '../data/mockData';
import type { Project, ProjectStatus } from '../data/mockData';

const filters = reactive({ banks: [] as string[], projects: [] as string[], statuses: [] as ProjectStatus[] });
const isLoading = ref(false);

// --- OPSI FILTER DINAMIS ---
const bankOptions = computed(() => [...new Set(masterData.map(p => p.bank))]);
const projectOptions = computed(() => [...new Set(masterData.map(p => p.projectName))]);
const statusOptions: ProjectStatus[] = ['Not Yet', 'In Progress', 'Live', 'Closed'];

// --- FUNGSI UTAMA: GENERATE LAPORAN PDF ---
const generatePdfReport = () => {
  isLoading.value = true;

  // 1. Filter data sesuai kriteria
  const filteredProjects = masterData.filter(p => 
    (filters.banks.length === 0 || filters.banks.includes(p.bank)) &&
    (filters.projects.length === 0 || filters.projects.includes(p.projectName)) &&
    (filters.statuses.length === 0 || filters.statuses.includes(p.projectStatus))
  );

  // 2. Buat instance PDF
  const doc = new jsPDF();

  // 3. Tambahkan Header
  doc.setFontSize(18);
  doc.setTextColor('#1E293B');
  doc.text("Laporan Status Proyek", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor('#64748B');
  doc.text(`Tanggal Dibuat: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

  // 4. Buat Ringkasan Eksekutif
  const totalProjects = filteredProjects.length;
  const inProgressCount = filteredProjects.filter(p => p.projectStatus === 'In Progress').length;
  const liveCount = filteredProjects.filter(p => p.projectStatus === 'Live').length;
  const summaryText = `Berdasarkan kriteria yang dipilih, ditemukan total ${totalProjects} proyek. Dari jumlah tersebut, ${inProgressCount} proyek sedang dalam tahap pengembangan aktif dan ${liveCount} proyek sudah berstatus "Live". Perhatian lebih lanjut mungkin diperlukan pada proyek yang masih dalam progres untuk memastikan penyelesaian tepat waktu.`;
  
  doc.setFontSize(12);
  doc.setTextColor('#334155');
  doc.text("Ringkasan Eksekutif", 14, 45);
  doc.setFontSize(10);
  const splitText = doc.splitTextToSize(summaryText, 180);
  doc.text(splitText, 14, 52);

  // 5. Siapkan data untuk tabel
  const tableHead = [['Proyek', 'Bank', 'Status', 'Total Tugas', 'PIC Terlibat']];
  const tableBody = filteredProjects.map(p => [
    p.projectName,
    p.bank,
    p.projectStatus,
    p.tasks.length,
    [...new Set(p.tasks.map(t => t.pic))].join(', ')
  ]);

  // 6. Tambahkan tabel ke PDF
  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 75,
    theme: 'grid',
    headStyles: { fillColor: '#F1F5F9', textColor: '#1E293B' },
    styles: { font: 'helvetica', fontSize: 9 },
  });

  // 7. Simpan file PDF
  doc.save(`Laporan-Proyek-${new Date().toISOString().slice(0,10)}.pdf`);
  
  isLoading.value = false;
};
</script>