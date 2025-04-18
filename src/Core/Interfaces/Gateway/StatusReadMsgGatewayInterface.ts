import { StatusMsgValueObject } from "../../Entity/ValueObject/StatusMsgValueObject";

export interface StatusReadMsgGatewayInterface {

    getNextStatusMessage (): Promise <StatusMsgValueObject| undefined>;
    deleteStatusMessage (statusId: string): Promise <void>;

}