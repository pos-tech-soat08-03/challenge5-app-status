import { ProcessingStatusGateway } from "../../Application/Gateway/ProcessingStatusRepoGateway";
import { ProcessingEntity } from "../Entity/ProcessingEntity";
import { ProcessingConfigValueObject } from "../Entity/ValueObject/ProcessingConfigValueObject";
import { ProcessingStatusEnum } from "../Entity/ValueObject/ProcessingStatusEnum";
import { UserValueObject } from "../Entity/ValueObject/UserValueObject";
import { VideoValueObject } from "../Entity/ValueObject/VideoValueObject";
import { ProcessingRepoGatewayInterface } from "../Interfaces/Gateway/ProcessingRepoGatewayInterface";
import { ProcessingConfigDTO } from "../Types/DTO/ProcessingConfigDTO";
import { UserDTO } from "../Types/DTO/UserDTO";
import { VideoDTO } from "../Types/DTO/VideoDTO";

// export class ProcessingUseCaseResponse {
//     public id: string;
//     public status: string;
//     public percentage: number;
//     public message: string;

//     constructor(id: string, status: string, percentage: number, message: string) {
//         this.id = id;
//         this.status = status;
//         this.percentage = percentage;
//         this.message = message;
//     }
// }

export class ProcessingUseCases {

    public static async CreateProcessingPersistence (processingGateway: ProcessingRepoGatewayInterface, videoDTO: VideoDTO, userDTO: UserDTO, configDTO: ProcessingConfigDTO): Promise<ProcessingEntity> {
        
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
            return processing;

        }
        catch (error: any) {
            throw new Error(error);
        }
    }

}