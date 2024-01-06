const express = require('express');
const router = express.Router();

const Visitas = require('../model/Visitas.js')

router.post('/constView', async (req, res)=>{
    try {
        try {
            // Encontrar o documento correspondente à data atual
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
            const documentoAtual = await Visitas.findOne({ date: hoje });
    
            if (documentoAtual) {
                // Se já existe um documento para a data atual, incrementar o total de visitas
                documentoAtual.views += 1;
                await documentoAtual.save();
                res.status(200).json({ msg:'Visita registrada com sucesso!, Total: ' + documentoAtual.views});
            } else {
                // Se não existe um documento para a data atual, criar um novo documento com total 1
                const novoDocumento = new Visitas({ views: 1, date: hoje });
                await novoDocumento.save();
                res.status(200).json({ msg:'Visita registrada com sucesso!, Total: ' + documentoAtual.views});
            }
    
        } catch (erro) {
            console.error('Erro ao incrementar o total de visitas:', erro.message);
        }
    } catch (error) {
        console.log('Erro ao contar view')
    }
})

module.exports = router;