export interface Request {
  id: number;
  date: Date;
  operation: "agregar" | "editar";
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
  operation: "agregar" | "editar";
  userEmail: string;
  statusRequestName: string;
  projectName: string;
}
