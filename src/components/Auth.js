import { useEffect, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import KanjiSetOptions from './KanjiSetOptions';
import WanikaniLinks from './WanikaniLinks';
import AnswerSVG from './AnswerSVG';
import Hints from './Hints';
import Canvas from './Canvas';

const wk_api_path = "https://api.wanikani.com/v2/"

function prepareWanikaniRequest(apiEndpointPath, apiToken){
      const requestHeaders = new Headers({
        "Wanikani-Revision": "20170710",
        Authorization: "Bearer " + apiToken,
      });
      return new Request(
        apiEndpointPath,
        {
          method: "GET",
          headers: requestHeaders,
        }
      );
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }
  

class Queue {
    constructor() {
        this.items = {};
        this.frontIndex = 0;
        this.backIndex = 0;
    }
    enqueue(item) {
        this.items[this.backIndex] = item;
        this.backIndex++;
    }
    dequeue() {
        if (this.frontIndex === this.backIndex) return null;
        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        return item;
    }
    peek() {
        // // console.log(this.items[this.frontIndex].KanjiCharacter || null)
        return this.items[this.frontIndex] || null;
    }

    rearrange(newOrder) {
        this.items = {};
        this.frontIndex = 0;
        this.backIndex = newOrder.length;
        newOrder.forEach((item, index) => {
            this.items[index] = item;
        });
    }
    get printQueue() {
        return Object.values(this.items);
    }
}

function Auth({ setAPI, user }) {
    // const { enqueue, dequeue, peek, rearrange, getQueue } = useQueue();
    const [loading, setLoading] = useState(true)
    
    const [kanji, setKanji] = useState("");
    const kanjiDictionary = useRef(new Map());
    const kanjiQueue = useRef(new Queue());
    const wanikaniLinksStack = useRef([])
    const levelRange = useRef([1,1])
    const options = Array.from({ length: user.level }, (_, index) => index + 1);
    const radicals = useRef(new Map())

    const handleLogOut = () => {
        localStorage.removeItem("wk_api")
        localStorage.removeItem("user")
        setAPI("")
    }

    const handleShowLogOut = () => {
        document.getElementById("responsive_log_out").classList.toggle("hidden")
    }

    const handleCorrect = () => {
        document.getElementById("main").classList.toggle("opacity-30")
        document.getElementById("correct_message").classList.toggle("hidden")
        document.getElementById("answerCover1").classList.add("hidden")
        // document.getElementById("answerCover2").classList.add("hidden")
        document.getElementById("svg-container").classList.add("blur-none") 
        document.getElementById("svg-container").classList.remove("hidden") 
        document.getElementById("svg-container").classList.replace("border-red-600", "border-green-600")
        const svgElement = document.querySelector("svg");
      svgElement.classList.add("kanjiVG");
      new window.KanjivgAnimate(".kanjiVG", 650);
    }

    const nextKanji = () => {
      //Save the last kanji into the wanikani links stack
      let prevKanji = {
        kanji: kanjiQueue.current.peek().KanjiCharacter,
        kanjiUrl: kanjiQueue.current.peek().document_url
      }
      wanikaniLinksStack.current.push(prevKanji)
      //Enqueue last item to the end of the queue
      kanjiQueue.current.enqueue(kanjiQueue.current.peek())
      //Move to next and set it
      kanjiQueue.current.dequeue()
      setKanji(kanjiQueue.current.peek())
      document.getElementById("answerCover1").classList.remove("hidden")
      // document.getElementById("answerCover2").classList.remove("hidden")
      document.getElementById("svg-container").classList.remove("blur-none")
      document.getElementById("svg-container").classList.add("hidden")
    }

    const chooseLevelRange = () => {
      document.getElementById("main").classList.toggle("opacity-30")
      document.getElementById("chooseLevelRange").classList.toggle("hidden")
    }

    const handleSorting = (sorting_type) => {
        let newSort = []
        // console.log(kanjiDictionary.current)
        switch (sorting_type){
            case "startDate":
              newSort = new Map(
                [...kanjiDictionary.current.entries()]
                  .sort(([, valueA], [, valueB]) =>
                  new Date(valueB.StartDate) - new Date(valueA.StartDate)
                  )
              )
              break;
            case "mostFailed":
              newSort = new Map(
                [...kanjiDictionary.current.entries()]
                  .sort(([, valueA], [, valueB]) => valueA.percentage_correct - valueB.percentage_correct)
              );
              break;
            case "chooseLevel":
              if(levelRange.current[0] > levelRange.current[1]){
                alert("Input a valid range! >:(")
                newSort = new Map(
                  shuffleArray([...kanjiDictionary.current.entries()])
                )
                chooseLevelRange()
                break;
              }
              newSort = new Map(
                kanjiDictionary.current.entries()
                  .filter(([, entry]) => entry.Level >= levelRange.current[0] && entry.Level <= levelRange.current[1])
              );
              chooseLevelRange()
              break;
            default:
              newSort = new Map(
                  shuffleArray([...kanjiDictionary.current.entries()])
              )
              break;
        }
        kanjiQueue.current = new Queue();
        Array.from(newSort.values()).forEach(item => kanjiQueue.current.enqueue(item));
        // console.log(kanjiQueue.current)
        setKanji(kanjiQueue.current.peek());
    }

    
    useEffect(() => {
      setLoading(true)
      const api = localStorage.getItem("wk_api")

      const fetchReviewStatistics = async () => {
          try {
            let next = wk_api_path + "review_statistics?subject_types=kanji";  
            while (next) {
              const apiEndpoint = prepareWanikaniRequest(next, api);
              const response = await fetch(apiEndpoint);
              if (!response.ok) throw new Error("Oops.");
              const responseBody = await response.json();
      
              responseBody.data.forEach(entry => {
                kanjiDictionary.current.set(
                  entry.data.subject_id,
                  {
                  percentage_correct: entry.data.percentage_correct,
                  }
                )
                })
              next = responseBody.pages.next_url; // Properly update the `next` URL
            }
          } catch (error) {
            console.error("Error: " + error);
          }
        };
    
      const fetchSubjects = async () => {
        try {
          let ids = Array.from(kanjiDictionary.current.keys())
          ids = ids.join(",")
          let next = wk_api_path + "subjects?ids=" + ids;  
          while (next) {
            const apiEndpoint = prepareWanikaniRequest(next, api);
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error("Oops.");
            const responseBody = await response.json();
            responseBody.data.forEach(entry => {
              kanjiDictionary.current.get(entry.id).KanjiCharacter = entry.data.characters;
              kanjiDictionary.current.get(entry.id).Level = entry.data.level;
              kanjiDictionary.current.get(entry.id).Meanings = entry.data.meanings;
              kanjiDictionary.current.get(entry.id).Readings = entry.data.readings;
              kanjiDictionary.current.get(entry.id).RadicalsIDs = entry.data.component_subject_ids;
              kanjiDictionary.current.get(entry.id).document_url = entry.data.document_url;
              kanjiDictionary.current.get(entry.id).AuxMeanings = entry.data.auxiliary_meanings;
              kanjiDictionary.current.get(entry.id).MeaningMnemonic = entry.data.meaning_mnemonic;
            })
  
            next = responseBody.pages.next_url;
          } 
          
        }
        catch (error) {
          console.error("Error: " + error);
        }
      };
  
      const fetchAssignments = async () => {
        try{
          let next = wk_api_path + "assignments?started=true&subject_types=kanji";
          while (next) {
            const apiEndpoint = prepareWanikaniRequest(next, api);
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error("Oops.");
            const responseBody = await response.json();
            responseBody.data.forEach(entry => {
              kanjiDictionary.current.get(entry.data.subject_id).StartDate = entry.data.started_at;
            })
            next = responseBody.pages.next_url;
          } 
        } catch (error){
          console.error("Error: " + error)
        }
      };

      const fetchRadicals = async() => {
        var headers = new Headers({
            "Authorization": `Bearer ${api}`,
            "Accept": "application/json",
            "Wanikani-Revision": "20170710"
        });

        return fetch("https://api.wanikani.com/v2/subjects?types=radical" , {headers: headers})
        .then(response => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(data => {
          // console.log(data)
          var radicalSVGs = {};
          data.data.forEach(function(radical){
              // var primaryMeaning = radical.data.meanings.find(function(meaning){ // Find the Primary meaning
              //     return meaning.primary;
              // }).meaning.toLowerCase(); // Set the primary meaning
              var id = radical.id
              var svgUrl = radical.data.character_images.find(function(image){ // Find the first SVG that does not have styling. Omit the '!' to get the ones with styling.
                  return image.content_type == "image/svg+xml" && image.metadata.inline_styles;
              });
              
              if(svgUrl){ // Not all radicals have an SVG
                  radicalSVGs[id] = svgUrl.url;
              };
          });
          radicals.current = radicalSVGs
        }).catch(error => {
          // console.log(error)
        })
      }


      const fetchAll = async () => {
        // console.log("Fetching data...")
        await fetchReviewStatistics();
        await fetchSubjects();
        await fetchAssignments();
        await fetchRadicals();
      };


      fetchAll()
      .finally(() => {
      // // console.log("Current user: ", user)
      Array.from(kanjiDictionary.current.values()).forEach(item => kanjiQueue.current.enqueue(item));
      setKanji(kanjiQueue.current.peek());
      setLoading((l) => l = false)
      // console.log("kanji: ", kanji)
      })

    }, [])

    return (
        loading ? (
            <>{console.log("Loading Auth...")}</>
        ) : (
        <>
        <header class="w-full border-2 mx-auto block h-fit bg-white">
                <div class=" w-11/12 mx-auto flex flex-col md:flex-row h-full justify-around ">
                    <div class=" basis-1/2 content-center ml-5 text-left ">
                        <img src="#" alt="Logo" class="inline-block align-middle w-28 xl:w-52 h-16 border-2 border-red-50"/>
                        <div className='md:ml-10 align-middle inline-block'>
                        <h1 class="text-2xl md:text-3xl xl:text-5xl inline font-semibold">WkDraw</h1>
                        <br /><p>Kanji Drawing Practice Tool</p>
                        </div>
                    </div>
                    {/* User card! */}
                    <div className="hidden md:flex flex-row-reverse xl:basis-1/2">
                        <div className=" flex flex-row items-center justify-end font-thin basis-2/4 text-center content-center ">
                            <div className='  align-middle'>
                                <p className=' font-semibold text-xl'>{user.username}</p>
                                <p className=' italic text-lg'>Level {user.level}</p>
                            </div>
                            <div className=' grow-0 content-center m-4 text-red-600 hover:text-red-800 rounded-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                                    className="size-7 m-2 hover:cursor-pointer hover:fill-red-300"
                                    onClick={handleLogOut}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {/* Small screen card! */}
                    <div className=' block md:hidden'>
                        <div className='  align-middle text-right' onClick={handleShowLogOut}>
                            <p className=' text-xl font-semibold '>{user.username}</p>
                            <p className=' italic text-lg '>Level {user.level}</p>
                            <p className=' hidden text-red-600' id='responsive_log_out' onClick={handleLogOut}>Log out</p>
                        </div>

                    </div>
                </div>
        </header>
        <main id='main' class="w-full mx-auto max-w-screen-2xl mb-20 flex flex-col lg:flex-row h-fit pt-10 px-3 md:px-0 text-base xl:text-lg ">
        {/* {console.log("kanji ", kanji)} */}
        {/* Left Column - Kanji Set Options & Wanikani Links */}
        <div class=" flex flex-col md:flex-row md:justify-between lg:justify-normal lg:flex-col basis-1/3 text-left md:px-10 xl:px-16">
          <KanjiSetOptions handleSorting={handleSorting} chooseLevelRange={chooseLevelRange} />
          <WanikaniLinks kanji_links={wanikaniLinksStack.current} />
        </div><br/><br/><br/>
        
        {/* Central Column - Kanji Canvas & Predictions */}
        <div class="  basis-1/3 text-center mx-auto">
          <AuthContext.Provider value={true}>
              <Canvas answerKanji={kanji} handleCorrect={handleCorrect} nextKanji={nextKanji} />
          </AuthContext.Provider>
        </div><br/>

        {/* Right Column - SVG & Hints */}
        <div class=" flex flex-col md:flex-row lg:flex-col  md:justify-evenly basis-1/3 md:px-5 xl:px-16">
          <AnswerSVG unicode={kanji.KanjiCharacter.codePointAt(0).toString(16).toUpperCase().padStart(5, "0")} />
          <Hints radicals={kanji.RadicalsIDs.map((id) => radicals.current[id])} mnemonic={kanji.MeaningMnemonic} />
        </div>
        <br/>
        </main>

        {/* Correct Message */}
        <div id='correct_message' onClick={handleCorrect} className=' hidden absolute w-screen h-screen right-0 top-0 z-0 content-center'>
            <div className='  w-11/12 md:w-96 mx-auto bg-white h-fit rounded-xl p-5 border-4 border-green-600'>
                <p className=' mx-auto'>Correct!</p>
                {/* <button onClick={handleCorrect} className=' right-0 p-2 bg-black text-white rounded-lg'> Ok! </button> */}
            </div>
        </div>

        {/* Choose Level Range */}
        <div id='chooseLevelRange'  className=' hidden absolute w-screen h-screen right-0 top-0 z-0 content-center'>
            <div className=' w-80 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-96 mx-auto bg-white h-fit rounded-xl p-5 border-4 '>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleSorting("chooseLevel")
              }}>
                <p className=' mb-5 lg:text-2xl'>Choose Level Range</p>
                From: 
                <select className=' inline-block mx-3 border-0 border-b-2 border-gray-500 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 ' onChange={(e) => levelRange.current[0] = e.target.value}>
                  {options.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select> To:
                <select className=' inline-block mx-3 border-0 border-b-2 border-gray-500 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 ' onChange={(e) => levelRange.current[1] = e.target.value}>
                {options.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
                </select>
                <div className=' mt-5 w-full flex flex-row-reverse items-end mr-0 ml-auto'>
                  <button type='submit' className='  px-3 py-1 mt-3 rounded-lg bg-gray-400 text-white'>Use Level Range</button>
                  {/* <label onClick={() => {
                    chooseLevelRange()
                  }} className=' text-red-500 hover:text-red-900 hover:cursor-pointer mx-5'>Cancel</label> */}
                </div>
              </form>
            </div>
        </div>

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
        )
    );
}

export default Auth;