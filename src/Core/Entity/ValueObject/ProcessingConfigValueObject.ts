export class ProcessingConfigValueObject {

    private readonly outputFormat: string;
    private readonly resolution: string;
    private readonly interval: number;
    
    constructor (outputFormat: string, resolution: string, interval: number) {
        this.outputFormat = outputFormat;
        this.resolution = resolution;
        this.interval = interval;
    }

    public getOutputFormat(): string {
        return this.outputFormat;
    }

    public getResolution(): string {
        return this.resolution;
    }

    public getInterval(): number {
        return this.interval;
    }

    public toDTO(): any {
        return {
            output_format: this.outputFormat,
            resolution: this.resolution,
            interval: this.interval
        };
    }

    public static fromDTO(dto: any): ProcessingConfigValueObject {
        return new ProcessingConfigValueObject(
            dto.output_format,
            dto.resolution,
            dto.interval
        );
    }

}