const fs = require("fs");
const path = require("path");
const express = require("express");
const db = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(db.slice(1))
});

const createNote = (body, arrayForNotes) => {
    const createdNote = body
    if(!Array.isArray(arrayForNotes)) {
        arrayForNotes = []
    }
    if(arrayForNotes.length === 0) {
        arrayForNotes.push(0)
    }

    body.id = arrayForNotes.length;
    arrayForNotes[0]++
    arrayForNotes.push(createdNote)

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(arrayForNotes, null, 2)
    )
    return createdNote
};

app.post('/api/notes', (req, res) => {
    const createdNote = createNote(req.body, db)
    res.json(createdNote)
});

const destoryNote = (id, arrayForNotes) => {
    for (let i = 0; i < arrayForNotes.length; i++) {
        let note = arrayForNotes[i]
        if (note.id == id) {
            arrayForNotes.splice(i, 1)
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(arrayForNotes, null, 2)
            );
            break;
        }
    }
};

app.delete('/api/notes/:id', (req, res) => {
    destoryNote(req.params.id, db)
    res.json(true)
});

app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`)
})