require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

// Oturum açan her kullanıcının refresh token’ları burada tutulur.
let refreshTokens = [] 

app.post('/token' , (req , res) => {

    const refreshToken = req.body.token // token endpoint’i refresh token alır.
    if(refreshToken == null ) return res.sendStatus(401) // Token yoksa 401
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // listede yoksa 403 döner
    
    // Refresh token doğrulanır.
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err , user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ Mail : user.gmail }) // İçindeki kullanıcı bilgisine göre yeni access token üretilir
        res.json({ accessToken : accessToken}) // Cevap olarak client’a yeni access token gönderilir

    })
})

//  /login endpoint’i e-posta ile oturum açmak içindir (şifre kontrolü yapılmaz, örnek amaçlı ) 
app.post('/login' , (req ,res) => {
    //Authenticate User

    const gmail = req.body.gmail
    const user = { Mail : gmail}// Mail isimli payload ile JWT token oluşturulacak

    const accessToken = generateAccessToken(user) //accessToken ve refreshToken üretilir
    const refreshToken = jwt.sign(user , process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken) // refreshToken listeye kaydedilir
    res.json({accessToken: accessToken , refreshToken: refreshToken}) //Kullanıcıya her iki token da verilir
}) 

// ACCESS_TOKEN_SECRET ile şifrelenmiş, 1 dakika geçerli access token üretir
function generateAccessToken(user) { 
    return jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '1m'})
}

app.listen(4000)

/* 
        --  authServer  (Bu sunucu kullanıcılara giriş işlemi sağlar)   --

- accessToken → server.js dosyasına gönderilip /posts verisine erişmek için kullanılır
- refreshToken → accessToken süresi dolunca /token ile yenilenebilir
- Her iki token da .env dosyasındaki secret’lar ile şifrelenmiştir

*/