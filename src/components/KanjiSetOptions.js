import { useEffect } from "react"


function KanjiSetOptions ({ handleSorting, chooseLevelRange }) {

    const handleSetChange = (sort) =>{
        
        let parent = document.getElementById("KanjiSetOptions")
        let options = parent.querySelectorAll("span")
        options.forEach(element => {
            if(element.id !== sort) element.classList.remove("underline", "font-semibold", "text-black")
            if(element.id !== sort) element.classList.add("text-gray-400")
        });
        document.getElementById(sort).classList.add("underline", "font-semibold");    
        document.getElementById(sort).classList.replace("text-gray-400", "text-black");
        if (sort === "chooseLevel"){
            chooseLevelRange()
            return
        }
        handleSorting(sort)
    }

    useEffect(() => {
        handleSetChange("default")
    },[])

    const handleDropDown = () => {
        document.getElementById("KanjiSetOptions").classList.toggle("hidden")
        document.getElementById("KanjiSetOptions").classList.add("border-t-2","border-gray-200")
        document.getElementById("dropdown_down").classList.toggle("hidden")
        document.getElementById("dropdown_up").classList.toggle("hidden")
    }

    return(

        <div className="  lg:block basis-full md:basis-5/12  w-full h-fit bg-[#f4f4f4] text-center mx-auto p-2 md:p-5 md:rounded-lg">
            <div className=" flex flex-row text-left md:mb-2 align-baseline">
                <label className=" grow mx-2 text-lg font-normal xl:text-xl md:font-light content-center">Choose Kanji Set</label>
                <svg id="dropdown_down" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                    class="size-8  inline-block lg:hidden"
                    onClick={handleDropDown}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                <svg id="dropdown_up" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                    class=" hidden size-8 lg:hidden"
                    onClick={handleDropDown}>                    
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>


                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                    class="size-10  inline-block lg:hidden"
                    onClick={handleDropDown}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                </svg> */}
            </div>
            <div id="KanjiSetOptions" className=" bg-white rounded-lg p-5 hidden lg:block ">
                <span onClick={() => handleSetChange("default")} id="default" className="  text-gray-400 hover:text-black hover:cursor-pointer text-base xl:text-lg my-5"> All Learned (Random)</span>
                <br/><br/>
                <span onClick={() => handleSetChange("chooseLevel")} id="chooseLevel" className="  text-gray-400 hover:text-black hover:cursor-pointer text-base xl:text-lg my-5"> Choose Level Range</span>
                <br/><br/>
                <span onClick={() => handleSetChange("startDate")} id="startDate" className="  text-gray-400 hover:text-black hover:cursor-pointer text-base xl:text-lg my-5"> Recently Learned</span>
                <br/><br/>
                <span onClick={() => handleSetChange("mostFailed")} id="mostFailed" className="  text-gray-400 hover:text-black hover:cursor-pointer text-base xl:text-lg my-5"> Most Failed</span>
            </div>
        </div>
    )

}

export default KanjiSetOptions;