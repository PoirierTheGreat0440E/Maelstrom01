"use client"
var axios = require('axios');
import {useRef} from 'react';
import './formulaire1.css';

export default function Formulaire1({destination}){

    let refTitre = useRef();
    let refContenu = useRef();
    let refFichier = useRef();
    let destination_table = useRef();

    const publicationThread = function(event){

        // On empêche la page de se rafraichir
        event.preventDefault();
        let titre = refTitre.current.value;
        let contenu = refContenu.current.value;
        let fichiers = refFichier.current.files;
        let destination_board = destination_table.current.value;
        let date = new Date();

        // Création d'un FormData regroupant toutes les
        // informations envoyées..
        let envoi = new FormData();

        envoi.append("thread_titre",titre);     // Le titre du nouveau thread

        for (let i = 0 ; i < fichiers.length ; i++ ){    // Les fichiers du premier message du thread
            envoi.append(`media-${i}`,fichiers[i]);
        }

        envoi.append("nombre_media",fichiers.length);

        envoi.append("boardName",destination_board);
        envoi.append("message_contenu",contenu);// Le contenu textuel du premier message du thread
        envoi.append("envoi_date",date.toLocaleString());      // La date de création du thread et du message 

        console.log("TITRE : "+envoi.get("thread_titre"));

        for (let i = 0 ; i < fichiers.length ; i++ ){    // Les fichiers du premier message du thread
            console.log(envoi.get(`media-${i}`));
        }

        console.log("DATE  : "+envoi.get("envoi_date"));

        
        axios.post("http://127.0.0.1:1234/threads",envoi,{headers:{'Content-Type':'multipart/form-data'}}).then(function(res){console.log(res);}).catch(function(err){console.log(err);});
        
    }

    const sendFiles = function(event){
        event.preventDefault();
        console.log("ENVOI DE FICHIERS...");
        //console.log(refFichier.current.files[0]);
        
        axios.post("http://127.0.0.1:1234/uploads",{imagos1:refFichier.current.files[0]},{
            headers:{'Content-Type':'multipart/form-data'}
        }).then(function(res){console.log(res);}).catch(function(err){console.log(err);});
        
        
    }

    return(<form className="formulaire1">
        <h3>Create a new thread in the {destination} board</h3>

        <label htmlFor="titre1">Thread&apos;s title : </label>
        <input ref={refTitre} type="text" id="titre1" name="titreThread" placeholder="Your thread title here..."/>

        <label htmlFor="files1">Thread&apos;s media :</label>
        <input ref={refFichier} id="files1" type="file" name="imagos1" multiple></input>

        <label htmlFor="premier1">Content of the first message...</label>
        <textarea ref={refContenu} id="premier1" rows="10"></textarea>

        <input type="hidden" ref={destination_table} value={destination}/>

        <input type="submit" value="Start the thread" onClick={e => publicationThread(e)}/>

    </form>);

}