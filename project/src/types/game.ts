export type PlayerRole = 'impostor' | 'staff';
export type PlayerStatus = 'alive' | 'dead';
export type GamePhase = 'lobby' | 'playing' | 'meeting' | 'victory';

export interface Player {
  id: string;
  name: string;
  role?: PlayerRole;
  status: PlayerStatus;
  tasks: string[];
  completedTasks: number;
  killCooldown?: number;
  sabotageCooldown?: number;
}

export interface GameSettings {
  impostorCount: number;
  tasksPerPlayer: number;
  killCooldown: number;
  sabotageCooldown: number;
  meetingDuration: number;
  availableTasks: string[];
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  settings: GameSettings;
  totalTasksCompleted: number;
  lastActivity: string;
  sabotageActive?: {
    type: string;
    timeLeft: number;
  };
}