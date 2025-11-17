// leaderboard.js - reads 'members' from Realtime Database and displays top by points
import { get, ref } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

async function loadLeaderboard(){
  const container = document.getElementById('leaderboard') || document.getElementById('leaderboardPreview');
  if(!container || !window.firebaseDB) return;
  container.innerHTML = '';
  try {
    const snapshot = await get(ref(window.firebaseDB, 'members'));
    if(!snapshot.exists()) {
      container.innerHTML = '<p class="muted">No members yet.</p>';
      return;
    }
    const data = snapshot.val();
    const arr = Object.keys(data).map(k => ({ uid:k, ...data[k] }));
    arr.sort((a,b) => (b.points||0) - (a.points||0));
    arr.slice(0,12).forEach((m, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      const rank = idx+1;
      const gold = rank === 1 ? 'background: linear-gradient(90deg,#ffe89c,#ffd24a); color:#0b0b0b;' : '';
      card.innerHTML = `<div class="card-content" style="${gold}"><h3>${rank}. ${m.name || m.email}</h3><p class="muted">Points: ${m.points || 0}</p></div>`;
      container.appendChild(card);
    });
  } catch (e) {
    console.warn('loadLeaderboard', e);
    container.innerHTML = '<p class="muted">Unable to load leaderboard.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => loadLeaderboard());
export { loadLeaderboard };
