import { ProcessingStatusEnum } from "../Enum/ProcessingStatusEnum";

export class StatusMsgValueObject {
    private readonly idVideo: string;
    private readonly idUser: string;
    private readonly statusMsg: ProcessingStatusEnum;
    private readonly statusTimestamp: Date;
    private readonly processingPercentage: number;

    constructor(idVideo: string, idUser: string, statusMsg: ProcessingStatusEnum, statusTimestamp: Date, processingPercentage: number) {
        this.idVideo = idVideo;
        this.idUser = idUser;
        this.statusMsg = statusMsg;
        this.statusTimestamp = statusTimestamp;
        this.processingPercentage = processingPercentage;
    }

    public getIdVideo(): string {
        return this.idVideo;
    }
    
    public getIdUser(): string {
        return this.idUser;
    }
    
    public getStatusMsg(): ProcessingStatusEnum {
        return this.statusMsg;
    }
    
    public getStatusTimestamp(): Date {
        return this.statusTimestamp;
    }
    
    public getProcessingPercentage(): number {
        return this.processingPercentage;
    }
    
    public toJson(): object {
        return {
            idVideo: this.idVideo,
            idUser: this.idUser,
            statusMsg: this.statusMsg,
            statusTimestamp: this.statusTimestamp,
            processingPercentage: this.processingPercentage
        };
    }

}