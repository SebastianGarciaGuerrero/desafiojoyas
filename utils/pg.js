require('dotenv').config()
const { Pool } = require('pg')
const format = require('pg-format')

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  allowExitOnIdle: true
}

const pool = new Pool(config)

const genericQuery = (query, values) => pool
  .query(query, values)
  .then(({ rows }) => rows)
  .catch(({ code, message }) => ({ code, message }))

const obtenerInventario = async ({ limits = 5 }) => await genericQuery('SELECT * FROM inventario LIMIT $1;', [limits])

const inventarioOrdenado = async ({ limits = 6, order = 'nombre_asc' }) => {
  const [campo, direccion] = order.split('_')
  const formattedQuery = format('SELECT * FROM inventario ORDER BY %s %s LIMIT %s;', campo, direccion, limits)
  return await genericQuery(formattedQuery)
}

const inventarioPorPagina = async ({ limits = 6, page = 1 }) => {
  const offset = limits * (page - 1)
  const formattedQuery = format('SELECT * FROM inventario LIMIT %s OFFSET %s;', limits, offset)
  return await genericQuery(formattedQuery)
}

const inventarioPorFiltro = async ({ stockmin, preciomax, categoria, metal }) => {
  const filtros = []
  const values = []
  let query = 'SELECT * FROM inventario'

  if (stockmin) filtros.push(`stock >= $${values.push(stockmin)}`)
  if (preciomax) filtros.push(`precio <= $${values.push(preciomax)}`)
  if (categoria) filtros.push(`categoria = $${values.push(categoria)}`)
  if (metal) filtros.push(`metal = $${values.push(metal)}`)

  if (filtros.length > 0) query += ` WHERE ${filtros.join(' AND ')};`

  return await genericQuery(query, values)
}

module.exports = {
  obtenerInventario,
  inventarioOrdenado,
  inventarioPorPagina,
  inventarioPorFiltro
}
