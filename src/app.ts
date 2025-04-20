import express from "express";
import dotenv from "dotenv";
import { DefaultApiEndpoints } from "./Infrastructure/Api/ApisDefaultEndpoints";
import { MySQLConnection } from "./Infrastructure/Database/Impl/MySQLConnection";
import { ApiProcessingStatus } from "./Infrastructure/Api/ApiProcessingStatus";
import { ApiMsgOverride } from "./Infrastructure/Api/ApiMsgOverride";
import { SqsConfig } from "./Infrastructure/Configs/SqsConfig";
import { SnsConfig } from "./Infrastructure/Configs/SnsConfig";
import { SqsProcessingMsgImpl } from "./Infrastructure/Services/SqsProcessingMsgImpl";
import { SnsServiceImpl } from "./Infrastructure/Services/SnsServiceImpl";
import { SqsErrorMsgImpl } from "./Infrastructure/Services/SqsErrorMsgImpl";
import { SqsStatusMsgImpl } from "./Infrastructure/Services/SqsStatusMsgImpl";
import { QueueWorkerProcessingSQS } from "./Infrastructure/QueueWorker/QueueWorkerProcessingSQS";
import { ProcessingQueueHandler } from "./Application/Controller/ProcessingQueueHandler";
import { EmailServiceMock } from "./Infrastructure/Services/EmailServiceMock";
import { QueueWorkerErroSQS } from "./Infrastructure/QueueWorker/QueueWorkerErrorSQS";
import { QueueWorkerStatusSQS } from "./Infrastructure/QueueWorker/QueueWorkerStatusSQS";
import { ErrorQueueHandler } from "./Application/Controller/ErrorQueueHandler";
import { StatusQueueHandler } from "./Application/Controller/StatusQueueHandler";

// Inicialização de variáveis de ambiente
dotenv.config();
const env = process.env.NODE_ENV ?? "development";

// Inicialização de banco de dados
const mysqlConnection = new MySQLConnection({
  hostname: process.env.DATABASE_HOST ?? "ERROR",
  portnumb: Number(process.env.DATABASE_PORT ?? "ERROR"),
  database: process.env.DATABASE_NAME ?? "ERROR",
  username: process.env.DATABASE_USER ?? "ERROR",
  password: process.env.DATABASE_PASS ?? "ERROR",
  databaseType: 'mysql'
});

// Inicialização de serviço de alertas
const emailAlert = new EmailServiceMock();

// Configuração do SQS e SNS
const snsConfigProcessamento = new SnsConfig();
const notificationGateway = new SnsServiceImpl(snsConfigProcessamento);

const sqsConfigProcessamento = new SqsConfig("sqs-canal-de-processamento");
const queueProcessingGW = new SqsProcessingMsgImpl(sqsConfigProcessamento);
const queueWorkerProcessing = new QueueWorkerProcessingSQS(new ProcessingQueueHandler(mysqlConnection, queueProcessingGW));
queueWorkerProcessing.start();
console.log("Worker iniciado com sucesso. Aguardando mensagens na fila SQS de Processamento...");

const sqsConfigErro = new SqsConfig("sqs-falhas-de-processamento");
const queueErroGW = new SqsErrorMsgImpl(sqsConfigErro);
const queueWorkerErro = new QueueWorkerErroSQS(new ErrorQueueHandler(mysqlConnection, queueErroGW, notificationGateway, emailAlert));
queueWorkerErro.start();
console.log("Worker iniciado com sucesso. Aguardando mensagens na fila SQS de Erro...");

const sqsConfigStatus = new SqsConfig("sqs-status-de-processamento");
const queueStatusGW = new SqsStatusMsgImpl(sqsConfigStatus);
const queueWorkerStatus = new QueueWorkerStatusSQS(new StatusQueueHandler(mysqlConnection, queueStatusGW));
queueWorkerStatus.start();
console.log("Worker iniciado com sucesso. Aguardando mensagens na fila SQS de Status...");

// Inicialização de framework Express + endpoints default
const port = Number(process.env.SERVER_PORT ?? "3000");
const app = express();
DefaultApiEndpoints.start(app);

// Inicialização de endpoints da aplicação
ApiProcessingStatus.start(mysqlConnection, app);
ApiMsgOverride.start(mysqlConnection, app);

// Inicialização do Express server
app.listen(port, () => {
  console.log(`Microserviço de Status e Reprocessamento rodando na porta: ${port}`);
});