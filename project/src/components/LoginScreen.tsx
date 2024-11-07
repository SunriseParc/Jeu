import React, { useState } from 'react';
import { Hotel } from 'lucide-react';

interface LoginScreenProps {
  onJoin: (name: string, isGameMaster: boolean) => void;
}

export default function LoginScreen({ onJoin }: LoginScreenProps) {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Hotel className="w-16 h-16 text-amber-800 mb-4" />
          <h1 className="text-3xl font-bold text-amber-900">Hotel Among Us</h1>
          <p className="text-amber-700 mt-2">1930s Edition</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => name && onJoin(name, false)}
              className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              disabled={!name}
            >
              Join as Player
            </button>
            <button
              onClick={() => name && onJoin(name, true)}
              className="w-full px-4 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition-colors"
              disabled={!name}
            >
              Join as Master
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}