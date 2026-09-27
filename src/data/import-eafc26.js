// src/data/import-eafc26.js
// Browser-side importer. It keeps every source row in IndexedDB and never filters by OVR.
import { savePlayerBatch } from '../storage/indexeddb.js';

export const EAFC26_CSV_URL = 'https://raw.githubusercontent.com/ismailoksuz/EAFC26-DataHub/main/data/players.csv';

function parseCSVLine(line) {
  const out = [];
  let value = '', quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') { value += '"'; i += 1; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { out.push(value); value = ''; }
    else value += ch;
  }
  out.push(value);
  return out;
}

function normalize(headers, cells, rowNumber) {
  const raw = {};
  headers.forEach((header, index) => { raw[header] = cells[index] ?? ''; });
  const id = raw.ID || raw.id || raw.player_id || `source-row-${rowNumber}`;
  return {
    id: String(id),
    姓名: raw.Name || raw.name || raw.long_name || '',
    年龄: Number(raw.Age || raw.age) || null,
    OVR: Number(raw.Overall || raw.OVR || raw.overall) || null,
    位置: raw.Position || raw.position || '',
    所属俱乐部: raw.Club || raw.club || raw.Team || raw.team || '',
    raw,
    sourceRow: rowNumber
  };
}

export async function importEAFC26CSV({ url = EAFC26_CSV_URL, batchSize = 250 } = {}) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`数据源请求失败：${response.status}`);
  const text = await response.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) throw new Error('CSV 为空');
  const headers = parseCSVLine(lines[0]).map(h => h.trim());
  let imported = 0, failed = 0, duplicates = 0;
  const seen = new Set();
  let batch = [];
  for (let i = 1; i < lines.length; i += 1) {
    try {
      const player = normalize(headers, parseCSVLine(lines[i]), i + 1);
      if (seen.has(player.id)) duplicates += 1;
      seen.add(player.id);
      batch.push(player);
      if (batch.length >= batchSize) {
        await savePlayerBatch(batch);
        imported += batch.length;
        batch = [];
      }
    } catch (error) { failed += 1; }
  }
  if (batch.length) { await savePlayerBatch(batch); imported += batch.length; }
  return { source: url, sourceRows: lines.length - 1, imported, failed, duplicates, uniqueIds: seen.size };
}
