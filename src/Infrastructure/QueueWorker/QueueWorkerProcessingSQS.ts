import { ProcessingQueueHandler } from "../../Application/Controller/ProcessingQueueHandler";

export class QueueWorker {
  constructor(private readonly queueHandler: ProcessingQueueHandler) {}

  async start(): Promise<void> {
    console.log("QueueWorker iniciado. Iniciando polling da fila SQS de Processamento...");
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
