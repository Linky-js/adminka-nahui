const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // для формы

const PORT = process.env.PORT || 3000

const CONFIG_PATH = path.join(__dirname, '..', 'public', 'entityConfig.json')
const DATA_DIR = path.join(__dirname, 'data')

const validTokens = new Set()

const SETTINGS_PATH = path.join(__dirname, '..', 'public', 'settings.json')

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function writeSettings(settings) {
  await fs.writeFile(
    SETTINGS_PATH,
    JSON.stringify(settings, null, 2)
  )
}
// Middleware для аутентификации
app.use((req, res, next) => {
  if (req.path === '/login') {
    return next() // пропустить для логина
  }
  const token = req.cookies.auth_token
  if (req.method === 'GET' || validTokens.has(token)) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

// Функция для чтения конфига
async function readConfig() {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    return {}
  }
}

// Функция для записи конфига
async function writeConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
}

// Login route
app.post('/login', (req, res) => {
  const { login, password } = req.body
  if (login === 'admin' && password === 'adminadmin') {
    const token = uuidv4()
    validTokens.add(token)
    res.cookie('auth_token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false })
    res.json({ success: true, username: 'admin' })
  } else {
    res.status(401).json({ error: 'Неверные данные' })
  }
})

// Config routes
app.get('/config', async (req, res) => {
  const { action, entity } = req.query

  if (action === 'list') {
    const config = await readConfig()
    return res.json({ entities: config })
  }

  if (action === 'get' && entity) {
    const config = await readConfig()
    return res.json({ config: config[entity] || null })
  }

  if (action === 'load_settings') {
    const settings = await readSettings()
    return res.json({ settings })
  }

  res.status(400).json({ error: 'Invalid action' })
})


app.post('/config', async (req, res) => {
  const { action, entity } = req.query
  const input = req.body

  // CREATE
  if (action === 'create' && entity) {
    const config = await readConfig()
    if (config[entity]) {
      return res.status(409).json({ error: 'Entity already exists' })
    }
    config[entity] = input.config || []
    await writeConfig(config)
    return res.json({ success: true, config: config[entity] })
  }

  // UPDATE ✅
  if (action === 'update' && entity) {
    const config = await readConfig()
    if (!config[entity]) {
      return res.status(404).json({ error: 'Entity not found' })
    }

    config[entity] = input.config || []
    await writeConfig(config)

    return res.json({
      success: true,
      config: config[entity],
    })
  }

  // DELETE ✅
  if (action === 'delete' && entity) {
    const config = await readConfig()
    if (!config[entity]) {
      return res.status(404).json({ error: 'Entity not found' })
    }

    delete config[entity]
    await writeConfig(config)

    return res.json({ success: true })
  }

  // SAVE SETTINGS
  if (action === 'save_settings') {
    const settings = {
      apiUrl: input.apiUrl || '',
      apiDomain: input.apiDomain || '',
      charts: input.charts || [],
    }
    await writeSettings(settings)
    return res.json({ success: true })
  }

  res.status(400).json({ error: 'Invalid action' })
})


// Функция для чтения данных сущности
async function readEntityData(entity) {
  const filePath = path.join(DATA_DIR, `${entity}.json`)
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    return []
  }
}

// Функция для записи данных
async function writeEntityData(entity, data) {
  const filePath = path.join(DATA_DIR, `${entity}.json`)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// CRUD

// GET /entities/:entity - list
app.get('/entities/:entity', async (req, res) => {
  const { entity } = req.params
  const config = await readConfig()
  if (!config[entity]) {
    return res.status(404).json({ error: 'Entity not found' })
  }
  const data = await readEntityData(entity)
  res.json(data)
})

// POST /entities/:entity - create
app.post('/entities/:entity', async (req, res) => {
  const { entity } = req.params
  const config = await readConfig()
  if (!config[entity]) {
    return res.status(404).json({ error: 'Entity not found' })
  }
  const newItem = { id: uuidv4(), ...req.body }
  const data = await readEntityData(entity)
  data.push(newItem)
  await writeEntityData(entity, data)
  res.json(newItem)
})

// PUT /entities/:entity/:id - update
app.put('/entities/:entity/:id', async (req, res) => {
  const { entity, id } = req.params
  const config = await readConfig()
  if (!config[entity]) {
    return res.status(404).json({ error: 'Entity not found' })
  }
  const data = await readEntityData(entity)
  const index = data.findIndex((item) => item.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' })
  }
  data[index] = { ...data[index], ...req.body }
  await writeEntityData(entity, data)
  res.json(data[index])
})

// DELETE /entities/:entity/:id - delete
app.delete('/entities/:entity/:id', async (req, res) => {
  const { entity, id } = req.params
  const config = await readConfig()
  if (!config[entity]) {
    return res.status(404).json({ error: 'Entity not found' })
  }
  const data = await readEntityData(entity)
  const filtered = data.filter((item) => item.id !== id)
  if (filtered.length === data.length) {
    return res.status(404).json({ error: 'Item not found' })
  }
  await writeEntityData(entity, filtered)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
