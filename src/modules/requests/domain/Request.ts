export enum RequestStatus {
  Approved = 2,
  Rejected = 3,
  Review = 4,
}

export interface Request {
  id: number;
  date: Date;
  operation: boolean;
  responseMessage?: string;
  userId: number;
  userEmail: string;
  statusRequestName: string;
  projectId: number;
  projectName: string;
}

export interface PendingRequest {
  id: number;
  date: Date;
  operation: boolean;
  userEmail: string;
  statusRequestName: string;
  projectName: string;
}
