// =====================================================================
// 🪟 【UIコンポーネント】js/modal.js
// =====================================================================

import { fetchGuests } from './api.js';

let cachedGuests = {};

export async function initGuestData() {
  cachedGuests = await fetchGuests();
  return cachedGuests;
}

export function openTableModal(onSelectTable) {
  const modal = document.getElementById('tableModal');
  const listContainer = document.getElementById('tableList');
  if (!modal || !listContainer) return;

  listContainer.innerHTML = '';
  const tables = Object.keys(cachedGuests);

  if (tables.length === 0) {
    listContainer.innerHTML = '<p>テーブル情報が読み込めませんでした</p>';
  } else {
    tables.forEach(table => {
      const btn = document.createElement('button');
      btn.className = 'btn-secondary';
      btn.textContent = table;
      btn.onclick = () => {
        onSelectTable(table);
        closeModal('tableModal');
      };
      listContainer.appendChild(btn);
    });
  }
  modal.style.display = 'flex';
}

export function openGuestModal(tableNo, onSelectGuest) {
  const modal = document.getElementById('guestModal');
  const listContainer = document.getElementById('guestList');
  if (!modal || !listContainer) return;

  listContainer.innerHTML = '';
  const guests = cachedGuests[tableNo] || [];

  if (guests.length === 0) {
    listContainer.innerHTML = '<p>該当するゲストが見つかりません</p>';
  } else {
    guests.forEach(guestName => {
      const btn = document.createElement('button');
      btn.className = 'btn-secondary';
      btn.textContent = guestName;
      btn.onclick = () => {
        onSelectGuest(guestName);
        closeModal('guestModal');
      };
      listContainer.appendChild(btn);
    });
  }
  modal.style.display = 'flex';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}
