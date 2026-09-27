// src/storage/indexeddb.js
// Simple IndexedDB wrapper for storing player static data and runtime diffs.
// API: openDB(), savePlayerBatch(players), getPlayer(id), getPlayersByTeam(teamId), clearPlayers()

const DB_NAME = 'fm_game_db_v1';
const DB_VERSION = 1;
const PLAYERS_STORE = 'players';
const DIFFS_STORE = 'diffs';

function openDB(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = e => reject(e.target.error);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if(!db.objectStoreNames.contains(PLAYERS_STORE)){
        const store = db.createObjectStore(PLAYERS_STORE, { keyPath: 'id' });
        store.createIndex('team', '所属俱乐部', { unique: false });
      }
      if(!db.objectStoreNames.contains(DIFFS_STORE)){
        db.createObjectStore(DIFFS_STORE, { keyPath: 'slotId' });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
  });
}

async function savePlayerBatch(players){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLAYERS_STORE], 'readwrite');
    const store = tx.objectStore(PLAYERS_STORE);
    for(const p of players){
      store.put(p);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = e => reject(e.target.error);
  });
}

async function getPlayer(id){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLAYERS_STORE], 'readonly');
    const store = tx.objectStore(PLAYERS_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPlayersByTeam(teamId){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLAYERS_STORE], 'readonly');
    const store = tx.objectStore(PLAYERS_STORE);
    const idx = store.index('team');
    const req = idx.getAll(teamId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function clearPlayers(){
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([PLAYERS_STORE], 'readwrite');
    const store = tx.objectStore(PLAYERS_STORE);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export { openDB, savePlayerBatch, getPlayer, getPlayersByTeam, clearPlayers };
