import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Calendar,
  Tag,
  Building2,
  MessageSquare,
  History,
  UserPlus,
  GitMerge,
  CheckCircle,
  Link2,
  Unlink
} from 'lucide-react';
import { Ticket, Reply, Dependency, AuditEntry } from '../types';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: () => void;
}

type Tab = 'details' | 'replies' | 'dependencies' | 'history';

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [replies, setReplies] = useState<Reply[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [mergeTicketId, setMergeTicketId] = useState('');
  const [dependencyTicketId, setDependencyTicketId] = useState('');

  useEffect(() => {
    loadData();
  }, [ticket.id]);

  const loadData = () => {
    setReplies(ticketService.getReplies(ticket.id));
    setDependencies(ticketService.getDependencies(ticket.id));
    setAuditHistory(ticketService.getAuditHistory(ticket.id));
  };

  const handleAddReply = () => {
    if (!user || !replyMessage.trim()) return;
    ticketService.addReply(ticket.id, replyMessage, user);
    setReplyMessage('');
    loadData();
    onUpdate();
  };

  const handleStatusChange = () => {
    if (!user || newStatus === ticket.status) return;
    ticketService.updateStatus(ticket.id, newStatus, user);
    loadData();
    onUpdate();
  };

  const handleAssign = (agentId: string) => {
    if (!user) return;
    ticketService.assignTicket(ticket.id, agentId, user);
    setShowAssignModal(false);
    loadData();
    onUpdate();
  };

  const handleMerge = () => {
    if (!user || !mergeTicketId.trim()) return;
    ticketService.mergeTickets(ticket.id, mergeTicketId, user);
    setShowMergeModal(false);
    setMergeTicketId('');
    loadData();
    onUpdate();
  };

  const handleClose = () => {
    if (!user) return;
    ticketService.closeTicket(ticket.id, user);
    loadData();
    onUpdate();
  };

  const handleAddDependency = () => {
    if (!user || !dependencyTicketId.trim()) return;
    ticketService.addDependency(ticket.id, dependencyTicketId, user);
    setShowDependencyModal(false);
    setDependencyTicketId('');
    loadData();
    onUpdate();
  };

  const handleRemoveDependency = (depId: string) => {
    if (!user) return;
    ticketService.removeDependency(depId, user);
    loadData();
    onUpdate();
  };

  const agents = ticketService.getAgents();
  const allTickets = ticketService.getTickets().filter(t => t.id !== ticket.id);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">{ticket.title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 px-6 py-3 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'details', label: 'Details', icon: Tag },
          { id: 'replies', label: 'Replies', icon: MessageSquare },
          { id: 'dependencies', label: 'Dependencies', icon: Link2 },
          { id: 'history', label: 'History', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Description</h3>
              <p className="text-slate-900">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Priority
                </h3>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-900 rounded-lg font-medium">
                  {ticket.priority}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Department
                </h3>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-900 rounded-lg">
                  {ticket.department}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Created By
                </h3>
                <p className="text-slate-900">{ticket.createdBy.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created At
                </h3>
                <p className="text-slate-900">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>

              {ticket.assignedTo && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Assigned To
                  </h3>
                  <p className="text-slate-900">{ticket.assignedTo.name}</p>
                </div>
              )}
            </div>

            {ticket.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Tags</h3>
                <div className="flex gap-2 flex-wrap">
                  {ticket.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Change Status
                </label>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as Ticket['status'])}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={newStatus === ticket.status}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Assign Agent
              </button>
              <button
                onClick={() => setShowMergeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <GitMerge className="w-4 h-4" />
                Merge Ticket
              </button>
              <button
                onClick={handleClose}
                disabled={ticket.status === 'Closed'}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Close Ticket
              </button>
            </div>
          </div>
        )}

        {activeTab === 'replies' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {replies.map(reply => (
                <div key={reply.id} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900">{reply.user.name}</span>
                    <span className="text-sm text-slate-500">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700">{reply.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <textarea
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleAddReply}
                disabled={!replyMessage.trim()}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Reply
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {dependencies.map(dep => {
                const depTicket = ticketService.getTicket(dep.dependsOn);
                return (
                  <div key={dep.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {depTicket?.title || 'Unknown Ticket'}
                      </p>
                      <p className="text-sm text-slate-500">
                        Added {new Date(dep.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveDependency(dep.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Unlink className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowDependencyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Link2 className="w-4 h-4" />
              Add Dependency
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {auditHistory.map(entry => (
              <div key={entry.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-4 h-4 text-slate-600" />
                  <span className="font-medium text-slate-900">{entry.user.name}</span>
                  <span className="text-sm text-slate-500">{entry.action}</span>
                  <span className="text-sm text-slate-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <pre className="text-xs text-slate-600 overflow-x-auto">
                  {JSON.stringify(entry.changes, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Assign to Agent</h3>
            <div className="space-y-2">
              {agents.map(agent => (
                <button
                  key={agent._id}
                  onClick={() => handleAssign(agent._id)}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-slate-600">{agent.email}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAssignModal(false)}
              className="mt-4 w-full px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showMergeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Merge Ticket</h3>
            <select
              value={mergeTicketId}
              onChange={e => setMergeTicketId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
            >
              <option value="">Select ticket to merge into</option>
              {allTickets.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleMerge}
                disabled={!mergeTicketId}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Merge
              </button>
              <button
                onClick={() => setShowMergeModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDependencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add Dependency</h3>
            <select
              value={dependencyTicketId}
              onChange={e => setDependencyTicketId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
            >
              <option value="">Select dependent ticket</option>
              {allTickets.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddDependency}
                disabled={!dependencyTicketId}
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowDependencyModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
