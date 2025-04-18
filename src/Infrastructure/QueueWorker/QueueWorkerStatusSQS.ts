import { StatusQueueHandler } from "../../Application/Controller/StatusQueueHandler";

export class QueueWorkerStatusSQS {
  constructor(private readonly queueHandler: StatusQueueHandler) {}

  async start(): Promise<void> {
    console.log("QueueWorker iniciado. Iniciando polling da fila SQS de Status...");
    while (true) {
      try {
        await this.queueHandler.handle();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Erro ao processar mensagem da fila:", error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}
