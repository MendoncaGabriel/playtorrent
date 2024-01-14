require('dotenv').config()
const express = require('express');
const router = express.Router();
const checkToken = require('../services/checkToken.js')
const filterProfanity = require('../services/filterProfanity.js')

//schemas
const Game = require('../model/gameSchema.js')
const Chat = require('../model/chatSchema.js')
const User = require('../model/user.js')


router.use(express.json());

router.post('/chat', checkToken, async (req, res) => {
    try {
        const comment = req.body.comment
        const userId = req.body.userId
        const pageId = req.body.pageId
        const userName = req.body.userName
        const date =  req.body.date
        
        const savedComment = new Chat({
            comment: comment,
            userId: userId,
            userName: userName,
            pageId: pageId,
            date: date
        });
          
        await savedComment.save()

        // Atualiza o usuário com a referência ao novo comentário
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { comments: { pageId: pageId, idComment: savedComment._id } }
            },
            { new: true }
        );

        console.log('Usuário atualizado com a referência ao comentário!');
        res.status(200).json({ success: true });
        
        
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});


router.get('/chat/:id', async (req, res)=>{
    try {
        const pageId = req.params.id
        console.log('pageID: ' + pageId)
        const comment = await Chat.find({ pageId: pageId });

        if (comment) {
            console.log('Comentário encontrado:', comment.length);
        } else {
            console.log('Comentário não encontrado.');
        }
  

        res.status(200).json(comment)


    } catch (error) {
        
    }
})


router.patch('/chat', checkToken, async (req, res) => {
    try {
        const commentId = req.body.commentId
        const userId = req.body.userId
        const commentNew = req.body.commentNew
        
        await Chat.findByIdAndUpdate(commentId, {comment: commentNew})

        await User.findOneAndUpdate(
            { _id: userId, "comments._id": commentId },
            { $set: { "comments.$.comment": commentNew } },
            { new: true }
        );
          
        
        res.status(200).json({success: true });
        
        
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});


router.delete('/chat', checkToken, async (req, res) => {
    try {
        const commentId = req.body.commentId
        const userId = req.body.userId
        
        await Chat.findByIdAndDelete(commentId)
        await User.updateOne(
            { _id: userId },
            { $pull: { comments: { idComment: commentId } } }
        );
          
          
        
        res.status(200).json({ success: true });
        
        
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ success: false, error: 'Erro interno no servidor' });
    }
});










module.exports = router;