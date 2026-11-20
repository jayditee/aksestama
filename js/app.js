/**
 * AKSESTAMA — Mobile Prototype Controller
 * Terstruktur rapi untuk pengembangan di Visual Studio Code
 */

// 1. State Aplikasi
const appState = {
  selectedRole: 'youth',
  currentAccount: null,
  theme: 'dark',
  highContrast: false,
  voiceActive: false,
  budgetLocked: false
};

const onboardingSlides = [
  {
    src: 'assets/onboarding-slide-2-polished.png',
    alt: 'Kota yang inklusif dibangun dari langkah kecil yang digerakkan bersama.'
  },
  {
    src: 'assets/onboarding-slide-3-peta-clean.png',
    alt: 'Peta akses dengan rute ramah disabilitas di sekitar Anda.'
  }
];
let onboardingSlideIndex = 0;
const AUDIT_REPORTS_KEY = 'aksestama-audit-reports';
const GAMIFICATION_STORAGE_PREFIX = 'aksestama-gamification-v1-';
const POLICY_STATUS_OVERRIDES_KEY = 'aksestama-policy-followup-demo';
const LOCAL_ACCOUNTS_KEY = 'aksestama-local-accounts-v1';
const USER_PROFILE_STORAGE_PREFIX = 'aksestama-user-profile-v1-';
const USER_SETTINGS_STORAGE_PREFIX = 'aksestama-user-settings-v1-';
const USER_NOTIFICATIONS_STORAGE_PREFIX = 'aksestama-user-notifications-v1-';
const LOCAL_PASSWORD_ITERATIONS = 120000;
const POINTS_PER_VALID_REPORT = 50;
const gamificationLevels = [
  { name: 'Relawan Pemula', threshold: 0 },
  { name: 'Penjelajah Akses', threshold: 100 },
  { name: 'Patroli Inklusif', threshold: 300 },
  { name: 'Pelopor Akses', threshold: 600 }
];
const gamificationBadges = [
  { id: 'first-valid-report', name: 'Mata Akses', description: '1 laporan valid', threshold: 1, icon: 'eye' },
  { id: 'five-valid-reports', name: 'Penjaga Jalur', description: '5 laporan valid', threshold: 5, icon: 'footprints' },
  { id: 'ten-valid-reports', name: 'Pelopor Inklusi', description: '10 laporan valid', threshold: 10, icon: 'award' }
];
const weeklyMissions = [
  { id: 'weekly-one-valid', title: 'Satu Titik Lebih Inklusif', description: 'Dapatkan 1 laporan valid minggu ini.', target: 1, reward: 20 },
  { id: 'weekly-three-valid', title: 'Patroli Konsisten', description: 'Dapatkan 3 laporan valid minggu ini.', target: 3, reward: 50 }
];
const demoLeaderboard = [
  { name: 'Dina Prameswari', role: 'Patroli Pemuda', points: 820 },
  { name: 'Raka Mahendra', role: 'Relawan Akses', points: 640 },
  { name: 'Bima Adinata', role: 'Patroli Pemuda', points: 410 }
];
const policyDemoReports = [
  {
    id: 'DEMO-8841',
    facilityName: 'Ramp Halte Ketintang Barat',
    facilityType: 'Ramp',
    location: 'Jl. Ketintang, Surabaya',
    area: 'Ketintang',
    description: 'Kemiringan ramp terindikasi terlalu curam dan perlu pemeriksaan teknis serta perbaikan.',
    severity: 'Berat',
    followUpStatus: 'Menunggu',
    reporterName: 'Relawan Akses (contoh)',
    createdAt: '2026-11-15T08:30:00.000Z',
    mapPosition: { x: 78, y: 58 }
  },
  {
    id: 'DEMO-8845',
    facilityName: 'Guiding block Simpang Wonokromo',
    facilityType: 'Guiding block',
    location: 'Simpang Wonokromo, Surabaya',
    area: 'Wonokromo',
    description: 'Jalur pemandu terhalang tiang utilitas pada titik penyeberangan.',
    severity: 'Sedang',
    followUpStatus: 'Diproses',
    reporterName: 'Relawan Akses (contoh)',
    createdAt: '2026-11-14T06:45:00.000Z',
    mapPosition: { x: 265, y: 70 }
  },
  {
    id: 'DEMO-8849',
    facilityName: 'Trotoar Koridor Wonokromo',
    facilityType: 'Trotoar',
    location: 'Jl. Raya Wonokromo, Surabaya',
    area: 'Wonokromo',
    description: 'Lebar efektif jalur pejalan kaki menyempit sehingga perlu penanganan hambatan.',
    severity: 'Berat',
    followUpStatus: 'Menunggu',
    reporterName: 'Warga Surabaya (contoh)',
    createdAt: '2026-11-13T10:20:00.000Z',
    mapPosition: { x: 224, y: 132 }
  },
  {
    id: 'DEMO-8790',
    facilityName: 'Ramp JPO Darmo',
    facilityType: 'Ramp',
    location: 'Jl. Raya Darmo, Surabaya',
    area: 'Darmo',
    description: 'Perbaikan ramp dilaporkan selesai; perlu evaluasi aksesibilitas lanjutan.',
    severity: 'Ringan',
    followUpStatus: 'Selesai',
    reporterName: 'Auditor Independen (contoh)',
    createdAt: '2026-11-12T04:10:00.000Z',
    mapPosition: { x: 302, y: 151 }
  },
  {
    id: 'DEMO-8852',
    facilityName: 'Akses toilet Puskesmas Ketintang',
    facilityType: 'Toilet umum',
    location: 'Puskesmas Ketintang, Surabaya',
    area: 'Ketintang',
    description: 'Ambang pintu dan ruang putar kursi roda perlu pemeriksaan di lokasi.',
    severity: 'Sedang',
    followUpStatus: 'Diproses',
    reporterName: 'Kader Akses (contoh)',
    createdAt: '2026-11-11T09:00:00.000Z',
    mapPosition: { x: 142, y: 143 }
  }
];
let auditPhotoFile = null;
let auditPhotoUrl = null;
let auditCoordinates = null;
let auditAnalysis = null;

// 2. Konfigurasi Profil Peran Multi-Aktor
const roleProfiles = {
  youth: {
    name: 'Zidni Raditya',
    affiliation: 'Universitas Negeri Surabaya',
    badge: 'Patroli Pemuda',
    avatar: 'YP',
    defaultTab: 'home'
  },
  disability: {
    name: 'Nadia Kusuma (Pertuni)',
    badge: 'Auditor Inklusi+',
    avatar: 'IN',
    defaultTab: 'inklusi'
  },
  bappeda: {
    name: 'Ir. Hendra Wijaya, M.T.',
    badge: 'Bappeda & PUPR',
    avatar: 'BP',
    defaultTab: 'gov'
  }
};

// 3. Data Skenario AI Computer Vision (Permen PUPR No. 14/PRT/M/2017)
const scanScenarios = [
  {
    tag: 'PELANGGARAN ELEVASI RAMP',
    measurement: 'Kemiringan Ramp: 14.2°',
    standard: 'Batas Maksimal PUPR: ≤ 7.0° (Defisit +102%)',
    confidence: 'Skor simulasi: 98,4%',
    ticket: '#EMUS-2026-8841',
    ads: 92
  },
  {
    tag: 'GUIDING BLOCK TERPUTUS',
    measurement: 'Obstruksi Tiang Utilitas: 100%',
    standard: 'Wajib Jalur Pemandu Tunanetra Kontinu (Pasal 18)',
    confidence: 'Skor simulasi: 96,9%',
    ticket: '#EMUS-2026-8845',
    ads: 88
  },
  {
    tag: 'LEBAR EFEKTIF TROTOAR',
    measurement: 'Lebar Tersisa: 65 cm',
    standard: 'Standar Minimum Kursi Roda: ≥ 150 cm',
    confidence: 'Skor simulasi: 97,5%',
    ticket: '#EMUS-2026-8849',
    ads: 84
  }
];

// 4. Data Titik Hotspot GIS Radar
const hotspots = [
  {
    title: 'Halte Ketintang Barat (Ramp 14.2°)',
    sub: 'Melanggar batas maks 7° Permen PUPR • Tiket #EMUS-8841'
  },
  {
    title: 'Simpang Wonokromo (Guiding Block)',
    sub: 'Ubin pemandu menabrak tiang reklame • Tiket #EMUS-8845'
  },
  {
    title: 'Koridor Kampus UNESA (Tersertifikasi)',
    sub: 'Ramp 5.4° & trotoar 180 cm lolos verifikasi disabilitas'
  }
];

const accessFacilities = [
  {
    id: 'halte-ketintang',
    name: 'Halte Ketintang Barat',
    shortName: 'Halte Ketintang',
    address: 'Koridor Ketintang · titik data contoh',
    statusKey: 'attention',
    statusLabel: 'Perlu perhatian',
    sidewalk: 'Lebar efektif ±120 cm; ada hambatan di jalur.',
    tactile: 'Jalur terputus di dekat akses halte.',
    ramp: '14,2° · terlalu curam untuk akses mandiri.',
    summary: 'Prioritaskan perbaikan ramp dan singkirkan hambatan pada trotoar.',
    position: { x: 93, y: 87 },
    route: {
      mode: 'Rute alternatif · demo',
      distance: '520 m',
      duration: '±10 menit',
      summary: 'Rute contoh menghindari ramp halte yang curam dan mengarah ke sisi trotoar yang lebih lapang.',
      steps: ['Mulai dari titik awal demo di sisi selatan.', 'Ikuti jalur utama ke arah barat.', 'Hindari ramp halte; gunakan titik akses alternatif yang aman.'],
      path: 'M 38 230 L 67 216 L 83 180 L 88 135 L 93 87'
    }
  },
  {
    id: 'simpang-wonokromo',
    name: 'Simpang Wonokromo',
    shortName: 'Simpang Wonokromo',
    address: 'Simpang Wonokromo · titik data contoh',
    statusKey: 'attention',
    statusLabel: 'Perlu perhatian',
    sidewalk: 'Lebar efektif menyempit karena tiang utilitas.',
    tactile: 'Guiding block terhalang dan tidak kontinu.',
    ramp: 'Ramp penyeberangan belum terdata.',
    summary: 'Jalur pemandu dan ruang bebas trotoar perlu diperiksa sebelum dilalui.',
    position: { x: 267, y: 101 },
    route: {
      mode: 'Rute penghindaran · demo',
      distance: '760 m',
      duration: '±15 menit',
      summary: 'Rute contoh menghindari sisi simpang dengan guiding block terhalang; kondisi akses penyeberangan perlu konfirmasi.',
      steps: ['Mulai dari titik awal demo.', 'Ikuti jalur utama ke arah timur laut.', 'Berhenti sebelum penyeberangan dan cari bantuan/penyeberangan aksesibel yang terkonfirmasi.'],
      path: 'M 38 230 L 83 214 L 131 184 L 193 145 L 267 101'
    }
  },
  {
    id: 'unesa-ketintang',
    name: 'Koridor Kampus UNESA',
    shortName: 'Kampus UNESA',
    address: 'Koridor Kampus UNESA · titik data contoh',
    statusKey: 'accessible',
    statusLabel: 'Ramah disabilitas',
    sidewalk: 'Lebar sekitar 180 cm; jalur utama relatif lapang.',
    tactile: 'Jalur pemandu utuh dan kontinu pada koridor contoh.',
    ramp: '5,4° · memenuhi rekomendasi pada data demo.',
    summary: 'Titik dengan kondisi akses paling baik dalam data contoh area ini.',
    position: { x: 205, y: 180 },
    route: {
      mode: 'Rute ramah akses · demo',
      distance: '420 m',
      duration: '±8 menit',
      summary: 'Rekomendasi menuju koridor dengan trotoar lebar, guiding block kontinu, dan ramp landai.',
      steps: ['Mulai dari titik awal demo di sisi selatan.', 'Ikuti trotoar utama ke arah timur laut.', 'Masuk melalui ramp landai menuju koridor kampus.'],
      path: 'M 38 230 L 83 215 L 125 202 L 165 188 L 205 180'
    }
  },
  {
    id: 'jpo-darmo',
    name: 'JPO Darmo',
    shortName: 'JPO Darmo',
    address: 'Koridor Darmo · titik data contoh',
    statusKey: 'accessible',
    statusLabel: 'Ramah disabilitas',
    sidewalk: 'Lebar sekitar 160 cm pada jalur pendekatan.',
    tactile: 'Jalur pemandu kontinu pada akses pendekatan.',
    ramp: '5,2° · ramp landai pada data demo.',
    summary: 'Akses pendekatan dan ramp tercatat baik pada data contoh; tetap perhatikan kondisi aktual.',
    position: { x: 291, y: 190 },
    route: {
      mode: 'Rute ramah akses · demo',
      distance: '680 m',
      duration: '±13 menit',
      summary: 'Rute contoh mengikuti trotoar dengan akses ramp; cek kondisi permukaan sebelum berangkat.',
      steps: ['Mulai dari titik awal demo.', 'Ikuti jalur utama ke arah timur.', 'Gunakan ramp pendekatan JPO dan periksa permukaan saat tiba.'],
      path: 'M 38 230 L 91 222 L 151 218 L 219 207 L 291 190'
    }
  }
];

