# 💸 Sistema de Controle Financeiro Full-Stack

Um sistema completo para gestão de finanças pessoais, construído com uma arquitetura moderna e separada (Decoupled Architecture) utilizando **API RESTful em C#** e uma **Single Page Application (SPA) em React**. 

Este projeto foi desenvolvido com foco em **Experiência do Usuário (UX)**, **Responsividade** e **Tratamento Robusto de Erros**, demonstrando o fluxo completo de dados desde o banco de dados relacional até a interface do usuário.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success)
![C#](https://img.shields.io/badge/Backend-C%23_|_ASP.NET_Core-512BD4?logo=c-sharp&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React_|_Vite-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)

## ✨ Funcionalidades Principais

- **Dashboard Dinâmico:** Resumo em tempo real de Receitas, Despesas e Saldo Atual com base no mês selecionado.
- **Gráficos Interativos:** Integração com `Recharts` para visualização da distribuição de despesas por categoria, respeitando as cores personalizadas salvas no banco de dados.
- **Gestão de Transações e Categorias (CRUD Completo):** - Criação, edição e exclusão de movimentações com interface baseada em Modais (sem uso de alertas nativos do navegador).
  - Categorização com seleção de cores hexadecimais nativas do HTML5.
- **Filtro Mensal Inteligente:** Navegação rápida entre meses com recálculo automático de todo o Dashboard na memória do cliente.
- **Exclusão em Massa (Bulk Delete):** Sistema de seleção múltipla (checkboxes) que utiliza `Promise.all` para processar múltiplas requisições assíncronas de exclusão simultaneamente.
- **Tratamento de Erros Profissional:** O frontend intercepta as validações de *Problem Details* do ASP.NET Core e traduz os erros (ex: chaves estrangeiras em uso, valores inválidos) para mensagens amigáveis na interface gráfica.
- **Design Responsivo (Mobile First):** Layout adaptável para smartphones, tablets e desktops utilizando CSS puro e Media Queries.

## 🛠️ Tecnologias e Ferramentas

### Backend (API)
* **C# / ASP.NET Core Web API:** Estrutura base da aplicação.
* **Entity Framework Core (EF Core):** ORM (Object-Relational Mapper) para manipulação de dados utilizando a abordagem Code-First.
* **PostgreSQL:** Banco de dados relacional forte e escalável.
* **Data Annotations:** Para validação rigorosa de dados na porta de entrada da API.

### Frontend (Interface)
* **React (com Vite):** Biblioteca principal para componentização e reatividade.
* **Recharts:** Para geração do gráfico de pizza animado.
* **CSS Puro:** Sem dependência de frameworks pesados, garantindo alta performance e controle total do layout.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [.NET 8.0 SDK](https://dotnet.microsoft.com/download) (ou superior)
* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/) rodando localmente.

### Passo 1: Configurando o Backend
1. Navegue até a pasta da API: `cd API` (ou o nome da sua pasta do C#).
2. Atualize a sua `Connection String` no arquivo `appsettings.json` com as credenciais do seu PostgreSQL.
3. Crie o banco de dados e as tabelas rodando as migrations do EF Core:
   
   dotnet ef database update
   
4. Inicie o servidor da API:


    dotnet run
A API geralmente rodará em http://localhost:5191.

Passo 2: Configurando o Frontend
Abra um novo terminal e navegue até a pasta do Frontend: cd Frontend (ou o nome da sua pasta do React).

Instale as dependências do projeto:

Bash

npm install
Inicie o servidor de desenvolvimento:

Bash

npm run dev
Acesse a aplicação no seu navegador (geralmente em http://localhost:5173).

Desenvolvido com ☕ e foco em arquitetura de software por Mauro Junior.
