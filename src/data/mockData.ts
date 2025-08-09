export type ProjectStatus = 'Live' | 'Closed' | 'In Progress' | 'Not Yet';
export type TaskStatus = 'Done' | 'In Progress' | 'Not Yet';
export type TaskPhase = 'DEFINITION' | 'DEVELOPMENT' | 'TESTING' | 'DEPLOYMENT';

export interface SubTask {
  id: number;
  description: string;
  progress: number; // Progress 0-100
}

export interface Link {
  id: number;
  label: string;
  url: string;
}

export interface Task {
  id: number;
  taskName: string;
  pic: string;
  taskStatus: TaskStatus;
  startDate: string; 
  endDate: string;
  phase: TaskPhase;
  subTasks: SubTask[];
  links: Link[];
}

export interface Project {
  id: number;
  bank: string;
  projectName: string;
  projectStatus: ProjectStatus;
  tasks: Task[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Project Manager' | 'Technical Leader' | 'Member';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export const usersData: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@proyeksi.com', avatar: 'https://placehold.co/100x100/E2E8F0/475569?text=A', role: 'Admin', status: 'Active', lastLogin: '2025-08-08 10:30' },
  { id: 2, name: 'Achsani', email: 'achsani@proyeksi.com', avatar: 'https://placehold.co/100x100/f56565/ffffff?text=A', role: 'Technical Leader', status: 'Active', lastLogin: '2025-08-08 09:15' },
  { id: 3, name: 'Valen', email: 'valen@proyeksi.com', avatar: 'https://placehold.co/100x100/48bb78/ffffff?text=V', role: 'Member', status: 'Active', lastLogin: '2025-08-07 16:45' },
  { id: 4, name: 'Rizal', email: 'rizal@proyeksi.com', avatar: 'https://placehold.co/100x100/4299e1/ffffff?text=R', role: 'Member', status: 'Inactive', lastLogin: '2025-08-05 11:00' },
  { id: 5, name: 'Swiarna', email: 'swiarna@proyeksi.com', avatar: 'https://placehold.co/100x100/ed8936/ffffff?text=S', role: 'Project Manager', status: 'Active', lastLogin: '2025-08-08 11:20' },
  { id: 6, name: 'Budi', email: 'budi@proyeksi.com', avatar: 'https://placehold.co/100x100/9f7aea/ffffff?text=B', role: 'Member', status: 'Active', lastLogin: '2025-08-08 08:55' },
];

export interface AuditLog {
  id: number;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN';
  targetType: string;
  targetName: string;
  details: string;
}

export const auditLogData: AuditLog[] = [
  { id: 1, timestamp: '2025-08-09 02:30:15', user: { name: 'Achsani', avatar: '...' }, action: 'UPDATE', targetType: 'Tugas', targetName: 'Desain UI/UX', details: 'Status diubah dari In Progress menjadi Done' },
  { id: 2, timestamp: '2025-08-09 01:15:45', user: { name: 'Admin User', avatar: '...' }, action: 'CREATE', targetType: 'Proyek', targetName: 'Rebranding Website', details: 'Proyek baru ditambahkan' },
  { id: 3, timestamp: '2025-08-08 23:50:02', user: { name: 'Swiarna', avatar: '...' }, action: 'UPDATE', targetType: 'Tugas', targetName: 'Dokumentasi FSD', details: 'Tanggal selesai diubah ke 2025-08-04' },
  { id: 4, timestamp: '2025-08-08 22:10:11', user: { name: 'Rizal', avatar: '...' }, action: 'LOGIN', targetType: 'Sistem', targetName: '-', details: 'Pengguna berhasil login' },
  { id: 5, timestamp: '2025-08-08 18:05:33', user: { name: 'Admin User', avatar: '...' }, action: 'DELETE', targetType: 'Tugas', targetName: 'Task Awal', details: 'Tugas "Task Awal" telah dihapus' },
  // ... tambahkan lebih banyak data log
];

export interface Permission {
  id: string;
  name: string;
  module: string;
}

