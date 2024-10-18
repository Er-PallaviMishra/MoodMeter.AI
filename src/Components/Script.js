import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import '../styles/script.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { capitalizeFirstLetter, scrollToBottom } from './utils';
import DataTable from './DataTable';

const Script = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  let inputRef = useRef(null);
  const [userInput, setUserInput] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [sessionID, setSessionID] = useState(id ? id : uuidv4);
  const [showEmptyInputMessage, setShowEmptyInputMessage] = useState(false);
  let stored = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
  const desiredItem = stored.find((item) => sessionID in item);
  const extractedValue = desiredItem ? desiredItem[sessionID] : null;
  const [outputObj, setOutputObj] = useState(extractedValue ? extractedValue : []);
  const [historyData, setHistoryData] = useState(stored ? stored : []);
  const [feedback, setFeedback] = useState({ thumbsUp: 0, thumbsDown: 0 });

  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate("/signin");
    }
    scrollToBottom();
  }, [outputObj, props.isLoggedIn]);


  const handleInputChange = () => {
    setUserInput(inputRef.current.value);
  };


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

      const response = await fetch(`http://127.0.0.1:5000//receive_input/${userInput}`, {
        method: 'GET'
      });

      const data = await response.json();
      console.log("data", data)

      // creating array of chats
      // if(data.data.status == 200){
      let newData = {};
      newData[userInput] = data;
      console.log(newData);
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

        localStorage.setItem("history", JSON.stringify(updatedHistoryData));
      } else {
        // Add a new session record
        const updatedHistoryData = [...historyData, { [sessionID]: [...outputObj, newData] }];
        setHistoryData(updatedHistoryData);
        localStorage.setItem("history", JSON.stringify(updatedHistoryData));
      }
    // }else{
    //   return "Unexpected Server error";
    // }
      setUserInput('');  // Reset the input field

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
    localStorage.setItem("history", JSON.stringify(updatedHistoryData));
  };


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
    localStorage.setItem("history", JSON.stringify(updatedHistoryData));
  };
  console.log(outputObj);

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar onLogout={props.onLogout} />

      <div className='content_container'>
        {/* Sidebar */}
        {/* <Sidebar loggedIn={props.isLoggedIn}/> */}

        {/* Main Content */}
        <main className="main-content">

          {/* result Section */}
          <div id="chat-container" className='result-section'>

            {/* logo section */}
             {outputObj.length === 0 && ( 
               <div className='ai_logo'>
                <img src='logo.jpg' alt='AI Logo' />
                <h2 className='main_text'><strong>How can I help you today?</strong></h2>
              </div>
             )} 

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
                              <p><strong>Result Query: </strong><br/>{value.query}</p>
                              {/* <DataTable theadData={Object.keys(value.data[0])} tbodyData={value.data} /> */}
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
            {/* <div className='submit_section'>
              <img
                src='send.png'
                className='submit-button'
                onClick={handleSubmit}
                alt='Send'
              />
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Script;