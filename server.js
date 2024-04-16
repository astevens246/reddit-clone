const express = require('express');
const { engine } = require('express-handlebars');


const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

// Cases Resource

// NEW
app.get('/cases/new', (req, res) => {
    res.render('cases-new',{});
})

app.listen(3000);