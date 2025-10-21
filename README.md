# V2 - Sistemas Distribuídos: API REST para Gerenciamento de Estudantes

## 📋 Sobre o Projeto

Este projeto implementa uma **API REST** para gerenciamento de estudantes, desenvolvida como parte da **Atividade Avaliativa II (V2)** da disciplina de Sistemas Distribuídos. A implementação utiliza **Node.js**, **TypeScript**, **Express** e **Prisma** para demonstrar conceitos fundamentais de arquitetura REST em sistemas distribuídos.

## 🎯 Objetivos da Atividade

1. ✅ **Compreender o conceito de arquitetura REST** e sua importância em sistemas distribuídos
2. ✅ **Implementar uma API REST básica** utilizando Node.js e Express
3. ✅ **Experimentar operações CRUD** (Create, Read, Update, Delete) em recursos distribuídos
4. ✅ **Testar endpoints** utilizando ferramentas como Postman ou cURL
5. ✅ **Refletir sobre segurança, escalabilidade** e papel das APIs em aplicações distribuídas

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web para Node.js
- **Prisma** - ORM (Object-Relational Mapping) para banco de dados
- **Zod** - Biblioteca de validação de schemas
- **Docker** - Containerização (opcional)

## 📁 Estrutura do Projeto

```
src/
├── index.ts                          # Ponto de entrada da aplicação
├── middlewares/                      # Middlewares personalizados
│   ├── async-handler.middleware.ts   # Tratamento de funções assíncronas
│   └── error-handler.middleware.ts   # Tratamento global de erros
└── modules/
    └── students/                     # Módulo de estudantes
        ├── controller/               # Controladores REST
        ├── dtos/                     # Data Transfer Objects
        ├── repositories/             # Camada de acesso a dados
        └── useCases/                 # Casos de uso da aplicação
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM ou Yarn
- Banco de dados PostgreSQL (ou SQLite para desenvolvimento)

### Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/CarlosAlexandredevv/V2-distributed-systems.git
cd V2-distributed-systems
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure o banco de dados:**

```bash
# Execute as migrações do Prisma
npx prisma migrate dev
```

4. **Execute a aplicação:**

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

A API estará disponível em: `http://localhost:3001`

## 📚 Endpoints da API

### Base URL

```
http://localhost:3001
```

### 1. Criar Estudante

```http
POST /students
Content-Type: application/json

{
  "name": "João Silva",
  "course": "Ciência da Computação"
}
```

### 2. Listar Todos os Estudantes

```http
GET /students
```

### 3. Atualizar Estudante

```http
PUT /students/{id}
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "course": "Engenharia de Software"
}
```

### 4. Deletar Estudante

```http
DELETE /students/{id}
```

## 🧪 Testando a API

### Usando o arquivo api.http (VS Code)

O projeto inclui um arquivo `api.http` com exemplos de requisições que podem ser executados diretamente no VS Code com a extensão REST Client.

## 🏗️ Arquitetura da Aplicação

### Padrões Implementados

1. **Clean Architecture** - Separação clara entre camadas
2. **Repository Pattern** - Abstração da camada de dados
3. **Use Cases** - Lógica de negócio isolada
4. **DTOs** - Validação de dados de entrada
5. **Middleware Pattern** - Tratamento de erros e funções assíncronas

### Fluxo de Dados

```
Controller → UseCase → Repository → Database
     ↓           ↓         ↓
   DTOs      Business   Prisma
           Logic
```

## 🔒 Considerações de Segurança

- **Validação de entrada** com Zod schemas
- **Tratamento de erros** centralizado
- **Sanitização** de dados de entrada
- **Códigos de status HTTP** apropriados

## 📈 Escalabilidade e Sistemas Distribuídos

### Desafios Identificados

1. **Concorrência**: Múltiplas requisições simultâneas podem causar problemas de consistência
2. **Estado Compartilhado**: Dados em memória não são adequados para sistemas distribuídos
3. **Tolerância a Falhas**: Falta de mecanismos de recuperação automática
4. **Balanceamento de Carga**: Ausência de distribuição de requisições

### Possíveis Melhorias

1. **Banco de Dados Distribuído**: Implementar replicação e sharding
2. **Cache Distribuído**: Redis para melhorar performance
3. **Load Balancer**: Distribuir carga entre múltiplas instâncias
4. **Autenticação/Autorização**: JWT tokens e middleware de segurança
5. **Monitoramento**: Logs centralizados e métricas de performance

## 📊 Reflexões sobre Sistemas Distribuídos

### 1. Como essa API poderia ser expandida para rodar em múltiplos servidores?

**Resposta Contextualizada**: Com base na arquitetura atual (Node.js + Express + Prisma + PostgreSQL), a distribuição envolveria:

