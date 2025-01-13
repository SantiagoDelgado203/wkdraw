function Footer() {
    return(
        <footer className='h-fit mb-5 w-full'>
            <div className='mx-auto h-full w-full xl:w-9/12 px-5 flex flex-col lg:flex-row text-sm flex-wrap'>
                <p className=' basis-full flex-grow my-10'>WkDraw is a personal project, a simple aplication I thought would help me enormously while studying kanji with Wanikani! I hope anyone that reads this finds it helpful, please notify any bug or suggest imporvements to&nbsp;
                    <a href="mailto:wkdraw.contact@gmail.com" className=' underline text-blue-800'>
                        wkdraw.contact@gmail.com.
                    </a>
                </p>
                <div className=" basis-1/3 px-3 flex flex-col">
                    <p className=''>
                    The &nbsp;
                    <a href='https://asdfjkl.github.io/kanjicanvas/' rel="noreferrer" target='_blank' className=' underline text-blue-800'>Kanji Canvas</a> 
                    &nbsp;recognition algorithm code was made by Dominik Klein and Seth Clydsedale, code can be found&nbsp;
                    <a href='https://github.com/asdfjkl/kanjicanvas' rel="noreferrer" target='_blank' className=' underline text-blue-800'>here.</a>
                    &nbsp;This software has been modified and used under the terms and conditions of its&nbsp;
                    <a href="https://github.com/asdfjkl/kanjicanvas/blob/master/LICENSE.TXT" rel="noreferrer" target="_blank" className="underline text-blue-800">License.</a>
                    </p><br/>
                    <p>
                        Application icon taken from flaticon.com.&nbsp;
                        <a href="https://www.flaticon.com/free-icons/chinese" rel="noreferrer" target="_blank" title="chinese icons"
                        className=" underline text-blue-800"
                        >Chinese icons created by Smashicons - Flaticon</a>
                    </p>
                </div>
                <div className=" basis-1/3 px-3 flex flex-col">
                    <p className=' '>
                    Kanji illustrations are provided by the&nbsp;
                    <a href='https://kanjivg.tagaini.net/' rel="noreferrer" target='_blank' className=' underline text-blue-800'>KanjiVG project</a>
                    &nbsp;copyright &copy; 2009 — 2024 by Ulrich Apel, accessible&nbsp;
                    <a href='https://github.com/KanjiVG/kanjivg' rel="noreferrer" target='_blank' className=' underline text-blue-800'>here.</a>
                    &nbsp;Released under the&nbsp;
                    <a href="https://creativecommons.org/licenses/by-sa/3.0/" rel="noreferrer" target="_blank" className=" underline text-blue-800">
                        Creative Commons Attribution-Share Alike 3.0 License.
                    </a>
                    </p><br/>
                    <p>
                        Kanji animations are possible thanks to&nbsp; 
                        <a href='https://github.com/nihongodera/kanjivganimate' rel="noreferrer" className=' underline text-blue-800' target='_blank'>KanjiVGAnimate</a>
                        , copyright &copy; NihongoDera. Used under&nbsp;
                        <a href="https://github.com/nihongodera/kanjivganimate/blob/master/LICENSE" rel="noreferrer" target="_blank" className=" underline text-blue-800">
                            MIT License.
                        </a>
                    </p><br/>
                    
                </div>
                <div className=" basis-1/3 px-3 flex flex-col">
                    <p className=' '>
                    Kanji meanings, readings, and example words in Guest mode are obtained from&nbsp;
                    <a href='https://kanjiapi.dev/' rel="noreferrer" className=' underline text-blue-800' target='_blank'>Kanjiapi.dev</a>
                    , developed by Iridium Szreter. Github repository can be found&nbsp;
                    <a href="https://github.com/onlyskin/kanjiapi.dev" rel="noreferrer" className=' underline text-blue-800' target='_blank'>here.</a>
                    
                    </p>
                </div>            
            </div>
        </footer>
    )
}

export default Footer;