import React, { useState } from "react";

const App: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("00:00");

  const [confirmedEventName, setConfirmedEventName] = useState("");

  const [displayDate, setDisplayDate] = useState(0);
  const [displayHours, setDisplayHours] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState(0);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  const [eventNameErrorMessage, setEventNameErrorMessage] = useState(" ");
  const [eventDateErrorMessage, setEventDateErrorMessage] = useState(" ");
  const [eventTimeErrorMessage, setEventTimeErrorMessage] = useState("");

  const [disabled, setDisabled] = useState(false);

  const [today, setToday] = useState(new Date());
  const [todayYear, setTodayYear] = useState(today.getFullYear());
  const [todayMonth, setTodayMonth] = useState(today.getMonth());
  const [todayDate, setTodayDate] = useState(today.getDate());
  const [currentHours, setCurrentHours] = useState(today.getHours());
  const [currentMinutes, setCurrentMinutes] = useState(today.getMinutes());
  const [currentTime, setCurrentTime] = useState(
    (currentHours.toString().length === 1 ? "0" + currentHours : currentHours) +
      ":" +
      (currentMinutes.toString().length === 1 ? "0" + currentMinutes : currentMinutes)
  );

  function setTime() {
    setToday(new Date());
    setTodayYear(today.getFullYear());
    setTodayMonth(today.getMonth());
    setTodayDate(today.getDate());
    setCurrentHours(today.getHours());
    setCurrentMinutes(today.getMinutes());
    setCurrentTime(
      (currentHours.toString().length === 1 ? "0" + currentHours : currentHours) +
        ":" +
        (currentMinutes.toString().length === 1 ? "0" + currentMinutes : currentMinutes)
    );
  }

  function onChangeHandler(type: string, inputContents: string) {
    if (type === "eventName") {
      eventNameValidation(inputContents);
    } else if (type === "eventDate") {
      eventDateValidation(inputContents);
    } else {
      eventTimeValidation(inputContents);
    }
    setInputContents(type, inputContents);
  }

  function eventNameValidation(inputContents: string) {
    if (inputContents === "") {
      setEventNameErrorMessage("イベント名を入力してください");
    } else {
      setEventNameErrorMessage("");
    }
  }

  function eventDateValidation(inputContents: string) {
    setTime();
    if (inputContents === "") {
      setEventDateErrorMessage("イベント日を入力してください");
    } else if (
      !inputContents.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/) ||
      new Date(todayYear, todayMonth, todayDate) > new Date(inputContents)
    ) {
      setEventDateErrorMessage("イベント日は不正な値が入力されています。正しい値を入力してください");
    } else if (
      todayYear === new Date(inputContents).getFullYear() &&
      todayMonth === new Date(inputContents).getMonth() &&
      todayDate === new Date(inputContents).getDate() &&
      currentTime >= eventTime
    ) {
      setEventTimeErrorMessage("イベント時刻は不正な値が入力されています。正しい値を入力してください!!!");
      setEventDateErrorMessage("");
    } else {
      setEventDateErrorMessage("");
    }
  }

  function eventTimeValidation(inputContents: string) {
    setTime();

    if (inputContents === "") {
      setEventTimeErrorMessage("");
    } else if (!inputContents.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
      setEventTimeErrorMessage("イベント時刻は不正な値が入力されています。正しい値を入力してください!");
    } else if (
      todayYear === new Date(eventDate).getFullYear() &&
      todayMonth === new Date(eventDate).getMonth() &&
      todayDate === new Date(eventDate).getDate() &&
      currentTime >= inputContents
    ) {
      setEventTimeErrorMessage("イベント時刻は不正な値が入力されています。正しい値を入力してください!!");
      setEventDateErrorMessage("");
    } else {
      setEventTimeErrorMessage("");
    }
  }

  function setInputContents(type: string, inputContents: string) {
    if (type === "eventName") {
      setEventName(inputContents);
    } else if (type === "eventDate") {
      setEventDate(inputContents);
    } else {
      inputContents === "" ? setEventTime("00:00") : setEventTime(inputContents);
    }
  }

  function onClickHandler() {
    setConfirmedEventName(eventName);
    setDisabled(true);
    setIntervalId(setInterval(setDisplayContents, 1000));
  }

  function stopTimer() {
    clearInterval(intervalId);
    setDisabled(false);
  }

  function setDisplayContents() {
    const today: any = new Date();
    const eventDateTime: any = new Date(eventDate + "T" + eventTime);
    const diff = eventDateTime - today;

    setTime();

    if (
      todayYear === new Date(eventDate).getFullYear() &&
      todayMonth === new Date(eventDate).getMonth() &&
      todayDate === new Date(eventDate).getDate() &&
      currentTime >= eventTime
    ) {
      stopTimer();
    } else {
      setDisplayDate(Math.floor(diff / 1000 / 60 / 60 / 24));
      setDisplayHours(Math.floor(diff / 1000 / 60 / 60) - Math.floor(Math.floor(diff / 1000 / 60 / 60 / 24)) * 24);
      setDisplayMinutes(Math.floor(diff / 1000 / 60) % 60);
      setDisplaySeconds(Math.floor(diff / 1000) % 60);
    }
  }

  return (
    <>
      <div>
        イベント名
        <input type={"text"} onChange={(e) => onChangeHandler("eventName", e.target.value)} disabled={disabled} />
        <p>{eventNameErrorMessage}</p>
      </div>
      <div>
        イベント日
        <input type={"date"} onChange={(e) => onChangeHandler("eventDate", e.target.value)} disabled={disabled} />
        <p>{eventDateErrorMessage}</p>
      </div>
      <div>
        イベント時間
        <input
          type={"time"}
          onChange={(e) => onChangeHandler("eventTime", e.target.value)}
          value={eventTime}
          disabled={disabled}
        />
        <p>{eventTimeErrorMessage}</p>
      </div>
      <button
        onClick={() => onClickHandler()}
        disabled={
          eventNameErrorMessage !== "" || eventDateErrorMessage !== "" || eventTimeErrorMessage !== "" ? true : false
        }
      >
        カウントダウン開始
      </button>
      <button onClick={() => stopTimer()}>停止</button>
      <div>
        {confirmedEventName}まであと{displayDate}日{displayHours}:{displayMinutes}:{displaySeconds}
      </div>
    </>
  );
};

export default App;
