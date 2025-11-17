// join.js - connects Join form to Realtime Database
import { push, ref, set } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joinForm');
  const status = document.getElementById('joinStatus');
  if(!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const bio = document.getElementById('bio').value.trim();

    if(!name || !email) {
      status.textContent = 'Please enter name and email.';
      return;
    }

    status.textContent = 'Saving...';

    try {
      const membersRef = ref(window.firebaseDB, 'members');
      const newRef = push(membersRef);
      await set(newRef, {
        name,
        email,
        bio,
        joinedAt: new Date().toISOString(),
        points: 0
      });
      status.textContent = 'Welcome! Your membership request has been saved.';
      form.reset();
    } catch (err) {
      console.error('Join save failed', err);
      status.textContent = 'Unable to save. Check your Firebase config and rules.';
    }
  });
});
