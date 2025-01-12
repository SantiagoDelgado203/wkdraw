import { useEffect } from "react";


function Hints({ radicals, mnemonic }) {

    const handleShowRadicals = () => {
        document.getElementById("radicalsCover").classList.add("hidden")
        document.getElementById("radicals").classList.remove("hidden")
    }

    const handleShowMnemonics = () => {
        document.getElementById("mnemonicCover").classList.add("hidden")
        document.getElementById("mnemonic").classList.remove("hidden")
    }

    useEffect(() =>{
        document.getElementById("radicalsCover").classList.remove("hidden")
        document.getElementById("radicals").classList.add("hidden")
        document.getElementById("mnemonicCover").classList.remove("hidden")
        document.getElementById("mnemonic").classList.add("hidden")
        const radical_tags = document.getElementsByTagName("radical")
        const kanji_tags = document.getElementsByTagName("kanji")
        for (let i = 0; i < radical_tags.length; i++) {
            radical_tags[i].classList.add(
                'text-white', 
                'px-2',
                'bg-[#00aaff]', 
                'rounded-md', 
                'align-middle', 
                'inline-block',
                'shadow-wk',
            )
        }
        for (let i = 0; i < kanji_tags.length; i++) {
            kanji_tags[i].classList.add(
                'text-white', 
                'px-2', 
                'bg-[#fa00a7]', 
                'rounded-md', 
                'align-middle', 
                'inline-block',
                'shadow-wk'
            );
        }
    },)

    return (
        <div className=" lg:block basis-full lg:basis-auto md:basis-6/12 w-full lg:h-fit bg-[#f4f4f4] text-left mx-auto md:mx-2 mt-5 md:mt-0 lg:mt-5 p-5 md:rounded-lg">
            <label className=" block mb-2 font-normal md:font-light mx-2 text-lg xl:text-xl">Hints</label>
            <div className=" bg-white rounded-lg p-5">
                {/* Radicals */}
                <div className="  items-center rounded-lg py-2 text-center">
                    <div id="radicals" className=" hidden text-center w-full">
                    {
                    Object.entries(radicals).map(([key, url]) => (
                        <img className=" size-14 inline-block mx-2 rounded-lg border-2 p-2" src={url} alt={key} />
                    ))
                    }
                    </div>
                    <div id="radicalsCover" onClick={handleShowRadicals} className="  bg-black h-14 items-center text-white text-xl content-center font-thin italic">
                        Radicals ({radicals.length})
                    </div>
                </div>
                {/* Mnemonics */}
                <div className=" relative items-center  rounded-lg py-2 text-center">
                    <div onClick={handleShowMnemonics} id="mnemonicCover" className=" w-full h-14 content-center bg-black text-xl italic font-thin text-white">
                        Meaning Mnemonic
                    </div>
                    <div id="mnemonic"
                    className="hidden"
                    dangerouslySetInnerHTML={{ __html: mnemonic }}
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default Hints;