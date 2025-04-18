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

// Inicialização de variáveis de ambiente
dotenv.config();
const env = process.env.NODE_ENV ?? "local";

// Configuração do SQS e SNS
const snsConfigProcessamento = new SnsConfig();
const sqsConfigProcessamento = new SqsConfig("fila-processamento");
const sqsConfigStatus = new SqsConfig("fila-status");
const sqsConfigErro = new SqsConfig("fila-erro");
if (!sqsConfigProcessamento.getQueueUrl() || !sqsConfigStatus.getQueueUrl() || !sqsConfigErro.getQueueUrl() || !snsConfigProcessamento.getTopicArn()) {
  throw new Error(
    "Configurações inválidas: URL da fila SQS ou ARN do tópico SNS não fornecidos"
  );
}
const queueProcessing = new SqsProcessingMsgImpl(sqsConfigProcessamento);
const queueStatus = new SqsErrorMsgImpl(sqsConfigErro);
const queueError = new SqsStatusMsgImpl(sqsConfigStatus);
const notificationRepository = new SnsServiceImpl(snsConfigProcessamento);

// Inicialização de processamento de mensagens
// const queueWorker = new QueueWorker(videoQueueHandler);
// console.log("Iniciando a aplicação de escuta de status...");
// await queueWorker.start();
// console.log(
//   "Worker iniciado com sucesso. Aguardando mensagens na fila SQS..."
// );

// Inicialização de banco de dados
const mysqlConnection = new MySQLConnection({
  hostname: process.env.DATABASE_HOST ?? "ERROR",
  portnumb: Number(process.env.DATABASE_PORT ?? "ERROR"),
  database: process.env.DATABASE_NAME ?? "ERROR",
  username: process.env.DATABASE_USER ?? "ERROR",
  password: process.env.DATABASE_PASS ?? "ERROR",
  databaseType: 'mysql'
});

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