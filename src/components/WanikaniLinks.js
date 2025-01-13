import { useEffect } from "react"

function WanikaniLinks({ kanji_links }) {

    const handleDropDown = () => {
        document.getElementById("links").classList.toggle("hidden")
        document.getElementById("links").classList.add("border-t-2","border-gray-200")
        document.getElementById("dropdown_down_links").classList.toggle("hidden")
        document.getElementById("dropdown_up_links").classList.toggle("hidden")
    }

    useEffect(() => {
        if(kanji_links.length > 11) kanji_links.shift()
    })

    return (
        <div className=" lg:block basis-full md:basis-5/12 w-full lg:basis-auto md:h-fit bg-[#f4f4f4] text-center mx-auto mt-5 md:mt-0 lg:mt-5 p-2 md:p-5  md:rounded-lg">
            <div className=" flex flex-row text-left items-center">
                <span className="grow mx-2 text-lg font-normal xl:text-xl md:font-light content-center md:mb-3">Wanikani Links</span>
                <svg id="dropdown_down_links" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                    class="size-8  inline-block lg:hidden"
                    onClick={handleDropDown}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                <svg id="dropdown_up_links" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                    class=" hidden size-8 lg:hidden"
                    onClick={handleDropDown}>                    
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </div>
            <div id="links" className=" lg:flex lg:flex-wrap hidden bg-white p-5 rounded-lg text-lg lg:text-xl xl:text-2xl lg:text-left ">
                {[...kanji_links].reverse().map((entry) => (
                    <a className=" inline-block p-2 my-1 mx-1  bg-[#fa00a7] shadow-wk rounded-lg text-white"
                    href={entry.kanjiUrl} rel="noreferrer" target="_blank" >{entry.kanji}</a>
                ))}
            </div>
        </div>
    )

}

export default WanikaniLinks;