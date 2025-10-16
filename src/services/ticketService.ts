
import { apiRequest } from './apiClient';

const API_BASE = 'http://localhost:4000/api';

export const ticketService = {
  async listTickets() {
    return apiRequest(`${API_BASE}/tickets`);
  },

  async getTicket(id: string) {
    return apiRequest(`${API_BASE}/tickets/${id}`);
  },

  async createTicket(data: {
    title: string;
    description?: string;
    priority?: string;
    department: string;
    tags?: string[];
  }) {
    return apiRequest(`${API_BASE}/tickets`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTicket(id: string, updates: Partial<any>) {
    return apiRequest(`${API_BASE}/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async updateTicketStatus(id: string, status: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  async assignTicket(id: string, agentId: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ agentId }),
    });
  },

  async mergeTicket(id: string, mergeWithId: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/merge`, {
      method: 'POST',
      body: JSON.stringify({ mergeWithId }),
    });
  },

  async closeTicket(id: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/close`, {
      method: 'POST',
    });
  },

  async getReplies(id: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/replies`);
  },

  async replyToTicket(id: string, message: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/replies`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async getDependencies(id: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/dependencies`);
  },

  async addDependency(id: string, dependsOn: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/dependencies`, {
      method: 'POST',
      body: JSON.stringify({ dependsOn }),
    });
  },

  async removeDependency(dependencyId: string) {
    return apiRequest(`${API_BASE}/dependencies/${dependencyId}`, {
      method: 'DELETE',
    });
  },

  async getAuditHistory(id: string) {
    return apiRequest(`${API_BASE}/tickets/${id}/audit`);
  },

  async getAgents() {
    return apiRequest(`${API_BASE}/agents`);
  },
};