let selectedMapFilter = 'all';
let selectedFacilityId = 'unesa-ketintang';
const governmentFollowUpStatuses = ['Menunggu', 'Diproses', 'Selesai'];
let selectedGovernmentFilter = 'all';
let selectedGovernmentReportId = 'DEMO-8841';

// =========================================================
// FUNGSI NAVIGASI & AUTENTIKASI
// =========================================================

function enterOnboardingScreen() {
  onboardingSlideIndex = 0;
  updateOnboardingSlide();
  document.getElementById('splash-screen').classList.add('hidden');
  document.getElementById('onboarding-screen').classList.remove('hidden');
  document.querySelector('.device-home-indicator').classList.add('device-home-indicator-hidden');
}

function updateOnboardingSlide() {
  const slide = onboardingSlides[onboardingSlideIndex];
  document.getElementById('onboarding-image').src = slide.src;
  document.getElementById('onboarding-image').alt = slide.alt;
  document.getElementById('onboarding-next').setAttribute(
    'aria-label',
    onboardingSlideIndex === onboardingSlides.length - 1
      ? 'Selanjutnya, ke halaman login'
      : 'Selanjutnya, ke halaman Peta Akses'
  );
}

function nextOnboardingSlide() {
  if (onboardingSlideIndex === onboardingSlides.length - 1) {
    enterLoginScreen();
    return;
  }

  onboardingSlideIndex += 1;
  updateOnboardingSlide();
}

function enterLoginScreen() {
  document.getElementById('onboarding-screen').classList.add('hidden');
  document.querySelector('.device-home-indicator').classList.remove('device-home-indicator-hidden');
  document.getElementById('view-login').classList.remove('hidden');
}

function selectRole(roleKey) {
  if (!Object.prototype.hasOwnProperty.call(roleProfiles, roleKey)) return;
  appState.selectedRole = roleKey;
  appState.currentAccount = null;
  document.querySelectorAll('.role-card').forEach(card => {
    card.classList.remove('active', 'border-emerald-400/50', 'bg-emerald-500/10');
    card.classList.add('border-white/10');
  });

  const activeCard = document.getElementById(`role-${roleKey}`);
  if (activeCard) {
    activeCard.classList.add('active', 'border-emerald-400/50', 'bg-emerald-500/10');
    activeCard.classList.remove('border-white/10');
  }
}

function getCurrentUserId() {
  return appState.currentAccount
    ? `account:${appState.currentAccount.email.toLowerCase()}`
    : appState.selectedRole;
}

function getActiveProfile() {
  const baseProfile = roleProfiles[appState.selectedRole] || roleProfiles.youth;
  if (appState.currentAccount) {
    return {
      ...baseProfile,
      name: appState.currentAccount.name,
      email: appState.currentAccount.email
    };
  }

  try {
    const serialized = localStorage.getItem(`${USER_PROFILE_STORAGE_PREFIX}${appState.selectedRole}`);
    if (!serialized) return baseProfile;
    const override = JSON.parse(serialized);
    if (!override || typeof override !== 'object' || Array.isArray(override)) {
      throw new TypeError('Format profil lokal tidak valid.');
    }
    return { ...baseProfile, ...override };
  } catch (error) {
    showToast('Profil lokal tidak dapat dibaca; perubahan profil tidak dimuat.');
    return baseProfile;
  }
}

function readLocalAccounts() {
  try {
    const serialized = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!serialized) return [];
    const accounts = JSON.parse(serialized);
    if (!Array.isArray(accounts) || accounts.some(account =>
      !account ||
      typeof account.email !== 'string' ||
      typeof account.name !== 'string' ||
      typeof account.roleId !== 'string' ||
      typeof account.passwordSalt !== 'string' ||
      typeof account.passwordHash !== 'string' ||
      !Object.prototype.hasOwnProperty.call(roleProfiles, account.roleId)
    )) {
      throw new TypeError('Format akun lokal tidak valid.');
    }
    return accounts;
  } catch (error) {
    showToast('Data akun lokal tidak dapat dibaca; data lama tidak ditimpa.');
    return null;
  }
}

function saveLocalAccounts(accounts) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    return true;
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; akun belum tersimpan.'
      : 'Akun gagal disimpan di perangkat ini.');
    return false;
  }
}

function encodeBytesToBase64(bytes) {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function decodeBase64ToBytes(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function deriveLocalPasswordHash(password, salt) {
  if (!window.crypto || !window.crypto.subtle || typeof TextEncoder === 'undefined') {
    throw new Error('Registrasi lokal membutuhkan browser modern melalui HTTPS atau localhost.');
  }
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations: LOCAL_PASSWORD_ITERATIONS,
    hash: 'SHA-256'
  }, key, 256);
  return encodeBytesToBase64(new Uint8Array(bits));
}

function showRegistrationScreen() {
  document.getElementById('login-screen-content').classList.add('hidden');
  document.getElementById('register-screen-content').classList.remove('hidden');
  document.getElementById('register-name').focus();
}

function showLoginScreen() {
  document.getElementById('register-screen-content').classList.add('hidden');
  document.getElementById('login-screen-content').classList.remove('hidden');
  document.getElementById('login-email').focus();
}

async function handleRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const roleId = document.getElementById('register-role').value;
  const password = document.getElementById('register-password').value;
  const confirmation = document.getElementById('register-password-confirm').value;
  if (password !== confirmation) {
    showToast('Kata sandi dan konfirmasi tidak sama.');
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(roleProfiles, roleId)) {
    showToast('Pilih peran yang tersedia.');
    return;
  }

  const accounts = readLocalAccounts();
  if (!accounts) return;
  if (accounts.some(account => account.email.toLowerCase() === email)) {
    showToast('Email sudah terdaftar di browser ini.');
    return;
  }

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    if (!window.crypto || !window.crypto.getRandomValues) {
      throw new Error('Browser ini tidak mendukung pembuatan akun lokal yang aman.');
    }
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const account = {
      name,
      email,
      roleId,
      passwordSalt: encodeBytesToBase64(salt),
      passwordHash: await deriveLocalPasswordHash(password, salt),
      createdAt: new Date().toISOString()
    };
    if (!saveLocalAccounts([...accounts, account])) return;

    appState.selectedRole = roleId;
    appState.currentAccount = account;
    form.reset();
    loginToApp();
  } catch (error) {
    showToast(error.message || 'Akun lokal gagal dibuat.');
  } finally {
    submitButton.disabled = false;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const accounts = readLocalAccounts();
  if (!accounts) return;
  const account = accounts.find(item => item.email.toLowerCase() === email);
  if (!account) {
    document.getElementById('login-password').value = '';
    appState.selectedRole = 'youth';
    appState.currentAccount = null;
    loginToApp();
    return;
  }

  try {
    const passwordHash = await deriveLocalPasswordHash(password, decodeBase64ToBytes(account.passwordSalt));
    if (passwordHash !== account.passwordHash) {
      showToast('Email atau kata sandi salah.');
      return;
    }
    document.getElementById('login-password').value = '';
    appState.selectedRole = account.roleId;
    appState.currentAccount = account;
    loginToApp();
  } catch (error) {
    showToast(error.message || 'Login lokal gagal diproses.');
  }
}

function applyUserSettings(settings) {
  if (settings.theme === 'light' || settings.theme === 'dark') setTheme(settings.theme);
  appState.highContrast = settings.highContrast === true;
  document.body.classList.toggle('high-contrast', appState.highContrast);
  appState.voiceActive = settings.voiceAssist === true;
}

function loginToApp() {
  const profile = getActiveProfile();
  const settings = readUserSettings();
  if (settings) applyUserSettings(settings);
  document.getElementById('app-shell').classList.add('app-active');
  updateHeaderProfile();

  document.getElementById('view-login').classList.add('hidden');
  document.getElementById('view-main').classList.remove('hidden');

  const primaryTabs = ['home', 'map', 'scan', 'gamification', 'profile'];
  switchTab(primaryTabs.includes(profile.defaultTab) ? profile.defaultTab : 'profile');
  updateAccountNotificationBadge();
  showToast(`Selamat datang, ${profile.name}`);
}

function loginAsBappedaDemo() {
  appState.selectedRole = 'bappeda';
  appState.currentAccount = null;
  loginToApp();
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('login-password');
  const toggleButton = document.getElementById('toggle-login-password');
  const isHidden = passwordInput.type === 'password';

  passwordInput.type = isHidden ? 'text' : 'password';
  toggleButton.setAttribute('aria-label', isHidden ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
  toggleButton.innerHTML = `<i data-lucide="${isHidden ? 'eye' : 'eye-off'}" aria-hidden="true"></i>`;
  lucide.createIcons();
}

function loginWithBiometric() {
  showToast('Memverifikasi identitas biometrik demo...');
  setTimeout(() => {
    loginToApp();
  }, 600);
}

function logoutToLogin() {
  closeAccountCenter();
  appState.currentAccount = null;
  document.getElementById('app-shell').classList.remove('app-active');
  document.getElementById('view-main').classList.add('hidden');
  document.getElementById('view-login').classList.remove('hidden');
  showLoginScreen();
  showToast('Sesi ditutup. Silakan login kembali.');
}

function switchTab(tabName) {
  const availableTabs = ['home', 'map', 'scan', 'gamification', 'inklusi', 'gov', 'profile'];
  if (!availableTabs.includes(tabName)) return;

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  const targetPanel = document.getElementById(`tab-${tabName}`);
  if (targetPanel) targetPanel.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active', 'text-emerald-300', 'bg-emerald-500/15');
    btn.classList.add('text-slate-400');
    btn.removeAttribute('aria-current');
  });
  const primaryNavTabs = ['home', 'map', 'scan', 'gamification', 'profile'];
  const activeNavName = primaryNavTabs.includes(tabName) ? tabName : 'profile';
  const activeNav = document.getElementById(`nav-${activeNavName}`);
  if (activeNav) {
    activeNav.classList.add('active', 'text-emerald-300', 'bg-emerald-500/15');
    activeNav.classList.remove('text-slate-400');
    activeNav.setAttribute('aria-current', 'page');
  }

  if (tabName === 'gamification' || tabName === 'gov' || tabName === 'profile' || tabName === 'inklusi') {
    document.getElementById('main-tab-content').scrollTop = 0;
  }
  if (tabName === 'gamification' || tabName === 'gov') renderGamification();
  if (tabName === 'gov') renderGovernmentDashboard();
  if (tabName === 'profile') renderProfileTab();
}

