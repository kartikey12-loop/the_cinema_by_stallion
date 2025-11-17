// pwa.js - register service worker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(err => console.warn('SW register failed', err));
}

// simple load of reveal on DOM
document.addEventListener('DOMContentLoaded', () => {
  // reveal fade-in elements on load
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
});
