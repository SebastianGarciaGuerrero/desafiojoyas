require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {
  obtenerInventario,
  inventarioOrdenado,
  inventarioPorPagina,
  inventarioPorFiltro
} = require('../utils/pg')

const PORT = process.env.PORT ?? 3_000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/joyas', (req, res) => {
  obtenerInventario(req.query)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.get('/inventarioOrdenado', (req, res) => {
  inventarioOrdenado(req.query)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.get('/joyasporpagina', (req, res) => {
  inventarioPorPagina(req.query)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.get('/joyas/filtros', (req, res) => {
  inventarioPorFiltro(req.query)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'Resource not found' }))

app.listen(PORT, () => console.log(`Server UP in URL: http://localhost:${PORT}`))
