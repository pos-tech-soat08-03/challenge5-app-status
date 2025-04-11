import { StatusMsgValueObject } from "../../Entity/ValueObject/StatusMsgValueObject";

export interface StatusMsgGatewayInteface {

    getNextStatusMessage (): Promise <StatusMsgValueObject| undefined>;
    deleteStatusMessage (statusId: string): Promise <void>;

}