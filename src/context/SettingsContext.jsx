import { createContext, useContext, useState } from "react";
import { loadSettings, saveSettings as saveToStorage } from "./settings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings());

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    saveToStorage(newSettings);
  }

  const clearSettings = () => {
    setSettings(null);
    localStorage.removeItem("userSettings");
  }

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, clearSettings }}>{children}</SettingsContext.Provider>
  );
}

// eslint-disable-next-line
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
