// .env dosyasındaki gizli anahtarları (ACCESS_TOKEN_SECRET) projeye dahil eder.
require('dotenv').config() 

// Express framework’ünü ve JWT (token doğrulama kütüphanesi) projeye dahil eder.
const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

// Gelen JSON formatındaki istekleri anlamasını sağlar (req.body'yi kullanabiliriz).
app.use(express.json())

const posts = [
    {
        gmail : 'emre@gmail.com',
        password: bcrypt.hashSync('1234', 10)
    },
    {
        gmail : 'yasin@gmail.com',
        password: bcrypt.hashSync('4321', 10)
    }
]

// authenticateToken middleware’i ile token kontrolü yapılır.
app.get('/posts', authenticateToken, (req,res) => {
    
    res.json(posts.filter( post => post.gmail === req.user.Mail))//Token geçerliyse, sadece o kullanıcıya ait post'lar döndürülür.
})

function authenticateToken (req , res , next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if ( token == null ) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err , user) => {//Doğruysa, içindeki Mail bilgisini req.user’a atar
        
        if (err) return res.sendStatus(403)//Token doğrulanır. Hatalıysa 403 döner

        req.user = user
        next()

    })

}
app.listen(3000)
/*    
        --  server.js (Korunan veri sunucusu (API sunucu) ) -- 

- authServer.js tarafından oluşturulan access token`ı kontrol eder.
- Doğrulama için .env dosyasındaki ACCESS_TOKEN_SECRET kullanılır.
- Kullanıcı sadece geçerli access token’la /posts verisine erişebilir

*/ 