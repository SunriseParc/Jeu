import { create } from 'zustand';
import { GameState, GameSettings, Player } from '../types/game';

interface GameStore extends GameState {
  updateSettings: (settings: Partial<GameSettings>) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setPhase: (phase: GameState['phase']) => void;
  resetGame: () => void;
}

const initialSettings: GameSettings = {
  impostorCount: 1,
  tasksPerPlayer: 3,
  killCooldown: 30,
  sabotageCooldown: 45,
  meetingDuration: 120,
  availableTasks: [
    'Make the bed in room 101',
    'Clean the lobby windows',
    'Replace towels in room 203',
    'Check the boiler room',
    'Vacuum the hallway',
    'Restock the mini bar in room 304',
    'Clean the pool',
    'Empty trash bins',
    'Dust the chandeliers',
    'Polish silverware in kitchen'
  ]
};

export const useGameStore = create<GameStore>((set) => ({
  phase: 'lobby',
  players: [],
  settings: initialSettings,
  totalTasksCompleted: 0,
  lastActivity: '',

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player]
    })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId)
    })),

  updatePlayer: (playerId, updates) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, ...updates } : p
      )
    })),

  setPhase: (phase) => set({ phase }),

  resetGame: () =>
    set({
      phase: 'lobby',
      players: [],
      settings: initialSettings,
      totalTasksCompleted: 0,
      lastActivity: ''
    })
}));