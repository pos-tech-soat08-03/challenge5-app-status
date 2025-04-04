import { ProcessingEntity } from "../Entity/ProcessingEntity";
import { ProcessingConfigValueObject } from "../Entity/ValueObject/ProcessingConfigValueObject";
import { ProcessingStatusEnum } from "../Entity/Enum/ProcessingStatusEnum";
import { UserValueObject } from "../Entity/ValueObject/UserValueObject";
import { VideoValueObject } from "../Entity/ValueObject/VideoValueObject";
import { ProcessingRepoGatewayInterface } from "../Interfaces/Gateway/ProcessingRepoGatewayInterface";
import { ErrorMsgDTO } from "../Types/DTO/ErrorMsgDTO";
import { ProcessingConfigDTO } from "../Types/DTO/ProcessingConfigDTO";
import { StatusMsgDTO } from "../Types/DTO/StatusMsgDTO";
import { UserDTO } from "../Types/DTO/UserDTO";
import { VideoDTO } from "../Types/DTO/VideoDTO";
import { ProcessingResponse } from "../Types/Responses";

export class ProcessingUseCases {

    public static async CreateProcessing (processingGateway: ProcessingRepoGatewayInterface, videoDTO: VideoDTO, userDTO: UserDTO, configDTO: ProcessingConfigDTO): Promise<ProcessingResponse | undefined> {

        try {
            
            const processingId = videoDTO.id_video;
            const newProcessing = new ProcessingEntity(
                processingId, 
                new VideoValueObject(videoDTO.id_video, videoDTO.title, videoDTO.description, videoDTO.filename, videoDTO.file_size, videoDTO.full_path, videoDTO.duration, videoDTO.framerate), 
                new UserValueObject(userDTO.id_usuario, userDTO.email), 
                new ProcessingConfigValueObject(configDTO.output_format, configDTO.resolution, configDTO.interval)
            );

            const currentProcessing = await processingGateway.getProcessingById(processingId);
            if (currentProcessing) {
                throw new Error("Processing already exists in the system");
            }

            const processing = await processingGateway.setProcessing(newProcessing);
            if (!processing) {
                throw new Error("Error creating new processing");
            }

            return {
                id_processing: processing.getProcessingId(),
                video: processing.getVideo().toDTO(),
                user: processing.getUser().toDTO(),
                config: processing.getProcessingConfig().toDTO(),
                status: processing.getProcessingStatus(),
                percentage: processing.getProcessingPercentage(),
                log: processing.getProcessingLog(),
                error_count: processing.getProcessingErrorCount(),
                success: true,
                message: "Processing created successfully",
                error_message: undefined,
            } as ProcessingResponse;

        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    public static async GetProcessing (processingGateway: ProcessingRepoGatewayInterface, processingId: string): Promise<ProcessingResponse | undefined> {
        try {
            const processing = await processingGateway.getProcessingById(processingId);
            if (!processing) {
                throw new Error("ID not found");
            }
            return {
                id_processing: processing.getProcessingId(),
                video: processing.getVideo().toDTO(),
                user: processing.getUser().toDTO(), 
                config: processing.getProcessingConfig().toDTO(),
                status: processing.getProcessingStatus(),
                percentage: processing.getProcessingPercentage(),
                log: processing.getProcessingLog(),
                error_count: processing.getProcessingErrorCount(),
                success: true,
                message: "Processing created successfully",
                error_message: undefined,
            } as ProcessingResponse;

        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async GetProcessingList (processingGateway: ProcessingRepoGatewayInterface): Promise<ProcessingResponse[] | undefined> {
        try {
            const processingList = await processingGateway.getProcessingList();
            if (!processingList) {
                throw new Error("Error fetching processing list");
            }
            const processingListResponse = processingList.map((processing: ProcessingEntity) => {
                return {
                    id_processing: processing.getProcessingId(),
                    video: processing.getVideo().toDTO(),
                    user: processing.getUser().toDTO(),
                    config: processing.getProcessingConfig().toDTO(),
                    status: processing.getProcessingStatus(),
                    percentage: processing.getProcessingPercentage(),
                    log: processing.getProcessingLog(),
                    error_count: processing.getProcessingErrorCount(),
                    success: true,
                    message: "Processing listed successfully",
                    error_message: undefined,
                } as ProcessingResponse;
            });
            return processingListResponse;
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async GetProcessingListByUser (processingGateway: ProcessingRepoGatewayInterface, userId: string): Promise<ProcessingResponse[] | undefined> {
        try {
            const processingList = await processingGateway.getProcessingListByUser(userId);
            if (!processingList) {
                throw new Error("Error fetching processing list by user");
            }
            const processingListResponse = processingList.map((processing: ProcessingEntity) => {
                return {
                    id_processing: processing.getProcessingId(),
                    video: processing.getVideo().toDTO(),
                    user: processing.getUser().toDTO(),
                    config: processing.getProcessingConfig().toDTO(),
                    status: processing.getProcessingStatus(),
                    percentage: processing.getProcessingPercentage(),
                    log: processing.getProcessingLog(),
                    error_count: processing.getProcessingErrorCount(),
                    success: true,
                    message: "Processing listed successfully",
                    error_message: undefined,
                } as ProcessingResponse;
            });
            return processingListResponse;
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async RegisterProcessingStatus (processingGateway: ProcessingRepoGatewayInterface, statusMsg: StatusMsgDTO): Promise<ProcessingResponse | undefined> {
        try {
            const processing = await processingGateway.getProcessingById(statusMsg.id_video);
            if (!processing) {
                throw new Error("Processing not found");
            }
            processing.setProcessingStatusPercentage(statusMsg.percentage);
            processing.setProcessingStatus(statusMsg.status as ProcessingStatusEnum);
            const updatedProcessing = await processingGateway.setProcessing(processing);
            if (!updatedProcessing) {
                throw new Error("Error updating processing");
            }
            return {
                id_processing: processing.getProcessingId(),
                video: processing.getVideo().toDTO(),
                user: processing.getUser().toDTO(),
                config: processing.getProcessingConfig().toDTO(),
                status: processing.getProcessingStatus(),
                percentage: processing.getProcessingPercentage(),
                log: processing.getProcessingLog(),
                error_count: processing.getProcessingErrorCount(),
                success: true,
                message: "Processing status updated successfully",
                error_message: undefined,
            } as ProcessingResponse;  
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    public static async RegisterProcessingError (processingGateway: ProcessingRepoGatewayInterface, errorMsg: ErrorMsgDTO): Promise<ProcessingResponse | undefined> {
        try {
            const processing = await processingGateway.getProcessingById(errorMsg.id_video);
            if (!processing) {
                throw new Error("Processing not found");
            }
            if (errorMsg.status === "INTERRUPTED") {
                processing.setProcessingStatus(ProcessingStatusEnum.INTERRUPTED);
                const attemptLimit = Number(process.env.PROCESSING_ATTEMPTS ?? "3");
                if (processing.getProcessingErrorCount() >= attemptLimit) {
                    processing.setProcessingStatus(ProcessingStatusEnum.ERROR);
                }
            }
            const updatedProcessing = await processingGateway.setProcessing(processing);
            if (!updatedProcessing) {
                throw new Error("Error updating processing");
            }
            return {
                id_processing: processing.getProcessingId(),
                video: processing.getVideo().toDTO(),
                user: processing.getUser().toDTO(),
                config: processing.getProcessingConfig().toDTO(),
                status: processing.getProcessingStatus(),
                percentage: processing.getProcessingPercentage(),
                log: processing.getProcessingLog(),
                error_count: processing.getProcessingErrorCount(),
                success: true,
                message: `Error count #${updatedProcessing.getProcessingErrorCount()}. Last error: ${errorMsg.error_message}`,
                error_message: undefined,
            } as ProcessingResponse;  
        }
        catch (error: any) {
            throw new Error(error.message);
        }

    }

}