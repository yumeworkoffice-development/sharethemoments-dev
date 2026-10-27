// =====================================================================
// 📤 【アップロードモジュール】js/uploader.js
// =====================================================================

import { uploadPhotoChunk } from './api.js';

export async function compressImages(files) {
  const compressedItems = [];
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;
  const QUALITY = 0.8;

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const base64Data = await resizeImageToDataURL(file, MAX_WIDTH, MAX_HEIGHT, QUALITY);
    compressedItems.push({
      fileName: file.name || `photo_${Date.now()}.jpg`,
      base64Data: base64Data
    });
  }
  return compressedItems;
}

function resizeImageToDataURL(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadPhotosInChunks(compressedItems, tableNo, userName, userMessage, onProgress) {
  const CHUNK_SIZE = 3;
  let targetFolderId = null;

  for (let i = 0; i < compressedItems.length; i += CHUNK_SIZE) {
    const chunk = compressedItems.slice(i, i + CHUNK_SIZE);
    if (onProgress) onProgress(i + 1, compressedItems.length);

    const res = await uploadPhotoChunk(chunk, tableNo, userName, userMessage, targetFolderId);
    if (!res.success) throw new Error("写真のアップロードに失敗しました");
    targetFolderId = res.folderId;
  }
  return true;
}
