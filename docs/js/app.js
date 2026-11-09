// Shared by every page: offline caching and keeping the screen awake.
(function () {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('Service worker registration failed', err);
      });
    });
  }

  // Ask the screen not to sleep while the exhibit is showing (iPadOS 16.4+).
  // Setting Auto-Lock to Never on the iPad is still recommended.
  let wakeLock = null;
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      // Not supported or not allowed; ignore.
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') requestWakeLock();
  });
  requestWakeLock();
})();
