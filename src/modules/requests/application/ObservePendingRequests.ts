import { PendingRequest } from "@/src/interfaces";
import { PendingRequestRepository } from "../domain/RequestRepository";

export class ObservePendingRequests {
  constructor(private readonly repo: PendingRequestRepository) {}

  async getCurrent(): Promise<PendingRequest[]> {
    const requests = await this.repo.getPending();

    return requests.map((r) => ({
      id: r.id,
      date: r.date,
      operation: r.operation ? "agregar" : "editar",
      userEmail: r.userEmail,
      statusRequestName: r.statusRequestName,
      projectName: r.projectName,
    }));
  }
}
