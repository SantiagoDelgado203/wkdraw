import { useEffect, useState } from 'react';
import Canvas from './Canvas';
import KanjiInfo from './KanjiInfo';
import Footer from './Footer';

function Guest({ setAPI, formError, setLoading }) {

  const [kanji, setKanji] = useState(null);
  const [apiInput, setApiInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true)
    setAPI(apiInput);
  }

  useEffect(() => {
    localStorage.removeItem("predictions")
    console.log("During Mounting Guest.js!")
    console.log("Current API: ", localStorage.getItem("api"))
    console.log("Current user: ", localStorage.getItem("user"))
  }, [])

  return (
    <>
    <header class="w-full border-2 mx-auto block h-24 bg-white">
            <div class=" w-11/12 mx-auto flex flex-col md:flex-row h-full justify-around ">
                <div class=" basis-1/2 content-center ml-5 text-left font-serif">
                    {/* <img src="#" alt="Logo" class="inline-block align-middle w-28 xl:w-52 h-16 border-2 border-red-50"/> */}
                    <div className='md:ml-10 align-middle inline-block'>
                      <h1 class="text-3xl md:text-3xl xl:text-4xl inline font-normal italic ">WkDraw</h1>
                      <br /><p>Kanji Drawing Practice Tool</p>
                    </div>
                </div>
                <div class="hidden md:flex flex-row-reverse xl:basis-1/2">
                    <div class="  text-xl italic font-thin basis-2/4 text-center content-center ">
                        {/* <span>You are logged in as a Guest!</span> */}
                    </div>
                </div>
            </div>
    </header>

    <main class="w-full mx-auto max-w-screen-2xl mb-20 flex flex-col lg:flex-row h-fit pt-14 px-3 md:px-0 text-base xl:text-lg ">

      {/* Left Column - Information and Form */}
      <div class="  basis-1/3 text-left md:px-5 xl:px-14">
      <div className=' rounded-md bg-[#f4f4f4] w-fit px-5 py-3'>
        <h2 className="  font-light text-3xl lg:text-2xl xl:text-xl  my-3">
          What is WkDraw?
        </h2>
        <p className=' bg-white rounded-lg block p-5 my-5 text-lg lg:text-base xl:text-base font-thin'>
          WkDraw is a practice tool to draw Japanese kanjis with the option to specifically review those you have learned so far in Wanikani. 
          Correct stroke order is not necessary, but encouraged!
        </p>
        <br/>
        <h2 className='font-light text-3xl lg:text-2xl xl:text-xl my-3'>Use Wanikani API Token</h2>
        <form className='' onSubmit={handleSubmit}>
          <div className=' bg-white rounded-lg p-5 my-5'>
            <p className='  text-lg lg:text-base xl:text-base font-thin'>
              To practice kanjis you have learned in Wanikani. You can find/generate your token&nbsp;
                <a href='https://www.wanikani.com/settings/personal_access_tokens' rel='noreferrer' target='_blank'
                  className=' underline text-blue-500'>here</a>.
                Only the "all_data:read" permission is needed. 
            </p>
            <input 
              type='text' 
              placeholder='v2API Token' 
              onChange={(e) => setApiInput(e.target.value)}
              className=' bg-[#e9e9e9] h-8 w-full my-2 focus:outline-none p-3 rounded-lg text-lg xl:text-sm'/>
          </div>
            {!formError ? null : (
              <span className=' text-red-500 text-sm block'> {formError} </span>
            )}
            <button type='submit' className=' py-1 px-5 rounded-sm border-2 text-black font-thin'>Use API</button>
        </form>

      </div>
      </div><br/><br/><br/>
      
      {/* Central Column - Kanji Canvas & Predictions */}
      <div class="  basis-1/3 text-center mx-auto">
        <Canvas setKanji={setKanji} />
      </div><br/>

      {/* Right Column - Kanjiinfo and SVG */}
      <div class=" basis-1/3 md:px-5 xl:px-14">
        <KanjiInfo kanji={kanji} />
      </div><br/>
    </main>
    <hr className='my-5 shadow-xl hidden'></hr>

    <Footer></Footer>
    </>
  );
}

export default Guest;

