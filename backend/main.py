from fastapi import FastAPI
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from datetime import datetime, date, time
from pydantic import BaseModel, field_validator
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Carregando .env
load_dotenv()

PARAMETROS_CONEXAO = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD")
}

def conexao():
    return psycopg2.connect(**PARAMETROS_CONEXAO)

#------------------ CONFIGURAR CORS FASTAPI ------------------
origins = [
   "http://localhost:5173",
   "http://localhost:5174",
   "http://127.0.0.1:5173",
   "http://127.0.0.1:5174",
]

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Lista de sites permitidos
    allow_credentials=True,          # Permite o envio de cookies/autenticação
    allow_methods=["*"],             # Permite todos os verbos (GET, POST, etc.)
    allow_headers=["*"],             # Permite todos os headers (Content-Type, etc.)
)

#------------------ ENDPOINTS ------------------
@app.get("/especialidades")
def get_especialidades():
    try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      
      cursor.execute(
          "SELECT * FROM especialidades ORDER BY especialidade ASC"
          )

      especialidades = cursor.fetchall()
      cursor.close()
      conn.close()
      return especialidades
    
    except Exception as e: 
      return {"erro": str(e)}
       
@app.get("/profissionais/{especialidade_id}")
def get_profissionais_por_especialidade(especialidade_id: int):
   try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      cursor.execute(
         "SELECT * FROM profissionais WHERE especialidade_id = %s ORDER BY nome ASC", (especialidade_id,)
      )
      profs_por_especialidade = cursor.fetchall()
      cursor.close()
      conn.close()
      return profs_por_especialidade

   except Exception as e:
      return {"erro": str(e)}

@app.get("/disponibilidade/{profissional_id}/{data}")
def get_horarios_disponiveis_por_profissional(profissional_id, data):
   data_nomr = datetime.strptime(data, "%Y-%m-%d")
   dia = data_nomr.strftime('%A').lower()
   try:
    conn = conexao()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
       "SELECT horario FROM disponibilidade WHERE profissional_id = %s AND dia_semana = %s AND horario " \
       "NOT IN (SELECT horario FROM agendamentos WHERE profissional_id = %s AND data_ = %s)",
       (profissional_id, dia, profissional_id, data_nomr)
    )
    horarios_profissional = cursor.fetchall()
    horarios_formatados = [{"horario": str(h["horario"])[:5]} for h in horarios_profissional]
    cursor.close()
    conn.close()
    return horarios_formatados

   except Exception as e:
      return {"erro": str(e)}

@app.get("/agendamentos/{cpf}")
def get_agendamentos_por_cpf(cpf):
   try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      cursor.execute(
         "SELECT agendamentos.id, paciente, cpf, data_, horario, profissional_id, nome, especialidade_id, especialidades.especialidade" \
         " FROM agendamentos" \
         " JOIN profissionais ON agendamentos.profissional_id = profissionais.id" \
         " JOIN especialidades ON profissionais.especialidade_id = especialidades.id" \
         " WHERE cpf = %s" \
         " ORDER BY data_ DESC, horario ASC", (cpf,)
      )
      agend_cpf = cursor.fetchall()
      agend_cpf_formatado = [{**h, "horario": str(h["horario"])[:5]} for h in agend_cpf]
      cursor.close()
      conn.close()
      return agend_cpf_formatado
   
   except Exception as e:
      return {"erro": str(e)}
   
class AgendamentoSchema(BaseModel):
   paciente: str
   cpf: str
   data: date
   horario: time
   profissional_id: int

   @field_validator("paciente")
   @classmethod
   def validate_pacieente(cls, valor: str):
      if valor.strip() != "":
         return " ".join(valor.split())
      else: raise ValueError('*Campo obrigatório, não pode estar em branco')

   @field_validator("cpf")
   @classmethod
   def validate_cpf(cls, valor: str):
      cpf_valiido = re.sub(r'[^\d]', '', valor)
      if len(cpf_valiido) == 11:
         return cpf_valiido
      else: raise ValueError('*Campo obrigatório deve ter 11 digitos')

@app.post("/agendamentos")
def insert_agendamentos(agendamento: AgendamentoSchema):
   try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      cursor.execute("INSERT INTO agendamentos (paciente, cpf, data_, horario, profissional_id) "
      "VALUES (%s, %s, %s, %s, %s)", (agendamento.paciente, agendamento.cpf, agendamento.data, agendamento.horario, agendamento.profissional_id) 
      )
      conn.commit()
      cursor.close()
      conn.close()
      return {"mensagem": f"Agendamento do paciente {agendamento.paciente} realizado com sucesso"}

   except Exception as e:
      return {"erro": str(e)}
   
@app.delete("/agendamentos/{id}")
def delete_agendamentos(id):
   try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      cursor.execute(
         "DELETE FROM agendamentos WHERE id = %s", (id,)
      )
      conn.commit()
      cursor.close()
      conn.close()
      return {"mensagem": f"Agendamento cancelado com sucesso"}

   except Exception as e:
      return {"erro": str(e)}
   



#cd backend
#venv\Scripts\activate
#fastapi dev main.py