function renderProfileTab() {
  const profile = getActiveProfile();
  document.getElementById('profile-tab-avatar').textContent = profile.avatar;
  document.getElementById('profile-tab-name').textContent = profile.name;
  document.getElementById('profile-tab-role').textContent = profile.badge;
  document.getElementById('profile-tab-email').textContent =
    profile.email || profile.affiliation || 'Akun demo lokal';

  const reports = readAuditReports();
  if (!reports) {
    document.getElementById('profile-tab-report-count').textContent = '–';
    document.getElementById('profile-tab-valid-count').textContent = 'Data laporan tidak tersedia';
    document.getElementById('profile-tab-points').textContent = '–';
    return;
  }
  synchronizeGamificationAwards(reports);
  const userReports = reports.filter(report => report && getReportOwnerId(report) === getCurrentUserId());
  const validCount = userReports.filter(report => report.verificationStatus === 'valid').length;
  const gamification = readGamificationState(getCurrentUserId());
  document.getElementById('profile-tab-report-count').textContent = String(userReports.length);
  document.getElementById('profile-tab-valid-count').textContent = `${validCount} laporan valid`;
  document.getElementById('profile-tab-points').textContent =
    gamification ? gamification.points.toLocaleString('id-ID') : '–';
}

function updateHeaderProfile() {
  const profile = getActiveProfile();
  document.getElementById('header-user-name').textContent = profile.name;
  const affiliation = document.getElementById('header-user-affiliation');
  affiliation.textContent = profile.affiliation || '';
  affiliation.classList.toggle('hidden', !profile.affiliation);
  document.getElementById('header-role-badge').textContent = profile.badge;
  document.getElementById('header-avatar').textContent = profile.avatar;
  document.getElementById('btn-account-center').setAttribute(
    'aria-label',
    `Buka pusat akun dan notifikasi untuk ${profile.name}`
  );
}

function readUserSettings() {
  const defaults = {
    theme: appState.theme,
    highContrast: appState.highContrast,
    voiceAssist: appState.voiceActive,
    notifyReports: true,
    notifyMissions: true
  };
  try {
    const serialized = localStorage.getItem(`${USER_SETTINGS_STORAGE_PREFIX}${getCurrentUserId()}`);
    if (!serialized) return defaults;
    const settings = JSON.parse(serialized);
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      throw new TypeError('Format pengaturan akun tidak valid.');
    }
    return {
      ...defaults,
      ...settings,
      theme: settings.theme === 'light' ? 'light' : 'dark',
      highContrast: settings.highContrast === true,
      voiceAssist: settings.voiceAssist === true,
      notifyReports: settings.notifyReports !== false,
      notifyMissions: settings.notifyMissions !== false
    };
  } catch (error) {
    showToast('Pengaturan akun tidak dapat dibaca; pengaturan lama tidak ditimpa.');
    return null;
  }
}

function persistUserSettingsPatch(patch) {
  const currentSettings = readUserSettings();
  if (!currentSettings) return false;
  try {
    localStorage.setItem(
      `${USER_SETTINGS_STORAGE_PREFIX}${getCurrentUserId()}`,
      JSON.stringify({ ...currentSettings, ...patch })
    );
    return true;
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; preferensi belum tersimpan.'
      : 'Preferensi gagal disimpan di perangkat ini.');
    return false;
  }
}

function readUserNotificationIds() {
  try {
    const serialized = localStorage.getItem(`${USER_NOTIFICATIONS_STORAGE_PREFIX}${getCurrentUserId()}`);
    if (!serialized) return [];
    const readIds = JSON.parse(serialized);
    if (!Array.isArray(readIds) || readIds.some(id => typeof id !== 'string')) {
      throw new TypeError('Format notifikasi lokal tidak valid.');
    }
    return readIds;
  } catch (error) {
    showToast('Riwayat notifikasi tidak dapat dibaca; data lama tidak ditimpa.');
    return null;
  }
}

function getAccountNotificationItems() {
  const userId = getCurrentUserId();
  const items = [{
    id: `welcome:${userId}`,
    category: 'system',
    title: 'Selamat datang di AKSESTAMA',
    detail: 'Profil dan aktivitas demo disimpan di browser perangkat ini.',
    createdAt: new Date().toISOString()
  }];
  const reports = readAuditReports();
  if (reports) {
    reports
      .filter(report => report && getReportOwnerId(report) === userId)
      .slice(0, 8)
      .forEach(report => {
        items.push({
          id: `report:${report.id}:${report.followUpStatus || report.status || 'pending'}`,
          category: 'reports',
          title: `Pembaruan laporan: ${report.facilityName || 'Fasilitas publik'}`,
          detail: report.followUpStatus
            ? `Tindak lanjut: ${report.followUpStatus}`
            : report.status || 'Menunggu verifikasi',
          createdAt: report.updatedAt || report.createdAt
        });
      });
  }

  const gamification = readGamificationState(userId);
  if (gamification) {
    gamification.history
      .filter(item => item && item.type === 'mission')
      .slice(0, 4)
      .forEach(item => {
        items.push({
          id: `mission:${item.id}`,
          category: 'missions',
          title: item.title || 'Misi Aksi Muda selesai',
          detail: `Poin demo bertambah ${Number(item.points) || 0}.`,
          createdAt: item.createdAt
        });
      });
  }
  return items;
}

function getVisibleAccountNotifications() {
  const settings = readUserSettings();
  if (!settings) return null;
  return getAccountNotificationItems().filter(item => {
    if (item.category === 'reports') return settings.notifyReports;
    if (item.category === 'missions') return settings.notifyMissions;
    return true;
  });
}

function updateAccountNotificationBadge() {
  const badge = document.getElementById('account-unread-badge');
  if (!badge) return;
  const readIds = readUserNotificationIds();
  const items = getVisibleAccountNotifications();
  if (!readIds || !items) {
    badge.classList.add('hidden');
    return;
  }
  const unreadCount = items.filter(item => !readIds.includes(item.id)).length;
  badge.classList.toggle('hidden', unreadCount === 0);
  document.getElementById('btn-account-center').setAttribute(
    'title',
    unreadCount ? `Pusat akun · ${unreadCount} notifikasi belum dibaca` : 'Pusat akun'
  );
}

function switchAccountSection(section) {
  const availableSections = ['profile', 'notifications', 'reports', 'settings', 'help'];
  if (!availableSections.includes(section)) return;
  document.querySelectorAll('[data-account-section-tab]').forEach(button => {
    const active = button.dataset.accountSectionTab === section;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.account-section').forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== `account-section-${section}`);
  });

  if (section === 'profile') renderAccountProfile();
  if (section === 'notifications') renderAccountNotifications();
  if (section === 'reports') renderAccountReportHistory();
  if (section === 'settings') renderAccountSettings();
}

function openAccountCenter(section) {
  const center = document.getElementById('account-center');
  center.classList.remove('hidden');
  center.setAttribute('aria-hidden', 'false');
  switchAccountSection(section || 'profile');
  document.getElementById('account-center-close').focus();
}

function closeAccountCenter() {
  const center = document.getElementById('account-center');
  if (!center || center.classList.contains('hidden')) return;
  center.classList.add('hidden');
  center.setAttribute('aria-hidden', 'true');
  const trigger = document.getElementById('btn-account-center');
  if (trigger && !document.getElementById('view-main').classList.contains('hidden')) trigger.focus();
}

function renderAccountProfile() {
  const profile = getActiveProfile();
  document.getElementById('account-profile-name').value = profile.name || '';
  const emailInput = document.getElementById('account-profile-email');
  emailInput.value = profile.email || '';
  emailInput.readOnly = Boolean(appState.currentAccount);
  emailInput.placeholder = appState.currentAccount ? '' : 'Email opsional';
  document.getElementById('account-profile-role').textContent = profile.badge;
  document.getElementById('account-profile-note').textContent = appState.currentAccount
    ? 'Akun dan profil ini hanya tersimpan di browser saat ini.'
    : 'Profil demo peran ini disimpan lokal di browser saat ini.';
}

function saveAccountProfile(event) {
  event.preventDefault();
  const name = document.getElementById('account-profile-name').value.trim();
  const email = document.getElementById('account-profile-email').value.trim().toLowerCase();
  if (!name) {
    showToast('Nama profil tidak boleh kosong.');
    return;
  }

  if (appState.currentAccount) {
    const accounts = readLocalAccounts();
    if (!accounts) return;
    const account = accounts.find(item => item.email === appState.currentAccount.email);
    if (!account) {
      showToast('Akun lokal tidak ditemukan; profil tidak diubah.');
      return;
    }
    account.name = name;
    if (!saveLocalAccounts(accounts)) return;
    appState.currentAccount = account;
  } else {
    try {
      localStorage.setItem(`${USER_PROFILE_STORAGE_PREFIX}${appState.selectedRole}`, JSON.stringify({
        name,
        email
      }));
    } catch (error) {
      showToast(error.name === 'QuotaExceededError'
        ? 'Penyimpanan perangkat penuh; profil belum disimpan.'
        : 'Profil gagal disimpan di perangkat ini.');
      return;
    }
  }

  updateHeaderProfile();
  renderAccountProfile();
  renderProfileTab();
  renderGamification();
  showToast('Profil diperbarui di perangkat ini.');
}

function renderAccountNotifications() {
  const list = document.getElementById('account-notifications-list');
  const readIds = readUserNotificationIds();
  const items = getVisibleAccountNotifications();
  list.replaceChildren();
  if (!readIds || !items) {
    list.textContent = 'Notifikasi tidak dapat dimuat dari penyimpanan perangkat.';
    return;
  }
  if (items.length === 0) {
    list.textContent = 'Notifikasi dinonaktifkan atau belum tersedia.';
    return;
  }

  items.forEach(item => {
    const unread = !readIds.includes(item.id);
    const card = document.createElement('article');
    card.className = `account-list-card${unread ? ' is-unread' : ''}`;
    const title = document.createElement('h3');
    title.textContent = item.title;
    const detail = document.createElement('p');
    detail.textContent = item.detail;
    const date = document.createElement('span');
    date.textContent = `${unread ? 'Belum dibaca · ' : ''}${formatGamificationDate(item.createdAt)}`;
    card.append(title, detail, date);
    list.appendChild(card);
  });

  const markReadButton = document.getElementById('account-mark-notifications-read');
  const hasUnread = items.some(item => !readIds.includes(item.id));
  markReadButton.classList.toggle('hidden', !hasUnread);
}

function markAccountNotificationsRead() {
  const items = getVisibleAccountNotifications();
  const readIds = readUserNotificationIds();
  if (!items || !readIds) return;
  const updatedIds = [...new Set([...readIds, ...items.map(item => item.id)])];
  try {
    localStorage.setItem(`${USER_NOTIFICATIONS_STORAGE_PREFIX}${getCurrentUserId()}`, JSON.stringify(updatedIds));
  } catch (error) {
    showToast('Status notifikasi gagal disimpan di perangkat ini.');
    return;
  }
  renderAccountNotifications();
  updateAccountNotificationBadge();
  showToast('Semua notifikasi ditandai sudah dibaca.');
}

