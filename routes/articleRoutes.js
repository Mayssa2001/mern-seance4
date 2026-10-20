const express = require('express');
const router = express.Router();

const {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getMyArticles // Exercice 2
} = require('../controller/ArticleController');

const { protect } = require('../middlewares/authMiddleware');

// 1. Consultation publique
router.get('/', getAllArticles);

// 2. Exercice 2: Consultation des articles de l'utilisateur connecté (Protégée)
// ATTENTION: Doit être placée impérativement AVANT /:id !
router.get('/my-articles', protect, getMyArticles);

// 3. Consultation publique par ID
router.get('/:id', getArticleById);

// 4. Opérations d'écriture protégées par authentification JWT
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;