import { fetchAppSettings, updateAppSettings } from './api.js';

const ADMIN_PASSCODE = "2026";

document.addEventListener('DOMContentLoaded', () => {
  const authScreen = document.getElementById('authScreen');
  const mainScreen = document.getElementById('adminMainScreen');
  const loginBtn = document.getElementById('loginBtn');
  const passcodeIpt = document.getElementById('passcodeInput');
  const logoutBtn = document.getElementById('logoutBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const toggle = document.getElementById('signageToggle');

  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    showDashboard();
  }

  loginBtn.onclick = () => {
    if (passcodeIpt.value === ADMIN_PASSCODE) {
      sessionStorage.setItem('admin_logged_in', 'true');
      showDashboard();
    } else {
      alert("パスコードが違います");
    }
  };

  logoutBtn.onclick = () => {
    sessionStorage.removeItem('admin_logged_in');
    mainScreen.style.display = 'none';
    authScreen.style.display = 'block';
  };

  saveBtn.onclick = async () => {
    saveBtn.textContent = "保存中...";
    const res = await updateAppSettings({ signageEnabled: toggle.checked });
    alert(res.success ? "保存しました" : "失敗しました");
    saveBtn.textContent = "設定を保存";
  };

  async function showDashboard() {
    authScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    const settings = await fetchAppSettings();
    toggle.checked = settings.signageEnabled;
  }
});
