import { ProcessingConfigValueObject } from "../../../../src/Core/Entity/ValueObject/ProcessingConfigValueObject";

describe('ProcessingConfigValueObject', () => {
    // Setup mock data
    const mockConfigDTO = {
        output_format: 'mp4',
        resolution: '1080x720',
        interval: 5
    };

    it('should create a ProcessingConfigValueObject with correct values', () => {
        const config = new ProcessingConfigValueObject('mp4', '1080x720', 5);
        
        expect(config.getOutputFormat()).toBe('mp4');
        expect(config.getResolution()).toBe('1080x720');
        expect(config.getInterval()).toBe(5);
    });

    it('should create a ProcessingConfigValueObject from DTO', () => {
        const config = ProcessingConfigValueObject.fromDTO(mockConfigDTO);
        
        expect(config.getOutputFormat()).toBe('mp4');
        expect(config.getResolution()).toBe('1080x720');
        expect(config.getInterval()).toBe(5);
    });

    it('should convert ProcessingConfigValueObject to DTO', () => {
        const config = new ProcessingConfigValueObject('mp4', '1080x720', 5);
        const dto = config.toDTO();
        
        expect(dto).toEqual({
            output_format: 'mp4',
            resolution: '1080x720',
            interval: 5
        });
    });

    it('should handle different output formats', () => {
        const config = new ProcessingConfigValueObject('avi', '1080x720', 5);
        expect(config.getOutputFormat()).toBe('avi');
    });

    it('should handle different resolutions', () => {
        const config = new ProcessingConfigValueObject('mp4', '640x480', 5);
        expect(config.getResolution()).toBe('640x480');
    });

    it('should handle different intervals', () => {
        const config = new ProcessingConfigValueObject('mp4', '1080x720', 10);
        expect(config.getInterval()).toBe(10);
    });

    it('should handle DTO with different values', () => {
        const customDTO = {
            output_format: 'webm',
            resolution: '320x240',
            interval: 2
        };
        
        const config = ProcessingConfigValueObject.fromDTO(customDTO);
        
        expect(config.getOutputFormat()).toBe('webm');
        expect(config.getResolution()).toBe('320x240');
        expect(config.getInterval()).toBe(2);
    });
});