import TaskModel from '../models/TaskModel.js';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      // Toda consulta de tarefas filtra pelo usuário logado
      const where = { user_id: req.user.id };
      const { done } = req.query;

      if (done === 'true' || done === 'false') {
        where.done = done === 'true';
      }

      const response = await TaskModel.findAll({
        where,
        order: [['id', 'asc']],
      });
      return res.status(200).send({
        type: 'success',
        message: 'Registros carregados com sucesso',
        data: response,
      });
    }

    const response = await TaskModel.findOne({ where: { id, user_id: req.user.id } });

    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: `Nenhum registro com id ${id}`,
        data: [],
      });
    }

    return res.status(200).send({
      type: 'success',
      message: 'Registro carregado com sucesso',
      data: response,
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const create = async (userId, dados, res) => {
  const { title, done } = dados;

  if (!title || String(title).trim() === '') {
    return res.status(200).send({
      type: 'error',
      message: 'title é obrigatório',
      data: [],
    });
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(200).send({
      type: 'error',
      message: 'done deve ser true ou false',
      data: [],
    });
  }

  const response = await TaskModel.create({
    user_id: userId,
    title: String(title).trim(),
    done: done === true,
  });

  return res.status(200).send({
    type: 'success',
    message: 'Cadastro realizado com sucesso',
    data: response,
  });
};

const update = async (userId, id, dados, res) => {
  const response = await TaskModel.findOne({ where: { id, user_id: userId } });

  if (!response) {
    return res.status(200).send({
      type: 'error',
      message: `Nenhum registro com id ${id} para atualizar`,
      data: [],
    });
  }

  const { title, done } = dados;

  if (title !== undefined && String(title).trim() === '') {
    return res.status(200).send({
      type: 'error',
      message: 'title não pode ser vazio',
      data: [],
    });
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(200).send({
      type: 'error',
      message: 'done deve ser true ou false',
      data: [],
    });
  }

  if (title !== undefined) response.title = String(title).trim();
  if (done !== undefined) response.done = done;

  await response.save();
  return res.status(200).send({
    type: 'success',
    message: `Registro id ${id} atualizado com sucesso`,
    data: response,
  });
};

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      return await create(req.user.id, req.body, res);
    }

    return await update(req.user.id, id, req.body, res);
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(200).send({
        type: 'error',
        message: 'Informe um id para deletar o registro',
        data: [],
      });
    }

    const response = await TaskModel.findOne({ where: { id, user_id: req.user.id } });

    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: `Nenhum registro com id ${id} para deletar`,
        data: [],
      });
    }

    await response.destroy();
    return res.status(200).send({
      type: 'success',
      message: `Registro id ${id} deletado com sucesso`,
      data: [],
    });
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

export default {
  get,
  persist,
  destroy,
};
