class NextQuoteButton extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      onHover: false };


    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);

  }

  handleOnClick(event) {
    this.props.onClickHandler();
  }

  handleOnMouseEnter(event) {
    this.setState({
      onHover: true });

  }

  handleOnMouseLeave(event) {
    this.setState({
      onHover: false });

  }

  render() {
    let color = this.state.onHover ? this.props.colors[1] : this.props.colors[0];
    return React.createElement("button", { id: "new-quote",
      class: "button color-transition",
      onClick: this.handleOnClick,
      style: { 'backgroundColor': color },
      onMouseEnter: this.handleOnMouseEnter,
      onMouseLeave: this.handleOnMouseLeave }, "Next Quote");


  }}

class TwitterButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onHover: false };


    this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this);
    this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this);
  }

  handleOnMouseEnter(event) {
    this.setState({
      onHover: true });

  }

  handleOnMouseLeave(event) {
    this.setState({
      onHover: false });

  }

  render() {
    let fontColor = this.state.onHover ? this.props.colors[1] : this.props.colors[0];

    return (
      React.createElement("a", { id: "tweet-quote",
        className: "color-transition",
        href: `https://twitter.com/intent/tweet?hashtags=quotes&text=${this.props.quote}.${this.props.author}.`,
        target: "_blank", "data-show-count": "false",
        "data-size": "large",
        style: { 'color': fontColor },
        onMouseEnter: this.handleOnMouseEnter,
        onMouseLeave: this.handleOnMouseLeave },

      React.createElement("i", { className: "fab fa-twitter-square fa-3x fa-pull-left" })));

  }}

class Quote extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { className: "quote-component", style: { 'opacity': this.props.opacity } },
      React.createElement("i", { className: `fa fa-quote-left fa-2x`, ariaHidden: "true" }),

      React.createElement("span", { id: "text" },
      this.props.quote),

      React.createElement("div", { id: "author-box" }, "-",

      React.createElement("span", { id: "author" },
      this.props.author))));


  }}

class QuoteApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: "",
      author: "",
      colors: [],
      quoteOpacity: '0' };


    this.sourceLink = "https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?";
    this.div = React.createRef();
    this.getNextQuote = this.getNextQuote.bind(this);

  }

  componentDidMount() {
    this.getNextQuote();
  }

  getNextColor() {
    let hue = Math.floor(Math.random() * 361);
    let saturation = Math.random() * 25 + 25;
    let lightness = Math.random() * 25 + 25;

    return [`hsl(${hue}, ${saturation}%, ${lightness}%)`, `hsl(${hue}, ${saturation}%, ${lightness - 10}%`];
  }

  getNextQuote() {
    console.log("Requesting new quote");

    this.setState({
      quoteOpacity: '0' });


    let quotePromise = $.getJSON(this.sourceLink, response => {
      this.setState({
        quote: response.quoteText,
        author: response.quoteAuthor == "" ? "Anonymous" : response.quoteAuthor,
        colors: this.getNextColor(),
        quoteOpacity: '1' });

      document.body.style = `background-color: ${this.state.colors[0]}; transition: background-color 0.3s`;
      console.log("New quote obtained");
    });
  }

  render() {
    return (
      React.createElement("div", { id: "quote-box", className: "text-center color-transition", style: { 'color': this.state.colors[0] } },
      React.createElement(Quote, { quote: this.state.quote, author: this.state.author, isUpdating: this.state.isUpdating, opacity: this.state.quoteOpacity }),
      React.createElement("div", { id: "button-box" },
      React.createElement(TwitterButton, { quote: this.state.quote, author: this.state.author, colors: this.state.colors }),
      React.createElement(NextQuoteButton, { onClickHandler: this.getNextQuote, colors: this.state.colors }))));



  }}


ReactDOM.render(React.createElement(QuoteApp, null), document.getElementById('app-container'));