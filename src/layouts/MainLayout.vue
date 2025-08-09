<template>
  <div class="flex h-screen bg-slate-100 font-sans">
    <aside 
      class="flex flex-col text-slate-600 bg-white transition-all duration-300 ease-in-out border-r border-slate-200"
      :class="isSidebarExpanded ? 'w-64' : 'w-20'"
    >
      <div class="h-16 flex items-center justify-between px-4 border-b border-slate-200 flex-shrink-0">
        <span v-if="isSidebarExpanded" class="text-xl font-bold tracking-wider text-blue-600">Project App</span>
        <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-slate-100">
          <ArrowLeftIcon class="h-6 w-6 text-slate-500 transition-transform duration-300" :class="!isSidebarExpanded && 'rotate-180'" />
        </button>
      </div>

      <nav class="flex-grow p-4 space-y-1">
        <p v-if="isSidebarExpanded" class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
        
        <RouterLink v-slot="{ isActive }" to="/dashboard">
          <a :class="getLinkClasses(isActive)" title="Dashboard">
            <HomeIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">Dashboard</span>
          </a>
        </RouterLink>
        <RouterLink v-slot="{ isActive }" to="/tasks">
          <a :class="getLinkClasses(isActive)" title="Daftar Tugas">
            <ClipboardDocumentListIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">Daftar Tugas</span>
          </a>
        </RouterLink>
        <RouterLink v-slot="{ isActive }" to="/project-summary">
          <a :class="getLinkClasses(isActive)" title="Project Summary">
            <ChartPieIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">Project Summary</span>
          </a>
        </RouterLink>

        <p v-if="isSidebarExpanded" class="px-2 pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</p>
        
        <RouterLink v-slot="{ isActive }" to="/user-management">
          <a :class="getLinkClasses(isActive)" title="User Management">
            <UsersIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">User Management</span>
          </a>
        </RouterLink>
        <RouterLink v-slot="{ isActive }" to="/audit-trail">
          <a :class="getLinkClasses(isActive)" title="Audit Trail">
            <ShieldCheckIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">Audit Trail</span>
          </a>
        </RouterLink>
        <RouterLink v-slot="{ isActive }" to="/reports">
          <a :class="getLinkClasses(isActive)" title="Laporan">
            <DocumentChartBarIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">Laporan</span>
          </a>
        </RouterLink>
        <RouterLink v-slot="{ isActive }" to="/wellbeing">
          <a :class="getLinkClasses(isActive)" title="Wellbeing">
            <HeartIcon class="h-6 w-6 flex-shrink-0" />
            <span v-if="isSidebarExpanded" class="ml-3">Kesejahteraan Tim</span>
          </a>
        </RouterLink>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow-sm h-16 px-6 flex justify-between items-center border-b border-slate-200">
        <h1 class="text-xl font-bold text-slate-800">{{ $route.meta.title }}</h1>
        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center gap-2">
            <img class="h-9 w-9 rounded-full object-cover" src="https://placehold.co/100x100/E2E8F0/475569?text=A" alt="User avatar">
            <span class="hidden md:block text-slate-600">{{ currentUser.name }}</span>
          </button>
          <div v-if="isDropdownVisible" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Pengaturan Akun</a>
            <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Logout</a>
          </div>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-6 bg-slate-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { 
  HomeIcon, ClipboardDocumentListIcon, ChartPieIcon, UsersIcon, ShieldCheckIcon,
  ArrowLeftIcon, DocumentChartBarIcon, HeartIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const currentUser = ref({ name: 'Admin User' });
const isDropdownVisible = ref(false);
const isSidebarExpanded = ref(true);

const toggleDropdown = () => isDropdownVisible.value = !isDropdownVisible.value;
const toggleSidebar = () => isSidebarExpanded.value = !isSidebarExpanded.value;

const getLinkClasses = (isActive: boolean) => {
  const baseClasses = 'flex items-center p-2 rounded-md transition-colors duration-200 w-full';
  const expandedClasses = isSidebarExpanded.value ? '' : 'justify-center';
  
  if (isActive) {
    return `${baseClasses} ${expandedClasses} bg-blue-100 text-blue-600 font-semibold`;
  }
  return `${baseClasses} ${expandedClasses} hover:bg-slate-100`;
};

const logout = () => {
  localStorage.removeItem('user-authenticated');
  router.push({ name: 'Login' });
};
</script>