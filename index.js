const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')

// MIDLEWARE: función que intercepta la petición que está pasando por la API
app.use(cors())
app.use(express.json())

app.use(logger)

let usuarios = [
  {
    id: 1,
    nombre: 'Esteban',
    edad: 18
  },
  {
    id: 2,
    nombre: 'Kassandra',
    edad: 25
  },
  {
    id: 3,
    nombre: 'Jorge',
    edad: 30
  },
  {
    id: 4,
    nombre: 'Sofía',
    edad: 16
  }
]

// RUTAS CON NODE
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(usuarios));
// });

// RUTAS CON EXPRESS
// ESTA RUTA ES LA RAÍZ, PUEDE SER UN MENSAJE DEL DESARROLLADOR PARA LA API
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/usuarios', (request, response) => {
  response.json(usuarios)
})

// OBTENER USUARIOS DE FORMA DINÁMICA EN BASE A UN ID
// EN REQUEST SIEMPRE LLEGARÁ UN STRING
app.get('/api/usuarios/:id', (request, response) => {
  const id = Number(request.params.id)
  const usuario = usuarios.find((usuario) => usuario.id === id)
  if (usuario) {
    response.json(usuario)
  } else {
    response.status(404).end()
  }
})

// ELIMINAR ELEMENTOS
app.delete('/api/usuarios/:id', (request, response) => {
  const id = Number(request.params.id)
  usuarios = usuarios.filter((usuario) => usuario.id !== id)
  response.status(204).end()
})

// CREAR ELEMENTOS
app.post('/api/usuarios', (request, response) => {
  const usuario = request.body
  if (!usuario || !usuario.nombre || !usuario.edad) {
    return response.status(400).json({
      error: 'falta contenido del usuario'
    })
  }

  const ids = usuarios.map((usuario) => usuario.id)
  const maxId = Math.max(...ids)
  const nuevoUsuario = {
    id: maxId + 1,
    nombre: usuario.nombre,
    edad: usuario.edad
  }
  usuarios = [...usuarios, nuevoUsuario]
  response.status(201).json(nuevoUsuario)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

//  Al momento de realizar deploy con Heroku se debe definir el puerto de la siguiente manera
// Así Heroku elige el puerto en base a sus variables de entorno
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${PORT}`)
})
