import { ProcessingStatusEnum } from "../../../src/Core/Entity/Enum/ProcessingStatusEnum";
import { ProcessingEntity } from "../../../src/Core/Entity/ProcessingEntity";
import { ProcessingConfigValueObject } from "../../../src/Core/Entity/ValueObject/ProcessingConfigValueObject";
import { UserValueObject } from "../../../src/Core/Entity/ValueObject/UserValueObject";
import { VideoValueObject } from "../../../src/Core/Entity/ValueObject/VideoValueObject";
import { ProcessingRepoGatewayInterface } from "../../../src/Core/Interfaces/Gateway/ProcessingRepoGatewayInterface";
import { ErrorMsgDTO } from "../../../src/Core/Types/DTO/ErrorMsgDTO";
import { ProcessingConfigDTO } from "../../../src/Core/Types/DTO/ProcessingConfigDTO";
import { StatusMsgDTO } from "../../../src/Core/Types/DTO/StatusMsgDTO";
import { UserDTO } from "../../../src/Core/Types/DTO/UserDTO";
import { VideoDTO } from "../../../src/Core/Types/DTO/VideoDTO";
import { ProcessingResponse } from "../../../src/Core/Types/Responses";
import { ProcessingUseCases } from "../../../src/Core/Usecase/ProcessingUseCases";


const mockVideoDTO: VideoDTO = {
    id_video: 'vid1',
    title: 'Test Video',
    description: 'desc',
    filename: 'file.mp4',
    file_size: 1000,
    full_path: '/tmp/file.mp4',
    duration: 10,
    framerate: 30,
};

const mockUserDTO: UserDTO = {
    id_usuario: 'user1',
    email: 'user@example.com',
};

const mockConfigDTO: ProcessingConfigDTO = {
    output_format: 'mp4',
    resolution: '720p',
    interval: 5,
};

const mockVideo = new VideoValueObject(
    mockVideoDTO.id_video,
    mockVideoDTO.title,
    mockVideoDTO.description,
    mockVideoDTO.filename,
    mockVideoDTO.file_size,
    mockVideoDTO.full_path,
    mockVideoDTO.duration,
    mockVideoDTO.framerate
);

const mockUser = new UserValueObject(
    mockUserDTO.id_usuario,
    mockUserDTO.email
);

const mockConfig = new ProcessingConfigValueObject(
    mockConfigDTO.output_format,
    mockConfigDTO.resolution,
    mockConfigDTO.interval
);

const mockProcessingEntity = new ProcessingEntity(
    'vid1',
    mockVideo,
    mockUser,
    mockConfig
);

const mockProcessingResponse: ProcessingResponse = {
    id_processing: 'vid1',
    video: mockVideoDTO,
    user: mockUserDTO,
    config: mockConfigDTO,
    status: ProcessingStatusEnum.NOT_STARTED,
    percentage: 0,
    log: '',
    error_count: 0,
    success: true,
    message: 'Processing created successfully',
    error_message: undefined,
};

const mockGateway: jest.Mocked<ProcessingRepoGatewayInterface> = {
    getProcessingById: jest.fn(),
    setProcessing: jest.fn(),
    getProcessingList: jest.fn(),
    getProcessingListByUser: jest.fn(),
};

