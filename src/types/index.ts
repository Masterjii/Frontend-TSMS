export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'user';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Escalated' | 'Merged' | 'Closed';
  department: 'Support' | 'Development' | 'IT';
  tags: string[];
  createdBy: User;
  assignedTo?: User;
  mergedInto?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface Reply {
  id: string;
  ticketId: string;
  user: User;
  message: string;
  createdAt: string;
}

export interface Dependency {
  id: string;
  ticketId: string;
  dependsOn: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  ticketId: string;
  user: User;
  action: string;
  changes: Record<string, any>;
  createdAt: string;
}
