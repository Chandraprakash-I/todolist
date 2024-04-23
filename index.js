
const express = require("express");
const app=express();
const bodyParser=require("body-parser");

const _=require("lodash");

const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(!err) console.log("connected");
    else console.log(err); 
});


// "mongodb+srv://chandraprakashi2023:GpkxUjsFYuDuCEqT@cluster0.j3ihj8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
app.set("view engine","ejs");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const listSchema=new mongoose.Schema( {
    name: String
});
const Item=mongoose.model("Item",listSchema);
const read=new Item({
    name: "/title to create new list"});


const listOfItems=[read];

const schematwo=new mongoose.Schema({
    name: String,
    list: [listSchema]
});

const Smodel=mongoose.model("Smodel",schematwo);

app.get("/:listname",function(req,res){
    console.log('=================================');
    const s=_.capitalize(req.params.listname);
    Smodel.find({name:s},function(err,data){
        console.log('daataa :::'+data);
        if(err){
            console.log('error in finding bitch');
        }else{
           console.log(data.length);
            if(data.length===0 ){
                const first=new Smodel({
                    name:s,
                    list: listOfItems
                });
                first.save().then(()=>{
                    res.redirect("/"+s);
                }).catch((err)=>{
                    console.log('error');
                });
                
            }else{
                console.log('lidddt;'+data[0].list.length);
                // if(data[0].list.length===0 ){
                //     const first=new Smodel({
                //         name:s,
                //         list: listOfItems
                //     });
                //     first.save().then(()=>{
                //         return res.redirect("/"+s);
                //     }).catch((err)=>{
                //         console.log('error');
                //     });
                // }
                data.forEach(function(element){
                    var d=new Date();
                    var day1=d.toDateString("en-US");
                    res.render("day",{title: element.name ,dayis: day1,itemis: element.list}); 
                       
                });
                
                // var d=new Date();
                // var day1=d.toDateString("en-US");
                // res.render("day",{title: data ,dayis: day1,itemis: data}); 
            }   
        }
          
    });
    
});

app.get("/",function(req,res){
    var d=new Date();
  console.log('its inside get / beggur')
    //    var options={
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    //    };


    Item.find({},function(err,data){
        // console.log(req.body.params);
        if(err){
            console.log('error in / route:'+err);
        }else{
            console.log(data.length===0);
            if(data.length===0){

                Item.insertMany(listOfItems,function(err){
                    if(err){
                        console.log(err);
                    }
                    console.log("SuccessFully uploaded");
                    res.redirect("/"); 
                    
                });
            
            }else{
                var day1=d.toDateString("en-US");
               res.render("day",{title: "Home",dayis: day1,itemis: data});
            }
           
        }
       

        
            
        
    });
   
});

app.post("/",function(req,res){
     const a=req.body.item;
     const b=req.body.list; 
     console.log(a);
     console.log(b);
     const ad=new Item({
        name: a
     });
     if(b==="Home"){
        ad.save()
        .then(savedAd => { console.log('Saved ad:', savedAd);   res.redirect("/"); })
        .catch(err => { console.error(err) });
     
     }else{
        Smodel.findOne({name: b},function(err,data){
            console.log(data);
            if(err){
                console.log("error");
            }


            data.list.push(ad);
            data.save();
            res.redirect("/"+b);
        }).clone().catch(function(err){ console.log(err)})
           
        
     }
 
});

  

app.post("/delete",function(req,res){

    // Smodel.deleteMany({},function(err){
    //     if(err){
    //         console.error(err);
    //     }else{
    //         console.log('all deleted ;');
    //     }
    // });

    const b=req.body.checkbox;
    const c= req.body.listname;
    console.log('deleting');

    if(c==="Home"){
        Item.findByIdAndRemove(b,function(err){
            if(err){
                console.log("haii");
                console.log("error");
            }else{
                console.log("sucess");
                res.redirect("/");
            }
        });


       
      
    }else{
        Smodel.findOneAndUpdate({name: c},{$pull: {list: {_id: b}}},function(err,found){
           
            if(err){
                console.log("haii");
                console.log("error");
            }else{
                console.log("sucess");
                res.redirect("/"+c);
            }
        });
    }

});






app.listen(3000,function(){
    console.log("Listening on port 3000");
});
