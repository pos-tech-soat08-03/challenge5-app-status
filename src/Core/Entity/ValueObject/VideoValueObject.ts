import { VideoDTO } from "../../Types/DTO/VideoDTO";

export class VideoValueObject {

    private readonly id: string;
    private readonly titulo: string;
    private readonly descricao: string;
    private readonly fileName: string;
    private readonly fileSize: number;
    private readonly fullPath: string;
    private readonly duration: number;
    private readonly frameRate: number;

    constructor (id: string, titulo: string, descricao: string, fileName: string, fileSize: number, fullPath: string, duration: number, frameRate:number) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fullPath = fullPath;
        this.duration = duration;
        this.frameRate = frameRate;
    }

    public getId(): string {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getFileSize(): number {
        return this.fileSize;
    }

    public getFullPath(): string {
        return this.fullPath;
    }    

    public getDuration(): number {
        return this.duration;
    }

    public getFrameRate(): number {
        return this.frameRate;
    }

    public toDTO(): VideoDTO {
        return {
            id_video: this.id,
            title: this.titulo,
            description: this.descricao,
            filename: this.fileName,
            file_size: this.fileSize,
            full_path: this.fullPath,
            duration: this.duration,
            framerate: this.frameRate
        };
    }

    public static fromDTO(videoDTO: any): VideoValueObject {
        return new VideoValueObject(
            videoDTO.id_video,
            videoDTO.title,
            videoDTO.description,
            videoDTO.filename,
            videoDTO.file_size,
            videoDTO.full_path,
            videoDTO.duration,
            videoDTO.framerate
        );
    }

}