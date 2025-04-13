import express from "express";
import { DefaultApiEndpoints } from "./Infrastructure/Api/ApisDefaultEndpoints";
import { MySQLConnection } from "./Infrastructure/Database/Impl/MySQLConnection";
import { ApiProcessingStatus } from "./Infrastructure/Api/ApiProcessingStatus";
import { ApiMsgOverride } from "./Infrastructure/Api/ApiMsgOverride";
import { SubscribeSNSwithSQSSetup } from "./Infrastructure/Services/Setup/SubscribeSNSwithSQSSetup";

// Iniicialização de variáveis de ambiente
// dotenv.config();
// const env = process.env.NODE_ENV ?? "local";
// const sqsConfig = new SqsConfig();
// const snsConfig = new SnsConfig();
// const s3Config = new S3Config();
// if (!sqsConfig.getQueueUrl() || !snsConfig.getTopicArn()) {
//   throw new Error(
//     "Configurações inválidas: URL da fila SQS ou ARN do tópico SNS não fornecidos"
//   );
// }
// const queueRepository = new SqsServiceImpl(sqsConfig);
// const notificationRepository = new SnsServiceImpl(snsConfig);
// const s3Service = new S3ServiceImpl(s3Config.getClient());
// const queueWorker = new QueueWorker(videoQueueHandler);
// console.log("Iniciando a aplicação de processamento de vídeos...");
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

// Configurações AWS
const awsAccessKeyID = process.env.AWS_ACCESS_KEY_ID ?? "test";
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? "test";
const awsRegion = process.env.AWS_REGION ?? "us-east-1";
const sqsEndpoint = process.env.SQS_ENDPOINT ?? "http://localstack:4566";
const AWSConfig = {
  accessKeyId: awsAccessKeyID,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion,
  endpoint: sqsEndpoint,
};

// Configuração das assinaturas de SNS com SQS
const procMsgSetup = new SubscribeSNSwithSQSSetup (AWSConfig);
procMsgSetup.setupSubscription(
  process.env.SNS_PROC_TOPIC_ARN ?? "arn:aws:sns:us-east-1:000000000000:canal-de-processamento",
  process.env.SQS_PROC_QUEUE_NAME ?? "fila-processamento"
);
const statusMsgSetup = new SubscribeSNSwithSQSSetup (AWSConfig);
statusMsgSetup.setupSubscription(
  process.env.SNS_STATUS_TOPIC_ARN ?? "arn:aws:sns:us-east-1:000000000000:status-de-processamento",
  process.env.SQS_STATUS_QUEUE_NAME ?? "fila-status"
);
const errorMsgSetup = new SubscribeSNSwithSQSSetup (AWSConfig);
errorMsgSetup.setupSubscription(
  process.env.SNS_ERROR_TOPIC_ARN ?? "arn:aws:sns:us-east-1:000000000000:erro-de-processamento",
  process.env.SQS_STATUS_QUEUE_NAME ?? "fila-erros"
);

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