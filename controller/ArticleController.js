const Article = require('../models/articleModel');
const User = require('../models/userModel');

// 1. Retrieve all articles populated with author information (Public)
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name email');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Exercice 2: Retrieve articles mta3 el-user el-connecté (GET /api/articles/my-articles - Protégé)
const getMyArticles = async (req, res) => {
  try {
    // Filtrage des articles par l'ID de l'utilisateur connecté
    const articles = await Article.find({ author: req.user._id }).populate('author', 'name email');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Create a new article (POST /api/articles - Protégé)
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        message: 'title and content are required' 
      });
    }

    // L-author yewli makhoudh mil-Token (req.user._id)
    const newArticle = await Article.create({ 
      title, 
      content, 
      author: req.user._id 
    });

    const populatedArticle = await newArticle.populate('author', 'name email');
    res.status(201).json(populatedArticle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Retrieve a single article by ID (Public)
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant d\'article invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

// 5. Update an existing article (PUT /api/articles/:id - Protégé)
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found for update' });
    }

    // Sécurité: Vérifier que l'utilisateur connecté est bien l'auteur de l'article ou un admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas l\'auteur de cet article' });
    }

    // Mise à jour
    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;
    await article.save();

    const populated = await article.populate('author', 'name email');
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant d\'article invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

// 6. Delete an article (DELETE /api/articles/:id - Protégé)
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found for deletion' });
    }

    // Sécurité: Vérifier que l'utilisateur connecté est bien l'auteur de l'article ou un admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas l\'auteur de cet article' });
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article deleted successfully', id: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Identifiant d\'article invalide' });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllArticles,
  getMyArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle
};