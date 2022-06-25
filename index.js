class Model {
  constructor() {
    (this.calculator_buttons = [
      {
        name: "clear",
        label: "AC",
        formula: false,
        type: "action",
        class: "clear-button",
      },
      {
        name: "delete",
        label: "CE",
        formula: false,
        type: "action",
        class: "clear-button",
      },
      {
        name: "percentage",
        label: "%",
        formula: "/100",
        type: "operator",
        class: "key-operator",
      },
      {
        name: "divide",
        label: "/",
        formula: "/",
        type: "operator",
        class: "key-operator",
      },
      {
        name: "7",
        label: 7,
        formula: 7,
        type: "number",
      },
      {
        name: "8",
        label: 8,
        formula: 8,
        type: "number",
      },
      {
        name: "9",
        label: 9,
        formula: 9,
        type: "number",
      },
      {
        name: "multiple",
        label: "x",
        formula: "*",
        type: "operator",
        class: "key-operator",
      },
      {
        name: "4",
        label: 4,
        formula: 4,
        type: "number",
      },
      {
        name: "5",
        label: 5,
        formula: 5,
        type: "number",
      },
      {
        name: "6",
        label: 6,
        formula: 6,
        type: "number",
      },
      {
        name: "subtract",
        label: "-",
        formula: "-",
        type: "operator",
        class: "key-operator",
      },
      {
        name: "1",
        label: 1,
        formula: 1,
        type: "number",
      },
      {
        name: "2",
        label: 2,
        formula: 2,
        type: "number",
      },
      {
        name: "3",
        label: 3,
        formula: 3,
        type: "number",
      },
      {
        name: "add",
        label: "+",
        formula: "+",
        type: "operator",
        class: "key-operator",
      },
      {
        name: "0",
        label: 0,
        formula: 0,
        type: "number",
      },
      {
        name: "comma",
        label: ".",
        formula: ".",
        type: "number",
      },
      {
        name: "equal",
        label: "=",
        formula: "=",
        type: "calculate",
        class: "key-equal",
      },
    ]),
      (this.screenMemory = []),
      (this.memory = []),
      (this.isNewCalculation = false);
  }

  addKeyEvents = (keys) => {
    keys.addEventListener("click", (e) => {
      const key = e.target;

      this.calculator_buttons.forEach((button) => {
        if (button.name == key.id) {
          return this.buttonClicks(button);
        }
      });
    });
  };

  updateOutputScreen = (screenString) => {
    const display = document.querySelector(".operation-display");
    console.log(screenString);
    display.innerHTML = screenString;
  };

  updateResult = (finalResult) => {
    const result = document.querySelector(".result");
    result.innerHTML = finalResult;
  };

  digitCounter = (number) => {
    return number.toString().length;
  };

  isFloat = (number) => {
    return number % 1 != 0;
  };

  formatResult = (result) => {
    const maxOutputLength = 10; //max output number length
    const outputPrecision = 10; // calculate precision upto 10 digits

    if (this.digitCounter(result) > maxOutputLength) {
      if (this.isFloat(result)) {
        const floatResult = parseFloat(result);
        const floatResultLength = this.digitCounter(floatResult);

        if (floatResultLength > maxOutputLength) {
          return result.toPrecision(outputPrecision);
        } else {
          const digitsAfterPoint = maxOutputLength - floatResultLength;
          return result.toFixed(digitsAfterPoint);
        }
      } else {
        return result.toPrecision(outputPrecision);
      }
    } else return result;
  };

  buttonClicks(button) {
    if (button.type == "operator") {
      this.screenMemory.push(button.label);
      this.memory.push(button.formula);
      this.isNewCalculation = false;
    } else if (button.type == "number" && this.isNewCalculation == false) {
      this.screenMemory.push(button.label);
      this.memory.push(button.formula);
    } else if (button.type == "number" && this.isNewCalculation == true) {
      this.screenMemory = []; //if a new calculation then clear screen
      this.memory = []; //if a new calculation then clear screen
      this.screenMemory.push(button.label);
      this.memory.push(button.formula);
      this.isNewCalculation = false;
    } else if (button.type == "action") {
      if (button.name == "clear") {
        this.screenMemory = [];
        this.memory = [];
        this.updateResult(0);
        this.isNewCalculation = false;
      } else if (button.name == "delete") {
        this.screenMemory.pop();
        this.memory.pop();
      }
    } else if (button.type == "calculate") {
      let memoryString = this.memory.join("");

      this.screenMemory = [];
      this.memory = [];

      let finalResult;
      let operatorCount = 0; // number of operators

      for (let i = 0; i <= memoryString.length; i++) {
        if (
          memoryString[i] == "+" ||
          memoryString[i] == "-" ||
          memoryString[i] == "*" ||
          memoryString[i] == "/"
        ) {
          operatorCount++;
        }
      }

      try {
        if (operatorCount == 1) {
          for (let i = 0; i <= memoryString.length; i++) {
            var leftNum = Number(memoryString.slice(0, i));
            var rightNum = Number(
              memoryString.slice(i + 1, memoryString.length + 1)
            );
            if (memoryString[i] === "+") {
              finalResult = leftNum + rightNum;
            } else if (memoryString[i] === "-") {
              finalResult = leftNum - rightNum;
            } else if (memoryString[i] === "*") {
              finalResult = leftNum * rightNum;
            } else if (memoryString[i] === "/") {
              finalResult = leftNum / rightNum;
            } else if (memoryString[i] === "%") {
              finalResult = finalResult / 100;
            }
          }
        } else if (operatorCount > 1) {
          finalResult = eval(memoryString);
        }
      } catch (error) {
        if (error instanceof Error) {
          finalResult = "Error!";
          this.updateResult(finalResult);
          return;
        }
      }

      finalResult = this.formatResult(finalResult); // format result

      this.screenMemory.push(finalResult); //save result for later if user perform consecutively
      this.memory.push(finalResult);

      this.updateResult(finalResult); // update output

      this.isNewCalculation = true; //set a new calculation

      return;
    }

    // remove screen when starting with zero
    if (this.screenMemory.join("").match(/^0\d+/)) {
      this.screenMemory.splice(-2, 1); //remove
    } else if (this.screenMemory.join("").match(/[^0-9\.]0\d+/)) {
      this.screenMemory.splice(-2, 1); //remove
    } else if (this.screenMemory.join("").match(/\.0/)) {
      this.screenMemory.join("");
    }
    this.updateOutputScreen(this.screenMemory.join(""));
  }
}

class View {
  constructor() {
    // this.app = this.getElement("#root");
    this.app = this.createElement("div", "container");
    this.calculatorContainer = this.createElement("div", "calculator");
    this.calculatorDisplay = this.createElement("div", "calculator-display");
    this.display = this.createElement("div", "operation-display");
    this.result = this.createElement("div", "result");
    this.keys = this.createElement("div", "calculator-keys");
    this.calculatorDisplay.append(this.display, this.result);
    this.calculatorContainer.append(this.calculatorDisplay, this.keys);
    this.app.append(this.calculatorContainer);
    document.body.appendChild(this.app);
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }
  render(buttons) {
    buttons.forEach((button, index) => {
      this.keys.innerHTML += `<button id="${button.name}" class="${button.class}">${button.label}</button>`;
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.render(this.model.calculator_buttons);
    this.model.addKeyEvents(this.view.keys);
  }
}

const app = new Controller(new Model(), new View());
