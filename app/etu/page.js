"use client"
var axios = require('axios'); 
import {useState,useEffect} from 'react';
import Formulaire1 from "../GEN_messagerie/formulaire1";
import Link from 'next/link';
import './stylus1.css';

export default function Etude(){

    const [LSthreads,setLSthreads] = useState([]);

    const listerThreads = function(){
        axios.get("http://127.0.0.1:1234/threads",{params:{boardName:"etu"}}).then(function(res){setLSthreads(res.data);}).catch(function(err){console.log(err);});
        //console.log("LISTE THREADS ETU");
    }

    useEffect( () => listerThreads() , [] );

    return(
    <div className="partie_etu">
    <main className="contenu">

        <Formulaire1 destination="etu"/>
        
        {LSthreads.map( elm => <ThreadElement key={elm.thread_id} id={elm.thread_id} titre={elm.thread_title} date={elm.thread_date} /> )}
        
    </main>
    </div>
    );

}

function ThreadElement({id,titre,date}){

    return(
    <Link className="THREAD" href={"etu/"+id}>
    <div className="THREAD_meta">
        <p>{titre}</p>
        <p>{date}</p>
    </div>
    </Link>
    )

}