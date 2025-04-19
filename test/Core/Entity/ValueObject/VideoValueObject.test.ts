import { VideoDTO } from "../../../../src/Core/Types/DTO/VideoDTO";
import { VideoValueObject } from "../../../../src/Core/Entity/ValueObject/VideoValueObject";


describe('VideoValueObject', () => {
    // Setup mock data
    const mockVideoDTO: VideoDTO = {
        id_video: 'vid123',
        title: 'Test Video',
        description: 'Test video description',
        filename: 'test-video.mp4',
        file_size: 1024000,
        full_path: '/path/to/test-video.mp4',
        duration: 120,
        framerate: 30
    };

    it('should create a VideoValueObject with the provided values', () => {
        const videoVO = new VideoValueObject(
            'vid123',
            'Test Video',
            'Test video description',
            'test-video.mp4',
            1024000,
            '/path/to/test-video.mp4',
            120,
            30
        );

        expect(videoVO.getId()).toBe('vid123');
        expect(videoVO.getTitulo()).toBe('Test Video');
        expect(videoVO.getDescricao()).toBe('Test video description');
        expect(videoVO.getFileName()).toBe('test-video.mp4');
        expect(videoVO.getFileSize()).toBe(1024000);
        expect(videoVO.getFullPath()).toBe('/path/to/test-video.mp4');
        expect(videoVO.getDuration()).toBe(120);
        expect(videoVO.getFrameRate()).toBe(30);
    });

    it('should create a VideoValueObject from DTO', () => {
        const videoVO = VideoValueObject.fromDTO(mockVideoDTO);

        expect(videoVO.getId()).toBe('vid123');
        expect(videoVO.getTitulo()).toBe('Test Video');
        expect(videoVO.getDescricao()).toBe('Test video description');
        expect(videoVO.getFileName()).toBe('test-video.mp4');
        expect(videoVO.getFileSize()).toBe(1024000);
        expect(videoVO.getFullPath()).toBe('/path/to/test-video.mp4');
        expect(videoVO.getDuration()).toBe(120);
        expect(videoVO.getFrameRate()).toBe(30);
    });

    it('should convert VideoValueObject to DTO', () => {
        const videoVO = new VideoValueObject(
            'vid123',
            'Test Video',
            'Test video description',
            'test-video.mp4',
            1024000,
            '/path/to/test-video.mp4',
            120,
            30
        );

        const dto = videoVO.toDTO();

        expect(dto).toEqual(mockVideoDTO);
        expect(dto.id_video).toBe('vid123');
        expect(dto.title).toBe('Test Video');
        expect(dto.description).toBe('Test video description');
        expect(dto.filename).toBe('test-video.mp4');
        expect(dto.file_size).toBe(1024000);
        expect(dto.full_path).toBe('/path/to/test-video.mp4');
        expect(dto.duration).toBe(120);
        expect(dto.framerate).toBe(30);
    });

    it('should handle empty values when creating from DTO', () => {
        const emptyDTO = {
            id_video: '',
            title: '',
            description: '',
            filename: '',
            file_size: 0,
            full_path: '',
            duration: 0,
            framerate: 0
        };

        const videoVO = VideoValueObject.fromDTO(emptyDTO);

        expect(videoVO.getId()).toBe('');
        expect(videoVO.getTitulo()).toBe('');
        expect(videoVO.getDescricao()).toBe('');
        expect(videoVO.getFileName()).toBe('');
        expect(videoVO.getFileSize()).toBe(0);
        expect(videoVO.getFullPath()).toBe('');
        expect(videoVO.getDuration()).toBe(0);
        expect(videoVO.getFrameRate()).toBe(0);
    });
});