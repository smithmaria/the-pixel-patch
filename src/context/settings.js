export function loadSettings() {
  const raw = localStorage.getItem('user.settings');
  if (!raw) return null;
  try { 
    return JSON.parse(raw); 
  } catch { 
    return null; 
  }
}

export function saveSettings(settings) {
  localStorage.setItem('user.settings', JSON.stringify(settings));
}
