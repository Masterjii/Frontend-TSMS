
import type { Ticket, Reply, Dependency, AuditEntry, User } from '../types';

const API_BASE = 'http://localhost:4000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}


export const ticketService = {
  async getTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE}/tickets`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },

  async getTicket(id: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) return null;
    return res.json();
  },

  async createTicket(data: {
    title: string;
    description: string;
    priority: Ticket['priority'];
    department: Ticket['department'];
    tags: string[];
  }): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) return null;
    return res.json();
  },

  async assignTicket(ticketId: string, agentId: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ agentId })
    });
    if (!res.ok) return null;
    return res.json();
  },

  async updateStatus(ticketId: string, status: Ticket['status']): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) return null;
    return res.json();
  },

  async closeTicket(ticketId: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) return null;
    return res.json();
  },

  async mergeTickets(ticketId: string, mergeWithId: string): Promise<Ticket | null> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ mergeWithId })
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getReplies(ticketId: string): Promise<Reply[]> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/replies`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch replies');
    return res.json();
  },

  async addReply(ticketId: string, message: string): Promise<Reply> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Failed to add reply');
    return res.json();
  },

  async getDependencies(ticketId: string): Promise<Dependency[]> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/dependencies`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch dependencies');
    return res.json();
  },

  async addDependency(ticketId: string, dependsOn: string): Promise<Dependency> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/dependencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ dependsOn })
    });
    if (!res.ok) throw new Error('Failed to add dependency');
    return res.json();
  },

  async removeDependency(dependencyId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/dependencies/${dependencyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    return res.ok;
  },

  async getAuditHistory(ticketId: string): Promise<AuditEntry[]> {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/audit`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch audit history');
    return res.json();
  },

  // addAuditEntry is now handled by backend

  async getAgents(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/agents`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
  }
};
