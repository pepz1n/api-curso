import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sequelize } from './config/config.js';

const app = express();
// Atrás do Nginx: usa o X-Forwarded-For para registrar o IP real do cliente no log
app.set('trust proxy', 1);
const dirname = path.dirname(fileURLToPath(import.meta.url));

const accessLogStream = fs.createWriteStream(
  path.join(dirname, '../access.log'),
  { flags: 'a' },
);

const corsOptions = {
  origin(origin, callback) {
    callback(null, true);
  },
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send({ status: 'ok', database: 'ok' });
  } catch (error) {
    res.status(503).send({ status: 'ok', database: 'indisponível' });
  }
});

routes(app);
app.use((req, res) => {
  res.status(404).send('404 - Página não encontrada');
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
