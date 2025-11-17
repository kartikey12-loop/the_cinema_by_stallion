// events.js - loads events preview and supports admin create (if later enabled)
import { ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

export async function loadEventsPreview(){
  try {
    if (!window.firebaseDB) return;
    const dbRef = ref(window.firebaseDB);
    const snapshot = await get(child(dbRef, 'events'));
    const container = document.getElementById('eventsGrid') || document.getElementById('eventsList');
    if(!container) return;
    container.innerHTML = '';
    if(!snapshot.exists()) {
      container.innerHTML = '<p class="muted">No events yet.</p>';
      return;
    }
    const data = snapshot.val();
    const keys = Object.keys(data);
    keys.forEach(k => {
      const e = data[k];
      container.appendChild(eventCard(e));
    });
  } catch (e) {
    console.warn('loadEventsPreview', e);
  }
}

function eventCard(e){
  const div = document.createElement('div');
  div.className = 'card';
  const img = document.createElement('img');
  img.src = e.posterUrl || 'assets/img/poster-placeholder.jpg';
  img.alt = e.title;
  div.appendChild(img);
  const c = document.createElement('div');
  c.className = 'card-content';
  c.innerHTML = `<h3>${e.title}</h3><p class="muted">📅 ${new Date(e.date).toLocaleString()} • ${e.location || ''}</p><p>${(e.description||'').slice(0,120)}</p>`;
  div.appendChild(c);
  return div;
}

document.addEventListener('DOMContentLoaded', () => {
  loadEventsPreview();

  // Admin create form
  const createForm = document.getElementById('createEventForm');
  if(createForm){
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        title: createForm.title.value,
        date: createForm.date.value,
        location: createForm.location.value,
        posterUrl: createForm.posterUrl.value || '',
        description: createForm.description.value || '',
        createdAt: new Date().toISOString()
      };
      try {
        const eventsRef = ref(window.firebaseDB, 'events');
        const newRef = push(eventsRef);
        await set(newRef, payload);
        alert('Event created.');
        createForm.reset();
        loadEventsPreview();
      } catch (err) {
        console.error('create event failed', err);
        alert('Failed to create event.');
      }
    });
  }
});
