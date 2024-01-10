require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.js')



//Registrar usuario
router.use(express.json());
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    // validação
    if (!name) {
        return res.status(422).json({ msg: "o nome é obrigatório" });
    }
    if (!email) {
        return res.status(422).json({ msg: "o email é obrigatório" });
    }
    if (!password) {
        return res.status(422).json({ msg: "a senha é obrigatória" });
    }

    // verificar se o usuário já existe
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ msg: "por favor, utilize outro email" });
    }

    // criar senha hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // criar usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();

        // criar e assinar token
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id, name: name }, secret);

        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });
    } catch (error) {
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
});

//fazer login
router.post('/login', async (req, res)=>{
	const {email, password} = req.body

	//validações
	if(!email){
		return res.status(422).json({msg: 'O email obrigatorio!'})
	}	
	if(!password){
		return res.status(422).json({msg: 'A senha obrigatorio!'})
	}	

	//checar se usuario existe
	const user = await User.findOne({email: email})

	if(!user){
		return res.status(404).json({msg: 'usuario não encontrado!'})
	}

	//verificar senha confere com cadastro
	const checkPassword = await bcrypt.compare(password, user.password)

	if(!checkPassword ){
		return res.status(422).json({msg: 'Senha invalida'})
	}

	try{
		const secret = process.env.SECRET
		const token = jwt.sign(
			{
				id: user._id
			}, secret
		)

	res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})
	//# No front end salve o token no localstorage para usalo posteriormente
	
		
	}catch(erro){
		console.log(erro)
		res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'})
	}

})

//verificar token
router.post('/check-token', (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ msg: 'Token ausente na solicitação.' });
    }

    try {
        const SECRET = process.env.SECRET
        console.log(SECRET)
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded)

        res.json({ isValid: true, userName: decoded.name });
    } catch (error) {
        console.error(error);
        res.status(401).json({ isValid: false, msg: 'Token inválido.' });
    }
});



module.exports = router;