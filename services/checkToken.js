const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token)
  //# o token do header bem mais ou menos assim "Bearer token..." o codigo acima separa um do outro e pega apenas o token

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  //validar se o token e correto
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);

    next();
  } catch (erro) {
    res.status(400).json({ msg: "Token Invalido!" });
  }
}

module.exports = checkToken