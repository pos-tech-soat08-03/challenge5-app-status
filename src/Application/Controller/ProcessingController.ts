import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ProcessingUseCases } from "../../Core/Usecase/ProcessingUseCases";
import { ProcessingAdapter } from "../Presenter/ProcessingAdapter";

export class ProcessingController {

    public static async GetProcessingList (dbConnection: IDbConnection): Promise<string> {
        try {
            const processingGateway = dbConnection.gateways.processingRepoGateway;
            const processingList = await ProcessingUseCases.GetProcessingList(processingGateway);
            if (!processingList) {
                throw new Error("No processing found");
            }
            return ProcessingAdapter.adaptProcessingValidListResponse(processingList);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async GetProcessingListByUser (dbConnection: IDbConnection, userId: string): Promise<string> {
        try {
            const processingGateway = dbConnection.gateways.processingRepoGateway;
            const processingList = await ProcessingUseCases.GetProcessingListByUser(processingGateway, userId);
            if (!processingList) {
                throw new Error("No processing found");
            }
            return ProcessingAdapter.adaptProcessingValidListResponse(processingList);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async GetProcessingStatus (dbConnection: IDbConnection, processingId: string): Promise<string> {
        try {
            const processingGateway = dbConnection.gateways.processingRepoGateway;
            const processing = await ProcessingUseCases.GetProcessing(processingGateway, processingId);
            if (!processing) {
                throw new Error("No processing found");
            }
            return ProcessingAdapter.adaptProcessingValidResponse(processing);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }
    
    
   

}