describe('ProcessingUseCases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('CreateProcessing', () => {
        it('should create a new processing and return response', async () => {
            mockGateway.getProcessingById.mockResolvedValue(undefined);
            mockGateway.setProcessing.mockResolvedValue(mockProcessingEntity);

            const result = await ProcessingUseCases.CreateProcessing(
                mockGateway,
                mockVideoDTO,
                mockUserDTO,
                mockConfigDTO
            );

            expect(mockGateway.getProcessingById).toHaveBeenCalledWith('vid1');
            expect(mockGateway.setProcessing).toHaveBeenCalled();
            expect(result).toMatchObject({
                id_processing: 'vid1',
                status: ProcessingStatusEnum.NOT_STARTED,
                success: true,
            });
        });

        it('should throw error if processing already exists', async () => {
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);

            await expect(
                ProcessingUseCases.CreateProcessing(
                    mockGateway,
                    mockVideoDTO,
                    mockUserDTO,
                    mockConfigDTO
                )
            ).rejects.toThrow('Processing already exists in the system');
        });

        it('should throw error if setProcessing fails', async () => {
            mockGateway.getProcessingById.mockResolvedValue(undefined);
            mockGateway.setProcessing.mockResolvedValue(undefined);

            await expect(
                ProcessingUseCases.CreateProcessing(
                    mockGateway,
                    mockVideoDTO,
                    mockUserDTO,
                    mockConfigDTO
                )
            ).rejects.toThrow('Error creating new processing');
        });
    });

    describe('GetProcessing', () => {
        it('should return processing response if found', async () => {
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);

            const result = await ProcessingUseCases.GetProcessing(
                mockGateway,
                'vid1'
            );

            expect(result).toMatchObject({
                id_processing: 'vid1',
                status: ProcessingStatusEnum.NOT_STARTED,
                success: true,
            });
        });

        it('should throw error if processing not found', async () => {
            mockGateway.getProcessingById.mockResolvedValue(undefined);

            await expect(
                ProcessingUseCases.GetProcessing(mockGateway, 'vid1')
            ).rejects.toThrow('ID not found');
        });
    });

    describe('GetProcessingList', () => {
        it('should return list of processing responses', async () => {
            mockGateway.getProcessingList.mockResolvedValue([mockProcessingEntity]);

            const result = await ProcessingUseCases.GetProcessingList(mockGateway);

            expect(Array.isArray(result)).toBe(true);
            expect(result?.[0]).toMatchObject({
                id_processing: 'vid1',
                status: ProcessingStatusEnum.NOT_STARTED,
                success: true,
            });
        });

        it('should throw error if list is undefined', async () => {
            mockGateway.getProcessingList.mockResolvedValue(undefined);

            await expect(
                ProcessingUseCases.GetProcessingList(mockGateway)
            ).rejects.toThrow('Error fetching processing list');
        });
    });

    describe('GetProcessingListByUser', () => {
        it('should return list of processing responses for user', async () => {
            mockGateway.getProcessingListByUser.mockResolvedValue([mockProcessingEntity]);

            const result = await ProcessingUseCases.GetProcessingListByUser(
                mockGateway,
                'user1'
            );

            expect(Array.isArray(result)).toBe(true);
            expect(result?.[0]).toMatchObject({
                id_processing: 'vid1',
                status: ProcessingStatusEnum.NOT_STARTED,
                success: true,
            });
        });

        it('should throw error if list is undefined', async () => {
            mockGateway.getProcessingListByUser.mockResolvedValue(undefined);

            await expect(
                ProcessingUseCases.GetProcessingListByUser(mockGateway, 'user1')
            ).rejects.toThrow('Error fetching processing list by user');
        });
    });

    describe('RegisterProcessingStatus', () => {
        it('should update processing status and return response', async () => {
            const setProcessingSpy = jest.spyOn(mockProcessingEntity, 'setProcessingStatus');
            const setPercentageSpy = jest.spyOn(mockProcessingEntity, 'setProcessingStatusPercentage');
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);
            mockGateway.setProcessing.mockResolvedValue(mockProcessingEntity);

            const statusMsg: StatusMsgDTO = {
                id_video: 'vid1',
                status: ProcessingStatusEnum.PROCESSING,
                percentage: 50,
                id_usuario: '',
                status_time: new Date(),
                message: ''
            };

            const result = await ProcessingUseCases.RegisterProcessingStatus(
                mockGateway,
                statusMsg
            );

            expect(setPercentageSpy).toHaveBeenCalledWith(50);
            expect(setProcessingSpy).toHaveBeenCalledWith(ProcessingStatusEnum.PROCESSING);
            expect(result).toMatchObject({
                id_processing: 'vid1',
                status: ProcessingStatusEnum.PROCESSING,
                percentage: 50,
                success: true,
            });
        });

        it('should throw error if processing not found', async () => {
            mockGateway.getProcessingById.mockResolvedValue(undefined);

            const statusMsg: StatusMsgDTO = {
                id_video: 'vid1',
                status: ProcessingStatusEnum.PROCESSING,
                percentage: 50,
                id_usuario: '',
                status_time: new Date(),
                message: ''
            };

            await expect(
                ProcessingUseCases.RegisterProcessingStatus(mockGateway, statusMsg)
            ).rejects.toThrow('Processing not found');
        });

        it('should throw error if setProcessing fails', async () => {
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);
            mockGateway.setProcessing.mockResolvedValue(undefined);

            const statusMsg: StatusMsgDTO = {
                id_video: 'vid1',
                status: ProcessingStatusEnum.PROCESSING,
                percentage: 50,
                id_usuario: '',
                status_time: new Date(),
                message: ''
            };

            await expect(
                ProcessingUseCases.RegisterProcessingStatus(mockGateway, statusMsg)
            ).rejects.toThrow('Error updating processing');
        });
    });

    describe('RegisterProcessingError', () => {
        beforeEach(() => {
            process.env.PROCESSING_ATTEMPTS = '2';
        });

        it('should set status to INTERRUPTED and increment error count', async () => {
            const setStatusSpy = jest.spyOn(mockProcessingEntity, 'setProcessingStatus');
            jest.spyOn(mockProcessingEntity, 'getProcessingErrorCount').mockReturnValue(1);
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);
            mockGateway.setProcessing.mockResolvedValue(mockProcessingEntity);

            const errorMsg: ErrorMsgDTO = {
                id_video: 'vid1',
                status: 'INTERRUPTED',
                error_message: 'Some error',
                id_user: '',
                status_time: new Date(),
            };

            const result = await ProcessingUseCases.RegisterProcessingError(
                mockGateway,
                errorMsg
            );

            expect(setStatusSpy).toHaveBeenCalledWith(ProcessingStatusEnum.INTERRUPTED);
            expect(result?.success).toBe(true);
            expect(result?.message).toContain('Last error: Some error');
        });

        it('should set status to ERROR if error count >= attempts', async () => {
            jest.spyOn(mockProcessingEntity, 'getProcessingErrorCount').mockReturnValue(2);
            const setStatusSpy = jest.spyOn(mockProcessingEntity, 'setProcessingStatus');
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);
            mockGateway.setProcessing.mockResolvedValue(mockProcessingEntity);

            const errorMsg: ErrorMsgDTO = {
                id_video: 'vid1',
                status: 'INTERRUPTED',
                error_message: 'Some error',
                id_user: '',
                status_time:new Date(),
            };

            const result = await ProcessingUseCases.RegisterProcessingError(
                mockGateway,
                errorMsg
            );

            expect(setStatusSpy).toHaveBeenCalledWith(ProcessingStatusEnum.ERROR);
            expect(result?.success).toBe(false);
            expect(result?.message).toContain('Last error: Some error');
        });

        it('should throw error if processing not found', async () => {
            mockGateway.getProcessingById.mockResolvedValue(undefined);

            const errorMsg: ErrorMsgDTO = {
                id_video: 'vid1',
                status: 'INTERRUPTED',
                error_message: 'Some error',
                id_user: '',
                status_time:new Date(),
            };

            await expect(
                ProcessingUseCases.RegisterProcessingError(mockGateway, errorMsg)
            ).rejects.toThrow('Processing not found');
        });

        it('should throw error if setProcessing fails', async () => {
            mockGateway.getProcessingById.mockResolvedValue(mockProcessingEntity);
            mockGateway.setProcessing.mockResolvedValue(undefined);

            const errorMsg: ErrorMsgDTO = {
                id_video: 'vid1',
                status: 'INTERRUPTED',
                error_message: 'Some error',
                id_user: '',
                status_time:new Date(),
            };

            await expect(
                ProcessingUseCases.RegisterProcessingError(mockGateway, errorMsg)
            ).rejects.toThrow('Error updating processing');
        });
    });
});