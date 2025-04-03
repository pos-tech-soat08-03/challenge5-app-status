import { ProcessingStatusEnum } from "./ProcessingStatusEnum";

export class ErrorMsgValueObject {

    private readonly idVideo: string;
    private readonly idUser: string;
    private readonly statusMsg: ProcessingStatusEnum;
    private readonly statusTimestamp: Date;
    private readonly errorMsg: string;

    constructor(idVideo: string, idUser: string, statusMsg: ProcessingStatusEnum, statusTimestamp: Date, errorMsg: string){
        this.idVideo = idVideo;
        this.idUser = idUser;
        this.statusMsg = statusMsg;
        this.statusTimestamp = statusTimestamp;
        this.errorMsg = errorMsg;
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
    
    public getErrorMsg(): string {
        return this.errorMsg;
    }

    public toJson(): object {
        return {
            id_video: this.idVideo,
            id_user: this.idUser,
            status: this.statusMsg,
            status_time: this.statusTimestamp,
            error_message: this.errorMsg
        };
    }

}