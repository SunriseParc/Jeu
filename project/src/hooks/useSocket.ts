import { useEffect } from 'react';
import { socketService } from '../services/socketService';
import { useGameStore } from '../store/gameStore';

export function useSocket() {
  const { setPhase, updateSettings, addPlayer, removePlayer, updatePlayer } = useGameStore();

  useEffect(() => {
    const unsubGameState = socketService.onGameStateUpdate((state) => {
      updateSettings(state.settings);
      state.players.forEach((player: any) => {
        addPlayer(player);
      });
    });

    const unsubMeeting = socketService.onMeetingCalled(() => {
      setPhase('meeting');
    });

    const unsubGameOver = socketService.onGameOver((winners) => {
      setPhase('victory');
    });

    return () => {
      unsubGameState();
      unsubMeeting();
      unsubGameOver();
    };
  }, [setPhase, updateSettings, addPlayer, removePlayer, updatePlayer]);

  return socketService;
}