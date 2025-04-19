import { ErrorMsgDTO } from "../../Types/DTO/ErrorMsgDTO";

export interface ErrorReadMsgGatewayInterface {

    getNextErrorMessage (): Promise <ErrorMsgDTO | undefined>;

}