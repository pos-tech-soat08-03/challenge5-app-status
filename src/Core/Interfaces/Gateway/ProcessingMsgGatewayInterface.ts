import { ProcessingEntity } from "../../Entity/ProcessingEntity";

export interface ProcessingMsgGatewayInterface {
 
    getProcessingMessage (): Promise <ProcessingEntity | undefined>;
    sendProcessingMessage (processing : ProcessingEntity): Promise <ProcessingEntity | undefined>;

}