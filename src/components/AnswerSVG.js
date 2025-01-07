import { useEffect, useState } from "react";

function AnswerSVG ({ unicode }) {
  const [svgContent, setSvgContent] = useState(null);


  useEffect(() => {
    const fetchSvg = async () => {
      try {
        // Fetch the SVG file from the public/kanji folder
        const response = await fetch(`${process.env.PUBLIC_URL}/kanji/${unicode}.svg`);
        if (!response.ok) {
          throw new Error(`Failed to load SVG for ${unicode}`);
        }
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        svgElement.classList.add("kanjiVG");
        setSvgContent(svgElement.outerHTML);
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
  }, [unicode]);

  const toggleCover = () => {
    document.getElementById("answerCover1").classList.toggle("hidden")
    document.getElementById("svg-container").classList.replace("border-green-600", "border-red-600" )

  }

  const addBlur = () =>{
    document.getElementById("svg-container").classList.remove('blur-none')
    document.getElementById("svg-container").classList.add('blur-md')
  }

  const handleShowAnswer = () =>{  
    document.getElementById("svg-container").classList.add("blur-none")
    const svgElement = document.querySelector("svg");
    svgElement.classList.add("kanjiVG");
    new window.KanjivgAnimate(".kanjiVG", 650);
    document.getElementById("answerCover2").classList.add("hidden")
  }

  return (
    <div onLoad={toggleCover} className=" basis-full md:basis-5/12 lg:h-fit w-full h-fit  text-center mx-auto mb-3 rounded-lg relative">
        <div onClick={toggleCover} id="answerCover1" 
            className=" absolute top-0  w-full h-64 bg-black opacity-100 z-20 text-white content-center rounded-lg text-3xl xl:text-5xl italic font-thin">
                Show Blurred Answer
        </div>
        <div id="answerCover2" onClick={handleShowAnswer} className=" absolute top-0  w-full h-64 z-10 text-3xl content-center xl:text-5xl italic font-thin"> Show Clear Answer </div>
        {svgContent ? (
        <div onLoad={addBlur}  id="svg-container"
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="relative blur-md z-0 border-2 border-red-600 shadow-lg shadow-current rounded-lg bg-white"
        />
        ) : (
            <p>Loading...</p>
        )}
    </div>
  );
};

export default AnswerSVG;
