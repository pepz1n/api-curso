import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const SALT_ROUNDS = 10;

const generateToken = (user) => jwt.sign(
  { id: user.id, email: user.email },
  process.env.TOKEN_KEY,
  { expiresIn: '1d' },
);

const get = async (req, res) => {
  try {
    const response = await UserModel.findOne({ where: { id: req.user.id } });

    if (!response) {
      return res.status(200).send({
        type: 'error',
        message: 'Usuário não encontrado',
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

const create = async (dados, res) => {
  const { name, email, password } = dados;

  if (!name || !email || !password) {
    return res.status(200).send({
      type: 'error',
      message: 'Informe name, email e password',
      data: [],
    });
  }

  if (String(password).length < 6) {
    return res.status(200).send({
      type: 'error',
      message: 'A senha deve ter pelo menos 6 caracteres',
      data: [],
    });
  }

  const emailExists = await UserModel.findOne({
    where: { email: String(email).trim().toLowerCase() },
  });

  if (emailExists) {
    return res.status(200).send({
      type: 'error',
      message: 'Já existe um usuário com este email',
      data: [],
    });
  }

  const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

  const response = await UserModel.create({
    name: String(name).trim(),
    email,
    passwordHash,
  });

  return res.status(200).send({
    type: 'success',
    message: 'Cadastro realizado com sucesso',
    data: response,
    token: generateToken(response),
  });
};

const update = async (id, dados, res) => {
  const response = await UserModel.findOne({ where: { id } });

  if (!response) {
    return res.status(200).send({
      type: 'error',
      message: `Nenhum registro com id ${id} para atualizar`,
      data: [],
    });
  }

  const { name, email, password } = dados;

  if (email !== undefined) {
    const emailExists = await UserModel.findOne({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (emailExists && emailExists.id !== response.id) {
      return res.status(200).send({
        type: 'error',
        message: 'Já existe um usuário com este email',
        data: [],
      });
    }
    response.email = email;
  }

  if (name !== undefined) response.name = String(name).trim();

  if (password !== undefined) {
    if (String(password).length < 6) {
      return res.status(200).send({
        type: 'error',
        message: 'A senha deve ter pelo menos 6 caracteres',
        data: [],
      });
    }
    response.passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
  }

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
      return await create(req.body, res);
    }

    if (Number(id) !== req.user.id) {
      return res.status(403).send({
        type: 'error',
        message: 'Você só pode alterar a sua própria conta',
        data: [],
      });
    }

    return await update(id, req.body, res);
  } catch (error) {
    return res.status(200).send({
      type: 'error',
      message: 'Ops! Ocorreu um erro',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).send({
        type: 'error',
        message: 'Informe email e password',
        data: [],
      });
    }

    const user = await UserModel.scope('withPassword').findOne({
      where: { email: String(email).trim().toLowerCase() },
    });

    const passwordOk = user && await bcrypt.compare(String(password), user.passwordHash);

    if (!passwordOk) {
      return res.status(200).send({
        type: 'error',
        message: 'Email ou senha inválidos',
        data: [],
      });
    }

    return res.status(200).send({
      type: 'success',
      message: 'Login realizado com sucesso',
      data: user,
      token: generateToken(user),
    });
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

    if (Number(id) !== req.user.id) {
      return res.status(403).send({
        type: 'error',
        message: 'Você só pode deletar a sua própria conta',
        data: [],
      });
    }

    const response = await UserModel.findOne({ where: { id } });

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
  login,
  destroy,
};
