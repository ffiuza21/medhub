# MedHub — Sistema de Agendamento de Consultas

Sistema web para agendamento de consultas médicas, desenvolvido como projeto acadêmico no curso de Análise e Desenvolvimento de Sistemas — UniCEUB.

## Tecnologias utilizadas

- **Backend**: Python 3.12 + FastAPI
- **Banco de dados**: PostgreSQL 18
- **Frontend**: React + Vite + shadcn/ui

## Deploy

- Frontend: https://medhub-xi.vercel.app (Vercel)
- Backend: https://medhub-backend-nlkg.onrender.com (Render)

> **Aviso**: O banco de dados gratuito do Render expira em 21/05/2026 e será deletado automaticamente.

## Como rodar localmente

### Pré-requisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL instalado e rodando

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend` com as seguintes variáveis:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medhub
DB_USER=postgres
DB_PASSWORD=sua_senha

Crie o banco de dados e as tabelas:

```bash
psql -U postgres -c "CREATE DATABASE medhub"
psql -U postgres -d medhub -f schema.sql
psql -U postgres -d medhub -f seed.sql
```

Inicie o servidor:

```bash
fastapi dev main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:5173

## Funcionalidades

- Agendamento de consultas em 3 passos: especialidade → data e horário → confirmação
- Horários disponíveis filtrados por profissional e data
- Consulta de agendamentos por CPF
- Cancelamento de agendamentos
