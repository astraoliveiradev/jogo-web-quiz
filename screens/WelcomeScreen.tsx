import React, { useState, useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { Player } from '../types';
import AvatarPicker from '../components/AvatarPicker';
import Button from '../components/Button';
import { AVATAR_SEEDS } from '../constants';

const WelcomeScreen: React.FC = () => {
  const context = useContext(GameContext);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${AVATAR_SEEDS[0]}`);
  const [joinRoomCode, setJoinRoomCode] = useState('');

  const handleCreateRoom = () => {
    if (context && name.trim()) {
      const user: Player = {
        id: `player_${Date.now()}`,
        name: name.trim(),
        avatar,
      };
      context.createRoom(user);
    }
  };
  
  const handleJoinRoom = () => {
    if (context && name.trim() && joinRoomCode.trim()) {
      const user: Player = {
        id: `player_${Date.now()}`,
        name: name.trim(),
        avatar,
      };
      context.joinRoom(user, joinRoomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in">
      <h1 className="text-4xl font-bold text-center text-white mb-2">Mestre do Quiz</h1>
      <p className="text-center text-slate-400 mb-8">Crie um jogo ou junte-se a um para desafiar seus amigos!</p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-slate-300 mb-2">
            Digite seu Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Capitão Quiz"
            className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />
        </div>
        
        <AvatarPicker selectedAvatar={avatar} onSelectAvatar={setAvatar} />

        <div className="pt-4 space-y-4">
          <Button onClick={handleCreateRoom} disabled={!name.trim()} className="w-full">
            Criar Sala
          </Button>

          <div className="flex items-center gap-4">
              <hr className="flex-grow border-slate-600" />
              <span className="text-slate-400 font-semibold">OU</span>
              <hr className="flex-grow border-slate-600" />
          </div>

          <div className="space-y-3">
              <label htmlFor="room-code" className="block text-lg font-semibold text-slate-300">
                Entrar com Código
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                  <input
                      id="room-code"
                      type="text"
                      value={joinRoomCode}
                      onChange={(e) => setJoinRoomCode(e.target.value)}
                      placeholder="DIGITE O CÓDIGO"
                      maxLength={6}
                      className="flex-grow w-full bg-slate-700 border-2 border-slate-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all uppercase tracking-widest text-center placeholder:normal-case placeholder:tracking-normal"
                  />
                  <Button 
                    onClick={handleJoinRoom} 
                    variant="secondary" 
                    className="w-full sm:w-auto"
                    disabled={!name.trim() || joinRoomCode.length < 6}
                  >
                      Entrar na Sala
                  </Button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;