import { Sequelize, Model } from 'sequelize';
import { ProcessingStatusGateway } from '../../../src/Application/Gateway/ProcessingStatusRepoGateway';
import { ProcessingStatusEnum } from '../../../src/Core/Entity/Enum/ProcessingStatusEnum';
import { ProcessingEntity } from '../../../src/Core/Entity/ProcessingEntity';
import { ProcessingConfigValueObject } from '../../../src/Core/Entity/ValueObject/ProcessingConfigValueObject';
import { UserValueObject } from '../../../src/Core/Entity/ValueObject/UserValueObject';
import { VideoValueObject } from '../../../src/Core/Entity/ValueObject/VideoValueObject';
import { ConnectionInfo } from '../../../src/Core/Types/ConnectionInfo';


// Mock sequelize module
jest.mock('sequelize', () => {
    const mSequelize = {
        sync: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(undefined),
    };
    
    const actualModel = jest.requireActual('sequelize').Model;
    const mModel = {
        init: jest.fn(),
        findOne: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue([]),
        upsert: jest.fn().mockResolvedValue([null, false]),
        __proto__: actualModel.prototype,
    };
    
    return {
        Sequelize: jest.fn(() => mSequelize),
        Model: class MockModel extends actualModel {
            static readonly init = mModel.init;
            static readonly findOne = mModel.findOne;
            static readonly findAll = mModel.findAll;
            static readonly upsert = mModel.upsert;
        },
        DataTypes: {
            STRING: jest.fn().mockImplementation((size) => `STRING(${size})`),
            TEXT: 'TEXT',
            INTEGER: 'INTEGER',
        },
    };
});

describe('ProcessingStatusGateway', () => {
    let gateway: ProcessingStatusGateway;
    let mockSequelize: Sequelize;
    const connectionInfo: ConnectionInfo = {
        username: 'testuser',
        password: 'testpass',
        hostname: 'localhost',
        portnumb: 3306,
        database: 'testdb',
        databaseType: 'mysql'
    };

    // Mock data
    const mockVideoValueObject = new VideoValueObject(
        'video-id-123',
        'Test Video',
        'Test Description',
        'test.mp4',
        1000,
        '/path/to/test.mp4',
        120,
        30
    );
    
    const mockUserValueObject = new UserValueObject(
        'user-id-123',
        'test@example.com'
    );
    
    const mockConfigValueObject = new ProcessingConfigValueObject(
        'mp4',
        '720p',
        5
    );
    
    const mockProcessingEntity = new ProcessingEntity(
        'proc-id-123',
        mockVideoValueObject,
        mockUserValueObject,
        mockConfigValueObject,
        ProcessingStatusEnum.NOT_STARTED,
        0,
        '',
        0
    );

    const mockProcessingDb = {
        processingId: 'proc-id-123',
        userId: 'user-id-123',
        processingVideo: JSON.stringify({
            id: 'video-id-123',
            titulo: 'Test Video',
            descricao: 'Test Description',
            fileName: 'test.mp4',
            fileSize: 1000,
            fullPath: '/path/to/test.mp4',
            duration: 120,
            frameRate: 30
        }),
        processingUser: JSON.stringify({
            userId: 'user-id-123',
            email: 'test@example.com'
        }),
        processingConfig: JSON.stringify({
            outputFormat: 'mp4',
            resolution: '720p',
            interval: 5
        }),
        processingStatus: ProcessingStatusEnum.NOT_STARTED,
        processingPercentage: 0,
        processingLog: '',
        processingErrorCount: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockSequelize = new Sequelize({} as any);
        gateway = new ProcessingStatusGateway(connectionInfo, mockSequelize);
    });

    describe('close', () => {
        it('should close the database connection', async () => {
            await gateway.close();
            expect(mockSequelize.close).toHaveBeenCalled();
        });
    });

    describe('setProcessing', () => {
        it('should create or update processing and return entity on success', async () => {
            // Mock successful upsert
            (Model.upsert as jest.Mock).mockResolvedValue([mockProcessingDb, true]);
            
            const result = await gateway.setProcessing(mockProcessingEntity);
            
            expect(Model.upsert).toHaveBeenCalledWith({
                processingId: 'proc-id-123',
                userId: 'user-id-123',
                processingVideo: expect.any(String),
                processingUser: expect.any(String),
                processingConfig: expect.any(String),
                processingStatus: ProcessingStatusEnum.NOT_STARTED,
                processingPercentage: 0,
                processingLog: '',
                processingErrorCount: 0,
            });
            
            expect(result).toBeInstanceOf(ProcessingEntity);
            expect(result?.getProcessingId()).toBe('proc-id-123');
        });

        it('should return undefined on upsert failure', async () => {
            // Mock failed upsert
            (Model.upsert as jest.Mock).mockResolvedValue([false, false]);
            
            const result = await gateway.setProcessing(mockProcessingEntity);
            
            expect(result).toBeUndefined();
        });
    });

    describe('getProcessingById', () => {
        it('should return processing entity when found', async () => {
            // Mock successful find
            (Model.findOne as jest.Mock).mockResolvedValue(mockProcessingDb);
            
            const result = await gateway.getProcessingById('proc-id-123');
            
            expect(Model.findOne).toHaveBeenCalledWith({
                where: { processingId: 'proc-id-123' }
            });
            
            expect(result).toBeInstanceOf(ProcessingEntity);
            expect(result?.getProcessingId()).toBe('proc-id-123');
        });

        it('should return undefined when processing not found', async () => {
            // Mock not found
            (Model.findOne as jest.Mock).mockResolvedValue(null);
            
            const result = await gateway.getProcessingById('non-existent-id');
            
            expect(result).toBeUndefined();
        });
    });

    describe('getProcessingList', () => {
        it('should return list of processing entities', async () => {
            // Mock successful findAll
            (Model.findAll as jest.Mock).mockResolvedValue([mockProcessingDb, mockProcessingDb]);
            
            const result = await gateway.getProcessingList();
            
            expect(Model.findAll).toHaveBeenCalled();
            expect(result?.length).toBe(2);
            expect(result?.[0]).toBeInstanceOf(ProcessingEntity);
        });

        it('should return undefined when no processing found', async () => {
            // Mock empty result
            (Model.findAll as jest.Mock).mockResolvedValue(null);
            
            const result = await gateway.getProcessingList();
            
            expect(result).toBeUndefined();
        });
    });

    describe('getProcessingListByUser', () => {
        it('should return list of processing entities for user', async () => {
            // Mock successful findAll
            (Model.findAll as jest.Mock).mockResolvedValue([mockProcessingDb, mockProcessingDb]);
            
            const result = await gateway.getProcessingListByUser('user-id-123');
            
            expect(Model.findAll).toHaveBeenCalledWith({
                where: { userId: 'user-id-123' }
            });
            
            expect(result?.length).toBe(2);
            expect(result?.[0]).toBeInstanceOf(ProcessingEntity);
        });

        it('should return undefined when no processing found for user', async () => {
            // Mock empty result
            (Model.findAll as jest.Mock).mockResolvedValue(null);
            
            const result = await gateway.getProcessingListByUser('user-id-123');
            
            expect(result).toBeUndefined();
        });
    });
});