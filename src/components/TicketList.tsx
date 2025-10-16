import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, ArrowUpCircle, Circle, CheckCircle2, GitMerge } from 'lucide-react';
import { Ticket } from '../types';
import { ticketService } from '../services/ticketService';

interface TicketListProps {
  onSelectTicket: (ticket: Ticket) => void;
  onCreateTicket: () => void;
  refreshTrigger: number;
}

const priorityColors = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700'
};

const statusIcons = {
  Open: Circle,
  'In Progress': ArrowUpCircle,
  Escalated: AlertCircle,
  Merged: GitMerge,
  Closed: CheckCircle2
};

const statusColors = {
  Open: 'text-slate-600',
  'In Progress': 'text-blue-600',
  Escalated: 'text-orange-600',
  Merged: 'text-purple-600',
  Closed: 'text-green-600'
};

export const TicketList: React.FC<TicketListProps> = ({
  onSelectTicket,
  onCreateTicket,
  refreshTrigger
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<'all' | Ticket['status']>('all');


  useEffect(() => {
    const loadTickets = async () => {
      try {
        const allTickets = await ticketService.listTickets();
        setTickets(Array.isArray(allTickets) ? allTickets : []);
      } catch (err) {
        setTickets([]);
      }
    };
    loadTickets();
  }, [refreshTrigger]);

  const filteredTickets = tickets.filter(
    ticket => filter === 'all' || ticket.status === filter
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Tickets</h2>
          <button
            onClick={onCreateTicket}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'Open', 'In Progress', 'Escalated', 'Closed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
            <Circle className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm">Create a new ticket to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map(ticket => {
              const StatusIcon = statusIcons[ticket.status];
              return (
                <button
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="w-full p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${statusColors[ticket.status]}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-xs text-slate-500">{ticket.department}</span>
                        {ticket.assignedTo && (
                          <span className="text-xs text-slate-500">
                            → {ticket.assignedTo.name}
                          </span>
                        )}
                      </div>
                      {ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {ticket.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