function renderAccountReportHistory() {
  const list = document.getElementById('account-report-history-list');
  const reports = readAuditReports();
  list.replaceChildren();
  if (!reports) {
    list.textContent = 'Riwayat laporan gagal dimuat dari penyimpanan perangkat.';
    return;
  }
  const userReports = reports.filter(report => report && getReportOwnerId(report) === getCurrentUserId());
  if (userReports.length === 0) {
    list.textContent = 'Belum ada laporan dari akun ini. Laporan Audit Pintar yang tersimpan akan muncul di sini.';
    return;
  }

  userReports.forEach(report => {
    const card = document.createElement('article');
    card.className = 'account-list-card';
    const heading = document.createElement('div');
    heading.className = 'account-report-heading';
    const title = document.createElement('h3');
    title.textContent = report.facilityName || 'Fasilitas tanpa nama';
    const status = document.createElement('span');
    status.className = 'account-report-status';
    status.textContent = report.followUpStatus || report.status || 'Menunggu verifikasi';
    heading.append(title, status);
    const details = document.createElement('p');
    details.textContent = `${report.facilityType || 'Jenis fasilitas'} · ${report.location || 'Lokasi belum diisi'}`;
    const date = document.createElement('span');
    date.textContent = `${report.analysis && report.analysis.severity ? `Indikasi ${report.analysis.severity.toLowerCase()} · ` : ''}${formatGamificationDate(report.createdAt)}`;
    const openAudit = document.createElement('button');
    openAudit.type = 'button';
    openAudit.className = 'account-inline-action';
    openAudit.textContent = 'Buka Audit Pintar';
    openAudit.addEventListener('click', () => {
      closeAccountCenter();
      switchTab('scan');
    });
    const actions = document.createElement('div');
    actions.className = 'account-report-actions';
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'account-inline-action account-delete-action';
    deleteButton.textContent = 'Hapus';
    deleteButton.setAttribute('aria-label', `Hapus laporan ${report.facilityName || 'fasilitas tanpa nama'}`);
    deleteButton.addEventListener('click', () => deleteAuditReport(report.id));
    actions.append(openAudit, deleteButton);
    card.append(heading, details, date, actions);
    list.appendChild(card);
  });
}

function renderAccountSettings() {
  const settings = readUserSettings();
  if (!settings) return;
  document.getElementById('account-setting-theme').value = settings.theme;
  document.getElementById('account-setting-contrast').checked = settings.highContrast;
  document.getElementById('account-setting-voice').checked = settings.voiceAssist;
  document.getElementById('account-setting-reports').checked = settings.notifyReports;
  document.getElementById('account-setting-missions').checked = settings.notifyMissions;
}

function saveAccountSettings(event) {
  event.preventDefault();
  const settings = {
    theme: document.getElementById('account-setting-theme').value,
    highContrast: document.getElementById('account-setting-contrast').checked,
    voiceAssist: document.getElementById('account-setting-voice').checked,
    notifyReports: document.getElementById('account-setting-reports').checked,
    notifyMissions: document.getElementById('account-setting-missions').checked
  };
  if (!['dark', 'light'].includes(settings.theme)) {
    showToast('Pilih tema yang tersedia.');
    return;
  }
  try {
    localStorage.setItem(`${USER_SETTINGS_STORAGE_PREFIX}${getCurrentUserId()}`, JSON.stringify(settings));
    localStorage.setItem('aksestama-theme', settings.theme);
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; pengaturan belum disimpan.'
      : 'Pengaturan gagal disimpan di perangkat ini.');
    return;
  }

  applyUserSettings(settings);
  renderAccountNotifications();
  updateAccountNotificationBadge();
  showToast('Pengaturan akun tersimpan di perangkat ini.');
}

// =========================================================
// FUNGSI INTERAKTIF FITUR SPASIAL, AI, INKLUSI+ & APBD
// =========================================================

function selectHotspot(index) {
  const item = hotspots[index];
  if (!item) return;
  document.getElementById('hs-title').textContent = item.title;
  document.getElementById('hs-sub').textContent = item.sub;
  showToast(`Memuat analisis spasial: ${item.title}`);
}

