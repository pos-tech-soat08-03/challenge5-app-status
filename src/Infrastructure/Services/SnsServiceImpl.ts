import { PublishCommand } from "@aws-sdk/client-sns";
import { SnsConfig } from "../Configs/SnsConfig";
import { ProcessingPostMsgGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingPostMsgGatewayInterface";
import { ProcessingEntity } from "../../Core/Entity/ProcessingEntity";

export class SnsServiceImpl implements ProcessingPostMsgGatewayInterface {
  constructor(private readonly snsConfig: SnsConfig) {}

  async sendProcessingMessage (processing : ProcessingEntity): Promise <void> {
    const message = JSON.stringify(processing.toReprocessingDTO());
    const params = {
      Message: message,
      TopicArn: this.snsConfig.getTopicArn(),
    };

    try {
      const comando = new PublishCommand(params);
      const resultado = await this.snsConfig.getClient().send(comando);
      console.log("Mensagem enviada com sucesso:", resultado);
    } catch (erro) {
      console.error("Erro ao enviar notificação:", erro);
      throw erro;
    }
  }

}
