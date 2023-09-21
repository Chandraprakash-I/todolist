const express = require("express");
const app=express();

const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(!err) console.log("connected");
    else console.log(err); 
});

app.listen(3000,function(){
    console.log("Listening");
});