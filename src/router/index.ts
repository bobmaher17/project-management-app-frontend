import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import TaskList from '../views/TaskList.vue'
import ProjectSummary from '../views/ProjectSummary.vue'
import UserManagement from '../views/UserManagement.vue'
import AuditTrail from '../views/AuditTrail.vue'
import Reports from '../views/Reports.vue'; // <-- Import halaman baru
import Wellbeing from '../views/Wellbeing.vue'; // <-- Import halaman baru

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: MainLayout,
      // Halaman di bawah ini memerlukan login dan menggunakan MainLayout
      children: [
        { path: '', redirect: '/dashboard' }, // Redirect root to dashboard
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'tasks',
          name: 'TaskList',
          component: TaskList,
          meta: { title: 'Daftar Tugas' }
        },
        {
          path: 'project-summary',
          name: 'ProjectSummary',
          component: ProjectSummary,
          meta: { title: 'Project Summary' }
        },
        {
          path: 'user-management',
          name: 'UserManagement',
          component: UserManagement,
          meta: { title: 'User Management' }
        },
        {
          path: 'audit-trail',
          name: 'AuditTrail',
          component: AuditTrail,
          meta: { title: 'Audit Trail' }
        },
        {
          path: 'reports', // <-- Tambahkan rute baru
          name: 'Reports',
          component: Reports,
          meta: { title: 'Laporan' }
        },
        {
          path: 'wellbeing', // <-- Tambahkan rute baru
          name: 'Wellbeing',
          component: Wellbeing,
          meta: { title: 'Kesejahteraan Tim' }
        }
      ]
    }
  ]
})

// Simpel "auth guard"
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router