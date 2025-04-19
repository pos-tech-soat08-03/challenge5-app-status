Funcionalidade: Criação de Jobs de Processamento de Vídeo
  Como usuário do sistema
  Quero criar novos jobs de processamento de vídeo
  Para que eu possa processar meus vídeos de acordo com configurações específicas

  Cenário: Criar um novo job de processamento com sucesso
    Dado que o sistema possui uma conexão válida com o banco de dados
    Quando eu envio uma requisição POST para "/msg/processamento" com dados válidos de vídeo, usuário e configuração
    Então o status da resposta deve ser 200
    E um novo job de processamento deve ser criado no banco de dados
    E a resposta deve incluir o ID do job de processamento
    E o status de processamento deve ser definido como "NOT_STARTED"
    E a porcentagem de processamento deve ser definida como 0

  Cenário: Tentativa de criar um job de processamento duplicado
    Dado que o sistema possui uma conexão válida com o banco de dados
    E já existe um job de processamento com ID "xxxx-xxxx-xxxx-xxxx"
    Quando eu envio uma requisição POST para criar um job de processamento com o mesmo ID "xxxx-xxxx-xxxx-xxxx"
    Então o status da resposta deve ser 500
    E a resposta deve conter a mensagem de erro "Processing already exists in the system"

  Cenário: Criar um job de processamento com dados obrigatórios ausentes
    Dado que o sistema possui uma conexão válida com o banco de dados
    Quando eu envio uma requisição POST para "/msg/processamento" com dados de vídeo ausentes
    Então o status da resposta deve ser 500
    E a resposta deve conter a mensagem de erro "Invalid payload"



Funcionalidade: Consulta de Status de Processamento de Vídeo
  Como usuário do sistema
  Quero visualizar o status dos meus jobs de processamento de vídeo
  Para que eu possa acompanhar o progresso deles

  Cenário: Obter status de processamento por ID
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existe um job de processamento com ID "xxxx-xxxx-xxxx-xxxx"
    Quando eu envio uma requisição GET para "/status/listar/id/xxxx-xxxx-xxxx-xxxx"
    Então o status da resposta deve ser 200
    E a resposta deve incluir os detalhes do job de processamento
    E a resposta deve incluir o status atual de processamento
    E a resposta deve incluir a porcentagem de processamento

  Cenário: Tentar obter status de processamento com ID inexistente
    Dado que o sistema possui uma conexão válida com o banco de dados
    Quando eu envio uma requisição GET para "/status/listar/id/id-inexistente"
    Então o status da resposta deve ser 500
    E a resposta deve conter a mensagem de erro "ID not found"

  Cenário: Listar todos os jobs de processamento
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existem múltiplos jobs de processamento no sistema
    Quando eu envio uma requisição GET para "/status/listar"
    Então o status da resposta deve ser 200
    E a resposta deve incluir uma lista de todos os jobs de processamento

  Cenário: Listar jobs de processamento por usuário
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existem jobs de processamento para o usuário com ID "user-123"
    Quando eu envio uma requisição GET para "/status/listar/usuario/user-123"
    Então o status da resposta deve ser 200
    E a resposta deve incluir uma lista de jobs de processamento para esse usuário



Funcionalidade: Atualização de Status de Processamento de Vídeo
  Como componente do sistema
  Quero atualizar o status dos jobs de processamento
  Para que os usuários possam acompanhar o progresso do processamento de seus vídeos

  Cenário: Atualizar porcentagem de processamento
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existe um job de processamento com ID "xxxx-xxxx-xxxx-xxxx" com 25% de conclusão
    Quando eu envio uma requisição PUT para "/msg/status" com:
      | id_video    | xxxx-xxxx-xxxx-xxxx                  |
      | id_usuario  | user-123                             |
      | status      | PROCESSING                           |
      | percentage  | 50                                   |
      | status_time | 2023-10-01T12:00:00Z                 |
    Então o status da resposta deve ser 200
    E a porcentagem do job de processamento deve ser atualizada para 50
    E o log de processamento deve incluir uma nova entrada

  Cenário: Tentativa de diminuir a porcentagem de processamento
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existe um job de processamento com ID "xxxx-xxxx-xxxx-xxxx" com 50% de conclusão
    Quando eu envio uma requisição PUT para "/msg/status" com uma porcentagem de 25
    Então o status da resposta deve ser 500
    E a resposta deve conter a mensagem de erro "Percentage value cannot be decreased"

  Cenário: Completar um job de processamento
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existe um job de processamento com ID "xxxx-xxxx-xxxx-xxxx" com 90% de conclusão
    Quando eu envio uma requisição PUT para "/msg/status" com status "COMPLETED"
    Então o status da resposta deve ser 200
    E o status do job de processamento deve ser atualizado para "COMPLETED"
    E a porcentagem do job de processamento deve ser atualizada para 100
    E o log de processamento deve incluir uma mensagem de conclusão



