// =====================================================================
// 🔌 【通信レイヤー】js/api.js
// GASのWebアプリとのすべての通信（fetch）をここに集約します
// =====================================================================

// ★ 取得したGASのウェブアプリのURLに書き換えてください
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbws79uadE4f7fyzZmxd7HuDEEhYqCu6YIsDpGlpg8YZ6jflck4J2OpRXpBuTT8cMfM/exec";

/**
 * 1. ゲスト名簿を取得する
 */
export async function fetchGuests() {
  try {
    const res = await fetch(`${GAS_WEB_APP_URL}?action=get_guests`, {
      method: "GET",
      redirect: "follow"
    });
    const data = await res.json();
    if (data.success) {
      return data.guests;
    }
    throw new Error("ゲスト名簿の取得に失敗しました");
  } catch (err) {
    console.error("fetchGuests Error:", err);
    return {};
  }
}

/**
 * 2. ユーザー固有の送信履歴をサーバーから取得する
 */
export async function fetchUserHistory(tableNo, userName) {
  try {
    if (!tableNo || !userName) return [];
    const res = await fetch(`${GAS_WEB_APP_URL}?action=get_history&table=${encodeURIComponent(tableNo)}&name=${encodeURIComponent(userName)}`, {
      method: "GET",
      redirect: "follow"
    });
    const data = await res.json();
    return data.success ? data.history : [];
  } catch (err) {
    console.error("fetchUserHistory Error:", err);
    return [];
  }
}

/**
 * 3. アプリ設定（サイネージ利用フラグなど）を取得する
 */
export async function fetchAppSettings() {
  try {
    const res = await fetch(`${GAS_WEB_APP_URL}?action=get_settings`, {
      method: "GET",
      redirect: "follow"
    });
    const data = await res.json();
    return data.success ? data.settings : { signageEnabled: true };
  } catch (err) {
    console.error("fetchAppSettings Error:", err);
    return { signageEnabled: true };
  }
}

/**
 * 4. 写真をバッチ（チャンク）単位でアップロードする
 */
export async function uploadPhotoChunk(chunkData, tableNo, userName, userMessage, targetFolderId) {
  const payload = {
    chunk: chunkData,
    tableNo: tableNo,
    userName: userName,
    userMessage: userMessage,
    targetFolderId: targetFolderId
  };

  const res = await fetch(GAS_WEB_APP_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`通信エラー (${res.status})`);
  return await res.json();
}

/**
 * 5. 問い合わせを送信する
 */
export async function sendInquiry(tableNo, userName, userMessage) {
  const payload = {
    type: "inquiry",
    tableNo: tableNo,
    userName: userName,
    userMessage: userMessage
  };

  const res = await fetch(GAS_WEB_APP_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

/**
 * 6. 管理画面から設定（サイネージのON/OFFなど）を保存する
 */
export async function updateAppSettings(settings) {
  const payload = {
    action: "update_settings",
    ...settings
  };

  const res = await fetch(GAS_WEB_APP_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}
