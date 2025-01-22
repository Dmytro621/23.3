const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
app.use(cors())

const password = '2vhMYfTvGong6mEa'

mongoose.connect(`mongodb+srv://buddim46:${password}@cluster0.buvp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });


app.listen(3000, () => {
    console.log('Server is running')
})

app.use(express.json());

app.get('/users/', (req, res) => {
    Todo.find()
        .then(todos => res.json(todos))
        .catch(err => res.status(500).send('Error retrieving tasks'));
})

app.get('/users/:id', (req, res) => {
    const idUser = +req.params.id;
    Todo.findOne({ id: idUser })
        .then(todo => {
            if (todo) {
                res.json(todo);
            } else {
                res.send('user not found');
            }
        })
        .catch(err => res.status(500).send('Error finding task'));
})

app.post('/users/', (req, res) => {
    const newTodo = new Todo({ ...req.body, id: Math.floor(Math.random() * 100) });
    newTodo.save()
        .then(savedTodo => res.json(savedTodo))
        .catch(err => res.status(500).send('Error saving task'));
})

app.put('/users/:id', (req, res) => {
    const idUser = +req.params.id;
    Todo.findOneAndUpdate({ id: idUser }, req.body, { new: true })
        .then(todo => {
            if (todo) {
                res.send('Ok');
            } else {
                res.send('error');
            }
        })
        .catch(err => res.status(500).send('Error updating task'));
})

app.delete('/users/:id', (req, res) => {
    const idUser = +req.params.id;
    Todo.deleteOne({ id: idUser })
        .then(result => {
            if (result.deletedCount) {
                res.send('user has been deleted');
            } else {
                res.send('user not found');
            }
        })
        .catch(err => res.status(500).send('Error deleting task'));
})

const todoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: Number, unique: true }
});

const Todo = mongoose.model('Todo', todoSchema);