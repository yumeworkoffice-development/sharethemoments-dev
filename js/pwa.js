// =====================================================================
// 📱 【PWAモジュール】js/pwa.js
// =====================================================================

let deferredPrompt = null;

export function initPWA() {
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (localStorage.getItem('pwa_dismissed') === 'true') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showCustomInstallModal();
  });
}

function showCustomInstallModal() {
  const modal = document.getElementById('pwaInstallModal');
  if (!modal) return;
  modal.style.display = 'flex';

  const yesBtn = document.getElementById('pwaInstallYes');
  const noBtn = document.getElementById('pwaInstallNo');

  if (yesBtn) {
    yesBtn.onclick = async () => {
      modal.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
      }
    };
  }

  if (noBtn) {
    noBtn.onclick = () => {
      modal.style.display = 'none';
      localStorage.setItem('pwa_dismissed', 'true');
    };
  }
}