export interface Role {
  id: number;
  name: 'Admin' | 'Project Manager' | 'Technical Leader' | 'Member';
  permissions: string[]; // Array of permission IDs
}

export const permissionsData: Permission[] = [
  { id: 'dashboard:read', name: 'Lihat Dashboard', module: 'Dashboard' },
  { id: 'tasks:create', name: 'Buat Tugas', module: 'Tugas' },
  { id: 'tasks:update', name: 'Ubah Semua Tugas', module: 'Tugas' },
  { id: 'tasks:delete', name: 'Hapus Tugas', module: 'Tugas' },
  { id: 'users:manage', name: 'Kelola Pengguna & Peran', module: 'Admin' },
  { id: 'projects:create', name: 'Buat Proyek Baru', module: 'Proyek' },
];

export const rolesData: Role[] = [
  { id: 1, name: 'Admin', permissions: ['dashboard:read', 'tasks:create', 'tasks:update', 'tasks:delete', 'users:manage', 'projects:create'] },
  { id: 2, name: 'Project Manager', permissions: ['dashboard:read', 'tasks:create', 'tasks:update', 'projects:create'] },
  { id: 3, name: 'Technical Leader', permissions: ['dashboard:read', 'tasks:update'] },
  { id: 4, name: 'Member', permissions: ['dashboard:read'] },
];

