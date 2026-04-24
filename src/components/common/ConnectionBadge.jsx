import { useWebSocket } from '../../context/WebSocketContext';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionBadge = () => {
  const { connected, connect, disconnect } = useWebSocket();

  return (
    <button
      onClick={connected ? disconnect : connect}
      title={connected ? 'Click to disconnect' : 'Click to reconnect'}
      className={`
        flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        transition-all duration-200 border
        ${connected
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
        }
      `}
    >
      {connected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live
        </>
      ) : (
        <>
          <WifiOff size={11} />
          Offline
        </>
      )}
    </button>
  );
};

export default ConnectionBadge;