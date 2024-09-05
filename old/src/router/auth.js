require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/user.js')



//Registrar usuario
router.use(express.json());

router.post('/register', async (req, res) => {
    const { name, password } = req.body;

    // validação
    if (!name) {
        return res.status(422).json({ field: 'name', msg: 'O nome é obrigatório' });
    }
    if (!password) {
        return res.status(422).json({ field: 'password', msg: 'A senha é obrigatória' });
    }


    // verificar se o usuário já existe
    const userExists = await User.findOne({ name: name });
    if (userExists) {
        console.log('usuario ja existe')
        return res.status(422).json({ field: 'name', msg: 'Por favor, utilize outro nome' });
    }

    // criar senha hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // criar usuário
    const user = new User({
        name,
        password: passwordHash,
    });

   
    try {
        await user.save();
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id, name: name }, secret);

        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', id: user._id, token });
    } catch (error) {
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
});


//fazer login
router.post('/login', async (req, res)=>{
	const {name, password} = req.body

	//validações
	if(!name){
		return res.status(422).json({msg: 'O name obrigatorio!'})
	}	
	if(!password){
		return res.status(422).json({msg: 'A senha obrigatorio!'})
	}	

	//checar se usuario existe
	const user = await User.findOne({name: name})

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

        res.status(200).json({msg: 'Autenticação realizada com sucesso!', id: user._id, token})
        //# No front end salve o token no localstorage para usalo posteriormente
	}
    catch(erro){
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
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded)

        res.json({ isValid: true, userName: decoded.name });
    } catch (error) {
        console.error(error);
        res.status(401).json({ isValid: false, msg: 'Token inválido.' });
    }
});



module.exports = router;