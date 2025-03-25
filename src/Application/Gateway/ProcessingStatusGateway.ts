import { DataTypes, Model, Sequelize } from "sequelize";
import { ConnectionInfo } from "../../Core/Types/ConnectionInfo";
import { ProcessingStatusInterface } from "../../Core/Interfaces/Gateway/ProcessingStatusInterface";
import { ProcessingStatusEntity } from "../../Core/Entity/ProcessingStatusEntity";
import { ProcessingStatusEnum } from "../../Core/Entity/ValueObject/ProcessingStatusEnum";

class LocalModel extends Model {
    public processingId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public finishedAt!: Date;
    public processingStatus!: string;
    public processingStatusPercentage!: number;
    public processingVideoId!: string;
    public userId!: string;
    public processingLog!: string;
}

export class ProcessingStatusGateway implements ProcessingStatusInterface {
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
                type: DataTypes.TEXT,
                primaryKey: true,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
            finishedAt: {
                type: DataTypes.DATE,
            },
            processingStatus: {
                type: DataTypes.TEXT,
            },
            processingStatusPercentage: {
                type: DataTypes.INTEGER,
            },
            processingVideoId: {
                type: DataTypes.TEXT,
            },
            userId: {
                type: DataTypes.TEXT,
            },
            processingLog: {
                type: DataTypes.TEXT,
            },
        },
        {
            sequelize: this.sequelize,
            modelName: "ProcessingStatusModel",
            tableName: "processing_status",
            timestamps: false,
        }
        );
        this.sequelize.sync({ alter: true });
    }

    public async getProcessingStatus(processingId: string): Promise<ProcessingStatusEntity | undefined> {
        const processing = await LocalModel.findOne({
            where: {
                processingId: processingId,
            },
        });
        if (!processing) {
            return undefined;
        }
        return new ProcessingStatusEntity(
            processing.userId,
            processing.processingVideoId,
            processing.processingStatus as ProcessingStatusEnum,
            processing.processingStatusPercentage,
            processing.processingLog,
            processing.createdAt,
            processing.updatedAt,
            processing.finishedAt,
            processing.processingId
        );
    }

    public async setProcessingStatus(processingStatus: ProcessingStatusEntity): Promise<void> {
        await LocalModel.upsert({
            processingId: processingStatus.getProcessingId(),
            createdAt: processingStatus.getCreatedAt(),
            updatedAt: processingStatus.getUpdatedAt(),
            finishedAt: processingStatus.getFinishedAt(),
            processingStatus: processingStatus.getProcessingStatus(),
            processingStatusPercentage: processingStatus.getProcessingStatusPercentage(),
            processingVideoId: processingStatus.getProcessingVideoId(),
            userId: processingStatus.getUserId(),
            processingLog: processingStatus.getProcessingLog(),
        });
    }

    public async getProcessingList(status: string): Promise <Array<ProcessingStatusEntity> | undefined> {
        const processing = await LocalModel.findAll({
            where: {
                processingStatus: status,
            },
        });
        if (!processing) {
            return undefined;
        }
        return processing.map((p) => new ProcessingStatusEntity(
            p.userId,
            p.processingVideoId,
            p.processingStatus as ProcessingStatusEnum,
            p.processingStatusPercentage,
            p.processingLog,
            p.createdAt,
            p.updatedAt,
            p.finishedAt,
            p.processingId
        ));
    }
    
    public async getProcessingListByUser(userId: string): Promise <Array<ProcessingStatusEntity> | undefined> {
        const processing = await LocalModel.findAll({
            where: {
                userId: userId,
            },
        });
        if (!processing) {
            return undefined;
        }
        return processing.map((p) => new ProcessingStatusEntity(
            p.userId,
            p.processingVideoId,
            p.processingStatus as ProcessingStatusEnum,
            p.processingStatusPercentage,
            p.processingLog,
            p.createdAt,
            p.updatedAt,
            p.finishedAt,
            p.processingId
        ));
    }



}
