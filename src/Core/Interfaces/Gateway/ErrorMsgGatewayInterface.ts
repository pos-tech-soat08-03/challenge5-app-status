import { ErrorMsgValueObject } from "../../Entity/ValueObject/ErrorMsgValueObject";

export interface ErrorMsgGatewayInterface {

    getErrorMessage (): Promise <ErrorMsgValueObject| undefined>;

}