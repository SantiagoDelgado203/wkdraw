import { useState, useEffect } from "react";
import { Popover } from 'flowbite-react';
import SVG from './SVG';

function KanjiInfo({ kanji }) {
    const [apiInfo, setApiInfo] = useState({
        unicode: null,
        readings: [[], []],
        meanings: [],
        vocab: [],
    });

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (kanji) {
            setLoading((l) => l = true)
            fetch("https://kanjiapi.dev/v1/kanji/" + kanji)
            .then((response) => response.json())
            .then((data) => {
                // var vocabulary = []
                fetch("https://kanjiapi.dev/v1/words/" + kanji)
                .then((response) => response.json())
                .then((words_data) => {
                    fetch("https://kanjiapi.dev/v1/words/" + kanji)
                    .then((response) => response.json())
                    .then((data) => {
                        const nfRegex = /nf(\d+)/; // Captures the number after "nf"

                        // Filter and sort data
                        words_data = words_data
                            .filter((entry) => {
                                entry.variants = entry.variants.filter((variant) => {
                                    return variant.priorities.some((priority) => nfRegex.test(priority));
                                });
                                return entry.variants.length !== 0;
                            })

                            .sort((a, b) => {
                                const getMinNf = (entry) => {
                                    return Math.min(
                                        ...entry.variants.flatMap((variant) =>
                                            variant.priorities
                                                .map((priority) => {
                                                    const match = nfRegex.exec(priority);
                                                    return match ? parseInt(match[1], 10) : Infinity;
                                                })
                                                .filter((num) => num !== Infinity)
                                        )
                                    );
                                };

                                const nfA = getMinNf(a);
                                const nfB = getMinNf(b);

                                return nfA - nfB; // Ascending order
                            });

                        return words_data.slice(0,5)
                    })
                    .then((vocabulary) => {
                        const unicode = data.unicode.toLowerCase().padStart(5, "0");
                        setApiInfo({
                            unicode,
                            readings: [data.on_readings.join(', '), data.kun_readings.join(', ')],
                            meanings: data.meanings.join(', '),
                            vocab: vocabulary,
                        });
                    })
                    .catch((error) => console.error("Error fetching data:", error));
                })
                
            })
            .catch((error) => {
                console.error("Error fetching kanji data:", error);
            });
        }
    }, [kanji]);

    useEffect(() =>{
        const loading_cover = document.getElementById("loading_cover");
        const info = document.getElementById("info");
        if(info) info.classList.toggle("hidden");
        if(loading_cover) loading_cover.classList.toggle("hidden");
    }, [loading])

    return (
        <div className=" h-fit w-70 mx-auto bg-[#f4f4f4] p-5 rounded-lg">
            <div className="mb-5 content-center w-fit h-fit align-middle">
                <span className="  inline-block text-left font-light text-lg lg:text-lg">Dictionary</span>
                <Popover
                    trigger="hover"
                    placement="top"
                    aria-labelledby="default-popover"
                    content={
                        <div className=" bg-white text-black text-base font-light p-3 max-w-56 text-center shadow-lg rounded-lg">
                            Click a prediction below the canvas to see definitions, readings, and vocabulary!
                        </div>
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                        class=" inline-block h-fit size-6 align-text-bottom mx-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                </Popover>
            </div>

            

            {apiInfo.unicode ? (
                <div className="  relative h-full">
                    <div id="info" className=" text-left hidden">
                        <SVG unicode={apiInfo.unicode} setLoading={setLoading}/>
                        <span className=" block text-2xl font-semibold text-center lg:text-left my-2">{apiInfo.meanings}</span>
                        <span className=" block text-center lg:text-left text-xl my-2">On: {apiInfo.readings[0]}</span>
                        <span className=" block text-center lg:text-left text-xl my-2 mb-5">Kun: {apiInfo.readings[1]}</span>
                        <hr></hr>
                            <label className=" block text-left text-2xl my-5">Related Vocabulary:</label>
                        <div className=" bg-white rounded-lg p-5 text-left">
                            <ul className="  text-left text-xl w-full">
                                {apiInfo.vocab.map((v, index) => (
                                    <div key={index}>
                                    <li className="  grid gap-2 grid-cols-5 w-full text-lg py-2 list-disc text-left">
                                        <div  className=" col-span-2 w-fit inline-block">
                                            <span className=" block text-sm text-gray-700 text-justify w-full">{v.variants[0].pronounced.split('')}</span>
                                            <span className=" block bg-[#a600fa] shadow-wk p-1 px-2 text-white rounded-md align-middle text-2xl text-center font-medium w-fit">{v.variants[0].written}</span>
                                        </div>
                                        <span className=" block content-center h-full align-middle col-span-3 text-base">{v.meanings[0].glosses.join(', ')}</span>
                                        {/* {v.variants[0].written} &ensp; <b>[</b>{v.variants[0].pronounced}<b>]</b> <br/> {v.meanings[0].glosses.join(', ')} */}
                                    </li>
                                    <hr className=" hidden border-t-2 border-opacity-30 border-white w-3/4 mx-auto my-3"></hr>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div id="loading_cover" className=" relative top-0 left-0 w-full h-96 text-5xl text-white content-center">
                        {/* Loading */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" 
                            class="size-24 mx-auto block animate-spin">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </div>
                </div>
            ) : (
                <div className=" bg-[#f4f4f4] rounded-lg h-fit min-h-96 content-center text-left mx-auto w-full"> 
                    {/* Place to put a logo */}
                    {/* <p className=" bg-white p-5 rounded-md h-96 content-center text-center"></p> */}
                </div>
            )
            }
        </div>
    );
}

export default KanjiInfo;
