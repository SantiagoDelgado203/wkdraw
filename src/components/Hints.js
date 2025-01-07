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
            radical_tags[i].classList.add('text-white', 'px-1', 'bg-blue-500', 'rounded-md')
        }
        for (let i = 0; i < kanji_tags.length; i++) {
            kanji_tags[i].classList.add('text-white', 'px-1', 'bg-pink-500', 'rounded-md' ); // Add tokens to the classList
        }
    },)

    return (
        <div className=" lg:block basis-full lg:basis-auto md:basis-5/12 w-full lg:h-fit bg-white text-center mx-auto mt-5 md:mt-0 lg:mt-5 px-5 py-2 lg:rounded-lg">
            <label className=" block mx-2 mb-5 text-xl xl:text-3xl font-semibold italic">Hints</label>
            {/* Radicals */}
            <div className="  items-center rounded-lg py-2">
                <div id="radicals" className=" hidden text-center w-full">
                {
                Object.entries(radicals).map(([key, url]) => (
                    <img className=" size-14 inline-block mx-2 rounded-lg border-2 p-2" src={url} alt={key} />
                ))
                }
                </div>
                <div id="radicalsCover" onClick={handleShowRadicals} className="  bg-black h-14 items-center text-white text-xl content-center font-thin italic">Radicals</div>
            </div>
            {/* Mnemonics */}
            <div className=" relative items-center  rounded-lg py-2">
                <div onClick={handleShowMnemonics} id="mnemonicCover" className=" w-full h-14 content-center bg-black text-xl italic font-thin text-white">
                    Meaning Mnemonic
                </div>
                <div id="mnemonic"
                className="hidden"
                dangerouslySetInnerHTML={{ __html: mnemonic }}
                ></div>
            </div>
        </div>
    )
}

export default Hints;