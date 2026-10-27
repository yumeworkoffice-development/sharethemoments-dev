// =====================================================================
// 📜 【履歴管理モジュール】js/history.js
// =====================================================================

import { fetchUserHistory } from './api.js';

export async function loadAndRenderHistory(tableNo, userName, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p class="loading-text">送信履歴を読み込み中...</p>';
  const historyList = await fetchUserHistory(tableNo, userName);

  container.innerHTML = '';
  if (!historyList || historyList.length === 0) {
    container.innerHTML = '<p class="no-history-text">まだ送信された写真はありません</p>';
    return;
  }

  historyList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-img-wrapper">
        <img src="${item.url}" alt="送信写真" loading="lazy">
      </div>
      <div class="history-info">
        <span class="history-date">${item.date}</span>
        ${item.message ? `<p class="history-msg">"${item.message}"</p>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}
