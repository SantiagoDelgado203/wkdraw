import { useState, useEffect } from "react";

function SVG({ unicode, setLoading }) {
    //State to control the changing svg file in display
    const [svgContent, setSvgContent] = useState(null);

    useEffect(() => {
        async function fetchSVG() {
            try {
                //given the unicode, fetch the svg file in text in public/kanji/
                const response = await fetch(`${process.env.PUBLIC_URL}/kanji/${unicode}.svg`);
                const svgText = await response.text();
                //parse it into svg code
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.documentElement;
                //add the class to animate it
                svgElement.classList.add("kanjiVG");
                //Set the state to render
                setSvgContent(svgElement.outerHTML);
                setLoading((l) => l = false)
            } catch (error) {
                console.error('Error fetching SVG:', error);
            }
        }
        fetchSVG();
    }, [unicode]);

    useEffect(() => {
        if (svgContent) {
            new window.KanjivgAnimate('.kanjiVG', 650);
            
        }
    }, [svgContent]);

    return (
        <div className=" size-fit bg-white mx-auto lg:mx-0 text-center content-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            >
        </div>
    );
}

export default SVG;