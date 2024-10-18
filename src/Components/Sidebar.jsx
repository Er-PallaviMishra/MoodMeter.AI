import React, { useEffect } from 'react';
import '../styles/sidebar.css';
import { capitalizeFirstLetter } from './utils';

const Sidebar = (props) => {
  useEffect(() => {

  }, [])
  const historyData = JSON.parse(localStorage.getItem('history')) || [];
  // console.log("history", historyData[0])
  return (
    <div className='sidebar'>
       <div className="profile">
    {/* You can display user information here */}
      <a href='http://localhost:3000/'><img src='/user-avatar.jpg' alt="User Avatar" className="avatar" /></a>
      <p className="userName">{props.loggedIn?capitalizeFirstLetter(localStorage.getItem("user")):""}</p></div>

      <div className="menu">
        <>
        {historyData.reverse().map((item) => {
          const id = Object.keys(item)[0];
          const linkText = Object.keys(item[id][0])[0];

          return (
            <div key={id}>
             <a 
             href={`${id}`}
             > <div className="menuItem">{capitalizeFirstLetter(linkText)}</div></a>
             </div>
          );
        })}

        </>
      </div>



      <div className="footer">
        <p className="appName">Query Generator App</p>
        <p className="copyright">&copy; 2023 Query Craft AI</p>
      </div>
    </div>

  );
};

export default Sidebar;