function filterAccessibleMap(filter) {
  const allowedFilters = ['all', 'accessible', 'attention'];
  if (!allowedFilters.includes(filter)) return;
  selectedMapFilter = filter;

  document.querySelectorAll('.map-filter-btn[data-map-filter]').forEach(button => {
    const isActive = button.dataset.mapFilter === filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  renderAccessibleMap();
}

function setAccessibleMapMode(mode) {
  if (!['standard', 'terrain'].includes(mode)) return;
  document.getElementById('access-map').classList.toggle('terrain-mode', mode === 'terrain');

  document.querySelectorAll('.map-filter-btn[data-map-mode]').forEach(button => {
    const isActive = button.dataset.mapMode === mode;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function selectMapFacility(facilityId) {
  if (!accessFacilities.some(facility => facility.id === facilityId)) return;
  selectedFacilityId = facilityId;
  renderAccessibleMap();
}

function renderAccessibleMap() {
  const facilities = accessFacilities.filter(facility =>
    selectedMapFilter === 'all' || facility.statusKey === selectedMapFilter
  );
  if (!facilities.some(facility => facility.id === selectedFacilityId)) {
    selectedFacilityId = facilities.length ? facilities[0].id : null;
  }

  const markers = document.getElementById('map-markers');
  const facilityList = document.getElementById('map-facility-list');
  document.getElementById('map-point-count').textContent = `${facilities.length} titik ditampilkan`;
  markers.replaceChildren();
  facilityList.replaceChildren();

  facilities.forEach((facility, index) => {
    const isSelected = facility.id === selectedFacilityId;
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = `map-marker ${facility.statusKey}${isSelected ? ' is-selected' : ''}`;
    marker.style.left = `${(facility.position.x / 360) * 100}%`;
    marker.style.top = `${(facility.position.y / 260) * 100}%`;
    marker.setAttribute('aria-label', `${facility.name}, ${facility.statusLabel}`);
    marker.setAttribute('aria-pressed', String(isSelected));
    marker.addEventListener('click', () => selectMapFacility(facility.id));

    const number = document.createElement('span');
    number.className = 'map-marker-number';
    number.textContent = String(index + 1);
    const label = document.createElement('span');
    label.className = 'map-marker-label';
    label.textContent = facility.shortName;
    marker.append(number, label);
    markers.appendChild(marker);

    const listButton = document.createElement('button');
    listButton.type = 'button';
    listButton.className = `map-facility-item${isSelected ? ' is-selected' : ''}`;
    listButton.setAttribute('aria-pressed', String(isSelected));
    listButton.addEventListener('click', () => selectMapFacility(facility.id));

    const indicator = document.createElement('span');
    indicator.className = `map-list-indicator ${facility.statusKey}`;
    indicator.setAttribute('aria-hidden', 'true');
    const listDetails = document.createElement('span');
    listDetails.className = 'map-list-details';
    const name = document.createElement('strong');
    name.textContent = facility.name;
    const status = document.createElement('span');
    status.textContent = `${facility.statusLabel} · ${facility.shortName}`;
    listDetails.append(name, status);
    const arrow = document.createElement('span');
    arrow.className = 'map-list-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';
    listButton.append(indicator, listDetails, arrow);
    facilityList.appendChild(listButton);
  });

  const selectedFacility = accessFacilities.find(facility => facility.id === selectedFacilityId);
  if (!selectedFacility) return;

  document.getElementById('map-facility-name').textContent = selectedFacility.name;
  document.getElementById('map-facility-address').textContent = selectedFacility.address;
  const statusBadge = document.getElementById('map-facility-status');
  statusBadge.className = `map-status-badge ${selectedFacility.statusKey}`;
  statusBadge.textContent = selectedFacility.statusLabel;
  document.getElementById('map-sidewalk-condition').textContent = selectedFacility.sidewalk;
  document.getElementById('map-tactile-condition').textContent = selectedFacility.tactile;
  document.getElementById('map-ramp-condition').textContent = selectedFacility.ramp;
  document.getElementById('map-access-summary').textContent = selectedFacility.summary;

  document.getElementById('map-route-mode').textContent = selectedFacility.route.mode;
  document.getElementById('map-route-distance').textContent = selectedFacility.route.distance;
  document.getElementById('map-route-duration').textContent = selectedFacility.route.duration;
  document.getElementById('map-route-summary').textContent = selectedFacility.route.summary;
  const routeSteps = document.getElementById('map-route-steps');
  routeSteps.replaceChildren();
  selectedFacility.route.steps.forEach(step => {
    const item = document.createElement('li');
    item.textContent = step;
    routeSteps.appendChild(item);
  });
  const routePath = document.getElementById('map-route-path');
  routePath.setAttribute('d', selectedFacility.route.path);
  routePath.classList.add('is-visible');
}

function getGovernmentReports() {
  const overrides = readGovernmentStatusOverrides();
  const demoReports = policyDemoReports.map(report => ({
    ...report,
    followUpStatus: overrides && governmentFollowUpStatuses.includes(overrides[report.id])
      ? overrides[report.id]
      : report.followUpStatus,
    sourceLabel: 'Data contoh'
  }));
  const localReports = readAuditReports();
  const communityReports = (localReports || [])
    .filter(report => report && typeof report === 'object')
    .map(report => ({
      ...report,
      facilityName: report.facilityName || 'Fasilitas tanpa nama',
      facilityType: report.facilityType || 'Jenis fasilitas tidak diketahui',
      location: report.location || 'Lokasi belum diisi',
      severity: report.analysis && report.analysis.severity ? report.analysis.severity : report.severity || 'Belum dinilai',
      followUpStatus: governmentFollowUpStatuses.includes(report.followUpStatus) ? report.followUpStatus : 'Menunggu',
      reporterName: report.submitterName || 'Warga (perangkat ini)',
      sourceLabel: 'Laporan perangkat',
      mapPosition: report.mapPosition || null
    }));

  return [...communityReports, ...demoReports].sort(
    (first, second) => Date.parse(second.createdAt || '') - Date.parse(first.createdAt || '')
  );
}

function readGovernmentStatusOverrides() {
  try {
    const serialized = localStorage.getItem(POLICY_STATUS_OVERRIDES_KEY);
    if (!serialized) return {};
    const overrides = JSON.parse(serialized);
    if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
      throw new TypeError('Format status tindak lanjut tidak valid.');
    }
    return overrides;
  } catch (error) {
    showToast('Status tindak lanjut demo tidak dapat dibaca.');
    return null;
  }
}

function getGovernmentPriority(report) {
  const severity = String(report.severity || '').toLowerCase();
  if (severity === 'berat') return { label: 'Kritis', key: 'critical' };
  if (severity === 'sedang') return { label: 'Tinggi', key: 'high' };
  if (severity === 'ringan') return { label: 'Sedang', key: 'medium' };
  return { label: 'Perlu asesmen', key: 'low' };
}

function getGovernmentStatusKey(status) {
  if (status === 'Diproses') return 'in-progress';
  if (status === 'Selesai') return 'completed';
  return 'waiting';
}

function filterGovernmentReports(filter) {
  if (!['all', ...governmentFollowUpStatuses].includes(filter)) return;
  selectedGovernmentFilter = filter;
  document.querySelectorAll('.gov-filter-btn').forEach(button => {
    const isActive = button.dataset.govFilter === filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  renderGovernmentDashboard();
}

function selectGovernmentReport(reportId) {
  selectedGovernmentReportId = reportId;
  renderGovernmentDashboard();
}

function renderGovernmentDashboard() {
  const reports = getGovernmentReports();
  const statusCounts = {
    Menunggu: reports.filter(report => report.followUpStatus === 'Menunggu').length,
    Diproses: reports.filter(report => report.followUpStatus === 'Diproses').length,
    Selesai: reports.filter(report => report.followUpStatus === 'Selesai').length
  };
  const distinctFacilities = new Set(
    reports.map(report => String(report.facilityName).trim().toLowerCase()).filter(Boolean)
  );
  const criticalCount = reports.filter(report => getGovernmentPriority(report).label === 'Kritis').length;
  const highPriorityCount = reports.filter(report => ['Kritis', 'Tinggi'].includes(getGovernmentPriority(report).label)).length;

  document.getElementById('gov-total-reports').textContent = String(reports.length);
  document.getElementById('gov-damaged-facilities').textContent = String(distinctFacilities.size);
  document.getElementById('gov-waiting-count').textContent = String(statusCounts.Menunggu);
  document.getElementById('gov-processing-count').textContent = String(statusCounts.Diproses);
  document.getElementById('gov-completed-count').textContent = String(statusCounts.Selesai);
  document.getElementById('gov-critical-summary').textContent = `Prioritas tinggi: ${highPriorityCount}`;

  const filteredReports = reports.filter(report =>
    selectedGovernmentFilter === 'all' || report.followUpStatus === selectedGovernmentFilter
  );
  if (!filteredReports.some(report => report.id === selectedGovernmentReportId)) {
    selectedGovernmentReportId = filteredReports.length ? filteredReports[0].id : null;
  }
  document.getElementById('gov-filter-count').textContent = `${filteredReports.length} laporan`;

  const list = document.getElementById('gov-report-list');
  list.replaceChildren();
  if (filteredReports.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gamification-empty-state';
    empty.textContent = 'Tidak ada laporan pada status ini.';
    list.appendChild(empty);
  }

  filteredReports.forEach(report => {
    const priority = getGovernmentPriority(report);
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `gov-report-row${report.id === selectedGovernmentReportId ? ' selected' : ''}`;
    row.setAttribute('aria-pressed', String(report.id === selectedGovernmentReportId));
    row.addEventListener('click', () => selectGovernmentReport(report.id));

    const dot = document.createElement('span');
    dot.className = `gov-report-priority-dot ${priority.key}`;
    dot.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('span');
    copy.className = 'gov-report-row-copy';
    const title = document.createElement('strong');
    title.textContent = report.facilityName;
    const meta = document.createElement('span');
    meta.textContent = `${report.location} · ${priority.label} · ${report.followUpStatus}`;
    copy.append(title, meta);
    const arrow = document.createElement('span');
    arrow.className = 'gov-report-row-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';
    row.append(dot, copy, arrow);
    list.appendChild(row);
  });

  const mapMarkers = document.getElementById('gov-map-markers');
  mapMarkers.replaceChildren();
  const mappedReports = filteredReports.filter(report => report.mapPosition);
  mappedReports.forEach((report, index) => {
    const priority = getGovernmentPriority(report);
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = `gov-map-marker ${priority.key}${report.id === selectedGovernmentReportId ? ' selected' : ''}`;
    marker.style.left = `${(report.mapPosition.x / 360) * 100}%`;
    marker.style.top = `${(report.mapPosition.y / 190) * 100}%`;
    marker.textContent = String(index + 1);
    marker.setAttribute('aria-label', `${report.facilityName}, prioritas ${priority.label}, status ${report.followUpStatus}`);
    marker.addEventListener('click', () => selectGovernmentReport(report.id));
    mapMarkers.appendChild(marker);
  });
  const unmappedCount = filteredReports.length - mappedReports.length;
  document.getElementById('gov-map-note').textContent = unmappedCount > 0
    ? `${mappedReports.length} titik contoh ditampilkan; ${unmappedCount} laporan perangkat belum memiliki titik pada peta skematis.`
    : `${mappedReports.length} titik contoh ditampilkan. Posisi bersifat ilustratif.`;

  const selectedReport = filteredReports.find(report => report.id === selectedGovernmentReportId);
  const statusControls = document.getElementById('gov-status-controls');
  statusControls.classList.toggle('hidden', appState.selectedRole !== 'bappeda' || !selectedReport);
  if (selectedReport) {
    const priority = getGovernmentPriority(selectedReport);
    const statusKey = getGovernmentStatusKey(selectedReport.followUpStatus);
    document.getElementById('gov-report-id').textContent = selectedReport.id;
    document.getElementById('gov-report-detail-title').textContent = selectedReport.facilityName;
    document.getElementById('gov-report-location').textContent = selectedReport.location;
    const priorityBadge = document.getElementById('gov-report-priority');
    priorityBadge.className = `gov-priority-chip ${priority.key}`;
    priorityBadge.textContent = priority.label;
    const statusBadge = document.getElementById('gov-report-status');
    statusBadge.className = `gov-status-badge ${statusKey}`;
    statusBadge.textContent = selectedReport.followUpStatus;
    document.getElementById('gov-report-description').textContent =
      selectedReport.description || 'Deskripsi laporan belum tersedia.';
    document.getElementById('gov-report-meta').textContent =
      `${selectedReport.facilityType} · ${selectedReport.reporterName} · ${selectedReport.sourceLabel} · ${formatGamificationDate(selectedReport.createdAt)}`;
    document.getElementById('gov-follow-up-select').value = selectedReport.followUpStatus;
    const photoWrap = document.getElementById('gov-report-photo-wrap');
    const photo = document.getElementById('gov-report-photo');
    if (typeof selectedReport.photoDataUrl === 'string' && selectedReport.photoDataUrl.startsWith('data:image/')) {
      photo.src = selectedReport.photoDataUrl;
      photoWrap.classList.remove('hidden');
    } else {
      photo.removeAttribute('src');
      photoWrap.classList.add('hidden');
    }
  } else {
    document.getElementById('gov-report-id').textContent = '';
    document.getElementById('gov-report-detail-title').textContent = 'Tidak ada laporan';
    document.getElementById('gov-report-location').textContent = '';
    document.getElementById('gov-report-description').textContent = 'Pilih filter lain untuk melihat laporan.';
    document.getElementById('gov-report-meta').textContent = '';
    document.getElementById('gov-report-photo-wrap').classList.add('hidden');
  }

  const typeCounts = new Map();
  reports.forEach(report => {
    const type = report.facilityType || 'Jenis lain';
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
  });
  const mostReportedType = [...typeCounts.entries()].sort((first, second) => second[1] - first[1])[0];
  const summaryItems = [
    `${criticalCount} laporan terklasifikasi kritis dan ${highPriorityCount - criticalCount} tinggi; dahulukan pemeriksaan keselamatan di lapangan.`,
    `Status tindak lanjut: ${statusCounts.Menunggu} menunggu, ${statusCounts.Diproses} diproses, ${statusCounts.Selesai} selesai.`,
    mostReportedType
      ? `Jenis fasilitas paling sering dilaporkan: ${mostReportedType[0]} (${mostReportedType[1]} laporan).`
      : 'Belum ada data jenis fasilitas untuk direkap.'
  ];
  const summary = document.getElementById('gov-policy-summary');
  summary.replaceChildren();
  summaryItems.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    summary.appendChild(item);
  });
}

function saveGovernmentReportStatus() {
  if (appState.selectedRole !== 'bappeda') {
    showToast('Perubahan status demo hanya tersedia untuk peran Bappeda.');
    return;
  }

  const nextStatus = document.getElementById('gov-follow-up-select').value;
  if (!governmentFollowUpStatuses.includes(nextStatus)) {
    showToast('Pilih status tindak lanjut yang tersedia.');
    return;
  }
  const reportId = selectedGovernmentReportId;
  if (!reportId) {
    showToast('Pilih laporan sebelum memperbarui status.');
    return;
  }

  try {
    if (reportId.startsWith('DEMO-')) {
      const overrides = readGovernmentStatusOverrides();
      if (!overrides) return;
      overrides[reportId] = nextStatus;
      localStorage.setItem(POLICY_STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
    } else {
      const reports = readAuditReports();
      if (!reports) return;
      const report = reports.find(item => item && item.id === reportId);
      if (!report) {
        showToast('Laporan tidak ditemukan di penyimpanan perangkat.');
        return;
      }
      report.followUpStatus = nextStatus;
      report.updatedAt = new Date().toISOString();
      localStorage.setItem(AUDIT_REPORTS_KEY, JSON.stringify(reports));
    }
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; status belum diperbarui.'
      : 'Status tindak lanjut gagal disimpan.');
    return;
  }

  renderGovernmentDashboard();
  updateAccountNotificationBadge();
  if (!document.getElementById('account-center').classList.contains('hidden')) {
    renderAccountReportHistory();
    renderAccountNotifications();
  }
  showToast(`Status laporan diperbarui menjadi ${nextStatus} (demo lokal).`);
}

function setScanScenario(index) {
  const data = scanScenarios[index];
  if (!data) return;

  document.querySelectorAll('.scen-btn').forEach((btn, i) => {
    if (i === index) {
      btn.className = 'scen-btn active px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950 shrink-0';
    } else {
      btn.className = 'scen-btn px-3 py-1.5 rounded-full text-[11px] font-bold glass-card text-slate-300 shrink-0';
    }
  });

  document.getElementById('cv-violation-tag').textContent = data.tag;
  document.getElementById('cv-measurement').textContent = data.measurement;
  document.getElementById('cv-standard').textContent = data.standard;
  document.getElementById('cv-confidence').textContent = data.confidence;
  document.getElementById('ticket-id').textContent = data.ticket;
  document.getElementById('ticket-desc').innerHTML = 
    `Skor ADS <strong class="text-rose-400">${data.ads}/100 (Prioritas Tinggi)</strong> otomatis masuk antrean penguncian anggaran APBD Dinas PUPR.`;
}

function triggerAutoMusrenbang() {
  const ticket = document.getElementById('ticket-id').textContent;
  showToast(`Data AI tervalidasi! Tiket ${ticket} terkirim ke E-Musrenbang.`);
}

// =========================================================
// AUDIT PINTAR: ANALISIS DEMO LOKAL & LAPORAN FASILITAS
// =========================================================

function openAuditCamera() {
  document.getElementById('audit-camera-input').click();
}

function openAuditGallery() {
  document.getElementById('audit-gallery-input').click();
}

function handleAuditPhotoSelected(event) {
  const input = event.currentTarget;
  const file = input.files && input.files[0];
  if (!file) return;

  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    input.value = '';
    showToast('Gunakan foto JPG, PNG, atau WebP.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    input.value = '';
    showToast('Ukuran foto melebihi batas 10 MB.');
    return;
  }

  let previewUrl;
  try {
    previewUrl = URL.createObjectURL(file);
  } catch (error) {
    input.value = '';
    showToast('Foto tidak dapat dibuka di perangkat ini.');
    return;
  }

  if (auditPhotoUrl) URL.revokeObjectURL(auditPhotoUrl);
  auditPhotoFile = file;
  auditPhotoUrl = previewUrl;
  auditAnalysis = null;

  const preview = document.getElementById('audit-photo-preview');
  preview.src = auditPhotoUrl;
  document.getElementById('audit-photo-name').textContent = file.name;
  document.getElementById('audit-photo-preview-wrap').classList.remove('hidden');
  document.getElementById('audit-analysis-result').classList.add('hidden');
  document.getElementById('audit-submit-button').disabled = true;
  document.getElementById('audit-report-status').textContent = 'Foto siap dianalisis';
}

function removeAuditPhoto() {
  if (auditPhotoUrl) URL.revokeObjectURL(auditPhotoUrl);
  auditPhotoFile = null;
  auditPhotoUrl = null;
  auditAnalysis = null;
  document.getElementById('audit-camera-input').value = '';
  document.getElementById('audit-gallery-input').value = '';
  document.getElementById('audit-photo-preview').removeAttribute('src');
  document.getElementById('audit-photo-preview-wrap').classList.add('hidden');
  document.getElementById('audit-analysis-result').classList.add('hidden');
  document.getElementById('audit-submit-button').disabled = true;
  document.getElementById('audit-report-status').textContent = 'Foto belum dipilih';
}

function handleAuditLocationInput() {
  auditCoordinates = null;
  document.getElementById('audit-location-status').textContent = 'Lokasi manual akan disimpan bersama laporan.';
}

function requestAuditLocation() {
  const status = document.getElementById('audit-location-status');
  const button = document.getElementById('audit-location-button');

  if (!navigator.geolocation) {
    status.textContent = 'Geolokasi tidak tersedia. Masukkan alamat secara manual.';
    showToast('Geolokasi tidak tersedia di browser ini.');
    return;
  }

  button.disabled = true;
  status.textContent = 'Meminta lokasi perangkat...';
  navigator.geolocation.getCurrentPosition(
    position => {
      auditCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      document.getElementById('audit-location').value =
        `${auditCoordinates.latitude.toFixed(5)}, ${auditCoordinates.longitude.toFixed(5)}`;
      status.textContent = `Koordinat tersimpan (akurasi ±${Math.round(auditCoordinates.accuracy)} m).`;
      button.disabled = false;
    },
    error => {
      const errorMessages = {
        1: 'Izin lokasi ditolak. Masukkan alamat secara manual.',
        2: 'Lokasi tidak tersedia. Coba lagi atau masukkan alamat manual.',
        3: 'Pencarian lokasi terlalu lama. Coba lagi atau masukkan alamat manual.'
      };
      status.textContent = errorMessages[error.code] || 'Lokasi gagal diperoleh. Masukkan alamat secara manual.';
      button.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function getAuditImageScore(image) {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Analisis gambar tidak didukung browser ini.');

  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  let edgePixels = 0;
  let edgeStrength = 0;
  const sampleCount = (size - 1) * (size - 1);
  const luminanceAt = (x, y) => {
    const offset = (y * size + x) * 4;
    return 0.299 * pixels[offset] + 0.587 * pixels[offset + 1] + 0.114 * pixels[offset + 2];
  };

  for (let y = 1; y < size; y += 1) {
    for (let x = 1; x < size; x += 1) {
      const current = luminanceAt(x, y);
      const edge = Math.abs(current - luminanceAt(x - 1, y)) +
        Math.abs(current - luminanceAt(x, y - 1));
      edgeStrength += edge;
      if (edge >= 70) edgePixels += 1;
    }
  }

  const textureScore = Math.round((edgePixels / sampleCount) * 100);
  const averageEdge = edgeStrength / sampleCount;
  const score = Math.max(0, Math.min(100, Math.round(textureScore * 0.75 + averageEdge * 0.25)));
  const severity = score < 20 ? 'Ringan' : score < 45 ? 'Sedang' : 'Berat';
  const summaries = {
    Ringan: 'Variasi tekstur foto rendah. Ini bukan bukti fasilitas dalam kondisi baik; tetap periksa foto dan lokasi secara manual.',
    Sedang: 'Ada variasi tekstur yang perlu diperiksa. Cocokkan hasil ini dengan deskripsi dan kondisi fasilitas di lapangan.',
    Berat: 'Variasi tepi dan kontras foto tinggi. Prioritaskan pemeriksaan manual; gambar ramai juga dapat memengaruhi hasil.'
  };

  return { score, severity, summary: summaries[severity] };
}

function createAuditPhotoData(image) {
  const maxDimension = 640;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Foto tidak dapat disiapkan untuk penyimpanan.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.62);
}

async function analyzeAuditPhoto() {
  if (!auditPhotoFile) {
    showToast('Ambil foto atau pilih foto dari galeri terlebih dahulu.');
    return;
  }

  const button = document.getElementById('audit-analyze-button');
  const buttonLabel = button.querySelector('span');
  const image = document.getElementById('audit-photo-preview');
  button.disabled = true;
  buttonLabel.textContent = 'Menganalisis...';
  document.getElementById('audit-report-status').textContent = 'Analisis lokal berlangsung';

  try {
    await image.decode();
    const result = getAuditImageScore(image);
    result.photoDataUrl = createAuditPhotoData(image);
    auditAnalysis = result;

    const severityClass = result.severity.toLowerCase();
    const badge = document.getElementById('audit-severity-badge');
    badge.className = `audit-severity-badge severity-${severityClass}`;
    badge.textContent = `Indikasi ${result.severity.toLowerCase()}`;
    document.getElementById('audit-analysis-summary').textContent = result.summary;
    document.getElementById('audit-score-bar').style.width = `${result.score}%`;
    document.getElementById('audit-score-label').textContent =
      `Indeks variasi visual: ${result.score}/100 (bukan probabilitas kerusakan).`;
    document.getElementById('audit-analysis-result').classList.remove('hidden');
    document.getElementById('audit-report-status').textContent = 'Analisis selesai · siap disimpan';
    document.getElementById('audit-submit-button').disabled = false;
  } catch (error) {
    auditAnalysis = null;
    document.getElementById('audit-analysis-result').classList.add('hidden');
    document.getElementById('audit-submit-button').disabled = true;
    document.getElementById('audit-report-status').textContent = 'Analisis gagal';
    showToast(error.message || 'Foto gagal dianalisis. Coba gunakan foto lain.');
  } finally {
    button.disabled = false;
    buttonLabel.textContent = 'Analisis Foto';
  }
}

function readAuditReports() {
  try {
    const serialized = localStorage.getItem(AUDIT_REPORTS_KEY);
    if (!serialized) return [];
    const reports = JSON.parse(serialized);
    if (!Array.isArray(reports)) throw new TypeError('Format data laporan tidak valid.');
    return reports;
  } catch (error) {
    showToast('Data laporan lokal tidak dapat dibaca. Data lama tidak akan ditimpa.');
    return null;
  }
}

function renderAuditReports() {
  const list = document.getElementById('audit-report-list');
  const reports = readAuditReports();
  list.replaceChildren();

  if (!reports) {
    const message = document.createElement('p');
    message.className = 'text-[10px] text-rose-300';
    message.textContent = 'Laporan gagal dimuat dari penyimpanan perangkat.';
    list.appendChild(message);
    return;
  }
  if (reports.length === 0) {
    const message = document.createElement('p');
    message.className = 'text-[10px] text-slate-400';
    message.textContent = 'Belum ada laporan tersimpan.';
    list.appendChild(message);
    return;
  }

  reports.forEach(report => {
    const card = document.createElement('article');
    card.className = 'audit-report-item';

    if (typeof report.photoDataUrl === 'string' && report.photoDataUrl.startsWith('data:image/')) {
      const photo = document.createElement('img');
      photo.className = 'audit-history-photo';
      photo.src = report.photoDataUrl;
      photo.alt = `Foto laporan ${report.facilityName || 'fasilitas'}`;
      card.appendChild(photo);
    }

    const details = document.createElement('div');
    details.className = 'min-w-0 flex-1';
    const title = document.createElement('p');
    title.className = 'text-[11px] font-bold text-white truncate';
    title.textContent = report.facilityName || 'Fasilitas tanpa nama';
    const metadata = document.createElement('p');
    metadata.className = 'text-[9px] text-slate-400 mt-1';
    metadata.textContent = `${report.facilityType || 'Jenis tidak diketahui'} · ${report.analysis && report.analysis.severity ? `Indikasi ${report.analysis.severity.toLowerCase()}` : 'Belum dianalisis'}`;
    const status = document.createElement('p');
    status.className = 'text-[9px] text-cyan-300 mt-1';
    status.textContent = report.status || 'Status tidak diketahui';
    const date = document.createElement('p');
    date.className = 'text-[9px] text-slate-500 mt-1';
    const createdAt = new Date(report.createdAt);
    date.textContent = Number.isNaN(createdAt.getTime()) ? 'Tanggal tidak diketahui' : createdAt.toLocaleString('id-ID');
    details.append(title, metadata, status, date);
    card.appendChild(details);
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'account-inline-action account-delete-action';
    deleteButton.textContent = 'Hapus';
    deleteButton.setAttribute('aria-label', `Hapus laporan ${report.facilityName || 'fasilitas tanpa nama'}`);
    deleteButton.addEventListener('click', () => deleteAuditReport(report.id));
    card.appendChild(deleteButton);
    list.appendChild(card);
  });
}

function deleteAuditReport(reportId) {
  const reports = readAuditReports();
  if (!reports) return;
  const report = reports.find(item => item && item.id === reportId);
  if (!report) {
    showToast('Laporan tidak ditemukan di penyimpanan perangkat.');
    return;
  }
  if (!window.confirm(`Hapus laporan "${report.facilityName || 'Fasilitas tanpa nama'}" dari perangkat ini?`)) return;

  try {
    localStorage.setItem(AUDIT_REPORTS_KEY, JSON.stringify(reports.filter(item => item !== report)));
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; laporan belum dihapus.'
      : 'Laporan gagal dihapus dari perangkat ini.');
    return;
  }

  let gamificationSaved = true;
  if (report.verificationStatus === 'valid' && typeof report.id === 'string') {
    const ownerId = getReportOwnerId(report);
    const gamification = readGamificationState(ownerId);
    if (gamification) {
      if (gamification.awardedReportIds.includes(report.id)) {
        const awardId = `report-${report.id}`;
        const award = gamification.history.find(item => item && item.id === awardId);
        gamification.points = Math.max(0, gamification.points - (award ? award.points : POINTS_PER_VALID_REPORT));
        gamification.awardedReportIds = gamification.awardedReportIds.filter(id => id !== report.id);
        gamification.history = gamification.history.filter(item => !item || item.id !== awardId);
        gamificationSaved = saveGamificationState(ownerId, gamification);
      }
    } else {
      gamificationSaved = false;
    }
  }

  renderAuditReports();
  renderGamification();
  renderProfileTab();
  renderGovernmentDashboard();
  if (!document.getElementById('account-center').classList.contains('hidden')) {
    renderAccountReportHistory();
    renderAccountNotifications();
  }
  updateAccountNotificationBadge();
  showToast(gamificationSaved
    ? 'Laporan berhasil dihapus.'
    : 'Laporan berhasil dihapus, tetapi poin Aksi Muda gagal diperbarui.');
}

function submitAuditReport(event) {
  event.preventDefault();
  if (!auditPhotoFile || !auditAnalysis) {
    showToast('Pilih dan analisis foto sebelum menyimpan laporan.');
    return;
  }

  const reports = readAuditReports();
  if (!reports) return;
  const report = {
    id: `AST-${Date.now().toString(36).toUpperCase()}`,
    facilityName: document.getElementById('audit-facility-name').value.trim(),
    facilityType: document.getElementById('audit-facility-type').value,
    description: document.getElementById('audit-description').value.trim(),
    location: document.getElementById('audit-location').value.trim(),
    coordinates: auditCoordinates,
    photoName: auditPhotoFile.name,
    photoDataUrl: auditAnalysis.photoDataUrl,
    analysis: {
      method: 'Analisis tekstur lokal (demo)',
      score: auditAnalysis.score,
      severity: auditAnalysis.severity,
      summary: auditAnalysis.summary
    },
    submitterId: appState.selectedRole,
    submitterAccountId: appState.currentAccount ? getCurrentUserId() : null,
    submitterName: getActiveProfile().name,
    verificationStatus: 'pending',
    status: 'Menunggu verifikasi',
    createdAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(AUDIT_REPORTS_KEY, JSON.stringify([report, ...reports]));
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh. Hapus data situs atau coba foto yang lebih kecil.'
      : 'Laporan gagal disimpan di perangkat ini.');
    return;
  }

  renderAuditReports();
  document.getElementById('audit-report-status').textContent = 'Tersimpan lokal · belum diverifikasi';
  document.getElementById('audit-submit-button').disabled = true;
  document.getElementById('audit-new-report-button').classList.remove('hidden');
  updateAccountNotificationBadge();
  if (!document.getElementById('account-center').classList.contains('hidden')) {
    renderAccountReportHistory();
    renderAccountNotifications();
  }
  showToast('Laporan tersimpan di perangkat ini.');
}

function getDefaultGamificationState() {
  return {
    points: 0,
    awardedReportIds: [],
    claimedMissionIds: [],
    history: []
  };
}

function readGamificationState(userId) {
  try {
    const serialized = localStorage.getItem(`${GAMIFICATION_STORAGE_PREFIX}${userId}`);
    if (!serialized) return getDefaultGamificationState();

    const state = JSON.parse(serialized);
    if (
      !state ||
      !Number.isSafeInteger(state.points) ||
      state.points < 0 ||
      !Array.isArray(state.awardedReportIds) ||
      !Array.isArray(state.claimedMissionIds) ||
      !Array.isArray(state.history)
    ) {
      throw new TypeError('Format data Aksi Muda tidak valid.');
    }
    return state;
  } catch (error) {
    showToast('Data Aksi Muda tidak dapat dibaca; poin lama tidak ditimpa.');
    return null;
  }
}

function saveGamificationState(userId, state) {
  try {
    localStorage.setItem(`${GAMIFICATION_STORAGE_PREFIX}${userId}`, JSON.stringify(state));
    return true;
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; poin Aksi Muda belum tersimpan.'
      : 'Poin Aksi Muda gagal disimpan di perangkat ini.');
    return false;
  }
}

function getReportOwnerId(report) {
  if (report && typeof report.submitterAccountId === 'string' && report.submitterAccountId) {
    return report.submitterAccountId;
  }
  return Object.prototype.hasOwnProperty.call(roleProfiles, report.submitterId)
    ? report.submitterId
    : 'youth';
}

function isPendingAuditReport(report) {
  return report && (
    report.verificationStatus === 'pending' ||
    (!report.verificationStatus && ['Belum diverifikasi (lokal)', 'Menunggu verifikasi'].includes(report.status))
  );
}

function getGamificationWeekInfo() {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const pad = value => String(value).padStart(2, '0');
  return {
    key: `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`,
    start: monday.getTime(),
    end: now.getTime()
  };
}

function getReportVerifiedTime(report) {
  const verifiedAt = Date.parse(report.verifiedAt || report.createdAt || '');
  return Number.isFinite(verifiedAt) ? verifiedAt : 0;
}

function synchronizeGamificationAwards(reports) {
  const validReports = reports.filter(report => report && report.verificationStatus === 'valid' && typeof report.id === 'string');
  const states = Object.create(null);
  const dirtyUsers = new Set();
  let savedSuccessfully = true;

  const getState = userId => {
    if (!Object.prototype.hasOwnProperty.call(states, userId)) {
      states[userId] = readGamificationState(userId);
    }
    return states[userId];
  };

  validReports.forEach(report => {
    const userId = getReportOwnerId(report);
    const state = getState(userId);
    if (!state) {
      savedSuccessfully = false;
      return;
    }
    if (state.awardedReportIds.includes(report.id)) return;

    state.points += POINTS_PER_VALID_REPORT;
    state.awardedReportIds.push(report.id);
    state.history.unshift({
      id: `report-${report.id}`,
      type: 'report',
      title: `Laporan valid: ${report.facilityName || 'Fasilitas publik'}`,
      points: POINTS_PER_VALID_REPORT,
      createdAt: report.verifiedAt || report.createdAt || new Date().toISOString()
    });
    dirtyUsers.add(userId);
  });

  const week = getGamificationWeekInfo();
  const userIds = new Set(Object.keys(roleProfiles));
  validReports.forEach(report => userIds.add(getReportOwnerId(report)));
  userIds.forEach(userId => {
    const weeklyCount = validReports.filter(report => {
      if (getReportOwnerId(report) !== userId) return false;
      const verifiedTime = getReportVerifiedTime(report);
      return verifiedTime >= week.start && verifiedTime <= week.end;
    }).length;
    if (weeklyCount === 0) return;

    const state = getState(userId);
    if (!state) {
      savedSuccessfully = false;
      return;
    }
    weeklyMissions.forEach(mission => {
      const missionKey = `${week.key}:${mission.id}`;
      if (weeklyCount < mission.target || state.claimedMissionIds.includes(missionKey)) return;

      state.claimedMissionIds.push(missionKey);
      state.points += mission.reward;
      state.history.unshift({
        id: `mission-${missionKey}`,
        type: 'mission',
        title: `Misi selesai: ${mission.title}`,
        points: mission.reward,
        createdAt: new Date().toISOString()
      });
      dirtyUsers.add(userId);
    });
  });

  dirtyUsers.forEach(userId => {
    const state = states[userId];
    state.history = state.history.slice(0, 100);
    if (!saveGamificationState(userId, state)) savedSuccessfully = false;
  });
  return savedSuccessfully;
}

function formatGamificationDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Tanggal tidak tersedia' : date.toLocaleString('id-ID');
}

function renderGamificationBadges(validReportCount) {
  const container = document.getElementById('gamification-badges');
  container.replaceChildren();
  let unlockedCount = 0;

  gamificationBadges.forEach(badge => {
    const unlocked = validReportCount >= badge.threshold;
    if (unlocked) unlockedCount += 1;
    const card = document.createElement('article');
    card.className = `gamification-badge ${unlocked ? 'unlocked' : 'locked'}`;
    const icon = document.createElement('span');
    icon.className = 'gamification-badge-icon';
    const iconElement = document.createElement('i');
    iconElement.setAttribute('data-lucide', unlocked ? badge.icon : 'lock-keyhole');
    iconElement.setAttribute('aria-hidden', 'true');
    icon.appendChild(iconElement);
    const copy = document.createElement('span');
    copy.className = 'gamification-badge-copy';
    const title = document.createElement('strong');
    title.textContent = badge.name;
    const description = document.createElement('span');
    description.textContent = unlocked ? 'Terbuka' : badge.description;
    copy.append(title, description);
    card.append(icon, copy);
    container.appendChild(card);
  });
  document.getElementById('gamification-badge-count').textContent =
    `${unlockedCount}/${gamificationBadges.length} terbuka`;
}

function renderGamificationMissions(weeklyCount, week) {
  const container = document.getElementById('gamification-missions');
  container.replaceChildren();
  document.getElementById('gamification-week-label').textContent = `Dimulai ${formatGamificationDate(week.start)}`;

  weeklyMissions.forEach(mission => {
    const progress = Math.min(weeklyCount, mission.target);
    const complete = progress >= mission.target;
    const card = document.createElement('article');
    card.className = `gamification-mission${complete ? ' complete' : ''}`;
    const top = document.createElement('div');
    top.className = 'gamification-mission-top';
    const title = document.createElement('span');
    title.className = 'gamification-mission-title';
    title.textContent = mission.title;
    const reward = document.createElement('span');
    reward.className = 'gamification-mission-reward';
    reward.textContent = complete ? `Selesai · +${mission.reward}` : `+${mission.reward} poin`;
    top.append(title, reward);
    const description = document.createElement('p');
    description.className = 'gamification-mission-description';
    description.textContent = mission.description;
    const progressRow = document.createElement('div');
    progressRow.className = 'gamification-mission-progress';
    const track = document.createElement('span');
    track.className = 'gamification-mission-track';
    const bar = document.createElement('span');
    bar.style.width = `${(progress / mission.target) * 100}%`;
    track.appendChild(bar);
    const progressLabel = document.createElement('span');
    progressLabel.className = 'gamification-mission-progress-label';
    progressLabel.textContent = `${progress}/${mission.target} laporan valid`;
    progressRow.append(track, progressLabel);
    card.append(top, description, progressRow);
    container.appendChild(card);
  });
}

function renderGamificationLeaderboard(userName, points) {
  const entries = [
    ...demoLeaderboard,
    { name: userName, role: 'Profil kamu', points, currentUser: true }
  ].sort((first, second) => second.points - first.points || first.name.localeCompare(second.name));
  const container = document.getElementById('gamification-leaderboard');
  container.replaceChildren();
  const currentRank = entries.findIndex(entry => entry.currentUser) + 1;
  document.getElementById('gamification-rank').textContent = `#${currentRank}`;

  entries.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = `gamification-leader-row${entry.currentUser ? ' current-user' : ''}`;
    const rank = document.createElement('span');
    rank.className = 'gamification-leader-rank';
    rank.textContent = `#${index + 1}`;
    const name = document.createElement('span');
    name.className = 'gamification-leader-name';
    name.textContent = `${entry.name}${entry.currentUser ? ' · Kamu' : ''}`;
    const total = document.createElement('span');
    total.className = 'gamification-leader-points';
    total.textContent = `${entry.points} poin`;
    row.append(rank, name, total);
    container.appendChild(row);
  });
}

