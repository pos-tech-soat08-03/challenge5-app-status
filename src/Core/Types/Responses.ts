import { ProcessingConfigDTO } from "./DTO/ProcessingConfigDTO";
import { UserDTO } from "./DTO/UserDTO";
import { VideoDTO } from "./DTO/VideoDTO";

export type ProcessingResponse = {
    id_processing: string | undefined;
    video_dto: VideoDTO | undefined;
    user_dto: UserDTO | undefined;
    config_dto: ProcessingConfigDTO | undefined;
    status: string | undefined;
    percentage: number | undefined; 
    log: string | undefined;
    error_count: number | undefined;
    success: boolean;
    message: string | undefined;
    error_message: string | undefined;
}