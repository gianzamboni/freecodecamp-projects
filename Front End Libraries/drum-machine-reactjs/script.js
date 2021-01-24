class SoundButton extends React.Component {
  constructor(props) {
    super(props);
    this.playSound = this.playSound.bind(this);
  }

  playSound() {
    this.props.onTrigger(this.props.buttonId);
    document.getElementById(this.props.text).play();
  }

  render() {
    return (
      React.createElement("button", { id: this.props.buttonId,
        className: "drum-pad",
        onClick: this.playSound },

      this.props.text,
      React.createElement("audio", {
        id: this.props.text,
        className: "clip",
        src: this.props.sound })));



  }}


class DrumMachine extends React.Component {
  constructor(props) {
    super(props);

    this.padButtons = [
    {
      id: 'deep-kick',
      innerText: 'Q',
      sound: 'https://freewavesamples.com/files/Deep-Kick.wav' },

    {
      id: 'bamboo',
      innerText: 'W',
      sound: 'https://freewavesamples.com/files/Bamboo.wav' },

    {
      id: 'bass-drum',
      innerText: 'E',
      sound: 'https://freewavesamples.com/files/Bass-Drum-1.wav' },

    {
      id: 'boom-kick',
      innerText: 'A',
      sound: 'https://freewavesamples.com/files/Boom-Kick.wav' },

    {
      id: 'bottle',
      innerText: 'S',
      sound: 'https://freewavesamples.com/files/Bottle.wav' },

    {
      id: 'clap',
      innerText: 'D',
      sound: 'https://freewavesamples.com/files/Clap-1.wav' },

    {
      id: 'claves',
      innerText: 'Z',
      sound: 'https://freewavesamples.com/files/Claves.wav' },

    {
      id: 'cowbell',
      innerText: 'X',
      sound: 'https://freewavesamples.com/files/Cowbell-1.wav' },

    {
      id: 'cuica',
      innerText: 'C',
      sound: 'https://freewavesamples.com/files/Cuica-1.wav' }];



    this.state = {
      displayText: "" };


    this.renderButton = this.renderButton.bind(this);
    this.changeDisplayText = this.changeDisplayText.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    let validKeys = this.padButtons.map(button => button.innerText);
    let pressedKey = event.key.toUpperCase();
    let keyIndex = validKeys.indexOf(pressedKey);
    if (keyIndex >= 0) {
      document.getElementById(pressedKey).play();
      this.changeDisplayText(this.padButtons[keyIndex].id);
    }
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleKeyPress);
  }

  changeDisplayText(text) {
    console.log(text);
    this.setState({
      displayText: text.replace(/-/g, ' ') });

  }

  renderButton(button) {
    return (
      React.createElement(SoundButton, { buttonId: button.id,
        key: button.id,
        onTrigger: this.changeDisplayText,
        sound: button.sound,
        text: button.innerText }));


  }

  render() {
    return (
      React.createElement("div", { class: "main-container" },
      React.createElement("div", { className: "keyboard", onKeypres: true },
      this.padButtons.map(this.renderButton)),

      React.createElement("div", { id: "display" },
      this.state.displayText)));


  }}


ReactDOM.render(React.createElement(DrumMachine, null), document.getElementById('drum-machine'));