function renderGamificationHistory(reports, state, userId) {
  const events = state.history.map(event => ({
    title: event.title,
    detail: event.type === 'mission' ? 'Misi mingguan selesai' : 'Laporan dinyatakan valid',
    points: event.points,
    createdAt: event.createdAt,
    pending: false
  }));
  reports
    .filter(report => report && getReportOwnerId(report) === userId && report.verificationStatus !== 'valid')
    .forEach(report => {
      events.push({
        title: `Laporan: ${report.facilityName || 'Fasilitas publik'}`,
        detail: report.status || 'Menunggu verifikasi',
        points: 0,
        createdAt: report.createdAt,
        pending: true
      });
    });

  events.sort((first, second) => Date.parse(second.createdAt || '') - Date.parse(first.createdAt || ''));
  const container = document.getElementById('gamification-history');
  container.replaceChildren();
  if (events.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gamification-empty-state';
    empty.textContent = 'Belum ada kontribusi. Poin laporan akan diberikan setelah dinyatakan valid.';
    container.appendChild(empty);
    return;
  }

  events.slice(0, 12).forEach(event => {
    const row = document.createElement('article');
    row.className = 'gamification-history-item';
    const copy = document.createElement('span');
    copy.className = 'gamification-history-copy';
    const title = document.createElement('strong');
    title.textContent = event.title;
    const detail = document.createElement('span');
    detail.textContent = `${event.detail} · ${formatGamificationDate(event.createdAt)}`;
    copy.append(title, detail);
    const points = document.createElement('span');
    points.className = `gamification-history-points${event.pending ? ' pending' : ''}`;
    points.textContent = event.pending ? '0 poin' : `+${event.points} poin`;
    row.append(copy, points);
    container.appendChild(row);
  });
}

