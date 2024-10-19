// config inicial
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const app = express();

// Models
const Livro = require('./models/Livros');
const Genero = require('./models/Genero');
const LocalBiblioteca = require('./models/LocalBiblioteca');
const User = require('./models/user');

// Criando função p/ criptografar senhas
const cipher = {
    algorithm: "aes256",
    secret: "chaves",
    type: "hex"
};

async function getCrypto(password) {
    return new Promise((resolve, reject) => {
        const cipherStream = crypto.createCipher(cipher.algorithm, cipher.secret);
        let encryptedData = '';

        cipherStream.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipherStream.read())) {
                encryptedData += chunk.toString(cipher.type);
            }
        });

        cipherStream.on('end', () => {
            resolve(encryptedData);
        });

        cipherStream.on('error', (error) => {
            reject(error);
        });

        cipherStream.write(password);
        cipherStream.end();
    });
}

//Configurando API para ler JSON
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

// Rotas

// Rota inicial
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API da Livraria!' });
});

//LOGIN INSERIR (funcionou)
app.post('/User', async (req, res) => {
    let { email, pass } = req.body;
    try {
        let newPass = await getCrypto(pass);
        const user = {
            email,
            pass: newPass,
        };
        await User.create(user);
        res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// O R do CRUD (ler os usuarios) (funcionou)
app.get('/person', async (req, res) => {
    try {
      const people = await User.find()
  
      res.status(200).json(people)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  });

// Login do Usuário (funcionou)
app.post('/login', async (req, res) => {
    let { email, pass } = req.body;
    try {
        let encryptedPass = await getCrypto(pass);
        const user = await User.findOne({ email, pass: encryptedPass });
        if (!user) {
            res.status(422).json({ message: 'Credenciais inválidas!' });
            return;
        }
        res.status(200).json({ message: 'Usuário Logado', user: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Rota para adicionar livro (funcionou)
app.post('/livro', async (req, res) => {
    const { titulo, autor, editora, sinopse, genero, local } = req.body; // Incluindo genero e local

    const livro = new Livro({
        titulo,
        autor,
        editora,
        sinopse,
        genero, 
        local 
    });

    try {
        await livro.save();
        res.status(201).json({ message: 'Livro cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});



// Rota para adicionar gênero (funcionou)
app.post('/genero', async (req, res) => {
    const { nome, descricao } = req.body;

    const genero = new Genero({
        nome,
        descricao
    });

    try {
        await genero.save();
        res.status(201).json({ message: 'Gênero cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Rota para adicionar local da biblioteca (funcionou)
app.post('/localbiblioteca', async (req, res) => {
    const { local, secao } = req.body;

    const localBiblioteca = new LocalBiblioteca({
        local,
        secao
    });

    try {
        await localBiblioteca.save();
        res.status(201).json({ message: 'Local da biblioteca cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});


//ROTAS PARA LER

// Rotas para Livros (funcionou)
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find().populate('local').populate('genero'); 
        res.status(200).json(livros);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});


// ler o livro por id (funcionou)
app.get('/livros/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const livro = await Livro.findOne({ _id: id }).populate('local').populate('genero');
        if (!livro) {
            res.status(422).json({ message: 'Livro não encontrado!' });
            return;
        }
        res.status(200).json(livro);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Rotas para Gêneros (funcionou)
app.get('/generos', async (req, res) => {
    try {
        const generos = await Genero.find();
        res.status(200).json(generos);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

app.get('/generos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const genero = await Genero.findOne({ _id: id });
        if (!genero) {
            res.status(422).json({ message: 'Gênero não encontrado!' });
            return;
        }
        res.status(200).json(genero);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Rotas para Localização da Biblioteca (funcionou)
app.get('/locais', async (req, res) => {
    try {
        const locais = await LocalBiblioteca.find();
        res.status(200).json(locais);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

app.get('/locais/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const local = await LocalBiblioteca.findOne({ _id: id });
        if (!local) {
            res.status(422).json({ message: 'Local não encontrado!' });
            return;
        }
        res.status(200).json(local);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});



// Conectando ao banco
mongoose.connect(`mongodb://localhost:27017`).then(() => {
    console.log("Conectamos ao mongoDB")
    app.listen(3000)
})
    .catch((err) => {
        console.log(err)
    })