# App

**Transaction app**
Este é um dos 3 projetos da formação de Node.js da Rocketseat, ele é uma aplicação de transações. Ele é uma API REST onde somente é possível identificar o usuário por um session-id. Neste projeto o usuário  é capaz decontrolar suas finnanças por meio do cadastro de suas transações 

**Tecnologias utilizadas:**
- Node.js
- Typescript
- Knex Query Builder
- Fastify
- Vitest
- Supertest
- Zod
- PotsgreSQL | SQLite
- Git | Github

**Conceitos utilizados**
- **_Repositories_**
  - In Memory Test Repositories
- **_Tests_**
  - Automated Tests
  - End-to-End tests | Vitest & Supertest
  - Unit Tests | Vitest

## RF

- [x] O usuário deve poder criar uma nova transação;
- [x] O usuário deve poder obter um resumo de sua conta;
- [x] O usuário deve poder listar transações que já ocorreram;
- [x] O usuário deve poder visualizar uma transação única;

## RN

- [x] A transação pode ser do tipo crédito que somará ao valor total, ou débito que irá subtrair;
- [x] Deve ser possível indentificarmos o usuário entre as requisições
- [x] O usuário só pode visializar transações o qual ele criou;