function renderGamificationVerificationPanel(reports) {
  const panel = document.getElementById('gamification-verification-panel');
  const list = document.getElementById('gamification-pending-reports');
  list.replaceChildren();
  if (appState.selectedRole !== 'bappeda') {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  const pendingReports = reports.filter(isPendingAuditReport);
  if (pendingReports.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gamification-empty-state';
    empty.textContent = 'Tidak ada laporan lokal yang menunggu validasi.';
    list.appendChild(empty);
    return;
  }

  pendingReports.forEach(report => {
    const row = document.createElement('article');
    row.className = 'gamification-history-item';
    const copy = document.createElement('span');
    copy.className = 'gamification-history-copy';
    const title = document.createElement('strong');
    title.textContent = report.facilityName || 'Fasilitas publik';
    const detail = document.createElement('span');
    detail.textContent = `${report.submitterName || 'Relawan'} · menunggu verifikasi`;
    copy.append(title, detail);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gamification-verify-button';
    button.textContent = `Validasi · +${POINTS_PER_VALID_REPORT}`;
    button.setAttribute('aria-label', `Simulasikan validasi laporan ${report.facilityName || 'fasilitas'}`);
    button.addEventListener('click', () => verifyAuditReport(report.id));
    row.append(copy, button);
    list.appendChild(row);
  });
}

function renderGamification() {
  const reports = readAuditReports() || [];
  synchronizeGamificationAwards(reports);
  const userId = getCurrentUserId();
  const profile = getActiveProfile();
  const state = readGamificationState(userId);
  if (!state) return;

  const userReports = reports.filter(report => report && getReportOwnerId(report) === userId);
  const validReports = userReports.filter(report => report.verificationStatus === 'valid');
  const points = state.points;
  let currentLevelIndex = 0;
  gamificationLevels.forEach((level, index) => {
    if (points >= level.threshold) currentLevelIndex = index;
  });
  const currentLevel = gamificationLevels[currentLevelIndex];
  const nextLevel = gamificationLevels[currentLevelIndex + 1];
  const progress = nextLevel
    ? Math.min(100, Math.floor(((points - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100))
    : 100;

  document.getElementById('gamification-profile-name').textContent = profile.name;
  document.getElementById('gamification-profile-role').textContent = profile.badge;
  document.getElementById('gamification-points').textContent = points.toLocaleString('id-ID');
  document.getElementById('gov-gamification-name').textContent = profile.name;
  document.getElementById('gov-gamification-points').textContent = `${points.toLocaleString('id-ID')} poin`;
  document.getElementById('gov-audit-valid-count').textContent = String(validReports.length);
  document.getElementById('gamification-level').textContent = currentLevel.name;
  document.getElementById('gamification-level-description').textContent = nextLevel
    ? `${nextLevel.threshold - points} poin menuju ${nextLevel.name}`
    : 'Level tertinggi tercapai.';
  document.getElementById('gamification-level-progress').textContent = `${progress}%`;
  document.getElementById('gamification-progress-bar').style.width = `${progress}%`;
  const progressBar = document.querySelector('#tab-gamification [role="progressbar"]');
  progressBar.setAttribute('aria-valuenow', String(progress));
  document.getElementById('gamification-valid-count').textContent = String(validReports.length);
  renderGamificationBadges(validReports.length);

  const week = getGamificationWeekInfo();
  const weeklyCount = validReports.filter(report => {
    const verifiedTime = getReportVerifiedTime(report);
    return verifiedTime >= week.start && verifiedTime <= week.end;
  }).length;
  renderGamificationMissions(weeklyCount, week);
  renderGamificationLeaderboard(profile.name, points);
  renderGamificationHistory(reports, state, userId);
  renderGamificationVerificationPanel(reports);
  lucide.createIcons();
  updateAccountNotificationBadge();
}

function verifyAuditReport(reportId) {
  if (appState.selectedRole !== 'bappeda') {
    showToast('Validasi demo hanya tersedia untuk peran Bappeda.');
    return;
  }
  const reports = readAuditReports();
  if (!reports) return;
  const report = reports.find(item => item && item.id === reportId);
  if (!isPendingAuditReport(report)) {
    showToast('Laporan tidak ditemukan atau sudah diproses.');
    return;
  }

  report.verificationStatus = 'valid';
  report.status = 'Terverifikasi (demo lokal)';
  report.verifiedAt = new Date().toISOString();
  try {
    localStorage.setItem(AUDIT_REPORTS_KEY, JSON.stringify(reports));
  } catch (error) {
    showToast(error.name === 'QuotaExceededError'
      ? 'Penyimpanan perangkat penuh; status validasi belum tersimpan.'
      : 'Status validasi gagal disimpan.');
    return;
  }

  const savedPoints = synchronizeGamificationAwards(reports);
  renderGamification();
  renderAuditReports();
  updateAccountNotificationBadge();
  if (!document.getElementById('account-center').classList.contains('hidden')) {
    renderAccountNotifications();
  }
  if (savedPoints) {
    const ownerProfile = roleProfiles[report.submitterId] || roleProfiles.youth;
    showToast(`Validasi demo selesai. Poin diberikan kepada ${report.submitterName || ownerProfile.name}.`);
  } else {
    showToast('Laporan tervalidasi; sinkronisasi poin akan dicoba kembali saat data dimuat.');
  }
}

function resetAuditReportForm() {
  document.getElementById('audit-report-form').reset();
  removeAuditPhoto();
  auditCoordinates = null;
  document.getElementById('audit-location-status').textContent = 'Isi alamat atau gunakan lokasi saat ini.';
  document.getElementById('audit-report-status').textContent = 'Belum dianalisis';
  document.getElementById('audit-new-report-button').classList.add('hidden');
}

function toggleBudgetLock() {
  appState.budgetLocked = !appState.budgetLocked;
  const btn = document.getElementById('btn-budget-lock');
  if (appState.budgetLocked) {
    btn.className = 'w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition';
    btn.innerHTML = '<i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i><span>Alokasi APBD terkunci (simulasi)</span>';
    showToast('Penguncian alokasi APBD simulasi diaktifkan.');
  } else {
    btn.className = 'w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition';
    btn.innerHTML = '<i data-lucide="lock" class="w-3.5 h-3.5"></i><span>Kunci alokasi APBD (simulasi)</span>';
    showToast('Status penguncian anggaran dibuka.');
  }
  lucide.createIcons();
}

function triggerHapticGuide() {
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
  showToast('Pemandu Suara & Getar Haptik Aktif: "Jalur aman 50m ke depan"');
}

function triggerEmergencySOS() {
  if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
  showToast('Sinyal SOS simulasi dikirim ke 3 relawan Patroli Pemuda terdekat!');
}

function verifyRepair(isApproved) {
  if (isApproved) {
    showToast('Verifikasi disetujui! Status infrastruktur berubah menjadi Aksesibel.');
  } else {
    showToast('Revisi diajukan! Dana retensi kontraktor PUPR ditahan.');
  }
}

function toggleHighContrast() {
  appState.highContrast = !appState.highContrast;
  document.body.classList.toggle('high-contrast', appState.highContrast);
  persistUserSettingsPatch({ highContrast: appState.highContrast });
  showToast(appState.highContrast ? 'Mode Kontras Tinggi WCAG AAA Aktif' : 'Mode Warna Neo-Civic Standar');
}

function setTheme(theme) {
  appState.theme = theme;
  document.body.classList.toggle('light-theme', theme === 'light');

  const button = document.getElementById('btn-theme');
  if (button) {
    const nextTheme = theme === 'light' ? 'gelap' : 'terang';
    const icon = theme === 'light' ? 'moon' : 'sun';
    button.setAttribute('aria-label', `Aktifkan mode ${nextTheme}`);
    button.setAttribute('aria-pressed', String(theme === 'light'));
    button.title = `Aktifkan mode ${nextTheme}`;
    button.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
    lucide.createIcons();
  }
}

function toggleTheme() {
  const theme = appState.theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('aksestama-theme', theme);
  } catch (error) {
    showToast('Preferensi tema gagal disimpan di perangkat ini.');
    return;
  }
  persistUserSettingsPatch({ theme });
  setTheme(theme);
  showToast(theme === 'light' ? 'Mode terang diaktifkan' : 'Mode gelap diaktifkan');
}

function toggleVoiceAssist() {
  appState.voiceActive = !appState.voiceActive;
  persistUserSettingsPatch({ voiceAssist: appState.voiceActive });
  showToast(appState.voiceActive ? 'Voice-Command aktif: Ucapkan "Scan Trotoar" atau "Rute Aman"' : 'Voice-Command dinonaktifkan');
}

// =========================================================
// UTILITAS NOTIFIKASI TOAST & INISIALISASI IKON
// =========================================================

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  toastMsg.textContent = message;

  toast.classList.remove('opacity-0', 'translate-y-3');
  toast.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-3');
  }, 3000);
}

