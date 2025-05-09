import { ProcessingStatusEnum } from "../Enum/ProcessingStatusEnum";

export class StatusMsgValueObject {
    private readonly idVideo: string;
    private readonly idUser: string;
    private readonly statusMsg: ProcessingStatusEnum;
    private readonly statusTimestamp: Date;
    private readonly processingPercentage: number;
    private readonly message: string;

    constructor(idVideo: string, idUser: string, statusMsg: ProcessingStatusEnum, statusTimestamp: Date, processingPercentage: number, message: string) {
        this.idVideo = idVideo;
        this.idUser = idUser;
        this.statusMsg = statusMsg;
        this.statusTimestamp = statusTimestamp;
        this.processingPercentage = processingPercentage;
        this.message = message;
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

    public getMessage(): string {
        return this.message;
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
            processingPercentage: this.processingPercentage,
            message: this.message
        };
    }

}