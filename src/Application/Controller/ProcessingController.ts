import { IDbConnection } from "../../Core/Interfaces/IDbConnection";
import { ErrorMsgDTO } from "../../Core/Types/DTO/ErrorMsgDTO";
import { ProcessingConfigDTO } from "../../Core/Types/DTO/ProcessingConfigDTO";
import { StatusMsgDTO } from "../../Core/Types/DTO/StatusMsgDTO";
import { UserDTO } from "../../Core/Types/DTO/UserDTO";
import { VideoDTO } from "../../Core/Types/DTO/VideoDTO";
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
            //return ProcessingAdapter.adaptProcessingJsonValidListResponse(processingList);
            return ProcessingAdapter.adaptProcessingHtmlListResponse(processingList);
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
            //return ProcessingAdapter.adaptProcessingJsonValidListResponse(processingList);
            return ProcessingAdapter.adaptProcessingHtmlListResponse(processingList);
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
            //return ProcessingAdapter.adaptProcessingJsonValidResponse(processing);
            return ProcessingAdapter.adaptProcessingHtmlResponse(processing);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }
    
    public static async CreateProcessing (dbConnection: IDbConnection, payload: any): Promise<string> {
        try {
            const videoDTO: VideoDTO = payload.video;
            const userDTO: UserDTO = payload.user;
            const configDTO: ProcessingConfigDTO = payload.config;
            if (!videoDTO || !userDTO || !configDTO) {
                throw new Error("Invalid payload");
            }
            const processingGateway = dbConnection.gateways.processingRepoGateway;
            const processingCreated = await ProcessingUseCases.CreateProcessing(processingGateway, videoDTO, userDTO, configDTO);
            if (!processingCreated) {
                throw new Error("No processing created");
            }
            return ProcessingAdapter.adaptProcessingJsonValidResponse(processingCreated);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async RegisterProcessingStatus (dbConnection: IDbConnection, payload: any): Promise<string> {
        try {
            const statusDTO: StatusMsgDTO = payload;
            if (!statusDTO) {
                throw new Error("Invalid payload");
            }
            const processingGateway = dbConnection.gateways.processingRepoGateway;
            const processingStatusUpdated = await ProcessingUseCases.RegisterProcessingStatus(processingGateway, statusDTO);
            if (!processingStatusUpdated) {
                throw new Error("No processing status updated");
            }
            return ProcessingAdapter.adaptProcessingJsonValidResponse(processingStatusUpdated);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }
   
    public static async RegisterProcessingError (dbConnection: IDbConnection, payload: any): Promise<string> {
        try {
            const errorDTO: ErrorMsgDTO = payload;
            if (!errorDTO) {
                throw new Error("Invalid payload");
            }
            const processingGateway = dbConnection.gateways.processingRepoGateway;
            const processingStatusUpdated = await ProcessingUseCases.RegisterProcessingError(processingGateway, errorDTO);
            if (!processingStatusUpdated) {
                throw new Error("Error processing error message");
            }
            return ProcessingAdapter.adaptProcessingJsonValidResponse(processingStatusUpdated);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }    

}