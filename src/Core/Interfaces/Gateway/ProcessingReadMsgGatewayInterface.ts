import { ProcessingEntity } from "../../Entity/ProcessingEntity";

export interface ProcessingReadMsgGatewayInterface {
 
    getNextProcessingMessage (): Promise <ProcessingEntity | undefined>;
    deleteProcessingMessage (processingId: string): Promise <void>;

}