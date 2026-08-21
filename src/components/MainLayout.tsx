import React from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from './TopAppBar';
import { NavigationDrawer } from './NavigationDrawer';
import { BottomNavBar } from './BottomNavBar';
import { AddTaskModal } from './AddTaskModal';
import { LegendModal } from './LegendModal';
import { AttachmentModal } from './AttachmentModal';
import { NotificationModal } from './NotificationModal';
import { EditProfileModal } from './EditProfileModal';
import { ExportReportModal } from './ExportReportModal';
import { TaskPhotoProofModal } from './TaskPhotoProofModal';
import { PhotoPreviewModal } from './PhotoPreviewModal';

// Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ActivityHistoryScreen } from '../screens/ActivityHistoryScreen';
import { MediaScreen } from '../screens/MediaScreen';
import { UrgentTasksScreen } from '../screens/UrgentTasksScreen';
import { StoreTasksScreen } from '../screens/StoreTasksScreen';
import { CommunicationsScreen } from '../screens/CommunicationsScreen';
import { NotesScreen } from '../screens/NotesScreen';

export const MainLayout: React.FC = () => {
  const { currentScreen, toast, isLoading } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'urgent-tasks':
        return <UrgentTasksScreen />;
      case 'store-tasks':
        return <StoreTasksScreen />;
      case 'communications':
        return <CommunicationsScreen />;
      case 'notes':
        return <NotesScreen />;
      case 'add-task':
        return <AddTaskScreen />;
      case 'media':
        return <MediaScreen />;
      case 'admin':
        return <SettingsScreen />;
      case 'activity':
        return <ActivityHistoryScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F7F7F8] dark:bg-[#191c1f] min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-[32px] text-[#FF5500] animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F8] dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#FFF0EB] selection:text-[#FF5500]">
      {/* Left Vertical Navigation Rail (Desktop) */}
      <NavigationDrawer />

      {/* Main App Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar */}
        <TopAppBar />

        {/* Dynamic Screen View */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-28 md:pb-12 overflow-x-hidden">
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Global Modals & Drawers */}
      <AddTaskModal />
      <LegendModal />
      <AttachmentModal />
      <NotificationModal />
      <EditProfileModal />
      <ExportReportModal />
      <TaskPhotoProofModal />
      <PhotoPreviewModal />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 border pointer-events-auto ${
              toast.type === 'error'
                ? 'bg-[#FFF0EB] text-[#FF5500] border-[#FFD8CC]'
                : toast.type === 'info'
                ? 'bg-[#2C2C2E] text-white border-white/10'
                : 'bg-[#008259] text-white border-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
