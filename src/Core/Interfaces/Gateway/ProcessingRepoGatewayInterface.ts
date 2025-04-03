import { ProcessingEntity } from "../../Entity/ProcessingEntity";

export interface ProcessingRepoGatewayInterface {

    setProcessing (processing : ProcessingEntity): Promise <ProcessingEntity | undefined>;
    getProcessingById (processingId: string): Promise <ProcessingEntity | undefined>;
    getProcessingList (): Promise <Array<ProcessingEntity> | undefined>;
    getProcessingListByUser (userId: string): Promise <Array<ProcessingEntity> | undefined>;

}