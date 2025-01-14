import { Popover } from "flowbite-react";
import { useEffect, useState } from "react";

function AnswerSVG ({ unicode }) {
  const [svgContent, setSvgContent] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSvg(){
      try {
        const baseUrl = process.env.PUBLIC_URL || '';
        const url = `${baseUrl}/kanji/${unicode}.svg`;

        console.log("Fetching SVG from:", url);
        // Fetch the SVG file from the public/kanji folder
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error loading SVG: ${response.status} - ${response.statusText}`, errorText);
          throw new Error(`Failed to load SVG for ${unicode}`);
        }
    
        const svgText = await response.text();
        console.log("SVG content loaded:", svgText);
    
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        svgElement.classList.add("kanjiVG");
    
        setSvgContent(svgElement.outerHTML);
        setLoading((l) => l = false)
        if(document.getElementById("svg-container")){
          document.getElementById("answerCover1").classList.remove("hidden")
          document.getElementById("svg-container").classList.add("hidden")
        }
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
      <div className=" mb-5 content-center align-middle">
        <span className=" font-normal md:font-light inline-block text-lg xl:text-xl">Answer</span>
        <Popover
          trigger="hover"
          placement="top"
          aria-labelledby="default-popover"
          content={
              <div className=" bg-white text-black text-base font-light p-3 max-w-56 text-center shadow-lg rounded-lg">
                  Click to animate!
              </div>
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
              class=" inline-block size-6 align-text-bottom mx-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </Popover>
      </div>
      <div onClick={removeCover} id="answerCover1" 
          className="  w-full h-64 bg-black opacity-100 z-20 text-white content-center rounded-lg">
      </div>
      {svgContent && !loading ? (
      <div onClick={handleShowAnswer}  id="svg-container"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className=" hidden blur-md z-0 border-2 border-red-600 shadow-lg shadow-current rounded-lg bg-white"
      ></div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default AnswerSVG;
