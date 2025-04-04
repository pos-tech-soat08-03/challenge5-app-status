import { DataTypes, Model, Sequelize } from "sequelize";
import { ConnectionInfo } from "../../Core/Types/ConnectionInfo";
import { ProcessingStatusEnum } from "../../Core/Entity/Enum/ProcessingStatusEnum";
import { VideoValueObject } from "../../Core/Entity/ValueObject/VideoValueObject";
import { UserValueObject } from "../../Core/Entity/ValueObject/UserValueObject";
import { ProcessingConfigValueObject } from "../../Core/Entity/ValueObject/ProcessingConfigValueObject";
import { ProcessingRepoGatewayInterface } from "../../Core/Interfaces/Gateway/ProcessingRepoGatewayInterface";
import { ProcessingEntity } from "../../Core/Entity/ProcessingEntity";

class LocalModel extends Model {
    public processingId!: string;
    public userId!: string;
    public processingVideo!: string;
    public processingUser!: string;
    public processingConfig!: string;
    public processingStatus!: ProcessingStatusEnum;
    public processingPercentage!: number;
    public processingLog!: string;
    public processingErrorCount!: number;
    // public processingId!: string;
    // public processingVideo!: VideoValueObject;
    // public processingUser!: UserValueObject;
    // public processingConfig!: ProcessingConfigValueObject;
    // public processingStatus!: ProcessingStatusEnum;
    // public processingPercentage!: number;
    // public processingLog!: string;
    // public processingErrorCount!: number;

}

export class ProcessingStatusGateway implements ProcessingRepoGatewayInterface {
    private readonly sequelize: Sequelize;

    constructor(private readonly dbconnection: ConnectionInfo, sequelize: Sequelize) {
        this.sequelize = new Sequelize(
            this.dbconnection.database,
            this.dbconnection.username,
            this.dbconnection.password,
            {
                host: this.dbconnection.hostname,
                port: this.dbconnection.portnumb,
                dialect: this.dbconnection.databaseType,
            }
        );

        LocalModel.init(
        {
            processingId: {
                type: DataTypes.STRING(36),
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            userId: {
                type: DataTypes.STRING(36),
                allowNull: false,
            },
            processingVideo: {
                type: DataTypes.TEXT
            },
            processingUser: {
                type: DataTypes.TEXT
            },
            processingConfig: {
                type: DataTypes.TEXT
            },
            processingStatus: {
                type: DataTypes.STRING
            },
            processingPercentage: {
                type: DataTypes.INTEGER
            },
            processingLog: {
                type: DataTypes.TEXT
            },
            processingErrorCount: {
                type: DataTypes.INTEGER
            }
        },
        {
            sequelize: this.sequelize,
            modelName: "ProcessingModel",
            tableName: "processing",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt",
            paranoid: true,
            underscored: true,
        });

        this.sequelize.sync({ alter: true });

    }

    public async close(): Promise<void> {
        await this.sequelize.close();
    }

    public async setProcessing(processing: ProcessingEntity): Promise<ProcessingEntity | undefined> {
        return LocalModel.upsert({
            processingId: processing.getProcessingId(),
            userId: processing.getUser().getUserId(),
            processingVideo: JSON.stringify(processing.getVideo()),
            processingUser: JSON.stringify(processing.getUser()),
            processingConfig: JSON.stringify(processing.getProcessingConfig()),
            processingStatus: processing.getProcessingStatus(),
            processingPercentage: processing.getProcessingPercentage(),
            processingLog: processing.getProcessingLog(),
            processingErrorCount: processing.getProcessingErrorCount(),
        }).then((result) => {
            if (result[0]) {
                return new ProcessingEntity(
                    processing.getProcessingId(),
                    processing.getVideo(),
                    processing.getUser(),
                    processing.getProcessingConfig(),
                    processing.getProcessingStatus(),
                    processing.getProcessingPercentage(),
                    processing.getProcessingLog(),
                    processing.getProcessingErrorCount()
                );
            } else {
                return undefined;
            }
        });
    }
    
    public async getProcessingById(processingId: string): Promise<ProcessingEntity | undefined> {
        const processing = await LocalModel.findOne({
            where: {
                processingId: processingId,
            },
        });
        if (!processing) {
            return undefined;
        }
        return new ProcessingEntity(
            processing.processingId,
            VideoValueObject.fromDTO(JSON.parse(processing.processingVideo)), // Deserialize to VideoValueObject
            UserValueObject.fromDTO(JSON.parse(processing.processingUser)), // Deserialize to UserValueObject
            ProcessingConfigValueObject.fromDTO(JSON.parse(processing.processingConfig)), // Deserialize to ProcessingConfigValueObject
            processing.processingStatus,
            processing.processingPercentage,
            processing.processingLog,
            processing.processingErrorCount
            );
    }

    public async getProcessingList(): Promise<Array<ProcessingEntity> | undefined> {
        const processingList = await LocalModel.findAll();
        if (!processingList) {
            return undefined;
        }
        return processingList.map((processing) => {
            return new ProcessingEntity(
                processing.processingId,
                VideoValueObject.fromDTO(JSON.parse(processing.processingVideo)), // Deserialize to VideoValueObject
                UserValueObject.fromDTO(JSON.parse(processing.processingUser)), // Deserialize to UserValueObject
                ProcessingConfigValueObject.fromDTO(JSON.parse(processing.processingConfig)), // Deserialize to ProcessingConfigValueObject    
                processing.processingStatus,
                processing.processingPercentage,
                processing.processingLog,
                processing.processingErrorCount
            );
        });
    }

    public async getProcessingListByUser(userId: string): Promise<Array<ProcessingEntity> | undefined> {
        const processingList = await LocalModel.findAll({
            where: {
                userId: userId,
            },
        });
        if (!processingList) {
            return undefined;
        }
        return processingList.map((processing) => {
            return new ProcessingEntity(
                processing.processingId,
                VideoValueObject.fromDTO(JSON.parse(processing.processingVideo)), // Deserialize to VideoValueObject
                UserValueObject.fromDTO(JSON.parse(processing.processingUser)), // Deserialize to UserValueObject
                ProcessingConfigValueObject.fromDTO(JSON.parse(processing.processingConfig)), // Deserialize to ProcessingConfigValueObject
                processing.processingStatus,
                processing.processingPercentage,
                processing.processingLog,
                processing.processingErrorCount
            );
        });
    }

}
