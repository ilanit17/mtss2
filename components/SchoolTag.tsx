
import React from 'react';

interface SchoolTagProps {
  name: string;
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
}

const SchoolTag: React.FC<SchoolTagProps> = ({ name, color = 'blue' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    gray: 'bg-gray-100 text-gray-700 border-gray-300',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses[color]}`}
    >
      {name}
    </span>
  );
};

export default SchoolTag;
