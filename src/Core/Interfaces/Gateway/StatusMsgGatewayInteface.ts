import { StatusMsgValueObject } from "../../Entity/ValueObject/StatusMsgValueObject";

export interface StatusMsgGatewayInteface {

    getStatusMessage (): Promise <StatusMsgValueObject| undefined>;
}