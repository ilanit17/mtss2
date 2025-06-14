
import React from 'react';
import { AppMessage } from '../types';

interface MessageDisplayProps {
  message: AppMessage;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  if (!message.type || !message.text) return null;

  const baseClasses = "mb-4 p-4 text-white rounded-lg shadow-md text-center";
  const typeClasses = message.type === 'success' ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message.text}
    </div>
  );
};

export default MessageDisplay;
