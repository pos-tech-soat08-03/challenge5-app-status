import { ProcessingDTO } from "../../Types/DTO/ProcessingDTO";

export interface ProcessingReadMsgGatewayInterface {
 
    getNextProcessingMessage (): Promise <ProcessingDTO | undefined>;

}