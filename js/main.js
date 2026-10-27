// =====================================================================
// 🎯 【コントローラー】js/main.js
// =====================================================================

import { initGuestData, openTableModal, openGuestModal } from './modal.js';
import { compressImages, uploadPhotosInChunks } from './uploader.js';
import { loadAndRenderHistory } from './history.js';
import { initPWA } from './pwa.js';

const state = {
  selectedTable: localStorage.getItem('sm_table') || null,
  selectedGuest: localStorage.getItem('sm_guest') || null,
  selectedFiles: []
};

document.addEventListener('DOMContentLoaded', async () => {
  await initGuestData();
  initPWA();

  const tableBtn = document.getElementById('tableSelectBtn');
  const guestBtn = document.getElementById('guestSelectBtn');
  const selectPhotoBtn = document.getElementById('selectPhotoBtn');
  const photoInput = document.getElementById('photoInput');
  const uploadBtn = document.getElementById('uploadBtn');

  if (state.selectedTable) tableBtn.textContent = state.selectedTable;
  if (state.selectedGuest) {
    guestBtn.textContent = state.selectedGuest;
    loadAndRenderHistory(state.selectedTable, state.selectedGuest, 'historyContainer');
  }

  tableBtn.onclick = () => {
    openTableModal((table) => {
      state.selectedTable = table;
      localStorage.setItem('sm_table', table);
      tableBtn.textContent = table;
      state.selectedGuest = null;
      localStorage.removeItem('sm_guest');
      guestBtn.textContent = "お名前を選択してください";
    });
  };

  guestBtn.onclick = () => {
    if (!state.selectedTable) {
      alert("先にテーブルを選択してください");
      return;
    }
    openGuestModal(state.selectedTable, (guest) => {
      state.selectedGuest = guest;
      localStorage.setItem('sm_guest', guest);
      guestBtn.textContent = guest;
      loadAndRenderHistory(state.selectedTable, state.selectedGuest, 'historyContainer');
    });
  };

  selectPhotoBtn.onclick = () => photoInput.click();

  photoInput.onchange = (e) => {
    state.selectedFiles = Array.from(e.target.files);
    const preview = document.getElementById('previewContainer');
    preview.innerHTML = `<p>${state.selectedFiles.length}枚の写真が選択されています</p>`;
    uploadBtn.disabled = state.selectedFiles.length === 0 || !state.selectedTable || !state.selectedGuest;
  };

  uploadBtn.onclick = async () => {
    if (!state.selectedTable || !state.selectedGuest || state.selectedFiles.length === 0) return;

    uploadBtn.disabled = true;
    uploadBtn.textContent = "圧縮・送信中...";

    try {
      const compressed = await compressImages(state.selectedFiles);
      const message = document.getElementById('userMessage').value;

      await uploadPhotosInChunks(compressed, state.selectedTable, state.selectedGuest, message, (current, total) => {
        uploadBtn.textContent = `送信中... (${current}/${total})`;
      });

      alert("写真を送信しました！");
      document.getElementById('userMessage').value = "";
      document.getElementById('previewContainer').innerHTML = "";
      state.selectedFiles = [];
      photoInput.value = "";

      loadAndRenderHistory(state.selectedTable, state.selectedGuest, 'historyContainer');
    } catch (err) {
      console.error(err);
      alert("送信に失敗しました");
    } finally {
      uploadBtn.textContent = "送信する";
      uploadBtn.disabled = false;
    }
  };
});
