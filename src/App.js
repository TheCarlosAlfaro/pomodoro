import React, { useState, useRef } from 'react';
import ReactNotifications from 'react-browser-notifications';
import Sound from 'react-sound';
import { useSessionStorageNumber } from 'react-use-window-sessionstorage';
import './App.css';

function padTime(time) {
  return time.toString().padStart(2, '0');
}

export default function App() {
  const [title, setTitle] = useState('Let the countdown begin!!!');
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(pomodoroTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const defaultPomodoroCount = 0;
  const [pomodoroCount, setPomodoroCount] = useSessionStorageNumber(
    'pomodoros',
    defaultPomodoroCount
  );
  const intervalRef = useRef(null);

  function startTimer() {
    if (intervalRef.current !== null) return;
    setTitle(`You're doing great!!!`);
    setIsRunning(true);
    setIsPlaying(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft >= 1) {
          return timeLeft - 1;
        }
        ReactNotifications.n.supported() && resetTimer();
        showNotifications();
        setIsPlaying(true);
        setIsRunning(false);
        setPomodoroCount(pomodoroCount + 1);

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
    setTimeLeft(pomodoroTime);
    setIsRunning(false);
  }

  function resetCount() {
    setPomodoroCount(0);
    resetTimer();
  }

  function showNotifications() {
    // If the Notifications API is supported by the browser
    // then show the notification
    if (ReactNotifications.n.supported()) {
      ReactNotifications.n.show();
    }
  }

  function handleNotificationClick(event) {
    // Sound notification here
    this.n.close(event.target.tag);
  }

  function handlePomodoroChange(value) {
    let userTime = parseInt(value.target.value) * 60;
    setPomodoroTime(userTime);
    setTimeLeft(userTime);
  }

  const pomodoroTimeMinutes = padTime(Math.floor(pomodoroTime / 60));

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
      <Sound
        url="https://my-s3-uploads103811-dev.s3.amazonaws.com/mixkit-bell-notification-933.wav"
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
        playFromPosition={0 /* in milliseconds */}
      />
      <h2>{title}</h2>

      <div className="time">
        <label className="time-label">
          Pomodoro Time{' '}
          <input
            type="number"
            min="0"
            step="1"
            value={pomodoroTimeMinutes}
            className="time__input"
            onChange={handlePomodoroChange}
          />
        </label>
      </div>

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
      <div className="pomodoro-counter">
        <span>Total Pomodoros:</span> <span>{pomodoroCount} </span>
        <button className="reset-count__button" onClick={resetCount}>
          Reset Count
        </button>
      </div>
    </div>
  );
}
