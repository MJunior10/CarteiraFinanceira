# 💰 FinanceAPI — Controle Financeiro Pessoal

> Aplicação fullstack para controle financeiro pessoal. O **backend** é uma API RESTful desenvolvida em **C# com ASP.NET Core**, e o **frontend** foi construído em **React**. Permite gerenciar receitas e despesas, organizar por categorias e visualizar o resumo financeiro por período.

---

## 🚀 Demonstração

> 🔧 *Em breve: link do deploy*

---

## 🧰 Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|---|---|
| C# / ASP.NET Core | Framework principal da API |
| PostgreSQL | Banco de dados relacional |
| Entity Framework Core | ORM para acesso ao banco |
| Scalar | Documentação interativa da API |

### Frontend
| Tecnologia | Uso |
|---|---|
| React | Interface do usuário |
| JavaScript | Linguagem do frontend |

---

## ✅ Funcionalidades

- [x] Cadastro de **receitas e despesas**
- [x] Organização por **categorias de gastos**
- [x] **Dashboard** com resumo financeiro por período
- [x] Interface visual em **React**
- [x] Documentação interativa com **Scalar**
- [ ] Autenticação JWT *(em desenvolvimento)*
- [ ] Deploy em produção *(em breve)*

---

## 🗂️ Estrutura do Projeto

```
FinanceApp/
├── backend/
│   ├── Controllers/        # Endpoints da API
│   ├── Models/             # Entidades do banco de dados
│   ├── DTOs/               # Objetos de transferência de dados
│   ├── Services/           # Regras de negócio
│   ├── Repositories/       # Acesso ao banco de dados
│   ├── Data/               # Contexto do Entity Framework
│   └── Program.cs          # Configuração da aplicação
└── frontend/
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/          # Páginas da aplicação
    │   └── services/       # Chamadas à API
    └── package.json
```

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Backend

```bash
# 1. Clone o repositório
git clone https://github.com/MJunior10/CarteiraFinanceira
cd CarteiraFinanceira/SistemaFinanceiro.API

# 2. Configure a string de conexão no appsettings.json
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Database=financedb;Username=SEU_USER;Password=SUA_SENHA"
# }

# 3. Aplique as migrations
dotnet ef database update

# 4. Rode a API
dotnet run

# 5. Acesse a documentação Scalar
# http://localhost:5191/scalar
```

### Frontend

```bash
# Em outro terminal, na pasta frontend
cd ../frontend

# Instale as dependências
npm install

# Rode o projeto
npm run dev
Acesse a aplicação no seu navegador (geralmente em http://localhost:5173).

Desenvolvido com ☕ e foco em arquitetura de software por [Mauro Junior].