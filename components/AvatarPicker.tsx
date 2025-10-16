import React from 'react';
import { AVATAR_SEEDS } from '../constants';

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-300 mb-3">Escolha seu Avatar</h3>
      <div className="grid grid-cols-6 gap-2">
        {AVATAR_SEEDS.map((seed) => {
          const avatarUrl = `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${seed}`;
          const isSelected = selectedAvatar === avatarUrl;
          return (
            <button
              key={seed}
              type="button"
              onClick={() => onSelectAvatar(avatarUrl)}
              className={`p-1 rounded-full transition-all duration-200 ${isSelected ? 'ring-4 ring-sky-400' : 'ring-2 ring-transparent hover:ring-sky-500'}`}
            >
              <img src={avatarUrl} alt={`Avatar ${seed}`} className="w-12 h-12 bg-slate-700 rounded-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPicker;