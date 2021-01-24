const LEFT = 0;
const RIGHT = 1;
const NONE = -1;

let renderer = new marked.Renderer();

marked.setOptions({
  breaks: true });


renderer.link = function (href, title, text) {
  return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>';
};

const initialMarkdown =
`# Markdown Previewer

## Small intro

Hi, there! This is a  markdown previewer. If you want to know more about Markdown, check this [cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). Feel free to modify this text in the editor side, however you want!

Some basic elements in markdown, are:

* Inline code:  It is rendered using \`this quotation marks\`
* Code blocks:
\`\`\`
     int function(int a){
        return a + 1;
     }
\`\`\`
* Quotes:
    > "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

* Images:

    ![Example image](https://media.treehugger.com/assets/images/2015/03/landmarks-nature-words.jpg.400x300_q90_crop-smart.jpg)

* **Bold text**
`;

class MinMaxButton extends React.Component {
  constructor(props) {
    super(props);
  }

  getIconClass() {
    console.log(this.props.direction);
    if (this.props.direction == LEFT) {
      return "fa-angle-left";
    } else {
      return "fa-angle-right";
    }
  }

  render() {
    let iconClass = this.getIconClass();

    return React.createElement("button", { onClick: this.props.onClickHandler },
    React.createElement("i", { className: `fas ${iconClass} fa-2x` }));

  }}


class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("span", { className: "title" },
      this.props.text));


  }}


class Resizer extends React.Component {
  constructor(props) {
    super(props);
  }

  getSize() {
    switch (this.props.size) {
      case 'normal':
        return '50vw';
      case 'maximized':
        return '100vw';
      case 'minimized':
        return '0';}

  }

  getStyle() {
    return {
      width: this.props.size,
      flexDirection: this.props.side === LEFT ? "row" : "row-reverse",
      transition: "width 500ms ease-in-out" };

  }

  render() {
    return (
      React.createElement("div", { className: "row-container", style: this.getStyle() },
      this.props.children,
      React.createElement(MinMaxButton, { direction: this.props.size === 'maximized' ? this.props.side : !this.props.side,
        onClickHandler: this.props.resizeHandler })));


  }}


class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);

  }

  handleOnChange(event) {
    this.props.onChangeHandler(event);
  }

  render() {
    return (
      React.createElement("div", { className: "column-container" },
      React.createElement(Title, { text: "Editor" }),
      React.createElement("textarea", { id: "editor", onChange: this.handleOnChange, value: this.props.value })));

  }}


class Previewer extends React.Component {
  constructor(props) {
    super(props);
  }

  getMarkdown() {
    return {
      __html: marked(this.props.value, { renderer: renderer }) };

  }

  render() {
    return (
      React.createElement("div", { className: "column-container" },
      React.createElement(Title, { text: "Preview" }),
      React.createElement("div", { id: "preview", dangerouslySetInnerHTML: this.getMarkdown() })));


  }}


class MarkdownPreviewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: initialMarkdown,
      sizes: ['50vw', '50vw'] };


    this.updateValue = this.updateValue.bind(this);
    this.resizeLeft = this.resizeLeft.bind(this);
    this.resizeRight = this.resizeRight.bind(this);
  }

  getSideSize(side) {
    return this.state.maximizedSide == NONE ? 'normal' : this.state.maximizedSide == side ? 'maximized' : 'minimized';
  }

  resize(side) {
    let newSizes = [];
    if (side && this.state.sizes[side] == '50vw') {
      newSizes = ['0', '100vw'];
    } else if (!side && this.state.sizes[side] == '50vw') {
      newSizes = ['100vw', '0'];
    } else {
      newSizes = ['50vw', '50vw'];
    }

    this.setState({
      sizes: newSizes });

  }

  resizeLeft() {
    this.resize(0);
  }

  resizeRight() {
    this.resize(1);
  }

  updateValue(event) {
    this.setState({
      text: event.target.value });

  }

  render() {
    let editorSize = this.getSideSize(LEFT);
    let previewSize = this.getSideSize(RIGHT);

    return (
      React.createElement("div", { className: 'row-container' },
      React.createElement(Resizer, { side: LEFT,
        size: this.state.sizes[0],
        resizeHandler: this.resizeLeft },

      React.createElement(Editor, { onChangeHandler: this.updateValue,
        value: this.state.text })),

      React.createElement(Resizer, { side: RIGHT,
        size: this.state.sizes[1],
        resizeHandler: this.resizeRight },

      React.createElement(Previewer, { value: this.state.text }))));



  }}


ReactDOM.render(React.createElement(MarkdownPreviewer, null), document.getElementById('markdown-app'));