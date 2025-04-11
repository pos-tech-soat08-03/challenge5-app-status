import express from "express";
import { DefaultApiEndpoints } from "./Infrastructure/Api/ApisDefaultEndpoints";
import { MySQLConnection } from "./Infrastructure/Database/Impl/MySQLConnection";
import { ApiProcessingStatus } from "./Infrastructure/Api/ApiProcessingStatus";
import { ApiMsgOverride } from "./Infrastructure/Api/ApiMsgOverride";
import * as dotenv from "dotenv";
import { SqsConfig } from "./Infrastructure/Configs/SqsConfig";
import { SnsConfig } from "./Infrastructure/Configs/SnsConfig";
import { S3Config } from "./Infrastructure/Configs/S3Configs";
import { SqsServiceImpl } from "./Infrastructure/Services/SqsServiceImpl";
import { SnsServiceImpl } from "./Infrastructure/Services/SnsServiceImpl";
import { S3ServiceImpl } from "./Infrastructure/Services/S3ServiceImpl";
import { QueueWorker } from "./Infrastructure/QueueWorker/QueueWorkerSQS";

// Iniicialização de variáveis de ambiente
dotenv.config();
const env = process.env.NODE_ENV ?? "local";

const sqsConfig = new SqsConfig();
const snsConfig = new SnsConfig();
const s3Config = new S3Config();

if (!sqsConfig.getQueueUrl() || !snsConfig.getTopicArn()) {
  throw new Error(
    "Configurações inválidas: URL da fila SQS ou ARN do tópico SNS não fornecidos"
  );
}

const queueRepository = new SqsServiceImpl(sqsConfig);
const notificationRepository = new SnsServiceImpl(snsConfig);
const s3Service = new S3ServiceImpl(s3Config.getClient());

// const queueWorker = new QueueWorker(videoQueueHandler);

// console.log("Iniciando a aplicação de processamento de vídeos...");
// await queueWorker.start();
// console.log(
//   "Worker iniciado com sucesso. Aguardando mensagens na fila SQS..."
// );



// Inicialização de banco de dados
const mysqlConnection = new MySQLConnection({
  hostname: process.env.DATABASE_HOST ?? "ERROR",
  portnumb: Number(process.env.DATABASE_PORT ?? "0"),
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