const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')

const app = express()
const api = express.Router()
/* ================== BASIC MIDDLEWARE ================== */
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://gyf.global/admin', 'https://gyf.global/'],
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3001

/* ================== PATHS ================== */

const CONFIG_PATH = path.join(__dirname, 'public', 'entityConfig.json')
const SETTINGS_PATH = path.join(__dirname, 'public', 'settings.json')
const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads')

const validTokens = new Set()

/* ================== FILE UPLOAD (MULTER) ================== */

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

app.use('/api/public/uploads', express.static(UPLOADS_DIR))

/* ================== AUTH MIDDLEWARE ================== */

api.use((req, res, next) => {
  if (req.path === '/login') return next()

  const token = req.cookies.auth_token
  if (req.method === 'GET' || validTokens.has(token)) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
})

/* ================== HELPERS ================== */

async function readConfig() {
  try {
    return JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function writeConfig(config) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
}

async function readSettings() {
  try {
    return JSON.parse(await fs.readFile(SETTINGS_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function writeSettings(settings) {
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2))
}

async function readEntityData(entity) {
  const filePath = path.join(DATA_DIR, `${entity}.json`)
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return []
  }
}

async function writeEntityData(entity, data) {
  const filePath = path.join(DATA_DIR, `${entity}.json`)
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

/* ================== AUTH ================== */

api.post('/login', (req, res) => {
  const { login, password } = req.body

  if (login === 'admin' && password === 'Linky12345678@') {
    const token = uuidv4()
    validTokens.add(token)

    res.cookie('auth_token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
    })

    res.json({ success: true, username: 'admin' })
  } else {
    res.status(401).json({ error: 'Неверные данные' })
  }
})

/* ================== CONFIG ================== */

api.get('/config', async (req, res) => {
  const { action, entity } = req.query

  if (action === 'list') {
    return res.json({ entities: await readConfig() })
  }

  if (action === 'get' && entity) {
    const config = await readConfig()
    return res.json({ config: config[entity] || null })
  }

  if (action === 'load_settings') {
    return res.json({ settings: await readSettings() })
  }

  res.status(400).json({ error: 'Invalid action' })
})

api.post('/config', async (req, res) => {
  const { action, entity } = req.query
  const input = req.body
  const config = await readConfig()

  if (action === 'create' && entity) {
    if (config[entity]) {
      return res.status(409).json({ error: 'Entity already exists' })
    }
    config[entity] = input.config || []
    await writeConfig(config)
    return res.json({ success: true })
  }

  if (action === 'update' && entity) {
    if (!config[entity]) {
      return res.status(404).json({ error: 'Entity not found' })
    }
    config[entity] = input.config || []
    await writeConfig(config)
    return res.json({ success: true })
  }

  if (action === 'delete' && entity) {
    delete config[entity]
    await writeConfig(config)
    return res.json({ success: true })
  }

  if (action === 'save_settings') {
    await writeSettings({
      apiUrl: input.apiUrl || '',
      apiDomain: input.apiDomain || '',
      charts: input.charts || [],
    })
    return res.json({ success: true })
  }

  res.status(400).json({ error: 'Invalid action' })
})

/* ================== FILE UPLOAD ================== */

api.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File not provided' })
  }

  res.json({
    success: true,
    file: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  })
})

/* ================== ENTITIES CRUD ================== */

// LIST
api.get('/entities/:entity', async (req, res) => {
  const { entity } = req.params
  const config = await readConfig()
  if (!config[entity]) return res.status(404).json({ error: 'Entity not found' })
  res.json(await readEntityData(entity))
})

// GET ONE
api.get('/entities/:entity/:id', async (req, res) => {
  const { entity, id } = req.params
  const data = await readEntityData(entity)

  const item = data.find((i) => i.id === id)

  if (!item) {
    return res.status(404).json({ error: 'Item not found' })
  }

  res.json(item)
})
// CREATE (+ FILE)
api.post('/entities/:entity', upload.single('file'), async (req, res) => {
  const { entity } = req.params
  const config = await readConfig()

  if (!config[entity]) {
    return res.status(404).json({ error: 'Entity not found' })
  }

  const data = await readEntityData(entity)

  const newItem = {
    id: uuidv4(),
    ...req.body,
    file: req.file ? `/uploads/${req.file.filename}` : null,
  }

  data.push(newItem)
  await writeEntityData(entity, data)
  res.json(newItem)
})

// UPDATE
api.put('/entities/:entity/:id', async (req, res) => {
  const { entity, id } = req.params
  const data = await readEntityData(entity)
  const index = data.findIndex((i) => i.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' })
  }

  data[index] = { ...data[index], ...req.body }
  await writeEntityData(entity, data)
  res.json(data[index])
})

// DELETE
api.delete('/entities/:entity/:id', async (req, res) => {
  const { entity, id } = req.params
  const data = await readEntityData(entity)

  const filtered = data.filter((i) => i.id !== id)
  if (filtered.length === data.length) {
    return res.status(404).json({ error: 'Item not found' })
  }

  await writeEntityData(entity, filtered)
  res.json({ success: true })
})

app.use('/api', api)

/* ================== START ================== */

app.listen(PORT, () => {
  console.log(`🚀 Admin backend running on port ${PORT}`)
})