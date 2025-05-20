// Variables pour stocker l'état de la calculatrice
let currentInput = '0';
let currentExpression = '';
let shouldResetInput = false;
let lastOperator = null;
let parenthesesCount = 0;

// Éléments DOM
const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const decimalButton = document.querySelector('.decimal');

// Fonction d'initialisation
function init() {
    attachEventListeners();
    updateDisplay();
};

// Attache les écouteurs d'événements
function attachEventListeners() {
    // Boutons numériques
    numberButtons.forEach(button => {
        button.addEventListener('click', () => handleNumberInput(button.value));
    });

    // Boutons opérateurs
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => handleOperatorInput(button.value));
    });

    // Bouton égal
    equalsButton.addEventListener('click', calculate);

    // Bouton clear
    clearButton.addEventListener('click', clearCalculator);

    // Bouton décimal
    decimalButton.addEventListener('click', () => handleDecimalInput());

    // Support clavier
    document.addEventListener('keydown', handleKeyboardInput);
};

// Gère l'entrée des chiffres
function handleNumberInput(number) {
    if (currentInput === '0' || shouldResetInput) {
        currentInput = number;
        shouldResetInput = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
};

// Gère l'entrée du point décimal
function handleDecimalInput() {
    if (shouldResetInput) {
        currentInput = '0.';
        shouldResetInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
};

// Gère l'entrée des opérateurs
function handleOperatorInput(operator) {
    // Gestion des parenthèses
    if (operator === '(') {
        if (currentInput === '0' || shouldResetInput || 
            currentExpression.endsWith('(') || 
            ['*', '/', '+', '-'].includes(currentExpression.slice(-1))) {
            currentExpression += '(';
            parenthesesCount++;
        } else {
            currentExpression += '*' + '('; // Multiplication implicite
            parenthesesCount++;
        }
        shouldResetInput = true;
        updateDisplay();
        return;
    }
    
    if (operator === ')') {
        if (parenthesesCount > 0 && currentInput !== '0') {
            currentExpression += currentInput + ')';
            parenthesesCount--;
            currentInput = '0';
            shouldResetInput = true;
            updateDisplay();
        }
        return;
    }

    // Gestion des opérateurs standard
    if (shouldResetInput && !['*', '/', '+', '-'].includes(currentExpression.slice(-1))) {
        // Si on enchaîne des opérateurs, remplacer le dernier
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else {
        // Ajouter l'expression courante et l'opérateur
        currentExpression += currentInput + operator;
        currentInput = '0';
    }
    shouldResetInput = true;
    updateDisplay();
};

// Calcule le résultat
function calculate() {
    // Fermer les parenthèses ouvertes si nécessaire
    let expressionToEvaluate = currentExpression + currentInput;
    for (let i = 0; i < parenthesesCount; i++) {
        expressionToEvaluate += ')';
    }

    try {
        // Évaluer l'expression mathématique
        const result = evaluateExpression(expressionToEvaluate);
        
        // Mettre à jour l'affichage
        currentExpression = '';
        currentInput = result.toString();
        shouldResetInput = true;
        parenthesesCount = 0;
        updateDisplay();
    } catch (error) {
        // Gérer les erreurs
        currentInput = 'Erreur';
        shouldResetInput = true;
        updateDisplay();
    }
};

// Évaluer l'expression mathématique avec priorité d'opérateurs
function evaluateExpression(expression) {    
    // Remplacer × par * pour l'évaluation
    expression = expression.replace(/×/g, '*');
    
    try {
        // Utilisation de Function pour isoler l'évaluation de l'expression
        return Function('"use strict"; return (' + expression + ')')();
    } catch (error) {
        throw new Error('Expression invalide');
    }
};

// Efface la calculatrice
function clearCalculator() {
    currentInput = '0';
    currentExpression = '';
    shouldResetInput = false;
    parenthesesCount = 0;
    updateDisplay();
};

// Met à jour l'affichage
function updateDisplay() {
    display.textContent = currentInput;
    expressionDisplay.textContent = currentExpression;
};

// Gère les entrées clavier
function handleKeyboardInput(event) {
    const key = event.key;
    // Chiffres
    if (/[0-9]/.test(key)) {
        handleNumberInput(key);
    }
    // Opérateurs
    else if (['+', '-', '*', '/'].includes(key)) {
        handleOperatorInput(key);
    }
    // Parenthèses
    else if (key === '(' || key === ')') {
        handleOperatorInput(key);
    }
    // Point décimal
    else if (key === '.') {
        handleDecimalInput();
    }
    // Égal ou Entrée
    else if (key === '=' || key === 'Enter') {
        event.preventDefault();
        calculate();
    }
    // Effacer (Backspace ou Escape)
    else if (key === 'Escape' || key === 'Delete') {
        clearCalculator();
    }
};

// Initialiser la calculatrice au chargement
document.addEventListener('DOMContentLoaded', init);