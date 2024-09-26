let cors = require('cors') //install in terminal- npm i cors 
let express = require('express')
let bodyParser = require("body-parser") //install in terminal- npm i body-parser
const Pool = require('pg').Pool //connection 
let app = express()

const pool = new Pool({
    user: 'hkamara',
    host: 'localhost',
    database: 'api',
    password: 'password22',
    port: 5432
})

const corsOptions ={
    origin: '*', 
    credentials: true,
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get('/reddit', function (req,res){
    pool.query('SELECT * FROM redditusers', function(error,results){ //sending SQL commend 
        if(error) {
            throw error
        }
        res.send(results.rows)
    })  
})


app.post('/addpost', function(req,res){
    let votes = req.body.votes
    let image = req.body.image
    let title = req.body.title
    let author = req.body.author
    let subreddit = req.body.subreddit

    pool.query('INSERT INTO redditusers (votes, image, title, author, subreddit) VALUES ($1, $2, $3, $4, $5)', [votes, image, title, author, subreddit], function(error, results){
        if(error){
            console.log(error)
            throw error
        }
        res.send(req.body)
    })

})


app.put('/reddit/:id', (req, res) => {
    const id = req.params.id;
    const newVotes = req.body.votes;

    pool.query('UPDATE redditusers SET votes = $1 WHERE id = $2 RETURNING *', [newVotes, id], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error updating votes');
        } else {
            res.status(200).json(results.rows[0]); // Send back the updated post
        }
    });
});

app.listen(3000)