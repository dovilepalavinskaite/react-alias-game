import localforage from "localforage";

const store = localforage.createInstance({ name: "alias-words" });

export async function loadPack(url) {
  const cached = await store.getItem(url);
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!cached || cached.version !== data.version) {
      await store.setItem(url, data);
    }
    return data.words;
  } catch (err) {
    if (cached) return cached.words;
    throw err;
  }
}