"use client"
var axios = require('axios');
import Image from 'next/image';
import Formulaire2 from '@/app/GEN_messagerie/formulaire2';
import {useState,useEffect,useRef} from 'react';
import Link from 'next/link';
import '../stylus1.css';

export default function Pagus({params}){

    // La liste des messages récupérés depuis la BDD...

    const [LSmessages,setLSmessages]= useState([]);

    const [NBmessage,setNBmessage] = useState(0);

    const [lecture,setLecture] = useState(false);

    const [NBlecture , setNBlecture ] = useState(0);

    const referenceChargement = useRef();

    const fondAtteint = function(e){
        //console.log(`scroll Y : ${window.innerHeight + window.scrollY} /// window height : ${document.body.scrollHeight}`);
        if ( window.innerHeight + window.scrollY > document.body.scrollHeight ){
          //console.log("Le fond est atteint");
          referenceChargement.current.click();
        }
    }

    useEffect( () => {window.addEventListener("scroll",function(e){fondAtteint(e);});} , [] );

    const lectureMessage = function(portion){
        setLecture(true);
        //axios.get("http://127.0.0.1:1234/message",{ params:{ idThread:params.threadId,boardName:"biz",depart: offset   } } ).then(function(res){setLSmessages( res.data ); updateLimite();  }).catch(function(err){console.log(err);});
        axios.get("http://127.0.0.1:1234/message",{ params:{ idThread:params.threadId,boardName:"biz",limite: portion} } ).then(function(res){  setLSmessages( res.data ); setNBmessage(res.data.length); setLecture(false); }).catch(function(err){console.log(err);});

    }

    useEffect( () => lectureMessage(6) , [] );
    
    return(
    <div className="partie_biz">
    <main className="contenu">

        <Formulaire2 destination={params.threadId} board="biz"/>

        <button className="privatos" ref={referenceChargement}  onClick={ () => lectureMessage(NBmessage + 1) } ></button>

        <div className="liste_messages">
        {LSmessages.map( elm => <MessageElement key={elm.message_id} cle={elm.message_id} date={elm.message_date} fichiers={elm.message_fichiers} contenu={elm.message_contenu} /> )}     
        </div>

        <button className="privatos" onClick={ (e) => referenceChargement.current.click() } ></button>

    </main>
    </div>
    );
}

// {LSmessages.map( elm => <MessageElement key={elm.message_id} cle={elm.message_id} date={elm.message_date} fichiers={elm.message_fichiers} contenu={elm.message_contenu} /> )}

function MessageElement({date,fichiers,contenu,cle}){

    let array_fichiers = fichiers.split("&&&");
    array_fichiers.pop();

    //<Image src={"/uploads/"+fi} width={200} height={200} />
    // {"/uploads/"+fi}

    //{array_fichiers.map( fi => <Link key={cle} href={"/uploads/"+fi}><Image key={cle} src={"/uploads/"+fi}  width={200} height={250}  placeholder='empty' /></Link> ) }

    let array_imagos = ["jpeg","jpg","gif","png"];


    return(<div className="message_element">

        <p>{date} <span className='idMessage'>{cle}</span></p>

        <div className="liste_fichiers">
        
        {array_fichiers.map(

            //fi => <Link key={cle} href={"/uploads/"+fi} target="_blank" ><Image key={cle} src={"/uploads/"+fi}  width={200} height={250}  placeholder='empty' /></Link> 
            
            //fi => { array_imagos.includes(fi.split(".")[1]) ? <Link key={cle} href={"/uploads/"+fi} target="_blank" ><Image key={cle} src={"/uploads/"+fi}  width={200} height={250}  placeholder='empty' /></Link> : <Link key={cle} href={"/uploads/"+fi} target="_blank" >{fi}</Link> }

            fi => <>{array_imagos.includes(fi.split(".")[1]) ? <Link key={cle} href={"/uploads/"+fi} alt={"/uploads/"+fi} target="_blank" ><Image key={cle} src={"/uploads/"+fi}  width={200} height={250}  placeholder='empty' /></Link> : fi.split(".")[1] == "mp4" ? <video controls><source src={"/uploads/"+fi} type="video/mp4"/></video> : fi.split(".")[1] == "mp3" ? <audio controls><source src={"/uploads/"+fi}/></audio> : <Link href={"/uploads/"+fi} target="_blank" >{fi}</Link>} </>

        )}

        </div>

        <p>{contenu}</p>
    </div>);

}