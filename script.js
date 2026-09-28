// ===============================
// 🧮 KALKULYATOR
// ===============================

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForNewValue = false;

const display = document.getElementById("calcDisplay");
const expression = document.getElementById("calcExpression");

function updateDisplay() {
    display.textContent = currentValue;
}

// 0-9
function inputNumber(number) {
    if (waitingForNewValue) {
        currentValue = number;
        waitingForNewValue = false;
    } else if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

// .
function inputDecimal() {
    if (waitingForNewValue) {
        currentValue = "0.";
        waitingForNewValue = false;
        updateDisplay();
        return;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

// + - × ÷
function chooseOperator(op) {
    const value = Number(currentValue);

    if (previousValue !== null && operator !== null) {
        calculate();
    }

    previousValue = Number(currentValue);
    operator = op;
    waitingForNewValue = true;

    expression.textContent =
        `${previousValue} ${getSymbol(op)}`;
}

// Operator belgisi
function getSymbol(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    if (op === "-") return "−";
    return op;
}

// =
function calculate() {
    if (previousValue === null || operator === null) {
        return;
    }

    const secondValue = Number(currentValue);
    let result;

    switch (operator) {

        case "+":
            result = previousValue + secondValue;
            break;

        case "-":
            result = previousValue - secondValue;
            break;

        case "*":
            result = previousValue * secondValue;
            break;

        case "/":
            if (secondValue === 0) {
                currentValue = "Error";
                expression.textContent = "0 ga bo‘lish mumkin emas!";
                updateDisplay();

                previousValue = null;
                operator = null;

                return;
            }

            result = previousValue / secondValue;
            break;
    }

    expression.textContent =
        `${previousValue} ${getSymbol(operator)} ${secondValue} =`;

    currentValue = String(result);

    previousValue = null;
    operator = null;
    waitingForNewValue = true;

    updateDisplay();

    saveHistory(
        expression.textContent,
        result
    );
}

// AC
function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    operator = null;
    waitingForNewValue = false;

    expression.textContent = "";

    updateDisplay();
}

// ⌫
function backspace() {
    if (waitingForNewValue) return;

    if (currentValue.length <= 1) {
        currentValue = "0";
    } else {
        currentValue =
            currentValue.slice(0, -1);
    }

    updateDisplay();
}

// %
function percent() {
    const value = Number(currentValue);

    currentValue = String(value / 100);

    updateDisplay();
}

// √
function squareRoot() {
    const value = Number(currentValue);

    if (value < 0) {
        currentValue = "Error";
        expression.textContent =
            "Manfiy sondan ildiz chiqarib bo‘lmaydi";

        updateDisplay();
        return;
    }

    const result = Math.sqrt(value);

    expression.textContent =
        `√${value} =`;

    currentValue = String(result);

    updateDisplay();

    saveHistory(
        `√${value}`,
        result
    );
}

// x²
function square() {
    const value = Number(currentValue);

    const result = value * value;

    expression.textContent =
        `${value}² =`;

    currentValue = String(result);

    updateDisplay();

    saveHistory(
        `${value}²`,
        result
    );
}

// ±
function plusMinus() {
    if (currentValue === "0") return;

    if (currentValue.startsWith("-")) {
        currentValue =
            currentValue.substring(1);
    } else {
        currentValue =
            "-" + currentValue;
    }

    updateDisplay();
}


// ===============================
// TUGMALAR
// ===============================

document.querySelectorAll(".calc-btn")
.forEach(button => {

    button.addEventListener("click", function () {

        const number =
            this.dataset.number;

        const op =
            this.dataset.operator;

        const action =
            this.dataset.action;


        if (number !== undefined) {
            inputNumber(number);
            return;
        }


        if (op !== undefined) {
            chooseOperator(op);
            return;
        }


        if (action === "decimal") {
            inputDecimal();
        }

        else if (action === "equals") {
            calculate();
        }

        else if (action === "clear") {
            clearCalculator();
        }

        else if (action === "backspace") {
            backspace();
        }

        else if (action === "percent") {
            percent();
        }

        else if (action === "sqrt") {
            squareRoot();
        }

        else if (action === "square") {
            square();
        }

        else if (action === "sign") {
            plusMinus();
        }

    });

});


// ===============================
// 📜 TARIX
// ===============================

let calculatorHistory =
    JSON.parse(
        localStorage.getItem(
            "calculatorHistory"
        )
    ) || [];


function saveHistory(text, result) {

    calculatorHistory.unshift({
        text: text,
        result: result
    });

    calculatorHistory =
        calculatorHistory.slice(0, 30);

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(calculatorHistory)
    );

    renderHistory();
}


function renderHistory() {

    const historyList =
        document.getElementById(
            "calcHistoryList"
        );

    if (!historyList) return;


    if (calculatorHistory.length === 0) {

        historyList.innerHTML = `
            <p class="empty-history">
                Hali hisob-kitoblar mavjud emas.
            </p>
        `;

        return;
    }


    historyList.innerHTML =
        calculatorHistory.map(item => `
            <div class="history-item">

                <span class="calculation">
                    ${item.text}
                </span>

                <strong class="result">
                    ${item.result}
                </strong>

            </div>
        `).join("");
}


// Tarixni tozalash
const clearHistoryButton =
    document.getElementById(
        "clearCalcHistory"
    );

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        function () {

            calculatorHistory = [];

            localStorage.removeItem(
                "calculatorHistory"
            );

            renderHistory();

        }
    );
}


// ===============================
// ⌨️ KLAVIATURA
// ===============================

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        // 0-9
        if (
            key >= "0" &&
            key <= "9"
        ) {
            inputNumber(key);
        }


        // .
        else if (key === ".") {
            inputDecimal();
        }


        // + - * /
        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {
            chooseOperator(key);
        }


        // Enter
        else if (key === "Enter" || key === "=") {
            event.preventDefault();
            calculate();
        }


        // Backspace
        else if (key === "Backspace") {
            backspace();
        }


        // Escape = AC
        else if (key === "Escape") {
            clearCalculator();
        }


        // %
        else if (key === "%") {
            percent();
        }

    }
);


// Boshlang‘ich holat
updateDisplay();
renderHistory();