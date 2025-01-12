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
        if(document.getElementById("svg-container")){
          document.getElementById("answerCover1").classList.remove("hidden")
          document.getElementById("svg-container").classList.add("hidden")
        }
        setSvgContent(svgElement.outerHTML);
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
  }, [unicode]);

  const removeCover = () => {
    document.getElementById("answerCover1").classList.add("hidden")
    document.getElementById("svg-container").classList.remove("hidden")
    document.getElementById("svg-container").classList.replace("border-green-600", "border-red-600" )
    document.getElementById("svg-container").classList.replace('blur-none','blur-md')
  }

  const handleShowAnswer = () =>{  
    document.getElementById("svg-container").classList.add("blur-none")
    new window.KanjivgAnimate(".kanjiVG", 650);
  }

  return (
    <div className=" basis-full md:basis-6/12 lg:h-fit w-full h-fit bg-[#f4f4f4] text-left mx-auto md:mx-2 mb-3 p-5 rounded-lg">
      <span className=" font-normal md:font-light mb-2 inline-block text-lg xl:text-xl">Answer</span>
      <div onClick={removeCover} id="answerCover1" 
          className="  w-full h-64 bg-black opacity-100 z-20 text-white content-center rounded-lg">
      </div>
      {svgContent ? (
      <div onClick={handleShowAnswer}  id="svg-container"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className=" hidden blur-md z-0 border-2 border-red-600 shadow-lg shadow-current rounded-lg bg-white"
      />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AnswerSVG;
