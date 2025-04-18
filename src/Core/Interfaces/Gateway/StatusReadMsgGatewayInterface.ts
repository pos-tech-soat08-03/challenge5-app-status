import { StatusMsgValueObject } from "../../Entity/ValueObject/StatusMsgValueObject";

export interface StatusReadMsgGatewayInterface {

    getNextStatusMessage (): Promise <StatusMsgValueObject| undefined>;

}