import { ProcessingEntity } from "../Entity/ProcessingEntity";
import { ProcessingConfigValueObject } from "../Entity/ValueObject/ProcessingConfigValueObject";
import { ProcessingStatusEnum } from "../Entity/ValueObject/ProcessingStatusEnum";
import { UserValueObject } from "../Entity/ValueObject/UserValueObject";
import { VideoValueObject } from "../Entity/ValueObject/VideoValueObject";
import { ProcessingRepoGatewayInterface } from "../Interfaces/Gateway/ProcessingRepoGatewayInterface";
import { ErrorMsgDTO } from "../Types/DTO/ErrorMsgDTO";
import { ProcessingConfigDTO } from "../Types/DTO/ProcessingConfigDTO";
import { StatusMsgDTO } from "../Types/DTO/StatusMsgDTO";
import { UserDTO } from "../Types/DTO/UserDTO";
import { VideoDTO } from "../Types/DTO/VideoDTO";

export class ProcessingUseCaseResponse {
    public processingId: string;
    public videoDTO: VideoDTO;
    public userDTO: UserDTO;
    public configDTO: ProcessingConfigDTO;
    public status: string;
    public percentage: number;
    public message: string;
    constructor(
        processingId: string,
        videoDTO: VideoDTO,
        userDTO: UserDTO,
        configDTO: ProcessingConfigDTO,
        status: string,
        percentage: number,
        message: string
    ) {
        this.processingId = processingId;
        this.videoDTO = videoDTO;
        this.userDTO = userDTO;
        this.configDTO = configDTO;
        this.status = status;
        this.percentage = percentage;
        this.message = message;

    }
}

export class ProcessingUseCases {

    public static async CreateProcessing (processingGateway: ProcessingRepoGatewayInterface, videoDTO: VideoDTO, userDTO: UserDTO, configDTO: ProcessingConfigDTO): Promise<ProcessingUseCaseResponse | undefined> {
        
        try {
            
            const processingId = videoDTO.id_video + "-" + userDTO.id_usuario;
        
            const newProcessing = new ProcessingEntity(
                processingId, 
                new VideoValueObject(videoDTO.id_video, videoDTO.title, videoDTO.description, videoDTO.filename, videoDTO.file_size, videoDTO.full_path, videoDTO.duration, videoDTO.framerate), 
                new UserValueObject(userDTO.id_usuario, userDTO.email), 
                new ProcessingConfigValueObject(configDTO.output_format, configDTO.resolution, configDTO.interval)
            );

            const currentProcessing = await processingGateway.getProcessingById(processingId);
            if (currentProcessing) {
                throw new Error("Processing already exists");
            }

            const processing = await processingGateway.setProcessing(newProcessing);
            if (!processing) {
                throw new Error("Error creating new processing");
            }
            return new ProcessingUseCaseResponse(
                processing.getProcessingId(),
                processing.getVideo().toDTO(),
                processing.getUser().toDTO(),
                processing.getProcessingConfig().toDTO(),
                processing.getProcessingStatus(),
                processing.getProcessingPercentage(),
                "Processing created successfully"
            );
        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    public static async GetProcessing (processingGateway: ProcessingRepoGatewayInterface, processingId: string): Promise<ProcessingUseCaseResponse | undefined> {
        try {
            const processing = await processingGateway.getProcessingById(processingId);
            if (!processing) {
                return undefined;
            }
            return new ProcessingUseCaseResponse(
                processing.getProcessingId(),
                processing.getVideo().toDTO(),
                processing.getUser().toDTO(),
                processing.getProcessingConfig().toDTO(),
                processing.getProcessingStatus(),
                processing.getProcessingPercentage(),
                "Processing obtained successfully"
            );
        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    public static async GetProcessingList (processingGateway: ProcessingRepoGatewayInterface): Promise<ProcessingUseCaseResponse[] | undefined> {
        try {
            const processingList = await processingGateway.getProcessingList();
            if (!processingList) {
                return undefined;
            }
            const processingListResponse = processingList.map((processing: ProcessingEntity) => {
                return new ProcessingUseCaseResponse(
                    processing.getProcessingId(),
                    processing.getVideo().toDTO(),
                    processing.getUser().toDTO(),
                    processing.getProcessingConfig().toDTO(),
                    processing.getProcessingStatus(),
                    processing.getProcessingPercentage(),
                    "Processing listed successfully"
                );
            });
            return processingListResponse;
        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    public static async GetProcessingListByUser (processingGateway: ProcessingRepoGatewayInterface, userId: string): Promise<ProcessingUseCaseResponse[] | undefined> {
        try {
            const processingList = await processingGateway.getProcessingListByUser(userId);
            if (!processingList) {
                return undefined;
            }
            const processingListResponse = processingList.map((processing: ProcessingEntity) => {
                return new ProcessingUseCaseResponse(
                    processing.getProcessingId(),
                    processing.getVideo().toDTO(),
                    processing.getUser().toDTO(),
                    processing.getProcessingConfig().toDTO(),
                    processing.getProcessingStatus(),
                    processing.getProcessingPercentage(),
                    "Processing listed successfully"
                );
            });
            return processingListResponse;
        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    public static async RegisterProcessingStatus (processingGateway: ProcessingRepoGatewayInterface, statusMsg: StatusMsgDTO): Promise<ProcessingUseCaseResponse | undefined> {
        try {
            const processing = await processingGateway.getProcessingById(statusMsg.id_video + "-" + statusMsg.id_usuario);
            if (!processing) {
                throw new Error("Processing not found");
            }
            processing.setProcessingStatusPercentage(statusMsg.percentage);
            processing.setProcessingStatus(statusMsg.status as ProcessingStatusEnum);
            const updatedProcessing = await processingGateway.setProcessing(processing);
            if (!updatedProcessing) {
                throw new Error("Error updating processing");
            }
            return new ProcessingUseCaseResponse(
                updatedProcessing.getProcessingId(),
                updatedProcessing.getVideo().toDTO(),
                updatedProcessing.getUser().toDTO(),
                updatedProcessing.getProcessingConfig().toDTO(),
                updatedProcessing.getProcessingStatus(),
                updatedProcessing.getProcessingPercentage(),
                "Processing updated successfully"
            );        }
        catch (error: any) {
            throw new Error(error);
        }
    }

    public static async RegisterProcessingError (processingGateway: ProcessingRepoGatewayInterface, errorMsg: ErrorMsgDTO): Promise<ProcessingUseCaseResponse | undefined> {
        try {
            const processing = await processingGateway.getProcessingById(errorMsg.id_video + "-" + errorMsg.id_user);
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
            return new ProcessingUseCaseResponse(
                updatedProcessing.getProcessingId(),
                updatedProcessing.getVideo().toDTO(),
                updatedProcessing.getUser().toDTO(),
                updatedProcessing.getProcessingConfig().toDTO(),
                updatedProcessing.getProcessingStatus(),
                updatedProcessing.getProcessingPercentage(),
                `Error count #${updatedProcessing.getProcessingErrorCount()}. Last error: ${errorMsg.error_message}`
            );
        }
        catch (error: any) {
            throw new Error(error);
        }

    }

}