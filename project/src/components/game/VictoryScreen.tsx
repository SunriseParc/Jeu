import React from 'react';
import { Hotel, Skull, RotateCcw } from 'lucide-react';
import ActionButton from './ActionButton';

interface VictoryScreenProps {
  isImpostorVictory: boolean;
  onPlayAgain: () => void;
}

export default function VictoryScreen({ isImpostorVictory, onPlayAgain }: VictoryScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center space-y-6">
          {isImpostorVictory ? (
            <>
              <Skull className="w-24 h-24 mx-auto text-red-600" />
              <h1 className="text-4xl font-bold text-red-900">
                The Impostors Win!
              </h1>
              <p className="text-red-700 text-lg">
                The hotel's reputation is forever tarnished...
              </p>
            </>
          ) : (
            <>
              <Hotel className="w-24 h-24 mx-auto text-green-600" />
              <h1 className="text-4xl font-bold text-green-900">
                The Hotel Staff Wins!
              </h1>
              <p className="text-green-700 text-lg">
                Order has been restored to the hotel!
              </p>
            </>
          )}

          <ActionButton
            icon={RotateCcw}
            label="Play Again"
            onClick={onPlayAgain}
            variant={isImpostorVictory ? 'danger' : 'success'}
          />
        </div>
      </div>
    </div>
  );
}