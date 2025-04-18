import { StatusMsgDTO } from "../../Types/DTO/StatusMsgDTO";

export interface StatusReadMsgGatewayInterface {

    getNextStatusMessage (): Promise <StatusMsgDTO | undefined>;

}