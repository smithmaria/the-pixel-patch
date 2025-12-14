export function loadSettings() {
  const raw = localStorage.getItem('userSettings');
  if (!raw) return {
    playerName: null
  };
  try { 
    return JSON.parse(raw); 
  } catch { 
    return null; 
  }
}

export function saveSettings(settings) {
  localStorage.setItem('userSettings', JSON.stringify(settings));
}
