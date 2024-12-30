import { useState, useEffect } from "react";
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
                            vocab: vocabulary, // You can populate vocab later if needed
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
        <div className=" h-fit w-70 mx-auto content-center">
            {apiInfo.unicode ? (
                <div className=" relative h-full">
                    <div id="info" className=" hidden">
                        <SVG unicode={apiInfo.unicode} setLoading={setLoading}/>
                        <p className=" text-2xl font-semibold text-center lg:text-left my-2">{apiInfo.meanings}</p>
                        <p className=" text-center lg:text-left text-xl my-2">On: {apiInfo.readings[0]}</p>
                        <p className=" text-center lg:text-left text-xl my-2 mb-5">Kun: {apiInfo.readings[1]}</p>
                        <hr></hr>
                        <p className=" text-left text-2xl my-5">Related Vocabulary:</p>
                        <ul className="text-left text-xl w-full">
                            {apiInfo.vocab.map((v, index) => (
                                <>
                                <li key={index} className="  grid gap-2 grid-cols-3 w-full text-lg py-2 list-disc text-left">
                                    <div  className=" col-span-1 w-fit inline-block">
                                        <span className=" block text-sm text-gray-700 text-justify w-full">{v.variants[0].pronounced.split('')}</span>
                                        <span className=" block text-2xl font-medium w-full">{v.variants[0].written}</span>
                                    </div>
                                    <p className=" self-center col-span-2 inline-block text-base">{v.meanings[0].glosses.join(', ')}</p>
                                    {/* {v.variants[0].written} &ensp; <b>[</b>{v.variants[0].pronounced}<b>]</b> <br/> {v.meanings[0].glosses.join(', ')} */}
                                </li>
                                <hr className=" hidden border-t-2 border-opacity-30 border-white w-3/4 mx-auto my-3"></hr>
                                </>
                            ))}
                        </ul>
                    </div>
                    <div id="loading_cover" className=" absolute top-0 left-0 w-full h-full text-center text-5xl text-white content-center">
                        <label>Loading...</label>
                    </div>
                </div>
            ) : (
                <div className="bg-white h-96 content-center mx-auto text-3xl italic font-thin p-3 w-3/4"> Click a prediction to show a kanji with stroke order and animations!</div>
            )
            }
        </div>
    );
}

export default KanjiInfo;
