import { ErrorMsgValueObject } from "../../Entity/ValueObject/ErrorMsgValueObject";

export interface ErrorMsgGatewayInterface {

    getNextErrorMessage (): Promise <ErrorMsgValueObject| undefined>;
    deleteErrorMessage (errorId: string): Promise <void>;   

}