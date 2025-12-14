import { useSettings } from "../context/SettingsContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { settings } = useSettings();

  if (!settings?.playerName) {
    return <Navigate to='/?showModal=true' replace />
  }

  return children;
}