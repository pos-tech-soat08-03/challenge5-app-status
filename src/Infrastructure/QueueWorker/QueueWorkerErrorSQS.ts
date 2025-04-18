import { ErroQueueHandler } from "../../Application/Controller/ProcessingQueueHandler";

export class QueueWorkerErroSQS {
  constructor(private readonly queueHandler: ErroQueueHandler) {}

  async start(): Promise<void> {
    console.log("QueueWorker iniciado. Iniciando polling da fila SQS de Erros...");
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
