import { ProcessingStatusEntity } from "../../Entity/ProcessingStatusEntity";

export interface ProcessingStatusInterface {

    getProcessingStatus(processingId: string): Promise <ProcessingStatusEntity | undefined>;
    getProcessingList(status: string): Promise <Array<ProcessingStatusEntity> | undefined>;
    getProcessingListByUser(userId: string): Promise <Array<ProcessingStatusEntity> | undefined>;
    setProcessingStatus(processingStatus: ProcessingStatusEntity): void;

}