import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export default function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within a SocketProvider');
  return ctx;
}
