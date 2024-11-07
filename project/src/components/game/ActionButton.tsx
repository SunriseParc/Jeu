import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  cooldown?: number;
  variant?: 'danger' | 'warning' | 'success';
}

export default function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  cooldown,
  variant = 'warning'
}: ActionButtonProps) {
  const variants = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full ${variants[variant]} text-white rounded-lg p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon size={24} />
        <span className="font-medium">{label}</span>
      </div>
      {cooldown !== undefined && cooldown > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-white/30 transition-all duration-1000"
            style={{ width: `${(cooldown / 100) * 100}%` }}
          />
        </div>
      )}
    </button>
  );
}