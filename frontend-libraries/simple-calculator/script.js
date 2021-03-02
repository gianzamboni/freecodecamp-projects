const OPERATION_BUTTON = "operation-button";
const NUMBER_BUTTON = "number-button";
const DELETE_BUTTON = "delete-button";
const EQUAL_BUTTON = "equal-button";
class Formula {
  static createFormulaFromString(aString) {
    if (isNaN(aString)) {
      if (aString.includes("+")) {
        return new Sum(aString);
      } else if (aString.includes("-")) {
        return new Subtraction(aString);
      } else if (aString.includes("x")) {
        return new Multiplication(aString);
      } else if (aString.includes("/")) {
        return new Division(aString);
      }
    } else if (aString !== "") {
      return Number(aString);
    }
  }

  constructor(aString, anOperatorSymbol) {
    this.stringFormula = aString;
    this.terms = [];
    aString.split(anOperatorSymbol).forEach(term => {
      if (term !== "") {
        let f = Formula.createFormulaFromString(term);
        this.terms.push(f);
      }
    });
  }

  canBeResolved() {
    return this.terms.length > 1;
  }

  operateWith() {
    throw "Subclass responsability";
  }

  valueOf() {
    if (!this.canBeResolved()) throw "Error: Equation incomplete";
    return this.terms.reduce((counter, actual) => {
      return this.operateWith(counter, actual.valueOf());
    });
  }}


class Sum extends Formula {
  constructor(aString) {
    super(aString, "+");
  }

  operateWith(anFormula, anotherFormula) {
    return anFormula.valueOf() + anotherFormula.valueOf();
  }}


class Subtraction extends Formula {
  constructor(aString) {
    super(aString, "-");
  }

  operateWith(anFormula, anotherFormula) {
    return anFormula.valueOf() - anotherFormula.valueOf();
  }}


class Multiplication extends Formula {
  constructor(aString) {
    super(aString, "x");
  }

  operateWith(anFormula, anotherFormula) {
    return anFormula.valueOf() * anotherFormula.valueOf();
  }}


class Division extends Formula {
  constructor(aString) {
    super(aString, "/");
  }

  operateWith(anFormula, anotherFormula) {
    return anFormula.valueOf() / anotherFormula.valueOf();
  }}


class CalcButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.handleClick(this.props.innerText);
  }

  render() {
    return (
      React.createElement("div", { className: `col-${this.props.width}` },
      React.createElement("button", {
        id: this.props.id,
        className: this.props.type,
        key: this.props.id,
        onClick: this.handleClick },

      this.props.innerText)));



  }}


class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { className: "screen" },
      React.createElement("p", { id: "operation-screen" }, this.props.first),
      React.createElement("p", { id: "display" }, this.props.second)));


  }}


class CalculatorApp extends React.Component {
  constructor(props) {
    super(props);

    this.backOneStep = this.backOneStep.bind(this);
    this.numberClicked = this.numberClicked.bind(this);
    this.operationClicked = this.operationClicked.bind(this);
    this.resetLastEntry = this.resetLastEntry.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.solveEquation = this.solveEquation.bind(this);

    this.buttons = [
    React.createElement(CalcButton, {
      id: "back",
      innerText: React.createElement("i", { class: "fas fa-arrow-left" }),
      handleClick: this.backOneStep,
      type: DELETE_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "clear",
      innerText: "AC",
      handleClick: this.resetValues,
      type: DELETE_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "ce",
      innerText: "CE",
      handleClick: this.resetLastEntry,
      type: DELETE_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "divide",
      innerText: "/",
      handleClick: this.operationClicked,
      type: OPERATION_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "seven",
      innerText: "7",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "eight",
      innerText: "8",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "nine",
      innerText: "9",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "multiply",
      innerText: "x",
      handleClick: this.operationClicked,
      type: OPERATION_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "four",
      innerText: "4",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "five",
      innerText: "5",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "six",
      innerText: "6",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "subtract",
      innerText: "-",
      handleClick: this.operationClicked,
      type: OPERATION_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "three",
      innerText: "3",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "two",
      innerText: "2",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "one",
      innerText: "1",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "add",
      innerText: "+",
      handleClick: this.operationClicked,
      type: OPERATION_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "zero",
      innerText: "0",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 6 }),

    React.createElement(CalcButton, {
      id: "decimal",
      innerText: ".",
      handleClick: this.numberClicked,
      type: NUMBER_BUTTON,
      width: 3 }),

    React.createElement(CalcButton, {
      id: "equals",
      innerText: "=",
      handleClick: this.solveEquation,
      type: OPERATION_BUTTON,
      width: 3 })];



    this.state = {
      equation: "0",
      entry: "0",
      lastButtonType: NUMBER_BUTTON };

  }

  numberClicked(number) {
    let oldEntry = this.state.entry;
    let lastButtonType = this.state.lastButtonType;
    let oldEquation = this.state.equation;

    if (number === '.') {
      if (oldEntry.indexOf('.') >= 0) {
        return;
      } else if (oldEntry === '0' || lastButtonType === EQUAL_BUTTON || lastButtonType === OPERATION_BUTTON) {
        number = '0.';
      }
    }

    if (lastButtonType == NUMBER_BUTTON) {
      this.setState({
        entry: oldEntry === "0" ? number : oldEntry.concat(number) });

    } else if (lastButtonType === OPERATION_BUTTON) {
      this.setState({
        equation: oldEquation.concat(oldEntry),
        entry: number });

    } else if (lastButtonType == EQUAL_BUTTON) {
      this.setState({
        equation: "0",
        entry: number });

    } else {
      throw `Error: last button pressed was of tye ${lastButtonType}`;
    }

    this.setState({
      lastButtonType: NUMBER_BUTTON });

  }

  operationClicked(operator) {
    let oldEntry = this.state.entry;
    let oldLastButtonType = this.state.lastButtonType;
    let oldEquation = this.state.equation;
    if (oldLastButtonType == NUMBER_BUTTON) {
      this.setState({
        equation: oldEquation == "0" ? oldEntry : oldEquation.concat(oldEntry),
        entry: operator });

    } else if (oldLastButtonType == OPERATION_BUTTON) {
      this.setState({
        entry: operator });

    } else if (oldLastButtonType == EQUAL_BUTTON) {
      this.setState({
        equation: oldEntry,
        entry: operator });

    } else {
      throw `Error: last button pressed was of tye ${lastButtonType}`;
    }

    this.setState({
      lastButtonType: OPERATION_BUTTON });

  }

  backOneStep() {
    let oldEntry = this.state.entry.slice(0, -1);
    if (oldEntry == "") oldEntry = "0";
    this.setState({
      entry: oldEntry });

  }

  resetLastEntry() {
    this.setState({
      entry: "0" });

  }

  resetValues() {
    this.setState({
      equation: "0",
      entry: "0" });

  }

  solveEquation() {
    let equation = this.state.equation.concat(this.state.entry);
    let equationTree = Formula.createFormulaFromString(equation);

    this.setState({
      equation: equation,
      entry: equationTree.valueOf().toString(),
      lastButtonType: EQUAL_BUTTON });

  }

  render() {
    return (
      React.createElement("div", { className: "container" },
      React.createElement(Display, { first: this.state.equation, second: this.state.entry }),
      React.createElement("div", { className: "row" }, this.buttons)));


  }}


ReactDOM.render(React.createElement(CalculatorApp, null), document.getElementById("calculator-app"));