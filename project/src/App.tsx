import React, { useEffect, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import AdminScreen from './components/admin/AdminScreen';
import LobbyScreen from './components/lobby/LobbyScreen';
import ImpostorScreen from './components/game/ImpostorScreen';
import StaffScreen from './components/game/StaffScreen';
import MeetingScreen from './components/game/MeetingScreen';
import VictoryScreen from './components/game/VictoryScreen';
import { useGameStore } from './store/gameStore';
import { useSocket } from './hooks/useSocket';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const { players, phase } = useGameStore();
  const socketService = useSocket();
  const currentPlayer = players.find(p => p.id === socketService.socket.id);

  const handleJoin = (name: string, isGameMaster: boolean) => {
    socketService.joinGame(name, isGameMaster);
    setCurrentScreen(isGameMaster ? 'admin' : 'lobby');
  };

  const handleBack = () => {
    socketService.leaveGame();
    setCurrentScreen('login');
  };

  const handleStartGame = () => {
    socketService.startGame();
    setCurrentScreen('game');
  };

  const handlePlayAgain = () => {
    socketService.playAgain();
    setCurrentScreen('login');
  };

  if (!socketService.socket.connected) {
    return (
      <div className="min-h-screen bg-amber-900 flex items-center justify-center">
        <p className="text-white text-xl">Connecting to server...</p>
      </div>
    );
  }

  if (phase === 'meeting') {
    return <MeetingScreen />;
  }

  if (phase === 'victory') {
    return (
      <VictoryScreen
        isImpostorVictory={players.some(p => p.role === 'impostor' && p.status === 'alive')}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  switch (currentScreen) {
    case 'login':
      return <LoginScreen onJoin={handleJoin} />;
    case 'admin':
      return <AdminScreen onBack={handleBack} onStartGame={handleStartGame} />;
    case 'lobby':
      return <LobbyScreen onBack={handleBack} />;
    case 'game':
      if (currentPlayer?.role === 'impostor') {
        return <ImpostorScreen />;
      }
      if (currentPlayer?.role === 'staff') {
        return <StaffScreen />;
      }
      return null;
    default:
      return <div>Loading...</div>;
  }
}

export default App;