import React from 'react';
import { UserProfile } from '../../types';
import Button from '../Button';

interface UserCardProps {
  user: UserProfile;
}

const Stat: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="text-center">
    <p className="font-bold text-lg text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    <p className="text-xs text-gray-400 uppercase">{label}</p>
  </div>
);


const UserCard: React.FC<UserCardProps> = ({ user }) => {

  return (
    <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/50 hover:-translate-y-1">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-24 h-24 rounded-full border-4 border-gray-600 mb-4 object-cover"
      />
      <h3 className="font-bold text-lg text-white">{user.name}</h3>
      <div className="grid grid-cols-2 gap-4 w-full my-4">
        <Stat label="Poin" value={user.points} />
        <Stat label="Tugas Selesai" value={user.stats.tasksCompleted} />
      </div>
      <div className="w-full mt-2">
        <Button variant="secondary" className="w-full bg-gray-700/50 hover:bg-gray-700" disabled>
          Lihat Profil
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
