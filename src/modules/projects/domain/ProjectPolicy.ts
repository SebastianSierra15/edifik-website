export interface SearchAdminProjectsPolicy {
  canSeeOwnerEmail: boolean;
}

export interface CreateProjectPolicy {
  userId: number;
  canManageAll: boolean;
  isClient: boolean;
}

export interface UpdateProjectPolicy {
  userId: number;
  isClient: boolean;
  canManageAll: boolean;
}

export interface DeleteProjectPolicy {
  userId: number;
  canManageAll: boolean;
}