**Containerização e Orquestração:**

```yaml
# docker-compose.yml expandido
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    container_name: crud-students
    environment:
      - POSTGRES_DB=crud-students
      - POSTGRES_USER=crud-students
      - POSTGRES_PASSWORD=crud-students
    ports:
      - '5433:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U crud-students -d crud-students']
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  pgdata:
```

**Modificações no Código:**

- Implementar **health checks** no middleware existente
- Configurar **service discovery** com Consul/etcd
- Adicionar **connection pooling** no Prisma
- Implementar **circuit breakers** para tolerância a falhas

**Estratégias Específicas:**

- **Load Balancer** (Nginx) para distribuir requisições
- **Service Discovery** para registro automático de instâncias
- **Health Checks** integrados ao ErrorHandlerMiddleware existente
- **Containerização** com Docker e orquestração com Kubernetes

### 2. Quais problemas podem surgir com concorrência no acesso ao recurso "estudantes"?

**Problemas Específicos da Implementação Atual:**

**Race Conditions no Prisma:**

```typescript
// Problema: Duas requisições simultâneas podem causar inconsistência
async updateById(id: string, student: UpdateStudentByIdDto): Promise<void> {
  // Sem controle de concorrência - pode sobrescrever dados
  await this.prisma.student.update({
    where: { id },
    data: student,
  });
}
```

**Problemas Identificados:**

- **Lost Updates**: Duas transações modificando o mesmo estudante simultaneamente
- **Dirty Reads**: Leitura de dados não commitados entre transações
- **Non-repeatable Reads**: Dados mudam entre leituras da mesma transação
- **Phantom Reads**: Novos estudantes aparecem entre consultas

**Soluções para a Arquitetura Atual:**

- **Transações Otimistas** com versionamento no schema Prisma
- **Locks Pessimistas** usando `FOR UPDATE` no PostgreSQL
- **Retry Logic** no Repository Pattern existente
- **Transações Distribuídas** com Prisma `$transaction`

### 3. Como autenticação e autorização poderiam ser incorporadas?

**Implementação Específica para a Arquitetura Clean:**

**Middleware de Autenticação:**

```typescript
// src/middlewares/auth.middleware.ts
export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}
```

**Modificação do StudentsController:**

```typescript
async create(req: Request, res: Response) {
  // Adicionar validação de permissão
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const validatedData = CreateStudentDto.parse(req.body);
  const result = await this.createStudentUseCase.execute(validatedData);
  res.status(201).json(result);
}
```

**Integração com a Arquitetura Existente:**

- **JWT tokens** para autenticação stateless
- **Middleware de autorização** integrado ao AsyncHandlerMiddleware
- **Rate limiting** usando express-rate-limit
- **Validação de roles** nos Use Cases existentes
- **HTTPS** obrigatório em produção

### 4. Qual seria o impacto de integrar essa API a um banco de dados distribuído?

**Impactos Específicos na Implementação com Prisma:**

**Modificações no Schema:**

```prisma
model Student {
  id        String   @id @default(uuid())
  name      String
  course    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Campos para distribuição
  version   Int      @default(1)
  nodeId    String?  // Identificador do nó que criou o registro
}
```

**Impactos na Performance:**

- **Latência aumentada**: 50-200ms devido à sincronização entre nós
- **Connection pooling**: Necessário configurar no Prisma Client
- **Query timeout**: Ajustar timeouts para operações distribuídas
- **Retry logic**: Implementar no Repository Pattern existente

**Transações Distribuídas:**

- **Saga Pattern**: Para operações complexas entre múltiplos serviços
- **Two-Phase Commit (2PC)**: Para consistência forte
- **Eventual Consistency**: Para melhor performance

**Monitoramento Distribuído:**

```typescript
// src/middlewares/distributed-monitoring.middleware.ts
export class DistributedMonitoringMiddleware {
  static trackRequest(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    req.requestId = requestId;
    req.startTime = startTime;

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      console.log(
        JSON.stringify({
          requestId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          timestamp: new Date().toISOString(),
          nodeId: process.env.NODE_ID,
        }),
      );
    });

    next();
  }
}
```

**Resumo dos Impactos:**

1. **Latência**: Aumento de 50-200ms devido à sincronização
2. **Complexidade**: Implementação de padrões Saga e 2PC
3. **Monitoramento**: Observabilidade distribuída necessária
4. **Tolerância a Falhas**: Circuit breakers e retry logic
5. **Consistência**: Trade-off entre consistência forte e disponibilidade

**Vantagem da Arquitetura Atual:**
A Clean Architecture implementada facilita essas modificações, pois a camada de dados (Repository) já está abstraída, permitindo mudanças no backend sem afetar a lógica de negócio (Use Cases).
