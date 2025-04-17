import { StatusMsgValueObject } from "../../Entity/ValueObject/StatusMsgValueObject";

export interface StatusReadMsgGatewayInteface {

    getNextStatusMessage (): Promise <StatusMsgValueObject| undefined>;
    deleteStatusMessage (statusId: string): Promise <void>;

}