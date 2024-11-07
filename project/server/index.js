import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

const gameState = {
  players: [],
  settings: {
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
  },
  phase: 'lobby',
  totalTasksCompleted: 0,
  lastActivity: '',
  sabotageActive: null,
  votes: new Map()
};

function assignRoles() {
  const players = [...gameState.players];
  const impostorCount = Math.min(gameState.settings.impostorCount, Math.floor(players.length / 2));
  
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }

  players.forEach((player, index) => {
    player.role = index < impostorCount ? 'impostor' : 'staff';
    player.status = 'alive';
    player.tasks = gameState.settings.availableTasks
      .sort(() => Math.random() - 0.5)
      .slice(0, gameState.settings.tasksPerPlayer);
    player.completedTasks = 0;
    player.killCooldown = 0;
    player.sabotageCooldown = 0;
  });

  gameState.players = players;
}

function checkGameEnd() {
  const alivePlayers = gameState.players.filter(p => p.status === 'alive');
  const aliveImpostors = alivePlayers.filter(p => p.role === 'impostor').length;
  const aliveStaff = alivePlayers.filter(p => p.role === 'staff').length;
  
  if (aliveImpostors === 0) {
    gameState.phase = 'victory';
    io.emit('gameOver', 'staff');
    return true;
  }
  
  if (aliveImpostors >= aliveStaff) {
    gameState.phase = 'victory';
    io.emit('gameOver', 'impostor');
    return true;
  }

  const totalTasks = gameState.players.filter(p => p.role === 'staff').length * gameState.settings.tasksPerPlayer;
  if (gameState.totalTasksCompleted >= totalTasks) {
    gameState.phase = 'victory';
    io.emit('gameOver', 'staff');
    return true;
  }

  return false;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ name, isGameMaster }) => {
    if (gameState.phase !== 'lobby') {
      socket.emit('error', 'Game is already in progress');
      return;
    }

    const player = {
      id: socket.id,
      name,
      isGameMaster,
      status: 'alive',
      tasks: [],
      completedTasks: 0
    };
    gameState.players.push(player);
    io.emit('gameState', gameState);
  });

  socket.on('leave', () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    io.emit('gameState', gameState);
  });

  socket.on('updateSettings', (settings) => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (player?.isGameMaster) {
      gameState.settings = { ...gameState.settings, ...settings };
      io.emit('gameState', gameState);
    }
  });

  socket.on('startGame', () => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (player?.isGameMaster && gameState.players.length >= 4) {
      assignRoles();
      gameState.phase = 'playing';
      gameState.totalTasksCompleted = 0;
      gameState.sabotageActive = null;
      gameState.votes.clear();
      io.emit('gameState', gameState);
    }
  });

  socket.on('completeTask', (taskIndex) => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (player && player.role === 'staff' && taskIndex === player.completedTasks) {
      player.completedTasks++;
      gameState.totalTasksCompleted++;
      io.emit('gameState', gameState);
      checkGameEnd();
    }
  });

  socket.on('kill', (targetId) => {
    const killer = gameState.players.find(p => p.id === socket.id);
    const target = gameState.players.find(p => p.id === targetId);
    
    if (killer?.role === 'impostor' && killer.killCooldown === 0 && target?.status === 'alive') {
      target.status = 'dead';
      killer.killCooldown = gameState.settings.killCooldown;
      io.emit('gameState', gameState);
      checkGameEnd();
    }
  });

  socket.on('sabotage', (type) => {
    const impostor = gameState.players.find(p => p.id === socket.id);
    if (impostor?.role === 'impostor' && impostor.sabotageCooldown === 0 && !gameState.sabotageActive) {
      gameState.sabotageActive = { type, timeLeft: 30000 };
      impostor.sabotageCooldown = gameState.settings.sabotageCooldown;
      io.emit('gameState', gameState);
    }
  });

  socket.on('meeting', () => {
    if (gameState.phase === 'playing') {
      gameState.phase = 'meeting';
      gameState.votes.clear();
      io.emit('meetingCalled');
    }
  });

  socket.on('vote', (targetId) => {
    const voter = gameState.players.find(p => p.id === socket.id);
    if (voter?.status === 'alive' && gameState.phase === 'meeting') {
      gameState.votes.set(socket.id, targetId);
      
      if (gameState.votes.size === gameState.players.filter(p => p.status === 'alive').length) {
        const voteCount = new Map();
        for (const votedId of gameState.votes.values()) {
          if (votedId) {
            voteCount.set(votedId, (voteCount.get(votedId) || 0) + 1);
          }
        }
        
        let maxVotes = 0;
        let ejectedId = null;
        for (const [id, votes] of voteCount.entries()) {
          if (votes > maxVotes) {
            maxVotes = votes;
            ejectedId = id;
          }
        }
        
        if (ejectedId) {
          const ejectedPlayer = gameState.players.find(p => p.id === ejectedId);
          if (ejectedPlayer) {
            ejectedPlayer.status = 'dead';
          }
        }
        
        gameState.phase = 'playing';
        gameState.votes.clear();
        io.emit('gameState', gameState);
        checkGameEnd();
      }
    }
  });

  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    io.emit('gameState', gameState);
  });
});

setInterval(() => {
  let updated = false;
  gameState.players.forEach(player => {
    if (player.killCooldown > 0) {
      player.killCooldown = Math.max(0, player.killCooldown - 1);
      updated = true;
    }
    if (player.sabotageCooldown > 0) {
      player.sabotageCooldown = Math.max(0, player.sabotageCooldown - 1);
      updated = true;
    }
  });

  if (gameState.sabotageActive) {
    gameState.sabotageActive.timeLeft -= 1000;
    if (gameState.sabotageActive.timeLeft <= 0) {
      gameState.sabotageActive = null;
    }
    updated = true;
  }

  if (updated) {
    io.emit('gameState', gameState);
  }
}, 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});