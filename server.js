require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")


app.use(express.json())

const posts = [
    {
        gmail : 'emre@gmail.com',
        password: '1234'
    },
    {
        gmail : 'yasin@gmail.com',
        password: '4321'
    }
]

app.get('/posts', authenticateToken, (req,res) => {
    
    res.json(posts.filter( post => post.gmail === req.user.Mail))
})

function authenticateToken (req , res , next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if ( token == null ) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err , user) => {
        
        if (err) return res.sendStatus(403)

        req.user = user
        next()

    })

}
app.listen(3000)