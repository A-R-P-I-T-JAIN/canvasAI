import { useEffect, useRef, useState } from "react";
import "../App.css";
import {
  convertToExcalidrawElements,
  Excalidraw,
  exportToBlob,
  Footer,
  MainMenu,
  WelcomeScreen,
  useDevice,
} from "@excalidraw/excalidraw";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import Nav from "./Nav";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Playground = () => {
  const navigate = useNavigate();
  const [excalidrawApi, setExcalidrawApi] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAsking, setIsAsking] = useState(false); // New state for "Ask AI" button loading state
  const { isMobile } = useDevice(); // Using the useDevice hook

  const { isSignedIn } = useUser();

  const sendImageToBackend = async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "canvas.png");

    try {
      const response = await fetch(
        "https://doodlesense.onrender.com/calculate",
        // "http://localhost:4000/calculate",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send image to backend");
      }

      const result = await response.text();
      // console.log("Response from backend:", result);
      displayResponseOnCanvas(result); // Call the function to display response
    } catch (error) {
      toast.error("Error sending image to backend. Please try again.");
      console.error("Error sending image to backend:", error);
    }
  };

  const displayResponseOnCanvas = (response) => {
    try {
      if (excalidrawApi) {
        const elements = excalidrawApi.getSceneElements();
        const lastElement = elements[elements.length - 1];
        const fs = lastElement?.type === "text" ? lastElement.fontSize : 64;
        const color = lastElement.strokeColor || "white";
        const x = lastElement?.x + lastElement?.width + 20 || 100; // Default position if last element is missing
        const y = lastElement?.y || 100;

        const textElement = convertToExcalidrawElements([
          {
            type: "text",
            id: "response-text",
            text: response,
            fontSize: fs,
            x: x,
            y: y,
            textAlign: "left",
            verticalTextAlign: "top",
            strokeColor: color,
          },
        ]);

        excalidrawApi.updateScene({
          elements: [...elements, ...textElement],
        });

        console.log("Displayed response on canvas:", response);
      } else {
        throw new Error("Excalidraw API not available to display response.");
      }
    } catch (error) {
      console.error(error.message);
      toast.error(
        "Error displaying response on canvas. Please refresh the page."
      );
    }
  };

  const handleButtonClick = async () => {
    if (excalidrawApi) {
      try {
        setIsAsking(true); // Set loading state to true
        console.log("Excalidraw API available. Exporting the image...");
        const blob = await exportToBlob({
          elements: excalidrawApi.getSceneElements(),
          mimeType: "image/png",
        });
        await sendImageToBackend(blob);
      } catch (error) {
        console.error("Error exporting image:", error);
        toast.error("Error exporting image. Please try again.");
      } finally {
        setIsAsking(false); // Set loading state to false after the request completes
      }
    } else {
      console.log("Excalidraw API not available at the moment.");
      toast.error("Excalidraw API is not ready yet. Please try again later.");
    }
  };

  const handleInsertDrawing = (element) => {
    try {
      if (excalidrawApi) {
        excalidrawApi.updateScene({
          elements: [...excalidrawApi.getSceneElements(), ...element],
        });
        console.log("Drawing Inserted");
      } else {
        throw new Error("Excalidraw API not available to insert drawing.");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error inserting drawing. Please try again later.");
    }
  };

  const handleGenerate = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await fetch(
        "https://doodlesense.onrender.com/generate",
        // "http://localhost:4000/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate drawing");
      }

      const result = await response.text();
      const newResult = result.replace(/```json|```|```excalidraw/g, "");
      // console.log(newResult);

      let parsedElements = JSON.parse(newResult);

      // Filter out unsupported element types (e.g., "star")
      parsedElements = parsedElements.filter((el) => {
        const supportedTypes = ["rectangle", "ellipse", "text", "line"]; // Add supported types here
        if (!supportedTypes.includes(el.type)) {
          console.warn(`Unhandled element type "${el.type}" skipped`);
          toast.warn(`Unsupported element type "${el.type}" skipped`);
          return false;
        }
        return true;
      });

      // Ensure all elements have required properties (e.g., width, height)
      parsedElements = parsedElements.filter(
        (el) => el && el.width !== undefined && el.height !== undefined
      );

      if (parsedElements.length === 0) {
        throw new Error("No valid elements generated");
      }

      const element = convertToExcalidrawElements(parsedElements);
      handleInsertDrawing(element);
    } catch (error) {
      console.error("Error generating element:", error);
      toast.error("Error generating drawing. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const MobileFooter = () => {
    const device = useDevice();
    const inputRef = useRef(null); // Create a reference for the input field
  
    // Focus the input field whenever the component renders
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus(); // Programmatically set focus on the input field
      }
    }, [text]); // Re-focus when the text changes
  
    if (device.editor.isMobile) {
      return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4 w-full">
          <input
            type="text"
            ref={inputRef} // Attach the ref to the input field
            className="h-10 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-2 py-1 text-black"
            style={{
              border: "2px solid white",
            }}
            placeholder="ex. a red car"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="bg-blue-200 p-2 text-black font-semibold w-full sm:w-auto"
            onClick={handleGenerate}
          >
            {loading ? "Loading..." : "Generate with AI"}
          </button>
          <button
            className="bg-blue-200 p-2 text-black font-semibold w-full sm:w-auto"
            onClick={handleButtonClick}
          >
            {isAsking ? "Asking..." : "Ask AI"}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="custom-styles h-screen bg-black flex flex-col items-center justify-center">
        <div className="bg-black head w-full h-10 flex items-center justify-between px-4" >
        <h1 onClick={() => navigate("/")} className="text-xl sm:text-2xl md:text-3xl text-white cursor-pointer">DoodleSense</h1>
        <div>
          {isSignedIn ? (
            <div className="pt-2" >
            <UserButton />
            </div>
          ) : (
            <div className="flex gap-2">
              <SignInButton>
                <button className="text-xs sm:text-sm md:text-base lg:text-lg text-white bg-blue-500 px-2 sm:px-3 py-1 rounded">Sign In</button>
              </SignInButton>
              <SignUpButton>
                <button className="text-xs sm:text-sm md:text-base lg:text-lg text-white bg-green-500 px-2 sm:px-3 py-1 rounded">Register</button>
              </SignUpButton>
            </div>
          )}
        </div>
        </div>
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawApi(api)}
          theme="dark"
          renderTopRightUI={() => {
            const device = useDevice();
            if (!device.editor.isMobile) {
              return (
                <button
                  className="bg-blue-200 px-2 py-1 text-black font-semibold sm:text-sm md:text-base lg:text-lg"
                  onClick={handleButtonClick}
                >
                  {isAsking ? "Asking..." : "Ask AI"}{" "}
                  {/* Button text based on the isAsking state */}
                </button>
              );
            }
            return null;
          }}
          UIOptions={{ dockedSidebarBreakpoint: 200 }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MobileFooter />
          </MainMenu>

          {!isMobile && (
            <Footer>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4 w-full">
                <input
                  type="text"
                  className="h-10 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-2 py-1 text-black"
                  style={{
                    border: "2px solid white",
                  }}
                  placeholder="ex. a red car"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  className="bg-blue-200 p-2 text-black font-semibold w-full sm:w-auto"
                  onClick={handleGenerate}
                >
                  {loading ? "Loading..." : "Generate with AI"}
                </button>
              </div>
            </Footer>
          )}
        </Excalidraw>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Playground;
