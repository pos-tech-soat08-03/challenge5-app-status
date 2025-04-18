import { ProcessingEntity } from "../../Entity/ProcessingEntity";

export interface ProcessingPostMsgGatewayInterface {
 
    sendProcessingMessage (processing : ProcessingEntity): Promise <void>;

}