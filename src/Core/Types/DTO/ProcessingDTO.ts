import { VideoDTO } from "./VideoDTO"
import { UserDTO } from "./UserDTO"
import { ProcessingConfigDTO } from "./ProcessingConfigDTO"

export type ProcessingDTO = {
    video: VideoDTO,
    user: UserDTO,
    config: ProcessingConfigDTO
}