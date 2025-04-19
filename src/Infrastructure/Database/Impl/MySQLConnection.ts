import { IDbConnection } from "../../../Core/Interfaces/IDbConnection";
import { Gateways } from "../../../Core/Types/Gateways";
import { ConnectionInfo } from "../../../Core/Types/ConnectionInfo";
import { ProcessingStatusGateway } from "../../../Application/Gateway/ProcessingStatusRepoGateway";

export class MySQLConnection implements IDbConnection {
  readonly gateways: Gateways;
  readonly dbConnection: ConnectionInfo;
  readonly sequelize: any;
  constructor(dbConnection: ConnectionInfo) {
    this.dbConnection = dbConnection;
    this.gateways = {
      processingRepoGateway: new ProcessingStatusGateway(this.dbConnection, this.sequelize),
    };
  }
}
