import { ProcessingEntity } from '../../../src/Core/Entity/ProcessingEntity';
import { ProcessingStatusEnum } from '../../../src/Core/Entity/Enum/ProcessingStatusEnum';
import { VideoValueObject } from '../../../src/Core/Entity/ValueObject/VideoValueObject';
import { UserValueObject } from '../../../src/Core/Entity/ValueObject/UserValueObject';
import { ProcessingConfigValueObject } from '../../../src/Core/Entity/ValueObject/ProcessingConfigValueObject';
import { ProcessingDTO } from '../../../src/Core/Types/DTO/ProcessingDTO';
import { ProcessingResponse } from '../../../src/Core/Types/Responses';

// Mock the console.log to avoid noise in test output
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ProcessingEntity', () => {
    // Setup mock data
    const mockVideoDTO = {
        id_video: 'vid123',
        title: 'Test Video',
        description: 'Test video description',
        filename: 'test-video.mp4',
        file_size: 1024000,
        full_path: '/path/to/test-video.mp4',
        duration: 120,
        framerate: 30
    };
    const mockUserDTO = {
        id_usuario: 'user123',
        email: 'test@example.com'
    };
    const mockConfigDTO = {
        output_format: 'mp4',
        resolution: '1080x1020',
        interval: 5
    };
    
    const mockVideo = VideoValueObject.fromDTO(mockVideoDTO);
    const mockUser = UserValueObject.fromDTO(mockUserDTO);
    const mockConfig = ProcessingConfigValueObject.fromDTO(mockConfigDTO);

    it('should create a ProcessingEntity with default values', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        
        expect(processingEntity.getProcessingId()).toBe('p123');
        expect(processingEntity.getVideo()).toBe(mockVideo);
        expect(processingEntity.getUser()).toBe(mockUser);
        expect(processingEntity.getProcessingConfig()).toBe(mockConfig);
        expect(processingEntity.getProcessingStatus()).toBe(ProcessingStatusEnum.NOT_STARTED);
        expect(processingEntity.getProcessingPercentage()).toBe(0);
        expect(processingEntity.getProcessingLog()).toBe('');
        expect(processingEntity.getProcessingErrorCount()).toBe(0);
    });

    it('should set processing status correctly', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        processingEntity.setProcessingStatus(ProcessingStatusEnum.PROCESSING);
        
        expect(processingEntity.getProcessingStatus()).toBe(ProcessingStatusEnum.PROCESSING);
        expect(processingEntity.getProcessingLog()).toContain('Status changed from');
    });

    it('should set completed status with 100% percentage', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        processingEntity.setProcessingStatus(ProcessingStatusEnum.COMPLETED);
        
        expect(processingEntity.getProcessingStatus()).toBe(ProcessingStatusEnum.COMPLETED);
        expect(processingEntity.getProcessingPercentage()).toBe(100);
        expect(processingEntity.getProcessingLog()).toContain('Processing finished successfully');
    });

    it('should increment error count when interrupted', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        processingEntity.setProcessingStatus(ProcessingStatusEnum.INTERRUPTED);
        
        expect(processingEntity.getProcessingStatus()).toBe(ProcessingStatusEnum.INTERRUPTED);
        expect(processingEntity.getProcessingErrorCount()).toBe(1);
        expect(processingEntity.getProcessingLog()).toContain('Processing interrupted');
    });

    it('should set processing percentage correctly', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        processingEntity.setProcessingStatusPercentage(50);
        
        expect(processingEntity.getProcessingPercentage()).toBe(50);
    });

    it('should throw error for invalid percentage', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        
        expect(() => {
            processingEntity.setProcessingStatusPercentage(-1);
        }).toThrow('Invalid percentage value');
        
        expect(() => {
            processingEntity.setProcessingStatusPercentage(101);
        }).toThrow('Invalid percentage value');
    });

    it('should throw error when decreasing percentage', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        processingEntity.setProcessingStatusPercentage(50);
        
        expect(() => {
            processingEntity.setProcessingStatusPercentage(40);
        }).toThrow('Percentage value cannot be decreased');
    });

    it('should append to processing log', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        processingEntity.appendProcessingLog('Test log message');
        
        expect(processingEntity.getProcessingLog()).toContain('Test log message');
    });

    it('should create proper status message', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        const statusMsg = processingEntity.getStatusMsg();
        
        expect(statusMsg).toContain(mockUser.getEmail());
        expect(statusMsg).toContain('0%');
        expect(statusMsg).toContain('0 retries');
    });

    it('should create entity from DTO', () => {
        const mockDTO: ProcessingDTO = {
            video: mockVideoDTO,
            user: mockUserDTO,
            config: mockConfigDTO
        };
        
        const processingEntity = ProcessingEntity.fromDTO(mockDTO);
        
        expect(processingEntity.getProcessingId()).toBe(mockVideoDTO.id_video);
        expect(processingEntity.getProcessingStatus()).toBe(ProcessingStatusEnum.NOT_STARTED);
    });

    it('should create entity from Response', () => {
        const mockResponse: ProcessingResponse = {
            id_processing: 'p123',
            video: mockVideoDTO,
            user: mockUserDTO,
            config: mockConfigDTO,
            status: ProcessingStatusEnum.NOT_STARTED,
            percentage: 0,
            log: '',
            error_count: 0,
            success: true,
            message: '',
            error_message: ''
        };
        
        const processingEntity = ProcessingEntity.fromResponse(mockResponse);
        
        expect(processingEntity.getProcessingId()).toBe('p123');
        expect(processingEntity.getProcessingStatus()).toBe(ProcessingStatusEnum.NOT_STARTED);
    });

    it('should create reprocessing DTO correctly', () => {
        const processingEntity = new ProcessingEntity('p123', mockVideo, mockUser, mockConfig);
        const reprocessingDTO = processingEntity.toReprocessingDTO();
        
        expect(reprocessingDTO).toHaveProperty('video');
        expect(reprocessingDTO).toHaveProperty('user');
        expect(reprocessingDTO).toHaveProperty('processing_config');
    });
});