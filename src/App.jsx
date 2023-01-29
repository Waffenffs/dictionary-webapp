import { useState } from 'react'
import './App.css'
import { AiOutlineSearch, AiFillPlayCircle } from 'react-icons/ai'
import {TbError404Off} from 'react-icons/tb'
import {BiBookAlt} from 'react-icons/bi'
import {BsToggleOff, BsToggleOn} from 'react-icons/bs'
import {RiLandscapeFill, RiLandscapeLine} from 'react-icons/ri'

export default function App(){

  // states
  const [searchWord, setSearchWord] = useState('')
  const [wordData, setWordData] = useState('none')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleEnter = (e) => {
    // 13 keycode is equivalent to 'enter'
    if(e.keyCode === 13){
      const fetchData = async () => {
        const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
        result.json().then((thisData) => {
          const data = thisData[0]

          // check if there is an audio file.
            // maybe use a state for false and true values
          const objectData = {
            word: data.word,
            meanings: data.meanings,
            phonetic: data.phonetic,
            phonetics: data.phonetics,
            source: data.sourceUrls[0],
          }

          setWordData(objectData)

          console.log(data)
        }).catch((error) => {
          setWordData('INVALID_INPUT')
        })
      }

      fetchData()
    }
  }

  // mode stylings.
  const lightMode = {
    backgroundColor: 'white',
    color: 'black',
  }

  const darkMode = {
    backgroundColor: 'black',
    color: 'white',
  }

  const darkModeAlt = {
    color: 'black'
  }

  const lightModeAlt = {
    color: '#2a2a2a',
  }

  const lightModeAlt2 = {
    color: '#3d3d3d',
  }

  // error component
  function ErrorPage() {
    return(
      <div className="errorContainer">
        <TbError404Off className='errorIcon'/>
        <h1 className='error'>Try another word.</h1>
      </div>
    )
  }

  // component 
  function MeaningsPage({partOfSpeech, definitions, synonyms, antonyms}) {
    const liElements = definitions.map((meaning) => {
      return <li style={!isDarkMode ? lightModeAlt2 : darkMode}>{meaning.definition}</li>
    })

    const synonymElements = synonyms.map((synonym) => {
      return <span className='synonym'>{synonym} </span>
    })

    return(
      <div className="sectionContainer">
        <div className="header">
          <h1 className="type" style={!isDarkMode ? lightModeAlt : darkMode}>{partOfSpeech}</h1>
          <hr className='break' />
        </div>
        <h1 className='meaning'>Meaning</h1>

        <ul>
          {liElements}
        </ul>

        <div className="synonymContainer">
          {synonyms.length !== 0 && <h1 ><span className='synonymTitle'>Synonym(s)</span> {synonymElements}</h1>}
        </div>
      </div>
    )
  }

  // content component
  function ContentPage() {
    const sectionElements = !wordData?.meanings ? '' : wordData.meanings.map((meaning) => {
      return(
        <MeaningsPage 
          partOfSpeech={meaning.partOfSpeech}
          definitions={meaning.definitions}
          synonyms={meaning.synonyms}
          antonyms={meaning.antonyms}
        />
      )
    })

    return(
      <section>
        <div className="upperSection">
          <div className="leftSection">
            <h1 className='word' style={!isDarkMode ? lightMode : darkMode}>{wordData.word}</h1>
            <h4 className='phonetic'>{wordData.phonetic}</h4>
          </div>
          {wordData !== 'none' && <AiFillPlayCircle className='play'/>}
        </div>

        <div className="midSection">
          {sectionElements}
        </div>

        {wordData?.source && <h5 className="span">Source: <a href={wordData.source} target="_blank">{wordData.source}</a></h5>}
      </section>
    )
  }

  // handle modes
  function toggleMode(){
    setIsDarkMode(prevBool => !prevBool)
  }

  // main render
  return(
    <main style={!isDarkMode ? lightMode : darkMode} >
      <nav>
        <BiBookAlt className='bookIcon'/>
        {!isDarkMode ? <BsToggleOff className='lightMode' onClick={toggleMode}/> : <BsToggleOn className='darkMode' onClick={toggleMode}/>}
        {!isDarkMode ? <RiLandscapeLine className='landscape'/> : <RiLandscapeFill className='landscape'/>}
      </nav>
      <div className="form">
        <input type="text" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} onKeyDown={handleEnter} />
        <AiOutlineSearch className='search' style={!isDarkMode ? lightModeAlt : darkModeAlt} />
      </div>
      {wordData === 'INVALID_INPUT' ? <ErrorPage /> : <ContentPage />}
    </main>
  )
}