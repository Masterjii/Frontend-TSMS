import React, { useState } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TicketList } from './TicketList';
import { TicketDetail } from './TicketDetail';
import { CreateTicket } from './CreateTicket';
import { Ticket } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
    handleRefresh();
  };

  const handleCreateTicket = () => {
    setShowCreateTicket(true);
  };

  const handleCloseCreate = () => {
    setShowCreateTicket(false);
  };

  const handleTicketCreated = () => {
    handleRefresh();
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Support Ticket System</h1>
            <p className="text-sm text-slate-600">Manage and track support tickets</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-600">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 flex-shrink-0">
          <TicketList
            onSelectTicket={handleSelectTicket}
            onCreateTicket={handleCreateTicket}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onClose={handleCloseDetail}
              onUpdate={handleRefresh}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a ticket to view details</p>
                <p className="text-sm">or create a new ticket to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateTicket && (
        <CreateTicket onClose={handleCloseCreate} onCreate={handleTicketCreated} />
      )}
    </div>
  );
};
