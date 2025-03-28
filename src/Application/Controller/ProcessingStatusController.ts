export class ProcessingStatusController {

    public static async UpdateProcessingStatus () {

    }

    public static async GetProcessingStatus (dbConnection: IDbConnection, processingId: string) {
        const processingGateway = dbConnection.gateways.processingGateway;
        

        const clienteGateway = dbConnection.gateways.clienteGateway;
        const { clientes, mensagem }  = await ClientesUsecases.ListarClientesUsecase(clienteGateway);
        if (clientes === undefined || clientes.length === 0) {
            return ClienteAdapter.adaptClienteJsonError(mensagem);
        }
        return ClienteAdapter.adaptJsonListaClientes(clientes, mensagem); 

    }

    public static async GetProcessingListByUser (dbConnection: IDbConnection, userId: string)  { 

    }

    public static async NotifyProcessingError () {

    }


}