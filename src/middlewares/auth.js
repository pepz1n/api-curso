import jwt from 'jsonwebtoken';

// Exige o header "Authorization: Bearer <token>" e coloca o usuário em req.user
export default (req, res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).send({
        type: 'error',
        message: 'Token não informado',
        data: [],
      });
    }

    const payload = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (error) {
    return res.status(401).send({
      type: 'error',
      message: 'Token inválido ou expirado',
      data: [],
    });
  }
};
