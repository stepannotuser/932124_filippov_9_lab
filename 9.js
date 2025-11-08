class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.buttons = document.querySelectorAll('.btn');
        this.equals = document.getElementById('equals');
        this.currentInput = '0';
        this.shouldReplaceZero = true;
        this.updateDisplay();
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button.textContent));
        });
        this.equals.addEventListener('click', () => this.calculate());
    }

    handleButtonClick(value) {
        if (value === 'C') {
            this.clearDisplay();
        } else if (value === '<-') {
            this.backspace();
        } else {
            if (this.shouldReplaceZero && this.currentInput === '0' && !['+', '-', '*', '/', '.'].includes(value)) {
                this.currentInput = value;
            } else {
                this.currentInput += value;
            }
            this.shouldReplaceZero = false;
            this.updateDisplay();
        }
    }

    clearDisplay() {
        this.currentInput = '0';
        this.shouldReplaceZero = true;
        this.updateDisplay();
    }

    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
            this.shouldReplaceZero = true;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        const operators = ['+', '-', '*', '/'];
        const lastOperatorIndex = Math.max(...operators.map(op => this.currentInput.lastIndexOf(op)));
        
        if (lastOperatorIndex >= 0) {
            const dimmedPart = this.currentInput.substring(0, lastOperatorIndex + 1);
            const normalPart = this.currentInput.substring(lastOperatorIndex + 1);
            this.display.innerHTML = `<span class="dimmed">${dimmedPart}</span>${normalPart}`;
        } else {
            this.display.innerHTML = this.currentInput;
        }
    }

    calculate() {
        try {
            let expression = this.currentInput;
            if (['+', '-', '*', '/'].includes(expression[expression.length - 1])) {
                expression = expression.slice(0, -1);
            }
            const result = this.evaluateExpression(expression);
            this.currentInput = result.toString();
            this.shouldReplaceZero = true;
            this.updateDisplay();
        } catch {
            this.display.innerHTML = 'Ошибка';
            this.currentInput = '0';
            this.shouldReplaceZero = true;
        }
    }

    evaluateExpression(expression) {
        const tokens = expression.split(/([+\-*/])/);
        let result = parseFloat(tokens[0]);
        
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const operand = parseFloat(tokens[i + 1]);
            
            if (isNaN(operand)) throw new Error('Invalid expression');
            
            switch (operator) {
                case '+': result += operand; break;
                case '-': result -= operand; break;
                case '*': result *= operand; break;
                case '/':
                    if (operand === 0) throw new Error('Division by zero');
                    result /= operand;
                    break;
                default: throw new Error('Unknown operator');
            }
        }
        return result;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});