export const masterData: Project[] = [
  // 1
  {
    id: 1,
    bank: 'Bank A',
    projectName: 'Rebranding Website',
    projectStatus: 'In Progress',
    tasks: [
      { id: 101, taskName: 'Desain UI/UX', pic: 'Achsani', taskStatus: 'Done', startDate: '2025-08-01', endDate: '2025-08-10', phase: 'DEFINITION', subTasks: [{id: 1, description: 'Finalisasi mockup', progress: 100}], links: [] },
      { id: 102, taskName: 'Frontend Dev', pic: 'Valen', taskStatus: 'In Progress', startDate: '2025-08-11', endDate: '2025-08-25', phase: 'DEVELOPMENT', subTasks: [{id: 1, description: 'Implementasi Halaman Utama', progress: 50}], links: [] },
      { id: 103, taskName: 'Backend Dev', pic: 'Rizal', taskStatus: 'In Progress', startDate: '2025-08-11', endDate: '2025-08-28', phase: 'DEVELOPMENT', subTasks: [{id: 1, description: 'Setup endpoint login', progress: 75}], links: [] },
    ],
  },
  // 2
  {
    id: 2,
    bank: 'Bank A',
    projectName: 'Mobile Banking App',
    projectStatus: 'Live',
    tasks: [
      { id: 201, taskName: 'API Gateway', pic: 'Rizal', taskStatus: 'Done', startDate: '2025-07-15', endDate: '2025-08-01', phase: 'DEVELOPMENT', subTasks: [], links: [] },
      { id: 202, taskName: 'iOS App Dev', pic: 'Swiarna', taskStatus: 'Done', startDate: '2025-08-02', endDate: '2025-08-15', phase: 'DEVELOPMENT', subTasks: [], links: [] },
      { id: 203, taskName: 'Android App Dev', pic: 'Valen', taskStatus: 'Done', startDate: '2025-08-02', endDate: '2025-08-18', phase: 'DEVELOPMENT', subTasks: [], links: [] },
    ],
  },
  // 3
  {
    id: 3,
    bank: 'Bank B',
    projectName: 'Implementasi QRIS',
    projectStatus: 'In Progress',
    tasks: [
      { id: 301, taskName: 'Dokumentasi FSD', pic: 'Swiarna', taskStatus: 'Done', startDate: '2025-07-20', endDate: '2025-08-04', phase: 'DEFINITION', subTasks: [], links: [] },
      { id: 302, taskName: 'Core Banking Logic', pic: 'Achsani', taskStatus: 'In Progress', startDate: '2025-08-05', endDate: '2025-09-05', phase: 'DEVELOPMENT', subTasks: [{id: 1, description: 'Integrasi Tag 26', progress: 40}], links: [] },
      { id: 303, taskName: 'Testing End-to-End', pic: 'Budi', taskStatus: 'Not Yet', startDate: '2025-09-06', endDate: '2025-09-20', phase: 'TESTING', subTasks: [], links: [] },
      { id: 304, taskName: 'UAT dengan Klien', pic: 'Rizal', taskStatus: 'Not Yet', startDate: '2025-09-21', endDate: '2025-09-30', phase: 'TESTING', subTasks: [], links: [] },
    ],
  },
  // 4
  {
    id: 4,
    bank: 'Bank C',
    projectName: 'Data Migration',
    projectStatus: 'Closed',
    tasks: [
      { id: 401, taskName: 'Analisis Data Source', pic: 'Achsani', taskStatus: 'Done', startDate: '2025-06-01', endDate: '2025-06-15', phase: 'DEFINITION', subTasks: [], links: [] },
      { id: 402, taskName: 'Proses ETL', pic: 'Rizal', taskStatus: 'Done', startDate: '2025-06-16', endDate: '2025-07-10', phase: 'DEVELOPMENT', subTasks: [], links: [] },
      { id: 403, taskName: 'Validasi Data Final', pic: 'Budi', taskStatus: 'Done', startDate: '2025-07-11', endDate: '2025-07-20', phase: 'TESTING', subTasks: [], links: [] },
    ],
  },
  // 5
  {
    id: 5,
    bank: 'Bank B',
    projectName: 'Credit Scoring Engine',
    projectStatus: 'Not Yet',
    tasks: [
      { id: 501, taskName: 'Riset Model AI', pic: 'Swiarna', taskStatus: 'Not Yet', startDate: '2025-09-01', endDate: '2025-09-30', phase: 'DEFINITION', subTasks: [], links: [] },
      { id: 502, taskName: 'Proof of Concept', pic: 'Achsani', taskStatus: 'Not Yet', startDate: '2025-10-01', endDate: '2025-10-30', phase: 'DEVELOPMENT', subTasks: [], links: [] },
    ],
  },
  // 6
  {
    id: 6,
    bank: 'Bank A',
    projectName: 'Pembaruan Aplikasi Mobile',
    projectStatus: 'In Progress',
    tasks: [
      { id: 601, taskName: 'Requirement Gathering', pic: 'Rina', taskStatus: 'Done', startDate: '2025-08-10', endDate: '2025-08-20', phase: 'DEFINITION', subTasks: [], links: [] },
      { id: 602, taskName: 'Pengembangan Fitur Transfer', pic: 'Valen', taskStatus: 'In Progress', startDate: '2025-08-21', endDate: '2025-09-10', phase: 'DEVELOPMENT', subTasks: [{id: 1, description: 'Endpoint & UI', progress: 25}], links: [] },
    ],
  },
  // 7
  {
    id: 7,
    bank: 'Bank D',
    projectName: 'Sistem CRM Baru',
    projectStatus: 'In Progress',
    tasks: [
      { id: 701, taskName: 'Analisis Kebutuhan Bisnis', pic: 'Achsani', taskStatus: 'Done', startDate: '2025-07-01', endDate: '2025-07-20', phase: 'DEFINITION', subTasks: [], links: [] },
      { id: 702, taskName: 'Instalasi & Konfigurasi', pic: 'Dian', taskStatus: 'In Progress', startDate: '2025-07-21', endDate: '2025-08-15', phase: 'DEVELOPMENT', subTasks: [], links: [] },
      { id: 703, taskName: 'SIT', pic: 'Budi', taskStatus: 'Not Yet', startDate: '2025-08-16', endDate: '2025-08-30', phase: 'TESTING', subTasks: [], links: [] },
    ],
  },
  // 8
  {
    id: 8,
    bank: 'Bank B',
    projectName: 'Integrasi Payment Gateway',
    projectStatus: 'Live',
    tasks: [
      { id: 801, taskName: 'Integrasi API', pic: 'Rizal', taskStatus: 'Done', startDate: '2025-05-10', endDate: '2025-06-10', phase: 'DEVELOPMENT', subTasks: [], links: [] },
      { id: 802, taskName: 'Security Testing', pic: 'Dian', taskStatus: 'Done', startDate: '2025-06-11', endDate: '2025-06-20', phase: 'TESTING', subTasks: [], links: [] },
    ],
  },
  // 9
  {
    id: 9,
    bank: 'Bank C',
    projectName: 'Layanan E-Statement',
    projectStatus: 'In Progress',
    tasks: [
      { id: 901, taskName: 'Pengembangan Modul PDF', pic: 'Swiarna', taskStatus: 'In Progress', startDate: '2025-08-01', endDate: '2025-08-25', phase: 'DEVELOPMENT', subTasks: [{id: 1, description: 'Report generation', progress: 80}], links: [] },
    ],
  },
  // 10
  {
    id: 10,
    bank: 'Bank A',
    projectName: 'Upgrade Infrastruktur Server',
    projectStatus: 'Live',
    tasks: [
      { id: 1001, taskName: 'Migrasi Server Database', pic: 'Dian', taskStatus: 'Done', startDate: '2025-07-05', endDate: '2025-07-15', phase: 'DEPLOYMENT', subTasks: [], links: [] },
    ],
  },
  // 11
  {
    id: 11,
    bank: 'Bank D',
    projectName: 'Aplikasi Poin Reward',
    projectStatus: 'Not Yet',
    tasks: [
      { id: 1101, taskName: 'Perancangan Konsep', pic: 'Rina', taskStatus: 'Not Yet', startDate: '2025-09-10', endDate: '2025-09-25', phase: 'DEFINITION', subTasks: [], links: [] },
    ],
  },
  // 12
  {
    id: 12,
    bank: 'Bank B',
    projectName: 'Sistem Anti-Fraud',
    projectStatus: 'In Progress',
    tasks: [
      { id: 1201, taskName: 'Pengembangan Algoritma', pic: 'Achsani', taskStatus: 'In Progress', startDate: '2025-07-15', endDate: '2025-08-30', phase: 'DEVELOPMENT', subTasks: [{id: 1, description: 'Machine Learning Model', progress: 50}], links: [] },
      { id: 1202, taskName: 'Integrasi ke Transaksi', pic: 'Rizal', taskStatus: 'In Progress', startDate: '2025-08-15', endDate: '2025-09-15', phase: 'DEVELOPMENT', subTasks: [], links: [] },
    ],
  },
  // 13
  {
    id: 13,
    bank: 'Bank C',
    projectName: 'Pembaruan Kebijakan Privasi',
    projectStatus: 'Closed',
    tasks: [
      { id: 1301, taskName: 'Go Live Perubahan', pic: 'Rina', taskStatus: 'Done', startDate: '2025-07-30', endDate: '2025-08-01', phase: 'DEPLOYMENT', subTasks: [], links: [] },
    ],
  },
  // 14
  {
    id: 14,
    bank: 'Bank A',
    projectName: 'Chatbot Customer Service',
    projectStatus: 'Live',
    tasks: [
      { id: 1401, taskName: 'Pengembangan NLP Engine', pic: 'Swiarna', taskStatus: 'Done', startDate: '2025-04-01', endDate: '2025-05-30', phase: 'DEVELOPMENT', subTasks: [], links: [] },
      { id: 1402, taskName: 'Pelatihan Tim CS', pic: 'Rina', taskStatus: 'Done', startDate: '2025-06-01', endDate: '2025-06-10', phase: 'DEPLOYMENT', subTasks: [], links: [] },
    ],
  },
  // 15
  {
    id: 15,
    bank: 'Bank B',
    projectName: 'Otomatisasi Laporan Internal',
    projectStatus: 'In Progress',
    tasks: [
      { id: 1501, taskName: 'SIT Laporan', pic: 'Budi', taskStatus: 'In Progress', startDate: '2025-08-05', endDate: '2025-08-20', phase: 'TESTING', subTasks: [{id: 1, description: 'Testing skenario A, B, C', progress: 30}], links: [] },
    ],
  },
];