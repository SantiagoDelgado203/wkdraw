import { useEffect, useState } from 'react';
import Canvas from './Canvas';
import KanjiInfo from './KanjiInfo';

function Guest({ setAPI }) {

  const [kanji, setKanji] = useState(null);
  const [apiInput, setApiInput] = useState("");

  const handleSubmit = (event) => {
    setAPI(apiInput);
  }

  return (
    <>
    <header class="w-full border-2 mx-auto block h-24 bg-white">
            <div class=" flex flex-col md:flex-row h-full justify-around ">
                <div class=" basis-1/2 content-center ml-5 text-left ">
                    <img src="#" alt="Logo" class="inline-block align-middle w-28 xl:w-52 h-16 border-2 border-red-50"/>
                    <div className='md:ml-10 align-middle inline-block'>
                      <h1 class="text-2xl md:text-3xl xl:text-5xl inline font-semibold">WkDraw</h1>
                      <br /><p>Kanji Drawing Practice Tool</p>
                    </div>
                </div>
                <div class="hidden md:flex flex-row-reverse xl:basis-1/2">
                    <div class="  text-xl italic font-thin basis-2/4 text-center content-center ">
                        <p>You are logged in as a Guest!</p>
                    </div>
                </div>
            </div>
    </header>

    <main class="w-full mx-auto mb-20 flex flex-col lg:flex-row h-fit pt-14 px-3 md:px-0 text-base xl:text-lg ">
      <div class=" basis-1/3 text-left md:px-16">
        <h2 className="  font-semibold text-4xl italic my-5">
          What is WkDraw?
        </h2>
        <p className=' text-xl font-thin'>
          WkDraw is a practice tool to draw Japanese kanjis with the option to specifically review those you have learned so far in Wanikani. 
          Correct stroke order is not necessary, but encouraged!
        </p>
        <br/><br/>
        <form onSubmit={handleSubmit}>
          <h2 className='font-semibold text-4xl italic my-5'>Use Wanikani API Token</h2>
            <p className='text-xl font-thin'>
              To practice kanjis you have learned in Wanikani.
            </p>
            <input 
              type='text' 
              placeholder='v2API Token' 
              onChange={(e) => setApiInput(e.target.value)}
              className=' h-8 w-full my-2 focus:outline-none p-3 rounded-lg'/>
            <button type='submit' className=' bg-[#707070] py-1 px-5 text-white rounded-xl'>Use API</button>
        </form>
      </div><br/><br/><br/>
      
      {/* Central Column - Kanji Canvas & Predictions */}
      <div class=" basis-1/3 text-center">
        <Canvas setKanji={setKanji} />
      </div><br/>

      <div class=" basis-1/3 text-center md:px-16">
        <KanjiInfo kanji={kanji} />
      </div><br/>
    </main>
    <hr className='my-5 shadow-xl hidden'></hr>

    <footer className='h-fit mb-5 w-full'>
      <div className='mx-auto h-full w-full xl:w-9/12 px-5 flex flex-col lg:flex-row text-sm flex-wrap'>
        <p className=' basis-full flex-grow my-10'>WkDraw is a personal project, a simple aplication I thought would help me enormously while studying kanji with Wanikani! I hope anyone that reads this finds it helpful, please notify any bug or suggest imporvements to my email: santiagodelgado@gmail.com.</p>
        <p className=' basis-1/3 xl:px-5'>
          The &nbsp;
          <a href='https://asdfjkl.github.io/kanjicanvas/' rel="noreferrer" target='_blank' className=' underline text-blue-800'>Kanji Canvas</a> recognition algorithm code was made by Dominik Klein and Seth Clydsedale, code can be found&nbsp;
          <a href='https://github.com/asdfjkl/kanjicanvas' rel="noreferrer" target='_blank' className=' underline text-blue-800'>here.</a>
        </p><br/>
        <p className=' basis-1/3 xl:px-5'>
          Kanji illustrations are provided by the&nbsp;
          <a href='https://kanjivg.tagaini.net/' rel="noreferrer" target='_blank' className=' underline text-blue-800'>KanjiVG project</a> created by Ulrich Apel, accessible&nbsp;
          <a href='https://github.com/KanjiVG/kanjivg' rel="noreferrer" target='_blank' className=' underline text-blue-800'>here.</a><br/><br/>
          Kanji animations are possible thanks to theKanjiVGAnimate project, by NihongoDera. Check it out&nbsp;
          <a href='https://github.com/nihongodera/kanjivganimate' rel="noreferrer" className=' underline text-blue-800' target='_blank'>here.</a>
        </p><br/>
        <p className=' basis-1/3 xl:px-5'>
          Kanji meanings, readings, and example words in Guest mode are obtained from&nbsp;
          <a href='https://kanjiapi.dev/' rel="noreferrer" className=' underline text-blue-800' target='_blank'>Kanjiapi.dev</a>, developed by Iridium Szreter.
        </p>
      </div>
    </footer>

    </>
  );
}

export default Guest;

