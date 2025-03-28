import { ProcessingStatusGateway } from "../../Application/Gateway/ProcessingStatusGateway";
import { ProcessingStatusEnum } from "../Entity/ValueObject/ProcessingStatusEnum";

export class ProcessingUseCaseResponse {
    public id: string;
    public status: string;
    public percentage: number;
    public message: string;

    constructor(id: string, status: string, percentage: number, message: string) {
        this.id = id;
        this.status = status;
        this.percentage = percentage;
        this.message = message;
    }
}

export class UpdateProcessingStatusUseCase {

    public static async UpdateStatusById (processingGateway: ProcessingStatusGateway, id: string, status: string, percentage: number): Promise<void> {
        
        const processing = await processingGateway.getProcessingStatus(id);
        if (!processing) {
            throw new Error("Processing not found");
        }
       
        processing.setProcessingStatusPercentage(percentage);
        processing.setProcessingStatus(status as ProcessingStatusEnum);

        await processingGateway.setProcessingStatus(processing);

    }

}