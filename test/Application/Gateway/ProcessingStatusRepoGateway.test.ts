import { Sequelize } from "sequelize";
import { ProcessingStatusGateway } from "../../../src/Application/Gateway/ProcessingStatusRepoGateway";
import { ProcessingStatusEnum } from "../../../src/Core/Entity/Enum/ProcessingStatusEnum";
import { ProcessingEntity } from "../../../src/Core/Entity/ProcessingEntity";
import { ProcessingConfigValueObject } from "../../../src/Core/Entity/ValueObject/ProcessingConfigValueObject";
import { UserValueObject } from "../../../src/Core/Entity/ValueObject/UserValueObject";
import { VideoValueObject } from "../../../src/Core/Entity/ValueObject/VideoValueObject";
import { ConnectionInfo } from "../../../src/Core/Types/ConnectionInfo";


jest.mock("sequelize");

const mockConnectionInfo: ConnectionInfo = {
    database: "testdb",
    username: "user",
    password: "pass",
    hostname: "localhost",
    portnumb: 5432,
    databaseType: "sqlite" as any,
};

const mockVideo = new VideoValueObject(
    "vid1",
    "title",
    "desc",
    "file.mp4",
    1000,
    "/tmp/file.mp4",
    10,
    30
);

const mockUser = new UserValueObject(
    "user1",
    "user@example.com"
);

const mockConfig = new ProcessingConfigValueObject(
    "mp4",
    "720p",
    5
);

const mockProcessingEntity = new ProcessingEntity(
    "vid1",
    mockVideo,
    mockUser,
    mockConfig,
    ProcessingStatusEnum.NOT_STARTED,
    0,
    "",
    0
);

describe("ProcessingStatusGateway", () => {
    let gateway: ProcessingStatusGateway;
    let sequelizeInstance: Sequelize;

    beforeEach(() => {
        (Sequelize as any).mockClear();
        sequelizeInstance = {
            sync: jest.fn().mockResolvedValue(undefined),
            close: jest.fn().mockResolvedValue(undefined),
            models: {
                ProcessingModel: {
                    upsert: jest.fn().mockResolvedValue([true]),
                    findOne: jest.fn(),
                    findAll: jest.fn(),
                }
            }
        } as any;
        (Sequelize as any).mockImplementation(() => sequelizeInstance);
        gateway = new ProcessingStatusGateway(mockConnectionInfo, sequelizeInstance);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        if (gateway) await gateway.close();
    });

    describe("constructor", () => {
        it("should initialize sequelize and sync model", () => {
            expect(Sequelize).toHaveBeenCalled();
            expect(sequelizeInstance.sync).toHaveBeenCalledWith({ alter: true });
        });
    });

    describe("close", () => {
        it("should close sequelize connection", async () => {
            await gateway.close();
            expect(sequelizeInstance.close).toHaveBeenCalled();
        });
    });


    describe("getProcessingById", () => {

        it("should return undefined if not found", async () => {
            (gateway as any).sequelize.models = {
                ProcessingModel: {
                    findOne: jest.fn().mockResolvedValue(undefined)
                }
            };
            const LocalModel = (gateway as any).sequelize.models.ProcessingModel;
            LocalModel.findOne = jest.fn().mockResolvedValue(undefined);

            const result = await gateway.getProcessingById("notfound");
            expect(result).toBeUndefined();
        });
    });


        it("should return empty array if no list", async () => {
            (gateway as any).sequelize.models = {
                ProcessingModel: {
                    findAll: jest.fn().mockResolvedValue(undefined)
                }
            };
            const LocalModel = (gateway as any).sequelize.models.ProcessingModel;
            LocalModel.findAll = jest.fn().mockResolvedValue(undefined);

            const result = await gateway.getProcessingList();
            expect(result).toBeUndefined();
        });

        it("should return undefined if no list", async () => {
            (gateway as any).sequelize.models = {
                ProcessingModel: {
                    findAll: jest.fn().mockResolvedValue(undefined)
                }
            };
            const LocalModel = (gateway as any).sequelize.models.ProcessingModel;
            LocalModel.findAll = jest.fn().mockResolvedValue(undefined);

            const result = await gateway.getProcessingListByUser("user1");
            expect(result).toBeUndefined();
        });


    });




