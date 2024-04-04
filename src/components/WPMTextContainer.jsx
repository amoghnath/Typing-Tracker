import { useCallback, useEffect, useRef, useState } from "react";
import useKey from "../hooks/useKey";
import TextCharacter from "./Typography/TextCharacter";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import Loader from "./Loaders/Loader";

const WPMTextArea = ({ mainText }) => {
  //Declaring states with useState hooks
  const toTypeState = {
    charIndex: -1,
    charsTyped: [],
  };
  const [typingState, setTypingState] = useState(toTypeState);
  const [charsToType, setCharsToType] = useState([]);
  const [secondsTime, setSecondsTime] = useState(0);

  //Declaring references (timer & text by lines)
  const timer = useRef(null);
  const mainTextLines = useRef(mainText.split("\n"));

  const mainContainer = {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
    width: "1100px",
    fontSize: "35px",
    fontWeight: "bold",
  };

  const infoContainer = {
    float: "inherit",
    fontSize: "40px",
  };

  const scrollAble = {
    overflowY: "scroll",
    overflowX: "hidden",
    overflow: "auto",
    userSelect: "none",
    height: "193px",
    width: "100%",
    marginTop: "100px",
  };

  const lineDiv = {
    marginBottom: "8px",
    wordWrap: "break-word",
  };

  //using the useKey hook
  useKey((key) => {
    if (key !== "Backspace") {
      setTypingState((prevTypingState) => {
        return {
          ...prevTypingState,
          charsTyped: [...prevTypingState.charsTyped, key],
        };
      });
    } else {
      setTypingState((prevTypingState) => {
        return {
          ...prevTypingState,
          charsTyped: prevTypingState.charsTyped.filter(
            (_, i) => i !== prevTypingState.charsTyped.length - 1
          ),
        };
      });
    }
  });

  const startTimer = useCallback(() => {
    if (timer.current !== null) {
      return false;
    }

    var startInterval = Date.now();
    timer.current = setInterval(() => {
      var timeStamped = Date.now() - startInterval;
      setSecondsTime(timeStamped / 1000);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timer.current);
    timer.current = null;
  }, []);

  const lineToChars = useCallback((line) => {
    return line
      .trim()
      .concat(" ")
      .split("")
      .map((c) => c);
  }, []);

  useEffect(() => {
    const checkClick = () => {
      var clickInsideWPMtext = document.getElementsByClassName("scrollableDiv");
      document.body.addEventListener("click", function (event) {
        if (clickInsideWPMtext[0].contains(event.target)) {
          console.log("clicked inside");
        } else {
          console.log("clicked outside");
        }
      });
    };
    checkClick();
  }, []);

  useEffect(() => {
    const characters = mainTextLines.current
      .map((line) => lineToChars(line))
      .flat();
    setCharsToType(characters);
  }, [lineToChars]);

  useEffect(() => {
    let cursor = document.getElementById("cursor");

    const cursorScrolling = () => {
      let cursorLocation = cursor.parentNode;
      cursorLocation.scrollIntoView({
        block: "start",
        inline: "start",
      });
    };

    //sets cursor position and range
    const cursorPosition = () => {
      var range = document.createRange();
      var sel = window.getSelection();

      range.setStart(cursor.childNodes[0], cursor.length);
      range.collapse(true);

      sel.removeAllRanges();
      sel.addRange(range);
    };
    cursorScrolling();
    cursorPosition();
  }, [typingState.charsTyped]);

  //   useEffect(() => {
  //     if (parseInt(secondsTime.toFixed(0)) === 10) {
  //       setWpmVisibility(false);
  //     }
  //   }, [secondsTime]);

  useEffect(
    (e) => {
      if (typingState.charsTyped.length === 1) {
        startTimer();
      }

      if (charsToType.length - 1 <= typingState.charsTyped.length) {
        stopTimer(e);
      }

      if (typingState.charsTyped.length < 1) {
        stopTimer(e);
        setSecondsTime(0);
      }
    },

    [typingState.charsTyped, charsToType.length]
  );

  let charCount = -1;

  const correct = typingState.charsTyped.reduce((acc, chr, i) => {
    return chr === charsToType[i] ? acc + 1 : acc;
  }, 0);

  const accuracy = (correct / typingState.charsTyped.length) * 100;
  const accurateText = `${accuracy.toFixed(0)}`;
  const wpm = typingState.charsTyped.length / 5 / (secondsTime / 60);
  return (
    <>
      <div style={mainContainer}>
        <div style={scrollAble} className="scrollableDiv">
          {mainTextLines.current.map((line, i) => (
            <div style={lineDiv} key={i}>
              {lineToChars(line).map((chr) => {
                charCount += 1;
                return (
                  <TextCharacter
                    chr={chr}
                    key={charCount}
                    id={charCount}
                    charsTyped={typingState.charsTyped}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={infoContainer}>
        <kbd>{`${isNaN(accuracy) ? 0 : accurateText}%`} </kbd>
        <kbd>{`WPM:${isNaN(wpm) || !isFinite(wpm) ? 0 : wpm.toFixed(0)}`} </kbd>
        <div style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            maxValue={60}
            value={secondsTime.toFixed(0)}
            text={`${secondsTime.toFixed(0)}`}
            styles={{
              path: {
                stroke: "#ff79c6",
              },
              trail: {
                // Trail color
                stroke: "#E5E5E5",
              },
              text: {
                // Text color
                fill: "#000",
                // Text size
                fontSize: "32px",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

const WPMTextContainer = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    const delay = async (sec) => {
      return await new Promise((resolve) => setTimeout(resolve, sec));
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await delay(1000);
        const { data: response } = await axios.get(
          "https://random-word-api.herokuapp.com/word?number=200"
        );
        var s = response.slice(0, response.length - 1).join(" ");
        setData(s.replace(/(?![^\n]{1,51}$)([^\n]{1,51})\s/g, "$1\n"));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading && <Loader />}
      {!loading && <WPMTextArea mainText={data} />}
    </div>
  );
};

export default WPMTextContainer;
