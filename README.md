# Golden Raspberry Awards API

API RESTful para consulta dos premiados do Golden Raspberry Awards na categoria Pior Filme.

## 🚀 Requisitos

- Docker
- Docker Compose

## 💻 Execução

1. Clone o repositório:
```bash
git clone https://github.com/mordente/outsera-test.git
cd outsera-test
```

2. Inicie a aplicação:
```bash
docker compose run --build --service-ports api
```

A API estará disponível em `http://localhost:3000`

## 🧪 Executando os Testes

```bash
docker compose run --build test
```

## 📚 API Endpoint

### Consultar os premiados

`GET /api/producers/intervals`

Retorna os intervalos de tempo entre os premiados de Pior Filme.

#### Exemplo de Resposta:

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

## 🛠️ Tecnologias Utilizadas

- Node.js com TypeScript
- Express
- Prisma ORM
- SQLite (banco em memória)
- Jest (testes)
- Docker
