// ==UserScript==
// @name         Apple Music — Add to Multiple Playlists
// @namespace    https://music.apple.com
// @version      1.1.2
// @description  Adds a button to songs that opens a playlist picker, letting you add a song to multiple playlists at once.
// @author       You
// @match        https://music.apple.com/*
// @match        https://music.apple.com/us/*
// @include      https://music.apple.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #amp-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.45);
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    }
    #amp-popup {
      background: #1c1c1e;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px;
      padding: 0;
      width: 340px;
      max-width: 92vw;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.6);
      animation: amp-pop 0.18s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes amp-pop {
      from { transform: scale(0.88); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }

    #amp-playlist-list {
      list-style: none;
      margin: 0;
      padding: 8px 0;
      max-height: 280px;
      overflow-y: auto;
    }
    #amp-playlist-list::-webkit-scrollbar { width: 4px; }
    #amp-playlist-list::-webkit-scrollbar-track { background: transparent; }
    #amp-playlist-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
    .amp-playlist-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 18px;
      cursor: pointer;
      transition: background 0.1s;
    }
    .amp-playlist-item:hover { background: rgba(255,255,255,0.06); }
    .amp-playlist-item input[type="checkbox"] {
      width: 17px;
      height: 17px;
      accent-color: #fc3c44;
      flex-shrink: 0;
      cursor: pointer;
    }
    .amp-playlist-label {
      font-size: 14px;
      color: rgba(255,255,255,0.88);
      flex: 1;
      user-select: none;
    }
    #amp-popup-footer {
      padding: 12px 18px 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    #amp-select-all-btn {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      flex: 1;
      text-align: left;
    }
    #amp-select-all-btn:hover { color: rgba(255,255,255,0.7); }
    #amp-cancel-btn {
      font-size: 14px;
      font-weight: 500;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.1s;
    }
    #amp-cancel-btn:hover { background: rgba(255,255,255,0.14); }
    #amp-add-btn {
      font-size: 14px;
      font-weight: 600;
      background: #fc3c44;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 20px;
      cursor: pointer;
      transition: background 0.1s, transform 0.1s;
    }
    #amp-add-btn:hover { background: #e0353c; }
    #amp-add-btn:active { transform: scale(0.97); }
    #amp-add-btn:disabled { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.3); cursor: not-allowed; }
    .amp-trigger-btn {
      background: none !important;
      border: none !important;
      cursor: pointer !important;
      padding: 0 4px !important;
      border-radius: 4px !important;
      color: rgba(255,255,255,0.4) !important;
      font-size: 11px !important;
      font-family: inherit !important;
      font-weight: 600 !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 2px !important;
      white-space: nowrap !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      flex-shrink: 0 !important;
      width: 22px !important;
      height: 22px !important;
      justify-content: center !important;
    }
    .amp-trigger-btn:hover {
      background: rgba(252,60,68,0.2) !important;
      color: #fc3c44 !important;
    }
    #amp-status-bar {
      font-size: 12px;
      padding: 6px 18px 0;
      min-height: 18px;
      color: rgba(255,255,255,0.4);
    }
    #amp-status-bar.success { color: #34c759; }
    #amp-status-bar.error   { color: #ff453a; }
    #amp-popup-header {
      padding: 14px 16px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #amp-header-art {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255,255,255,0.08);
    }
    #amp-header-text { flex: 1; min-width: 0; }
    #amp-popup-song-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #amp-popup-artist-name {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #amp-popup-title {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.3);
      margin: 4px 0 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    #amp-search-bar {
      padding: 8px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    #amp-search-input {
      width: 100%;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      color: #fff;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
    }
    #amp-search-input::placeholder { color: rgba(255,255,255,0.3); }
    #amp-search-input:focus { border-color: rgba(252,60,68,0.5); }
    .amp-playlist-art {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255,255,255,0.08);
    }
    .amp-playlist-item-hidden { display: none !important; }
    #amp-memory-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
      color: rgba(255,255,255,0.4);
    }
    #amp-memory-label { display: flex; align-items: center; gap: 6px; }
    #amp-memory-toggle {
      position: relative;
      width: 32px;
      height: 18px;
      flex-shrink: 0;
    }
    #amp-memory-toggle input { opacity: 0; width: 0; height: 0; }
    #amp-memory-slider {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.15);
      border-radius: 9px;
      cursor: pointer;
      transition: background 0.2s;
    }
    #amp-memory-slider:before {
      content: '';
      position: absolute;
      width: 13px;
      height: 13px;
      left: 2.5px;
      top: 2.5px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    #amp-memory-toggle input:checked + #amp-memory-slider { background: #fc3c44; }
    #amp-memory-toggle input:checked + #amp-memory-slider:before { transform: translateX(14px); }
  `;
  document.head.appendChild(style);

  // ─── Playlist cache ──────────────────────────────────────────────────────────
  let _playlistCache = null;
  async function getPlaylists() {
    if (_playlistCache) return _playlistCache;
    const playlists = await fetchPlaylists();
    _playlistCache = playlists.map(p => {
      const art = p.attributes && p.attributes.artwork;
      const artUrl = art ? art.url.replace('{w}', '64').replace('{h}', '64') : null;
      return { id: p.id, name: p.attributes.name, artUrl };
    });
    return _playlistCache;
  }

  // ─── Memory helpers ───────────────────────────────────────────────────────────
  function isMemoryEnabled() {
    try { return localStorage.getItem('amp_memory_enabled') !== 'false'; } catch { return true; }
  }
  function setMemoryEnabled(val) {
    try { localStorage.setItem('amp_memory_enabled', val ? 'true' : 'false'); } catch {}
  }
  function getLastSelected() {
    try {
      const saved = localStorage.getItem('amp_last_selected');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }
  function saveLastSelected(ids) {
    try { localStorage.setItem('amp_last_selected', JSON.stringify(ids)); } catch {}
  }

  // ─── Popup ──────────────────────────────────────────────────────────────────
  async function openPopup(songName, songId, artUrl, artistName) {
    // Remove existing popup
    const existing = document.getElementById('amp-popup-overlay');
    if (existing) existing.remove();

    // Show loading state immediately
    const overlay = document.createElement('div');
    overlay.id = 'amp-popup-overlay';
    overlay.innerHTML = `
      <div id="amp-popup" role="dialog" aria-modal="true" aria-label="Add to playlists">
        <div id="amp-popup-header">
          ${artUrl ? `<img id="amp-header-art" src="${escHtml(artUrl)}" alt="">` : '<div id="amp-header-art"></div>'}
          <div id="amp-header-text">
            <p id="amp-popup-song-name">${escHtml(songName || 'Selected song')}</p>
            <p id="amp-popup-artist-name">${escHtml(artistName || '')}</p>
            <p id="amp-popup-title">Add to playlists</p>
          </div>
        </div>
        <div id="amp-search-bar">
          <input id="amp-search-input" type="text" placeholder="Search playlists…" autocomplete="off">
        </div>
        <ul id="amp-playlist-list">
          <li class="amp-playlist-item" style="color:rgba(255,255,255,0.4);font-size:13px;">Loading playlists…</li>
        </ul>
        <div id="amp-status-bar"></div>
        <div id="amp-popup-footer">
          <button id="amp-select-all-btn">Select all</button>
          <button id="amp-cancel-btn">Cancel</button>
          <button id="amp-add-btn" disabled>Add</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Cancel / close
    overlay.querySelector('#amp-cancel-btn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
    });

    // Fetch playlists from API
    let playlists;
    try {
      playlists = await getPlaylists();
    } catch(e) {
      overlay.querySelector('#amp-playlist-list').innerHTML =
        '<li class="amp-playlist-item" style="color:#ff453a;font-size:13px;">Failed to load playlists</li>';
      return;
    }

    // Render memory toggle bar
    const memEnabled = isMemoryEnabled();
    const lastSelected = getLastSelected();
    const memBar = document.createElement('div');
    memBar.id = 'amp-memory-bar';
    memBar.innerHTML = `
      <span id="amp-memory-label">Remember last selection</span>
      <label id="amp-memory-toggle">
        <input type="checkbox" id="amp-memory-check" ${memEnabled ? 'checked' : ''}>
        <span id="amp-memory-slider"></span>
      </label>
    `;
    overlay.querySelector('#amp-playlist-list').before(memBar);
    overlay.querySelector('#amp-memory-check').addEventListener('change', e => {
      setMemoryEnabled(e.target.checked);
    });

    // Render playlist checkboxes, auto-checking last selected if memory is on
    overlay.querySelector('#amp-playlist-list').innerHTML = playlists.map((pl, i) => {
      const wasSelected = memEnabled && lastSelected.includes(pl.id);
      const artImg = pl.artUrl
        ? `<img class="amp-playlist-art" src="${escHtml(pl.artUrl)}" alt="">`
        : `<div class="amp-playlist-art"></div>`;
      return `
        <li class="amp-playlist-item" data-index="${i}" data-name="${escHtml(pl.name.toLowerCase())}">
          <input type="checkbox" id="amp-pl-${i}" data-id="${escHtml(pl.id)}" data-name="${escHtml(pl.name)}" ${wasSelected ? 'checked' : ''}>
          <label class="amp-playlist-label" for="amp-pl-${i}">${escHtml(pl.name)}</label>
          ${artImg}
        </li>
      `;
    }).join('');

    // Search bar filtering
    overlay.querySelector('#amp-search-input').addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      overlay.querySelectorAll('#amp-playlist-list .amp-playlist-item').forEach(li => {
        const name = li.dataset.name || '';
        li.classList.toggle('amp-playlist-item-hidden', q.length > 0 && !name.includes(q));
      });
    });

    // Only target playlist checkboxes, not the memory toggle
    const checkboxes = overlay.querySelectorAll('#amp-playlist-list input[type="checkbox"]');
    const addBtn = overlay.querySelector('#amp-add-btn');
    const statusBar = overlay.querySelector('#amp-status-bar');

    function updateAddBtn() {
      const count = [...checkboxes].filter(c => c.checked).length;
      addBtn.disabled = count === 0;
      addBtn.textContent = count > 0 ? `Add to ${count}` : 'Add';
    }
    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateAddBtn);
      cb.closest('li').addEventListener('click', e => {
        if (e.target !== cb) { cb.checked = !cb.checked; updateAddBtn(); }
      });
    });

    // Run once on open so pre-checked boxes from memory enable the Add button immediately
    updateAddBtn();

    // Select all
    overlay.querySelector('#amp-select-all-btn').addEventListener('click', () => {
      const allChecked = [...checkboxes].every(c => c.checked);
      checkboxes.forEach(c => c.checked = !allChecked);
      overlay.querySelector('#amp-select-all-btn').textContent = allChecked ? 'Select all' : 'Deselect all';
      updateAddBtn();
    });

    // Add button
    addBtn.addEventListener('click', async () => {
      const selected = [...checkboxes].filter(c => c.checked).map(c => ({ id: c.dataset.id, name: c.dataset.name }));
      addBtn.disabled = true;
      addBtn.textContent = 'Adding…';
      statusBar.className = '';
      statusBar.textContent = '';

      // Save selection to memory if enabled
      if (isMemoryEnabled()) {
        saveLastSelected(selected.map(pl => pl.id));
      }

      let successes = 0, failures = [];
      for (const pl of selected) {
        try {
          await addToPlaylist(pl.id, songId);
          successes++;
        } catch (e) {
          failures.push(pl.name);
        }
        await sleep(300);
      }

      if (failures.length === 0) {
        statusBar.className = 'success';
        statusBar.textContent = `✓ Added to ${successes} playlist${successes !== 1 ? 's' : ''}`;
        setTimeout(() => overlay.remove(), 1200);
      } else {
        statusBar.className = 'error';
        statusBar.textContent = `Added ${successes}, failed: ${failures.join(', ')}`;
        addBtn.textContent = 'Retry';
        addBtn.disabled = false;
      }
    });
  }

  // ─── Core: add to a playlist via Apple Music API ─────────────────────────────
  async function addToPlaylist(playlistId, songId) {
    const mk = window.MusicKit.getInstance();
    const result = await fetch(`https://amp-api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mk.developerToken}`,
        'Music-User-Token': mk.musicUserToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [{ id: songId, type: 'songs' }] })
    });
    if (result.status !== 204 && result.status !== 200) {
      throw new Error(`Failed with status ${result.status}`);
    }
  }

  // Get all playlists from the API
  async function fetchPlaylists() {
    const mk = window.MusicKit.getInstance();
    const result = await mk.api.get('/v1/me/library/playlists', { limit: 100 });
    return result.json.data;
  }

  // Get song ID from a row element
  function getSongIdFromRow(row) {
    const link = row.querySelector('a[href*="/song/"]');
    if (!link) return null;
    const parts = link.href.split('/');
    return parts[parts.length - 1];
  }

  // ─── Inject trigger buttons into song rows ──────────────────────────────────
  function injectButtons() {
    const rows = document.querySelectorAll('.songs-list-row:not([data-amp-injected])');

    rows.forEach(row => {
      row.dataset.ampInjected = '1';

      // Get song name from the correct element
      const nameEl = row.querySelector('.songs-list-row__song-name');
      const songName = nameEl ? nameEl.textContent.trim() : '';

      // Inject into the controls area (right side of the row, next to the "..." button)
      const actionsArea = row.querySelector('.songs-list-row__controls');
      if (!actionsArea) return;

      const btn = document.createElement('button');
      btn.className = 'amp-trigger-btn';
      btn.setAttribute('title', 'Add to multiple playlists');
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="1.5" width="9" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="0" y="5" width="9" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="0" y="8.5" width="6" height="1.5" rx="0.75" fill="currentColor"/>
          <rect x="10.25" y="8" width="1.5" height="5" rx="0.75" fill="currentColor"/>
          <rect x="8" y="10.25" width="5" height="1.5" rx="0.75" fill="currentColor"/>
        </svg>
      `;

      btn.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        const songId = getSongIdFromRow(row);
        // Grab art from srcset since Apple Music lazy-loads the actual src
        const artSource = row.querySelector('.artwork-component picture source');
        let artUrl = null;
        if (artSource && artSource.srcset) {
          artUrl = artSource.srcset.split(',')[0].trim().split(' ')[0];
        }
        const artistEl = row.querySelector('.songs-list-row__by-line a, .songs-list__col--secondary a');
        const artistName = artistEl ? artistEl.textContent.trim() : '';
        openPopup(songName, songId, artUrl, artistName);
      });

      // Force controls container wide enough to show our button
      actionsArea.style.setProperty('width', 'auto', 'important');
      actionsArea.style.setProperty('min-width', '160px', 'important');
      actionsArea.style.setProperty('overflow', 'visible', 'important');
      actionsArea.style.setProperty('display', 'flex', 'important');
      actionsArea.style.setProperty('align-items', 'center', 'important');
      actionsArea.style.setProperty('gap', '4px', 'important');

      // Insert between the time and the "..." menu
      const contextMenuBtn = actionsArea.querySelector('.songs-list-row__context-menu');
      if (contextMenuBtn) {
        actionsArea.insertBefore(btn, contextMenuBtn);
      } else {
        actionsArea.appendChild(btn);
      }
    });
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── Observer: re-inject when new rows appear (SPA navigation) ─────────────
  let injectTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(injectTimer);
    injectTimer = setTimeout(injectButtons, 300);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Wait for rows to exist before first inject
  function waitForRows() {
    const rows = document.querySelectorAll('.songs-list-row');
    if (rows.length > 0) {
      injectButtons();
    } else {
      setTimeout(waitForRows, 500);
    }
  }
  waitForRows();

})();