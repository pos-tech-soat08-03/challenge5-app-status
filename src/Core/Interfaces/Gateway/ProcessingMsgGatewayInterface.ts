import { ProcessingEntity } from "../../Entity/ProcessingEntity";

export interface ProcessingMsgGatewayInterface {
 
    getNextProcessingMessage (): Promise <ProcessingEntity | undefined>;
    sendProcessingMessage (processing : ProcessingEntity): Promise <ProcessingEntity | undefined>;
    deleteProcessingMessage (processingId: string): Promise <void>;

}