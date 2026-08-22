import React from 'react';
import { CalendarView } from '../components/CalendarView';
import { TaskAccordions } from '../components/TaskAccordions';

export const DashboardScreen: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-200">
      {/* Calendar Section (Default English AD, configurable in Settings) */}
      <CalendarView />

      {/* Urgent/Tasks/Communications sections below are scoped to the calendar's selected date */}
      <TaskAccordions />
    </div>
  );
};
