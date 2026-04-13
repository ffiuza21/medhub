CREATE TABLE IF NOT EXISTS especialidades (
    id SERIAL PRIMARY KEY,
    especialidade VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS profissionais (
    id SERIAL PRIMARY KEY,
    crm VARCHAR(10) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    especialidade_id INT NOT NULL,
    FOREIGN KEY (especialidade_id) REFERENCES especialidades(id)
);

CREATE TABLE IF NOT EXISTS disponibilidade (
    id SERIAL PRIMARY KEY,
    profissional_id INT NOT NULL,
    dia_semana VARCHAR(100) NOT NULL,
    horario TIME NOT NULL,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id),
    UNIQUE (profissional_id, dia_semana, horario)
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    paciente VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    data_ DATE NOT NULL,
    horario TIME NOT NULL,
    profissional_id INT NOT NULL,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id),
    UNIQUE (data_, horario, profissional_id)
);
