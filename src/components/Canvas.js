import { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


/**
 * 
 * @param {*} "Kanji - Kanji character to display. setKanji - State function to set parent's state to Kanji" 
 * @returns "span element/component, each with the onClick event to setKanji to kanji. Styled with TailwindCSS" 
 */
function KanjiPrediction({ id, kanji, setKanji, answerKanji, handleCorrect }){
    
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (answerKanji){
            if (kanji === answerKanji.KanjiCharacter){ 
                document.getElementById("results").classList.add("border-5");
                document.getElementById("results").classList.add("border-green-500");
                document.getElementById("results").classList.add("shadow-lg");
                // handleCorrect()
            }
        }
    }, [answerKanji, kanji])

    return auth ? (
        <>
        {
            kanji === answerKanji.KanjiCharacter ? (
                <span id={id} className=" mx-1 hover:cursor-pointer hover:font-bold" onClick={handleCorrect}>
                    {kanji}
                </span>
            ) : (
                <span id={id} className=" mx-1 hover:cursor-pointer hover:font-bold">
                    {kanji}
                </span>
            )
        }
        </>
    ) : (
        <span id={id} onClick={() => setKanji(kanji)} className=" mx-1 hover:cursor-pointer hover:font-bold">
            {kanji}
        </span>
    )
    
}

function Canvas({ setKanji, answerKanji, handleCorrect, nextKanji }){    
    const auth = useContext(AuthContext);
    //State to render component each time user draws a kanji and predictions are generated
    const [predictions, setPredictions] = useState('');

    useEffect(() => {
        //Set width and height of the canvas to the ones calculated by Tailwind 
        document.getElementById("drawCanvas").width = parseInt(getComputedStyle(document.getElementById("drawCanvas")).getPropertyValue("width"))
        document.getElementById("drawCanvas").height = parseInt(getComputedStyle(document.getElementById("drawCanvas")).getPropertyValue("height"))
        //Initialize the kanjicanvas
        window.KanjiCanvas.init('drawCanvas');
        //when clearing canvas, erase and set state to predictions
        document.getElementById("clearCanvas").addEventListener("click", () => {
            window.KanjiCanvas.erase('drawCanvas');
            // setPredictions(localStorage.getItem('predictions').split('').filter(char => char !== ' '));
            setPredictions([])
        });
        //when undoLast canvas, erase and set state to predictions
        document.getElementById("undoLast").addEventListener("click", () => {
            window.KanjiCanvas.deleteLast('drawCanvas');
            let array = localStorage.getItem('predictions').split('').filter(char => char !== ' ')
            // if(auth) setPredictions(array.slice(0,3))
            // else 
            setPredictions(array);
        });
        //when user finish stroke, set state to predictions
        document.getElementById("drawCanvas").addEventListener("touchend", () => {
            var array = localStorage.getItem('predictions').split('').filter(char => char !== ' ');
            // console.log(array)
            // if(auth) setPredictions(array.slice(0,3))
            // else 
            setPredictions(array);
        });
        document.getElementById("drawCanvas").addEventListener("mouseup", () => {
            var array = localStorage.getItem('predictions').split('').filter(char => char !== ' ');
            // console.log(array)
            // if(auth) setPredictions(array.slice(0,3))
            // else 
            setPredictions(array);
        });
        if (auth) {
            document.getElementById("nextKanjiButton").addEventListener("click", () => {
                window.KanjiCanvas.erase('drawCanvas');
                setPredictions([])
            });
        }

    }, []);

    return(
        <div className=" bg-[#f4f4f4] p-5 lg:px-1 rounded-lg mx-auto">
            {/* <div className=" text-left w-11/12">
                <label className=" font-light lg:text-2xl text-base mb-5 block">Canvas</label>
            </div> */}
            <div class=" lg:w-11/12 mx-auto ">
                {auth ? (
                <div className=" xl:text-xl mb-2 text-center">
                    <span className=" font-normal text-xl xl:text-3xl mx-auto"> 
                        {answerKanji.Meanings.map((m) => m.meaning).join(" - ")}
                    </span><br/>
                    <div className="font-thin italic">
                        <span className=" ">
                            On: {" "}
                            {
                            answerKanji.Readings
                            .filter(reading => reading.type === "onyomi")
                            .flatMap(reading => reading.reading)
                            .join(", ")
                            }
                        </span><br/>
                        <span className=" ">
                            Kun: {" "}
                            {
                            answerKanji.Readings
                            .filter(reading => reading.type === "kunyomi")
                            .flatMap(reading => reading.reading)
                            .join(", ")
                            }
                        </span><br/>
                    </div>
                </div>
                ) : (
                    <>
                    {/* <div className=" text-left w-11/12">
                        <label className=" font-light lg:text-2xl text-base mb-5 block">Canvas</label>
                    </div> */}
                    </>
                )}
                <div className="w-full md:w-96 lg:w-full mx-auto">
                    <canvas 
                        data-candidate-list="results" 
                        id="drawCanvas"  
                        class=" bg-[#2B2828] w-full h-64 lg:h-64 xl:h-[22rem] inline-block">
                    </canvas>
                    <div class=" text-left text-sm grid grid-cols-10 gap-1 justify-start mt-2">
                        <button id="clearCanvas" class=" col-span-3 xl:col-span-2 px-5 py-2 bg-[#707070] text-white hover:bg-gray-500">Clear</button>
                        <button id="undoLast" class=" col-span-3 xl:col-span-2 px-5 py-2 bg-[#707070] text-white hover:bg-gray-500">Undo</button>
                        {
                            auth ? (
                                <>
                                <button onClick={nextKanji} id="nextKanjiButton" className=" col-span-4 xl:col-span-6 justify-self-end px-10 py-2 bg-red-500 text-white hover:bg-red-600">Next!</button>
                                </>
                            ) : (
                                null
                            )
                        }
                    </div>
                </div>
            </div>
            <div id="results" class=" w-fit bg-white inline-block text-lg xl:text-2xl px-4 py-2 mt-5  shadow-lg">
                {
                    predictions ?
                    predictions.map((kanji, index) => (
                        <KanjiPrediction key={index} id={index} kanji={kanji} answerKanji={answerKanji} setKanji={setKanji} handleCorrect={handleCorrect} />
                    )) : null
                }
            </div>
        </div>
    )
}


export default Canvas;

