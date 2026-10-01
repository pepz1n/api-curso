# API de Tarefas

API REST de tarefas com usuários (Node.js + Express + Sequelize + PostgreSQL), seguindo o padrão do [api-modelo](https://github.com/pepz1n/api-modelo).

  * Primeiramente instalar com o comando:
  * ```
    npm install
    ```
  * Criar o banco e rodar o `schema.sql` nele:
  * ```
    psql -h localhost -U postgres -d api_tarefas -f schema.sql
    ```
  * Copiar o `.env.example` para **.env** no diretório principal e preencher:
  * ```
    POSTGRES_HOST=localhost
    POSTGRES_DB=api_tarefas
    POSTGRES_USERNAME=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_PORT=5432
    DB_SSL=false
    TOKEN_KEY={chave secreta do JWT}
    API_PORT=3000
    API_HOST=http://localhost
    ```
    No RDS da AWS use `DB_SSL=true`.
  * Após a criação do arquivo rodar o comando
  * ```
    npm run dev
    ```

## Rotas

Respostas no formato `{ type, message, data }`. As rotas com 🔒 exigem o header `Authorization: Bearer <token>` (o token vem no cadastro e no login).

| Método | Rota | Ação |
|---|---|---|
| GET | `/health` | Status da API e do banco |
| POST | `/users/persist` | Cadastrar usuário |
| POST | `/users/login` | Login (retorna o token) |
| GET | `/users/me` 🔒 | Dados do usuário logado |
| POST | `/users/persist/:id` 🔒 | Atualizar o próprio usuário |
| DELETE | `/users/:id` 🔒 | Remover o próprio usuário (e suas tarefas) |
| GET | `/tasks` 🔒 | Listar minhas tarefas (`?done=true` ou `?done=false`) |
| GET | `/tasks/:id` 🔒 | Buscar uma tarefa |
| POST | `/tasks/persist` 🔒 | Criar tarefa |
| POST | `/tasks/persist/:id` 🔒 | Atualizar tarefa (`title`, `done`) |
| DELETE | `/tasks/:id` 🔒 | Remover tarefa |

Ao marcar `done: true`, a API grava em `done_at` a hora em que a tarefa foi finalizada; ao voltar para `done: false`, `done_at` volta a ser `null`.

Exemplos prontos em `requests.http` (extensão REST Client do VS Code).

## Docker / Deploy na EC2

A API e o banco rodam juntos via Docker na mesma EC2. O `docker-compose.yml` e o passo a passo do deploy ficam no repositório **api-curso-db**, que deve ficar na mesma pasta que este:

```
curso/
├── api-curso/
└── api-curso-db/
```
