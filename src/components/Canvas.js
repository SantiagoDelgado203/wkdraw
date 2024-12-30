import { useEffect, useState } from "react";


/**
 * 
 * @param {*} "Kanji - Kanji character to display. setKanji - State function to set parent's state to Kanji" 
 * @returns "span element/component, each with the onClick event to setKanji to kanji. Styled with TailwindCSS" 
 */
function KanjiPrediction({ kanji, setKanji }){
    return (
        <span onClick={() => setKanji(kanji)} className=" mx-1 hover:cursor-pointer hover:font-bold">
            {kanji}
        </span>
    )
    
}

function Canvas({ setKanji }){    
    
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
            setPredictions(localStorage.getItem('predictions').split('').filter(char => char !== ' '));
        });
        //when undoLast canvas, erase and set state to predictions
        document.getElementById("undoLast").addEventListener("click", () => {
            window.KanjiCanvas.deleteLast('drawCanvas');
            setPredictions(localStorage.getItem('predictions').split('').filter(char => char !== ' '));
        });
        //when user finish stroke, set state to predictions
        document.getElementById("drawCanvas").addEventListener("touchend", () => {
            var array = localStorage.getItem('predictions').split('').filter(char => char !== ' ');
            // console.log(array)
            setPredictions(array);
        });
        document.getElementById("drawCanvas").addEventListener("mouseup", () => {
            var array = localStorage.getItem('predictions').split('').filter(char => char !== ' ');
            // console.log(array)
            setPredictions(array);
        });

    }, []);


    return(
        <>
        <script src="./scripts/kanji-canvas.js"></script>
        <script src="./scripts/ref-patterns.js"></script>
            <div class=" md:w-8/12 lg:w-11/12 mx-auto">
                <canvas 
                    data-candidate-list="results" 
                    id="drawCanvas"  
                    class=" bg-[#2B2828] w-full md:w-96 lg:w-full h-80 lg:h-64 xl:h-[22em] inline-block">
                </canvas>
                <div class=" text-left text-sm flex flex-row justify-start mt-2">
                    <button id="clearCanvas" class=" mx-1 px-5 py-2 bg-[#707070] text-gray-400 hover:text-white">Clear</button>
                    <button id="undoLast" class=" mx-1 px-5 py-2 bg-[#707070] text-gray-400 hover:text-white">Undo</button>
                </div><br/>
            </div>
            <div id="results" class=" w-fit bg-white inline-block text-xl xl:text-2xl px-4 py-2">
                {
                    predictions ?
                    predictions.map((kanji, index) => (
                        <KanjiPrediction key={index} kanji={kanji} setKanji={setKanji} />
                    )) : null
                }
            </div>
        </>
    )
}


export default Canvas;

