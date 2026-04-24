import {
  createContext, useContext, useState,
  useCallback, useEffect,
} from 'react';
import { useWebSocket } from './WebSocketContext';

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { lastEvent } = useWebSocket();
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled,  setSoundEnabled]  = useState(
    () => localStorage.getItem('ewms_sound') !== 'false'
  );

  // Convert incoming WS events → notifications
  useEffect(() => {
    if (!lastEvent) return;
    const notif = {
      id:        `n_ws_${Date.now()}`,
      type:      lastEvent.type,
      message:   lastEvent.message,
      sender:    lastEvent.sender,
      read:      false,
      time:      new Date().toISOString(),
      source:    'realtime',
    };
    setNotifications((prev) => [notif, ...prev].slice(0, 100));
  }, [lastEvent]);

  const markRead    = useCallback((id) =>
    setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n)), []);
  const markAllRead = useCallback(() =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true }))), []);
  const dismiss     = useCallback((id) =>
    setNotifications((p) => p.filter((n) => n.id !== id)), []);
  const clearAll    = useCallback(() => setNotifications([]), []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((v) => {
      localStorage.setItem('ewms_sound', String(!v));
      return !v;
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount,
      markRead, markAllRead, dismiss, clearAll,
      soundEnabled, toggleSound,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationsProvider');
  return ctx;
};