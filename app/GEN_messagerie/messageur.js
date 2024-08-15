const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mysql = require('mysql');

let application = express();
application.use(cors());
application.use(express.json());
application.use(fileUpload());

let connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"shareplace"
});

connection.connect(); // Connection à la base de données shareplace

let port = 1234;

application.post("/message",function(req,res,next){
    console.log("REQUETE POST MESSAGES");
    console.log(req.body);

    let chaine_fichiers = "";
    for (let i = 0 ; i < req.body.nombre_media ; i++ ){
        console.log(req.files[`media-${i}`].mimetype);
        req.files[`media-${i}`].name = String(Date.now());
        if (req.files[`media-${i}`].mimetype == "image/jpeg"){
            req.files[`media-${i}`].name += ".jpg";
        } else if (req.files[`media-${i}`].mimetype == "image/png"){
            req.files[`media-${i}`].name += ".png";
        } else if (req.files[`media-${i}`].mimetype == "image/gif"){
            req.files[`media-${i}`].name += ".gif";
        } else if (req.files[`media-${i}`].mimetype == "application/pdf"){
            req.files[`media-${i}`].name += ".pdf";
        } else if (req.files[`media-${i}`].mimetype == "application/octet-stream"){
            req.files[`media-${i}`].name += ".txt";
        } else if (req.files[`media-${i}`].mimetype == "video/mp4"){
            req.files[`media-${i}`].name += ".mp4";
        } else if (req.files[`media-${i}`].mimetype == "audio/mpeg"){
            req.files[`media-${i}`].name += ".mp3";
        }else if (req.files[`media-${i}`].mimetype == "video/webm"){
            req.files[`media-${i}`].name += ".webm";
        }
        chaine_fichiers += req.files[`media-${i}`].name;
        chaine_fichiers += "&&&";
        req.files[`media-${i}`].mv(`../../public/uploads/${req.files[`media-${i}`].name}`);
    }
    // On insère le nouveau thread dans la table threads...
    connection.query(`INSERT INTO ${req.body.board_envoi}_messages (message_thread,message_date,message_fichiers,message_contenu) VALUES ('${req.body.thread_id}','${req.body.envoi_date}','${chaine_fichiers}','${req.body.message_contenu}')`,function(err,result,fiels){
        if (err){
            console.log(err);
        } else {
            console.log("Message inséré avec succès !");
            res.end();
        }
    });

});

application.get("/message",function(req,res,next){
    console.log(`SELECT * FROM ${req.query.boardName}_messages WHERE message_thread=${req.query.idThread} LIMIT ${req.query.limite} `);
    connection.query(`SELECT * FROM ${req.query.boardName}_messages WHERE message_thread=${req.query.idThread} LIMIT ${req.query.limite}`,function(err,result,fields){
        if (err){
            console.log(err);
        } else {
            res.json(result);
            res.end();
        }
    });
});

application.post("/threads",function(req,res,next){
    console.log("POST THREAD");
    let chaine_fichiers = "";
    for (let i = 0 ; i < req.body.nombre_media ; i++ ){
        console.log(req.files[`media-${i}`].mimetype);
        req.files[`media-${i}`].name = String(Date.now());
        if (req.files[`media-${i}`].mimetype == "image/jpeg"){
            req.files[`media-${i}`].name += ".jpg";
        } else if (req.files[`media-${i}`].mimetype == "image/png"){
            req.files[`media-${i}`].name += ".png";
        } else if (req.files[`media-${i}`].mimetype == "image/gif"){
            req.files[`media-${i}`].name += ".gif";
        }
        chaine_fichiers += req.files[`media-${i}`].name;
        chaine_fichiers += "&&&";
        req.files[`media-${i}`].mv(`../../public/uploads/${req.files[`media-${i}`].name}`);
    }
    // On insère le nouveau thread dans la table threads...
    connection.query(`INSERT INTO ${req.body.boardName}_threads (thread_date,thread_title) VALUES ('${req.body.envoi_date}','${req.body.thread_titre}')`,function(err,res,fiels){
        if (err){
            console.log(err);
        } else {
            console.log("THREAD CREE AVEC SUCCES !");
            connection.query(`INSERT INTO ${req.body.boardName}_messages (message_thread,message_date,message_fichiers,message_contenu)  VALUES (${res.insertId},'${req.body.envoi_date}','${chaine_fichiers}','${req.body.message_contenu}')`,function(err,res,fiels){
                if (err){
                    console.log(err);
                } else {
                    console.log("MESSAGE CREE AVEC SUCCES !");
                }
            });
        }
    });
});

application.get("/threads",function(req,res,next){
    console.log(req.query.boardName);
    console.log(`NOM DU BOARD : ${req.query.boardName}_threads `);
    connection.query(`SELECT * FROM ${req.query.boardName}_threads `,function(err,result,fields){
        if (err){
            console.log(err);
            res.end();
        } else {
            console.log(result);
            res.json(result);
            res.end();
        }
    });
    //res.end();
});

application.listen(port,function(){console.log(`Le serveur écoute au port ${port}`);});