import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import '../styles/script.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { updateHistoryData } from './utils';

const Script = (props) => {
  // const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { id } = useParams();

  const [sessionID, setSessionID] = useState(id ? id : uuidv4);

  let stored = localStorage.getItem('history')?JSON.parse(localStorage.getItem('history')):[];
  
  const desiredItem = stored.find((item) => sessionID in item);

  const extractedValue = desiredItem ? desiredItem[sessionID] : null;
  const [outputObj, setOutputObj] = useState(extractedValue?extractedValue:[]);
  const [showEmptyInputMessage, setShowEmptyInputMessage] = useState(false);
  const [historyData, setHistoryData] = useState(stored?stored:[]);
  let inputRef = useRef(null);
  const [feedback, setFeedback] = useState({ thumbsUp: 0, thumbsDown: 0 });
  useEffect(() => {
    // if(!props.isLoggedIn){
    //   navigate("/signin");
    // }


    // Scroll to the bottom of the chat when outputObj changes
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }


  }, [outputObj]);

  const handleInputChange = () => {
    setUserInput(inputRef.current.value);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    // return string
  }

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (!userInput.trim()) {
        setShowEmptyInputMessage(true);
        setTimeout(() => {
          setShowEmptyInputMessage(false);
        }, 1000);
        return;
      }

      setShowLoading(true); // Show loading spinner
      const response = await fetch(`http://127.0.0.1:5000//receive_input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });

      const data = await response.json();
      console.log("here in data", data.data);
      setShowResult(true);

      // creating array of chats
      let newData = {};
      newData[userInput] = data.data;
      setOutputObj([...outputObj, newData]);
      const sessionExists = historyData.some((item) => Object.keys(item)[0] === sessionID);

      if (sessionExists) {
        // Update the existing session record
        const updatedHistoryData = historyData.map((item) => {
          if (Object.keys(item)[0] === sessionID) {
            return { [sessionID]: [...item[sessionID], newData] };
          }
          return item;
        });

        setHistoryData(updatedHistoryData);
        localStorage.setItem("history",JSON.stringify(updatedHistoryData));

      } else {
        // Add a new session record
        const updatedHistoryData =[...historyData, { [sessionID]: [...outputObj, newData] }];
        setHistoryData(updatedHistoryData);
        localStorage.setItem("history",JSON.stringify(updatedHistoryData));

      }     

       // Reset the input field
      setUserInput('');
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }
    finally {
      setShowLoading(false); // Hide loading spinner after data is fetched
    }

  };

  const handleThumbsUp = (index) => {
    // Update the feedback state for thumbs-up
    setFeedback({ ...feedback, thumbsUp: feedback.thumbsUp + 1 });

    // Update the outputObj to include the feedback message
    const updatedOutputObj = outputObj.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          feedbackMessage: 'Thank you for your valuable feedback.',
        };
      }
      return item;
    });

    setOutputObj(updatedOutputObj);
    const updatedHistoryData = historyData.map((item) => {
      const sessionKey = Object.keys(item)[0];
      const sessionData = item[sessionKey].map((chatItem, chatIndex) => {
        if (chatIndex === index) {
          return {
            ...chatItem,
            feedbackMessage: 'Thank you for your valuable feedback.',
          };
        }
        return chatItem;
      });

      return { [sessionKey]: sessionData };
    });

    setHistoryData(updatedHistoryData);
    localStorage.setItem("history",JSON.stringify(updatedHistoryData));

  };

  // Function to handle thumbs-down click
  const handleThumbsDown = (index) => {
    // Update the feedback state for thumbs-down
    setFeedback({ ...feedback, thumbsDown: feedback.thumbsDown + 1 });


    // Update the outputObj to include the feedback message
    const updatedOutputObj = outputObj.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          feedbackMessage: 'We will try to improve that.',
        };
      }
      return item;
    });


    setOutputObj(updatedOutputObj);
    // save history
    const updatedHistoryData = historyData.map((item) => {
      const sessionKey = Object.keys(item)[0];
      const sessionData = item[sessionKey].map((chatItem, chatIndex) => {
        if (chatIndex === index) {
          return {
            ...chatItem,
            feedbackMessage: 'We will try to improve that.',
          };
        }
        return chatItem;
      });

      return { [sessionKey]: sessionData };
    });

    setHistoryData(updatedHistoryData);
    localStorage.setItem("history",JSON.stringify(updatedHistoryData));


  };

  console.log("historyData",historyData);
  return (
    <div className="app-container">

      {/* Navbar */}
      <Navbar />
      <div className='content_container'>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="main-content">

          {/* result Section */}
          <div id="chat-container" className='result-section'>
            <h2>MongoDB Queries</h2>

            {/*  show loader */}
            <div className="loading">
              <div className={showLoading ? 'loading_text' : 'display_none'}>Generating...</div>
            </div>

            {/* user prompt */}
            {
              <>
                {outputObj.map((item, index) => (
                  <>
                    {Object.entries(item).map(([key, value]) => (
                      key != 'feedbackMessage' ? <>
                        <div className='user_prompt_section'>
                          <div className='user_logo'>
                            <img src='circle-user.png' alt='user-logo' />
                          </div>
                          <div className='user_prompt' key={key}>
                            <p>{capitalizeFirstLetter(key)}.</p>
                          </div>
                        </div>

                        {/* chatbot response */}
                        <div className='chatbot_response_section'>
                          <div className="chatbot_response">
                            <p>{value}.</p>
                          </div>
                          <div className="chatbot_logo">
                            <img src="user-robot.png" alt="chatbot-logo" />
                          </div>
                        </div>

                      </>
                        : ''
                    ))}
                    <div className="chatbot_feedback">
                      {item.feedbackMessage ? (
                        <span className='feedback_message'>{item.feedbackMessage}</span>
                      ) : (
                        <>
                          <span onClick={() => handleThumbsUp(index)}>👍</span>
                          <span onClick={() => handleThumbsDown(index)}>👎</span>
                        </>
                      )}
                    </div>
                  </>
                ))}
              </>
            }
          </div >
          {showEmptyInputMessage && (
            <p style={{ color: 'red', fontWeight: 'bold', marginTop: '5px' }}>
              Please ask me something
            </p>
          )}
          {/* input section */}
          < div className="input-section" >

            <div>
              <input
                className='inputbox'
                type="text"
                id="userInput"
                placeholder="Type something..."
                value={userInput}
                ref={inputRef}
                onChange={handleInputChange}
                onKeyDown={handleEnterPress}
              />

            </div>
            <div className='submit_section'>
              <img
                src='send.png'
                className='submit-button'
                onClick={handleSubmit}
                alt='Send'
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Script;
