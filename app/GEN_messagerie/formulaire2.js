"use client"
var axios = require('axios');
import {useRef,useEffect,useState} from 'react';
import './formulaire2.css';

export default function Formulaire2({destination,board}){

    let refContenu = useRef();
    let refFichier = useRef();
    let refSubmit = useRef();

    const [ fichiers_envoyes , setFE ] = useState({ });
    const [ message_contenu , setMC ] = useState("");
    const [ interdiction , setInterdiction ] = useState(false);

    const verificationBasique = function(fichiers,contenu){

        document.querySelector(".indicationFichiers").innerHTML = "";

        let formats_acceptes = new Array("image/jpeg","image/png","","image/gif","application/pdf","application/octet-stream","video/mp4","audio/mpeg","video/webm");

        // Si un des fichiers n'est pas du bon format et/ou si le message est d'une longueur supérieur à 2000 caractères
        // alors on désactive le bouton d'envoi mdr...

        let ERREUR_FICHIERS = false;
        let ERREUR_CONTENU = false;

        let message_erreur_fichiers = new Array();
        for (let i = 0 ; i < fichiers.length ; i++ ){
            if ( formats_acceptes.includes(fichiers[i].type) == false  ){
                message_erreur_fichiers.push(`<p>Le fichier ${fichiers[i].name} possède un format interdit !</p>`);
                ERREUR_FICHIERS = true;
            }
        }

        if (ERREUR_FICHIERS){
            document.querySelector(".indicationFichiers").style.color = "red"
            for (let i = 0 ; i < message_erreur_fichiers.length ; i++ ){
                document.querySelector(".indicationFichiers").innerHTML += message_erreur_fichiers[i];
            }
        }
    
        
        if (contenu.length > 2000){
            //console.log("Le message est trop long !");
            document.querySelector(".indicationContenu").style.color = "red";
            ERREUR_CONTENU = true;
        }

        if (contenu.length == 0){
            //console.log("Aucun message n'est saisi !");
            document.querySelector(".indicationContenu").style.color = "red";
            ERREUR_CONTENU = true;
        }

        if ( contenu.length > 0 && contenu.length <= 2000 ){
            document.querySelector(".indicationContenu").style.color = "green";
        }

        if ( ERREUR_FICHIERS || ERREUR_CONTENU ){
            refSubmit.current.disabled = true;
        } else {
            refSubmit.current.disabled = false;
        }

        return ERREUR_FICHIERS || ERREUR_FICHIERS;

    }

    const publicationMessage = function(event){

        // On empêche la page de se rafraichir
        event.preventDefault();
        
        let contenu = refContenu.current.value;
        let fichiers = refFichier.current.files;
        let date = new Date();

        // On fait une vérification basique hihi...
        verificationBasique(fichiers,contenu);

        // Création d'un FormData regroupant toutes les
        // informations envoyées..
        let envoi = new FormData();

        envoi.append("thread_id",destination);     // L'ID du thread où sera envoyé le message
        for (let i = 0 ; i < fichiers.length ; i++ ){    // Les fichiers du premier message du thread
            envoi.append(`media-${i}`,fichiers[i]);
        }
        envoi.append("nombre_media",fichiers.length);
        envoi.append("message_contenu",contenu);// Le contenu textuel du premier message du thread
        envoi.append("envoi_date",date.toLocaleString());      // La date de création du thread et du message 
        envoi.append("board_envoi",board);

        if (interdiction == false){
            axios.post("http://127.0.0.1:1234/message",envoi,{headers:{'Content-Type':'multipart/form-data'}}).then(function(res){console.log(res);}).catch(function(err){console.log(err);});
        } else {
            console.log("L'envoi es interdit !");
        }
    }

    useEffect( () => setInterdiction( verificationBasique(refFichier.current.files,refContenu.current.value) ) , [message_contenu,fichiers_envoyes] )

    return(<form className="formulaire2">

        <h3>Post a message</h3>

        <label htmlFor="files1">Message&apos;s media :</label>
        <p className="indicationFichiers"></p>
        <input ref={refFichier} id="files1" type="file" name="imagos1" onChange={ (e) => setFE(refFichier.current.files) } multiple></input>

        <label htmlFor="premier1">Content of message :<p className="indicationContenu">{message_contenu.length}/2000 character(s) typed</p> </label>
        <textarea ref={refContenu} id="contenu1" rows="10" onChange={ (e) => setMC(e.target.value) }></textarea>

        <input type="submit" value="Post" ref={refSubmit} onClick={e => publicationMessage(e)}/>

    </form>);

}