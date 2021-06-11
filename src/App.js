import React, { useState, useRef } from 'react';
import ReactNotifications from 'react-browser-notifications';
import './App.css';

function padTime(time) {
  return time.toString().padStart(2, '0');
}

export default function App() {
  const [title, setTitle] = useState('Let the countdown begin!!!');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  function startTimer() {
    if (intervalRef.current !== null) return;
    setTitle(`You're doing great!!!`);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft >= 1) {
          return timeLeft - 1;
        }
        ReactNotifications.n.supported() && resetTimer();
        showNotifications();
        setIsRunning(false);
        return 0;
      });
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTitle('Keep it up!!!');
    setIsRunning(false);
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTitle('Ready to go another round?');
    setTimeLeft(25 * 60);
    setIsRunning(false);
  }

  function showNotifications() {
    // If the Notifications API is supported by the browser
    // then show the notification
    if (ReactNotifications.n.supported()) ReactNotifications.n.show();
  }

  function handleNotificationClick(event) {
    // Sound notification here
    this.n.close(event.target.tag);
  }

  const minutes = padTime(Math.floor(timeLeft / 60));
  const seconds = padTime(timeLeft - minutes * 60);

  return (
    <div className="app">
      <ReactNotifications
        onRef={(ref) => (ReactNotifications.n = ref)} // Required
        title="You did it!!!" // Required
        body="Ready for another one?"
        icon="icon.png"
        tag="abcdef"
        timeout="5000"
        onClick={(event) => handleNotificationClick(event)}
      />
      <h2>{title}</h2>

      <div className="timer">
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
      </div>

      <div className="buttons">
        {!isRunning && <button onClick={startTimer}>Start</button>}
        {isRunning && <button onClick={stopTimer}>Stop</button>}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}
