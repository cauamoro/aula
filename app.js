const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(session({
  secret: 'sua_chave_secreta',
  resave: true,
  saveUninitialized: true
}));

// sempre vem no começo
app.use('/', express.static(__dirname +'/static'))

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const requireAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  } else {
    res.redirect('/login');
  }
};

// Rotas para as paginas
app.get('/home', (req, res) => {
  res.render('home', {posts: []});
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/posts', requireAdmin, (req, res) => {
  // Exemplo de postagens (você pode obter esses dados de um banco de dados)
  const posts = [
    { id: 1, title: 'Postagem 1', content: 'Conteúdo da postagem 1' },
    { id: 2, title: 'Postagem 2', content: 'Conteúdo da postagem 2' },
    { id: 3, title: 'Postagem 3', content: 'Conteúdo da postagem 3' }
  ];

  res.render('posts', { posts });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica as credenciais (isso é simplificado, em um ambiente real use um sistema de autenticação seguro)
  if (username === 'admin' && password === 'admin') {
    req.session.isAdmin = true;
    res.redirect('/posts');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