Funcionalidade: Tratamento de Erros de Processamento de Vídeo
  Como componente do sistema
  Quero registrar e tratar erros de processamento
  Para que os problemas possam ser rastreados e potencialmente resolvidos

  Cenário: Registrar um erro de processamento
    Dado que o sistema possui uma conexão válida com o banco de dados
    E existe um job de processamento com ID "xxxx-xxxx-xxxx-xxxx"
    Quando eu envio uma requisição PUT para "/msg/erro" com:
      | id_video      | xxxx-xxxx-xxxx-xxxx                  |
      | id_user       | user-123                             |
      | status        | INTERRUPTED                          |
      | status_time   | 2023-10-01T12:00:00Z                 |
      | error_message | "Formato de arquivo não suportado"   |
    Então o status da resposta deve ser 200
    E o status do job de processamento deve ser atualizado para "INTERRUPTED"
    E a contagem de erros de processamento deve ser incrementada
    E o log de processamento deve incluir a mensagem de erro

  Cenário: Registrar um erro para um job de processamento inexistente
    Dado que o sistema possui uma conexão válida com o banco de dados
    Quando eu envio uma requisição PUT para "/msg/erro" para um ID de job de processamento inexistente
    Então o status da resposta deve ser 500
    E a resposta deve conter a mensagem de erro "Processing not found"



Funcionalidade: Integração com Filas do Sistema
  Como administrador do sistema
  Quero que a aplicação se integre com AWS SQS e SNS
  Para que as atualizações de status de processamento possam ser tratadas de forma assíncrona

  Cenário: Processar uma mensagem de status da fila
    Dado que o sistema possui uma conexão válida com o banco de dados
    E a aplicação está em execução
    Quando uma mensagem de status é publicada no tópico SNS
    Então a mensagem deve ser recebida na fila SQS
    E o status do job de processamento deve ser atualizado adequadamente



Funcionalidade: Gerenciamento de Conexão com o Banco de Dados
  Como componente do sistema
  Quero me conectar de forma confiável e interagir com o banco de dados
  Para que os dados de processamento sejam armazenados e recuperados corretamente

  Cenário: Conectar com sucesso ao banco de dados na inicialização
    Dado que uma configuração válida do banco de dados é fornecida
    Quando a aplicação é iniciada
    Então ela deve estabelecer uma conexão com o banco de dados MySQL
    E ela deve criar ou atualizar as tabelas necessárias
    E o ProcessingStatusGateway deve ser inicializado

  Cenário: Tratar falha na conexão com o banco de dados
    Dado que uma configuração inválida do banco de dados é fornecida
    Quando a aplicação tenta se conectar ao banco de dados
    Então ela deve registrar uma mensagem de erro apropriada
    E a aplicação deve falhar de forma amigável



Funcionalidade: Gerenciamento de Entidades de Processamento
  Como desenvolvedor
  Quero gerenciar adequadamente as entidades de processamento
  Para que os jobs de processamento mantenham sua integridade

  Cenário: Criar uma nova entidade de processamento
    Dados válidos de vídeo, usuário e configuração
    Quando uma nova ProcessingEntity é criada
    Então ela deve ter o ID fornecido
    E ela deve ter o status padrão "NOT_STARTED"
    E ela deve ter a porcentagem padrão 0
    E ela deve ter um log vazio
    E ela deve ter uma contagem de erros igual a 0

  Cenário: Atualizar status de processamento e logs
    Dado que existe uma ProcessingEntity
    Quando o status de processamento é alterado para "PROCESSING"
    Então a entidade deve ter o status atualizado
    E o log deve conter uma entrada sobre a mudança de status
    E o registro de data e hora deve ser incluído no log