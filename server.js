const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
const port=6060;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const bcrypt=require('bcrypt');
const mongoClient=require('mongodb').MongoClient;
require('dotenv').config();
const conStr=process.env.mongodb;

//default page
app.get('/',(req,res)=>{
    res.send('Welcome to server port:'+port);
});

//signup
app.post('/signup',(req,res)=>{
    mongoClient.connect(conStr).then((clientObject)=>{
        const db=clientObject.db('video-library');
        db.collection('users').findOne({email:req.body.email}).then(async(user)=>{
            if(user){
                res.send('This email is already registered')
            }else{
                db.collection('users').insertOne({...req.body,password:await bcrypt.hash(req.body.password,10)}).then(()=>{
                    res.send('Sigup success');
                })
            }
        })
        
    })
});

//login
app.post('/login',(req,res)=>{
    mongoClient.connect(conStr).then((clientObject)=>{
        const db=clientObject.db('video-library');
        db.collection('users').findOne({email:req.body.email}).then(async (user)=>{
            if(user){
                const correctPassword=await bcrypt.compare(req.body.password, user.password);
                if(correctPassword){res.send({...user,status:'success'})}
                else{res.send('invalid password')}
            }
            else{res.send('invalid user')}
        })
    })
});

//....................server at port 6060....................
app.listen(port);
console.log('http://localhost:'+port);