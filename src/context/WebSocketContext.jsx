import {
  createContext, useContext, useEffect,
  useRef, useState, useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { markNotificationRead } from '../features/dashboard/dashboardSlice';
import { toast } from 'react-toastify';

const WebSocketContext = createContext(null);

// ─── Simulated real-time events ───────────────────────────────────────────────
const SIMULATED_EVENTS = [
  { type: 'task_assigned',    delay: 12000, message: '📋 New task assigned: "Review API docs"',              sender: 'Mark Manager'  },
  { type: 'task_completed',   delay: 25000, message: '✅ Eve completed "Update color system"',               sender: 'Eve Employee'  },
  { type: 'project_update',   delay: 40000, message: '🚀 Apollo Redesign moved to In Review',                sender: 'Alice Admin'   },
  { type: 'mention',          delay: 55000, message: '💬 Mark mentioned you in "Auth Refactor"',             sender: 'Mark Manager'  },
  { type: 'deadline_warning', delay: 70000, message: '⚠️ Task "Rate limit login" due in 2 days',            sender: 'System'        },
  { type: 'new_member',       delay: 90000, message: '👋 Sara Designer joined the Engineering team',         sender: 'System'        },
  { type: 'task_completed',   delay: 110000,message: '✅ Raj completed "CI/CD pipeline setup"',             sender: 'Raj DevOps'    },
  { type: 'comment',          delay: 130000,message: '💬 New comment on "Dashboard metrics redesign"',       sender: 'Priya Product' },
];

export const WebSocketProvider = ({ children }) => {
  const dispatch    = useDispatch();
  const timersRef   = useRef([]);
  const [connected, setConnected]   = useState(false);
  const [lastEvent, setLastEvent]   = useState(null);
  const [eventLog,  setEventLog]    = useState([]);

  const emit = useCallback((event) => {
    setLastEvent(event);
    setEventLog((prev) => [{ ...event, receivedAt: new Date().toISOString() }, ...prev].slice(0, 50));

    // Show toast based on type
    const toastOptions = { autoClose: 5000, position: 'bottom-right' };
    switch (event.type) {
      case 'task_assigned':    toast.info(event.message,    toastOptions); break;
      case 'task_completed':   toast.success(event.message, toastOptions); break;
      case 'project_update':   toast.info(event.message,    toastOptions); break;
      case 'mention':          toast.warning(event.message, toastOptions); break;
      case 'deadline_warning': toast.warning(event.message, toastOptions); break;
      case 'new_member':       toast.success(event.message, toastOptions); break;
      case 'comment':          toast.info(event.message,    toastOptions); break;
      default:                 toast(event.message,         toastOptions);
    }
  }, []);

  // Start simulation
  const connect = useCallback(() => {
    setConnected(true);
    toast.success('🔌 Real-time connection established', { autoClose: 3000 });

    SIMULATED_EVENTS.forEach((event) => {
      const id = setTimeout(() => emit(event), event.delay);
      timersRef.current.push(id);
    });
  }, [emit]);

  // Stop simulation
  const disconnect = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setConnected(false);
    toast.info('🔌 Real-time connection closed', { autoClose: 3000 });
  }, []);

  // Auto-connect on mount, disconnect on unmount
  useEffect(() => {
    const id = setTimeout(connect, 2000); // 2s delay after load
    return () => {
      clearTimeout(id);
      timersRef.current.forEach(clearTimeout);
    };
  }, [connect]);

  const sendMessage = useCallback((msg) => {
    // Simulate sending — echo back after 500ms
    setTimeout(() => {
      emit({ type: 'echo', message: `Echo: ${msg}`, sender: 'You' });
    }, 500);
  }, [emit]);

  return (
    <WebSocketContext.Provider value={{
      connected, lastEvent, eventLog,
      connect, disconnect, sendMessage,
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be inside WebSocketProvider');
  return ctx;
};