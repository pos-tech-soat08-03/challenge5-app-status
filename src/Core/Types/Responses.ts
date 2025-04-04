import { ProcessingConfigDTO } from "./DTO/ProcessingConfigDTO";
import { UserDTO } from "./DTO/UserDTO";
import { VideoDTO } from "./DTO/VideoDTO";

export type ProcessingResponse = {
    id_processing: string | undefined;
    video: VideoDTO | undefined;
    user: UserDTO | undefined;
    config: ProcessingConfigDTO | undefined;
    status: string | undefined;
    percentage: number | undefined; 
    log: string | undefined;
    error_count: number | undefined;
    success: boolean;
    message: string | undefined;
    error_message: string | undefined;
}