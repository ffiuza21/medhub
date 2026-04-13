from fastapi import FastAPI
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from datetime import datetime, date, time
from pydantic import BaseModel, field_validator
import re

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

@app.get("/especialidades")
def get_especialidades():
    try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      
      cursor.execute(
          "SELECT * FROM especialidades"
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
         "SELECT * FROM profissionais WHERE especialidade_id = %s", (especialidade_id,)
      )
      profs_por_especialidade = cursor.fetchall()
      cursor.close()
      conn.close()
      return profs_por_especialidade

   except Exception as e:
      return {"erro": str(e)}

@app.get("/disponibilidade/{profissional_id}/{data}")
def get_horarios_disponiveis_por_profissional(profissional_id, data):
   data_nomr = datetime.strptime(data, "%d-%m-%Y")
   dia = data_nomr.strftime('%A').lower()
   try:
    conn = conexao()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
       "SELECT horario FROM disponibilidade WHERE profissional_id = %s AND dia_semana = %s", (profissional_id, dia)
    )
    horarios_profissional = cursor.fetchall()
    cursor.close()
    conn.close()
    return horarios_profissional

   except Exception as e:
      return {"erro": str(e)}

@app.get("/agendamentos/{cpf}")
def get_agendamentos_por_cpf(cpf):
   try:
      conn = conexao()
      cursor = conn.cursor(cursor_factory=RealDictCursor)
      cursor.execute(
         "SELECT * FROM agendamentos WHERE cpf = %s", (cpf,)
      )
      agend_cpf = cursor.fetchall()
      cursor.close()
      conn.close()
      return agend_cpf
   
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