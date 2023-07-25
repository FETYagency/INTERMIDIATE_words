import { Fragment, useState } from 'react'
import {FontOptions as FFs} from "./components/fontOptions"
import {ThemeSwitcher as Themes} from "./components/themeSwitcher"

import "./app.css"

import logo from "./assets/images/logo.svg"
import arrow from "./assets/images/icon-arrow-down.svg"
import searchBar from "./assets/images/icon-search.svg"
import play from "./assets/images/icon-play.svg"
import playHover from "./assets/images/icon-play-hovered.svg"
import window from "./assets/images/icon-new-window.svg"



const assets = {
  logo: logo,
  arrow: arrow,
  searchBar: searchBar,
  play: play,
  playHover: playHover,
  window: window,
}

function Header(){
    function openTab(e){
        e.currentTarget.classList.toggle("open")
    }
    return(
        <header>
            <a href="#" className='logo'>
                <img src={assets.logo}/>
            </a>

            <div className='options'>

                <div className="dropdownFonts" onClick={openTab}>
                    <p className="font">Sans Serif</p>

                    <div className="arrow">
                        <img src={assets.arrow}/>
                    </div>

                    <div className="fontOptions">
                        <FFs name="Sans Serif" dataAttr="sf"/>
                        <FFs name="Serif" dataAttr="s"/>
                        <FFs name="Mono" dataAttr="m"/>
                    </div>
                </div>

                <div className="verticalBar"></div>

                <Themes/>

            </div>
            
        </header>
    )
}

function SearchBar({fireRequest}) {
    return (
        <div className='searchContainer'>
            <input type="text" id='keywordSearcher' onKeyDown={fireRequest}/>
            <div className='searchIcon'>
                <img src={assets.searchBar}/>
            </div>
        </div>
    )
}

function WordHeader({word, phonetic, phonetics}){

    function change(e){
        e.currentTarget.querySelector("img").src=assets.playHover
    }
    function reset(e){
        e.currentTarget.querySelector("img").src=assets.play
    }
    let sources = null
    if(phonetics.length>0){
        sources= phonetics.map(e=>{
            return(
                <>
                    <source src={e.audio}/>
                </>
            )
        })
    }

    function playAudio(e){
        e.currentTarget.querySelector("audio").load()
        e.currentTarget.querySelector("audio").play()
    }

    return(
        <div className="wordHeader">
            <div className='texts'>
                <h2>{word}</h2>
                <p>{phonetic}</p>
            </div>
            <div className="play" onMouseEnter={change} onMouseLeave={reset} onClick={playAudio}>
                <img src={assets.play}/>
                <audio> 
                    {sources}
                </audio>
            </div>
        </div>  
    )

}

function WordMeaningsHeader({partOfSpeech}){

    return(
        <div className="partOfSpeech">
            <h3>{partOfSpeech}</h3>
            <hr />
        </div>
    )
    
}

function WordMeanings({list}){
    return <ul>{list}</ul>
}

function WordSynonym({found}){
    if(found.length===0){
        return;
    }
    return <p className='syno'>Synonyms <span className='results'>{found}</span></p>
}

function WordSource({url}){
    return <p className='source'><span>Source</span> <a href="#">{url}</a></p>
}

function WordAsIndivudual({word, phonetic, meanings, source, fetchSyno, phonetics}){
    
    let WordSpecific= meanings.map(e=>{
        let definitions = e.definitions.map(x=>{
            if(Boolean(x.example)){
                return(
                    <Fragment>
                        <li>
                            <p className='definition'>{x.definition}</p>
                            <p className='example'><q>{x.example}</q></p>
                        </li>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <li>
                            <p className='definition'>{x.definition}</p>
                        </li>
                    </Fragment>
                )
            }
        })
        let Synonyms = e.synonyms.map(e=>{
            return <span onClick={fetchSyno}>{e}</span>
        })

        return(
            <Fragment>
                <WordMeaningsHeader partOfSpeech={e.partOfSpeech}/>
                <WordMeanings list={definitions}/>
                <WordSynonym found={Synonyms}/>
            </Fragment>
        )
    })
    
    return (
        <div className='perWord'>
            <WordHeader word={word} phonetic={phonetic} phonetics={phonetics}/>
            {WordSpecific}
            <WordSource url={source}/>
        </div>
    )

}


function WordAsAwhole({isFullFilled, fetchSyno}){
    try {
            if(isFullFilled){
                let results = isFullFilled.map(e=>{
                return <WordAsIndivudual word={e.word} phonetic={e.phonetic} meanings={e.meanings} source={e.sourceUrls} fetchSyno={fetchSyno} phonetics={e.phonetics}/>
            })
        
            return <section className='wordsResult'>{results}</section>
        }
        return null
    } catch (error) {
        return(
            <section className="errorPage">
                <div>😕</div>
                <h2>{isFullFilled.title}</h2>                
                <p>{isFullFilled.message}</p>
            </section>
        )
    }

}


export default function App(){

    let [data, setData] = useState(null)
    
    function fetchData(e){
        e.currentTarget.parentElement.classList.remove("empty")
        if(e.key==="Enter"){
            if(e.currentTarget.value===""){
                setData(null)
                e.currentTarget.parentElement.classList.add("empty")
            }
            let API = `https://api.dictionaryapi.dev/api/v2/entries/en/${e.currentTarget.value}`
            fetch(API)
            .then(resp=>{
                return resp.json()
            })
            .then(data=>setData(data))
        }
    }
    function fetchSynonym(e){
        let API = `https://api.dictionaryapi.dev/api/v2/entries/en/${e.currentTarget.textContent}`
        fetch(API)
        .then(resp=>resp.json())
        .then(data=>setData(data))
        document.getElementById("keywordSearcher").value=e.currentTarget.textContent
        document.getElementById("keywordSearcher").focus()
    }

    return(
        <>
            <Header/>
            <SearchBar fireRequest={fetchData}/>
            <WordAsAwhole isFullFilled={data} fetchSyno={fetchSynonym} changeState={setData}/>
        </>
    )
}