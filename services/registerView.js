const Analytics = require('../model/analyticsSchema.js')
async function registerView(game) {
    try {
        const existingAnalytics = await Analytics.findOne({
            name: game.name,
            date: new Date().toISOString().split('T')[0] // Apenas a data (sem a hora)
        });

        if (existingAnalytics) {
            // Se já existir um registro para este jogo e data, incrementar as visualizações
            await Analytics.findByIdAndUpdate(existingAnalytics._id, { $inc: { views: 1 } }, { new: true });
        } else {
            // Se não existir, criar um novo registro
            const newAnalytics = new Analytics({
                name: game.name,
                views: 1,
                date: new Date().toISOString().split('T')[0] // Apenas a data (sem a hora)
            });

            await newAnalytics.save();
        }
    } catch (error) {
        console.error('Erro ao registrar visualização:', error.message);
    }
}

module.exports = registerView;