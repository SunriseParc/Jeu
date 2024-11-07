import { io, Socket } from 'socket.io-client';
import { GameSettings, Player } from '../types/game';

class SocketService {
  public socket: Socket;
  private static instance: SocketService;

  private constructor() {
    this.socket = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    this.setupEventHandlers();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to server with ID:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });
  }

  public joinGame(name: string, isGameMaster: boolean) {
    this.socket.emit('join', { name, isGameMaster });
  }

  public leaveGame() {
    this.socket.emit('leave');
  }

  public kickPlayer(playerId: string) {
    this.socket.emit('kickPlayer', playerId);
  }

  public updateSettings(settings: Partial<GameSettings>) {
    this.socket.emit('updateSettings', settings);
  }

  public startGame() {
    this.socket.emit('startGame');
  }

  public completeTask(taskIndex: number) {
    this.socket.emit('completeTask', taskIndex);
  }

  public killPlayer(targetId: string) {
    this.socket.emit('kill', targetId);
  }

  public sabotage(type: string) {
    this.socket.emit('sabotage', type);
  }

  public callMeeting() {
    this.socket.emit('meeting');
  }

  public vote(targetId: string | null) {
    this.socket.emit('vote', targetId);
  }

  public playAgain() {
    this.socket.emit('playAgain');
  }

  public onGameStateUpdate(callback: (state: any) => void) {
    this.socket.on('gameState', callback);
    return () => this.socket.off('gameState', callback);
  }

  public onMeetingCalled(callback: () => void) {
    this.socket.on('meetingCalled', callback);
    return () => this.socket.off('meetingCalled', callback);
  }

  public onVoteResults(callback: (results: any) => void) {
    this.socket.on('voteResults', callback);
    return () => this.socket.off('voteResults', callback);
  }

  public onGameOver(callback: (winners: 'impostor' | 'staff') => void) {
    this.socket.on('gameOver', callback);
    return () => this.socket.off('gameOver', callback);
  }
}

export const socketService = SocketService.getInstance();