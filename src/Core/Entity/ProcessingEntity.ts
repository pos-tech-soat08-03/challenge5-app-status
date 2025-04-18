import { ProcessingConfigValueObject } from './ValueObject/ProcessingConfigValueObject';
import { ProcessingStatusEnum } from './Enum/ProcessingStatusEnum';
import { UserValueObject } from './ValueObject/UserValueObject';
import { VideoValueObject } from './ValueObject/VideoValueObject';
import { ProcessingDTO } from '../Types/DTO/ProcessingDTO';
import { ProcessingResponse } from '../Types/Responses';

export class ProcessingEntity {
    private readonly processingId: string;
    private readonly processingVideo: VideoValueObject;
    private readonly processingUser: UserValueObject;
    private readonly processingConfig: ProcessingConfigValueObject;
    private processingStatus: ProcessingStatusEnum;
    private processingPercentage: number;
    private processingLog: string;
    private processingErrorCount: number;

    constructor (processingId: string, processingVideo: VideoValueObject, processingUser: UserValueObject, processingConfig: ProcessingConfigValueObject, processingStatus?: ProcessingStatusEnum, processincPercentage?:number, processingLog?: string, processingErrorCount?: number) {
        this.processingId = processingId;
        this.processingVideo = processingVideo;
        this.processingUser = processingUser;
        this.processingConfig = processingConfig;
        this.processingStatus = processingStatus ?? ProcessingStatusEnum.NOT_STARTED;
        this.processingPercentage = processincPercentage ?? 0;
        this.processingLog = processingLog ?? '';
        this.processingErrorCount = processingErrorCount ?? 0;
    }
    
    public setProcessingStatus(processingStatus: ProcessingStatusEnum): void {
        if (processingStatus === ProcessingStatusEnum.COMPLETED) {
            this.setProcessingStatusPercentage(100);
            this.appendProcessingLog('Processing finished successfully at ' + new Date().toISOString());
        }
        if (processingStatus === ProcessingStatusEnum.INTERRUPTED) {
            this.processingErrorCount++;
            this.appendProcessingLog(`Processing interrupted at ${new Date().toISOString()}. This is error #${this.processingErrorCount}.`);
        }
        if (this.processingStatus !== processingStatus) {
            this.appendProcessingLog(`Status changed from ${this.processingStatus} to ${processingStatus} at ` + new Date().toISOString());
        }
        this.processingStatus = processingStatus;
    }

    public setProcessingStatusPercentage(processingStatusPercentage: number): void {
        if (processingStatusPercentage < 0 || processingStatusPercentage > 100) {
            throw new Error("Invalid percentage value");
        }
        if (processingStatusPercentage < this.processingPercentage) {
            throw new Error("Percentage value cannot be decreased");
        }
        this.processingPercentage = processingStatusPercentage;
    }

    public appendProcessingLog(processingLog: string): void {
        console.log(processingLog);
        this.processingLog = this.processingLog.concat(`\n${processingLog}`);
    }

    public getProcessingId(): string {
        return this.processingId;
    }

    public getVideo(): VideoValueObject {
        return this.processingVideo;
    }

    public getProcessingConfig(): ProcessingConfigValueObject {
        return this.processingConfig;
    }

    public getUser(): UserValueObject {
        return this.processingUser;
    }

    public getProcessingStatus(): ProcessingStatusEnum {
        return this.processingStatus;
    }

    public getProcessingPercentage(): number {
        return this.processingPercentage;
    }

    public getProcessingLog(): string {
        return this.processingLog;
    }

    public toReprocessingDTO(): any {
        return {
            video: { ...this.processingVideo.toDTO() },
            user: { ...this.processingUser.toDTO() },
            processing_config: { ...this.processingConfig.toDTO() },
        };
    }

    public getProcessingErrorCount(): number {
        return this.processingErrorCount;
    }

    public getStatusMsg(): string {
        return `Processing Video ${this.processingVideo.getTitulo} for user ${this.processingUser.getEmail()} with status ${this.getProcessingStatus()} at ${this.getProcessingPercentage()}% (${this.getProcessingErrorCount()} retries).`;
    }

    public static fromDTO(processingDTO: ProcessingDTO): ProcessingEntity {
        const processingId = processingDTO.video.id_video;
        const processingVideo = VideoValueObject.fromDTO(processingDTO.video);
        const processingUser = UserValueObject.fromDTO(processingDTO.user);
        const processingConfig = ProcessingConfigValueObject.fromDTO(processingDTO.config);
        return new ProcessingEntity(
            processingId,
            processingVideo,
            processingUser,
            processingConfig
        );
    }

    public static fromResponse(pr: ProcessingResponse): ProcessingEntity {
        const processingId = pr.id_processing;
        const processingVideo = VideoValueObject.fromDTO(pr.video);
        const processingUser = UserValueObject.fromDTO(pr.user);
        const processingConfig = ProcessingConfigValueObject.fromDTO(pr.config);
        return new ProcessingEntity(
            processingId ?? '',
            processingVideo,
            processingUser,
            processingConfig,
        );
    }

}