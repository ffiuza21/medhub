import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export async function getEspecialidades() {
  const resposta = await api.get('/especialidades')
  return resposta.data
}

export async function getProfissionais(especialidadeId) {
  const resposta = await api.get(`/profissionais/${especialidadeId}`)
  return resposta.data
}

export async function getHorariosDisponiveis(profissionalId, data) {
  const resposta = await api.get(`/disponibilidade/${profissionalId}/${data}`)
  return resposta.data
}

export async function getAgendamentosPorCpf(cpf) {
  const resposta = await api.get(`/agendamentos/${cpf}`)
  return resposta.data
}

export async function criarAgendamento(dados) {
  const resposta = await api.post('/agendamentos', dados)
  return resposta.data
}

export async function cancelarAgendamento(id) {
  const resposta = await api.delete(`/agendamentos/${id}`)
  return resposta.data
}