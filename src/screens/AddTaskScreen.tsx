import React from 'react';
import { AddTaskModal } from '../components/AddTaskModal';

export const AddTaskScreen: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-200">
      <AddTaskModal isPageMode={true} />
    </div>
  );
};