function toggleScreenCaptureMenu() {
  const menu = document.getElementById('screen-capture-menu');
  const button = document.getElementById('btn-screen-capture');
  const isOpening = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !isOpening);
  button.setAttribute('aria-expanded', String(isOpening));
}

function closeScreenCaptureMenu() {
  const menu = document.getElementById('screen-capture-menu');
  const button = document.getElementById('btn-screen-capture');
  if (!menu || !button) return;
  const restoreFocus = menu.contains(document.activeElement);
  menu.classList.add('hidden');
  button.setAttribute('aria-expanded', 'false');
  if (restoreFocus) button.focus();
}

let screenCaptureInProgress = false;
async function renderAppScreenshot() {
  if (typeof window.html2canvas !== 'function') {
    showToast('Fitur gambar belum termuat. Periksa koneksi internet lalu muat ulang.');
    return null;
  }
  if (screenCaptureInProgress) {
    showToast('Gambar sedang disiapkan. Tunggu sebentar.');
    return null;
  }

  const appShell = document.getElementById('app-shell');
  if (!appShell) {
    showToast('Tampilan aplikasi tidak ditemukan.');
    return null;
  }

  screenCaptureInProgress = true;
  try {
    return await window.html2canvas(appShell, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false
    });
  } catch (error) {
    console.error('Gagal membuat gambar tampilan aplikasi.', error);
    showToast('Tampilan gagal dibuat sebagai gambar. Coba muat ulang halaman.');
    return null;
  } finally {
    screenCaptureInProgress = false;
  }
}

async function downloadAppScreenshot() {
  closeScreenCaptureMenu();
  const canvas = await renderAppScreenshot();
  if (!canvas) return;

  try {
    const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!imageBlob || imageBlob.type !== 'image/png') {
      showToast('File PNG gagal disiapkan untuk diunduh.');
      return;
    }

    const imageUrl = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.download = `aksestama-tampilan-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    link.href = imageUrl;
    link.type = 'image/png';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    showToast('Tampilan aplikasi berhasil disimpan sebagai PNG.');
  } catch (error) {
    console.error('Gagal menyimpan gambar tampilan aplikasi.', error);
    showToast('Gambar gagal disimpan. Coba gunakan browser lain.');
  }
}

async function copyAppScreenshot() {
  closeScreenCaptureMenu();
  if (!window.isSecureContext || !navigator.clipboard || typeof navigator.clipboard.write !== 'function' ||
      typeof window.ClipboardItem !== 'function') {
    showToast('Salin gambar tidak didukung di sini. Gunakan Simpan sebagai PNG.');
    return;
  }

  const canvas = await renderAppScreenshot();
  if (!canvas) return;

  try {
    const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!imageBlob) {
      showToast('Gambar gagal disiapkan untuk disalin.');
      return;
    }
    await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': imageBlob })]);
    showToast('Gambar berhasil disalin ke clipboard.');
  } catch (error) {
    console.error('Gagal menyalin gambar tampilan aplikasi.', error);
    showToast('Gambar gagal disalin. Coba gunakan Simpan sebagai PNG.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('aksestama-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
  renderAccessibleMap();
  renderAuditReports();
  lucide.createIcons();

  document.addEventListener('click', event => {
    const captureTools = document.getElementById('screen-capture-tools');
    if (captureTools && !captureTools.contains(event.target)) closeScreenCaptureMenu();
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeAccountCenter();
    closeScreenCaptureMenu();
  }
});
