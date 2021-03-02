function beautifyNumber(number) {
  return number < 10 ? `0${number}` : number.toString();
}

function beautifyName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  beautifyTimeLeft(timeSeconds) {
    let minutes = beautifyNumber(Math.floor(timeSeconds / 60));
    let seconds = beautifyNumber(timeSeconds - minutes * 60);
    return `${minutes}:${seconds}`;
  }

  render() {
    let name = this.props.name;
    let beautifiedName = beautifyName(name);
    let timeLeft = this.beautifyTimeLeft(this.props.timeLeft);
    return (
      React.createElement("div", { className: "config-panel full-width" },
      React.createElement("div", null,
      React.createElement("span", { id: "timer-label" }, beautifiedName)),

      React.createElement("div", null,
      React.createElement("span", { className: "timer-length", id: "time-left" }, timeLeft)),

      React.createElement("div", null,
      React.createElement("button", { id: "start_stop", onClick: this.props.onStartStop },
      this.props.started == false ? React.createElement("i", { className: "fa fa-play" }) : React.createElement("i", { className: "fa fa-stop" })),

      React.createElement("button", { id: "reset", onClick: this.props.onReset },
      React.createElement("i", { class: "fas fa-undo" })))));




  }}


class TimerConfigPanel extends React.Component {
  constructor(props) {
    super(props);

    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleDecrement() {
    this.props.onDecrement(this.props.index);
  }

  handleIncrement() {
    this.props.onIncrement(this.props.index);
  }

  render() {
    let name = this.props.name;
    let printedName = beautifyName(name);
    let length = this.props.length / 60;
    return (
      React.createElement("div", { className: "config-panel" },
      React.createElement("div", { id: `${name}-label` },
      React.createElement("span", null, printedName, " Length")),

      React.createElement("button", {
        id: `${name}-decrement`,
        disabled: length == 1 || this.props.enabled,
        onClick: this.handleDecrement },

      React.createElement("i", { class: "fas fa-minus" })),

      React.createElement("span", { className: "timer-length", id: `${name}-length` }, length),
      React.createElement("button", {
        id: `${name}-increment`,
        disabled: length == 60 || this.props.enabled,
        onClick: this.handleIncrement },

      React.createElement("i", { class: "fas fa-plus" })),

      React.createElement("div", null,
      React.createElement("span", null, "minutes"))));



  }}


class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timers: [1500, 300],
      timersNames: ["session", "break"],
      activeTimer: 0,
      timeLeft: 1500,
      started: false };


    this.tickTask = undefined;

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.makeTick = this.makeTick.bind(this);
    this.startStop = this.startStop.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidUpdate() {
    if (this.state.timeLeft == 0) {
      document.getElementById("beep").play();
    }
  }
  createConfigPanelForIndex(index) {
    return (
      React.createElement(TimerConfigPanel, {
        name: this.state.timersNames[index],
        index: index,
        length: this.state.timers[index],
        onDecrement: this.decrement,
        onIncrement: this.increment,
        enabled: this.state.started }));


  }

  decrement(timerIndex) {
    let time = this.state.timers[timerIndex];
    let newTimers = [0, 0];
    newTimers[timerIndex] = time - 60;
    newTimers[1 - timerIndex] = this.state.timers[1 - timerIndex];
    this.setState({
      timers: newTimers,
      timeLeft: newTimers[0] });

  }

  increment(timerIndex) {
    let time = this.state.timers[timerIndex];
    let newTimers = [0, 0];
    newTimers[timerIndex] = time + 60;
    newTimers[1 - timerIndex] = this.state.timers[1 - timerIndex];
    this.setState({
      timers: newTimers,
      timeLeft: newTimers[0] });

  }

  makeTick() {
    let timeLeft = this.state.timeLeft;

    if (timeLeft == 0) {
      let newActiveTimer = 1 - this.state.activeTimer;
      this.setState({
        activeTimer: newActiveTimer,
        timeLeft: this.state.timers[newActiveTimer] });

    } else {
      this.setState({
        timeLeft: timeLeft - 1 });

    }
  }

  start() {
    this.tickTask = setInterval(this.makeTick, 1000);
    this.setState({
      started: true });

  }

  stop() {
    clearInterval(this.tickTask);
    document.getElementById("beep").load();
    this.setState({
      started: false });

  }

  startStop() {
    let started = this.state.started;
    if (started == true) {
      this.stop();
    } else {
      this.start();
    }
  }

  reset() {
    this.stop();
    this.setState({
      timers: [1500, 300],
      activeTimer: 0,
      timeLeft: 1500 });

  }
  render() {
    let activeTimer = this.state.activeTimer;
    let timeLeft;
    return (
      React.createElement("div", { className: "pomodoro-clock" },
      React.createElement("div", { className: "config-timers" },
      this.createConfigPanelForIndex(0),
      this.createConfigPanelForIndex(1)),

      React.createElement("div", { className: "config-timers" },
      React.createElement(Timer, {
        name: this.state.timersNames[activeTimer],
        timeLeft: this.state.timeLeft,
        onStartStop: this.startStop,
        onReset: this.reset,
        started: this.state.started }),

      React.createElement("audio", {
        id: "beep",
        src: "http://soundbible.com/mp3/A-Tone-His_Self-1266414414.mp3" }))));




  }}


ReactDOM.render(React.createElement(PomodoroClock, null), document.getElementById("pomodoro-app"));