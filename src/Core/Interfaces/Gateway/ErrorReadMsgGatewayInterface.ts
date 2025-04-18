import { ErrorMsgValueObject } from "../../Entity/ValueObject/ErrorMsgValueObject";

export interface ErrorReadMsgGatewayInterface {

    getNextErrorMessage (): Promise <ErrorMsgValueObject| undefined>;

}