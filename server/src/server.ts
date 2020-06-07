import express from 'express';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

import routes from './routes';


const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

// Rota: Endereço completo da requisição
// Recurso: Qual entidade estamos acessando do sistema

// GET: Buscar uma ou mais informações do back-end
// POST: Criar uma nova informação no back-end
// PUT: Alterar uma informação no back-end
// DELETE: Remover uma informação no back-end

// Request Param: Parâmetros que vem na própria rota que identificam um recurso
// Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros, paginação e etc
// Request Body: Parâmetros para criação/atualização de informações

app.listen(3333);
