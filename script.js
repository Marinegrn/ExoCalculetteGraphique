// Variable pour stocker si on vient d'effectuer un calcul
let justCalculated = false;
    
function addToDisplay(value) {
    const display = document.getElementById('display');
      
    // Si on vient de calculer et qu'on ajoute un chiffre, on efface l'écran
    if (justCalculated && !isNaN(value)) {
        display.textContent = value;
        justCalculated = false;
    } else if (justCalculated && isNaN(value)) { // Si on vient de calculer et qu'on ajoute un opérateur, on continue avec le résultat
        display.textContent += value;
        justCalculated = false;
    } else { // Cas normal: on ajoute la valeur
        // Si l'affichage est à 0, on remplace par la nouvelle valeur (sauf si c'est un opérateur)
        if (display.textContent === '0' && !isNaN(value)) {
          display.textContent = value;
        } else {
          display.textContent += value;
        }
    }
};
    
function clearDisplay() {
    document.getElementById('display').textContent = '0';
    justCalculated = false;
};
    
function calculate() {
    const display = document.getElementById('display');
    try {
        let result = evaluateExpression(display.textContent);
        display.textContent = result;
        justCalculated = true;
    } catch (error) {
        display.textContent = 'Erreur';
        setTimeout(() => {
            display.textContent = '0';
        },  1000);
    }
};

// Fonction pour évaluer l'expression en respectant les priorités d'opération
function evaluateExpression(expression) {
    // Transformation de l'expression en tableau de nombres et d'opérateurs
    let tokens = tokenize(expression);
    return evaluateTokens(tokens);
};

// Fonction pour transformer l'expression en tableau de nombres et d'opérateurs
function tokenize(expression) {
    let tokens = [];
    let currentNumber = '';
      
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
    
    // Si c'est un chiffre, on l'ajoute au nombre courant
    if (!isNaN(char) || char === '.') {
        currentNumber += char;
        } else { // Si c'est un opérateur
        // On ajoute le nombre courant s'il existe
        if (currentNumber !== '') {
            tokens.push(parseFloat(currentNumber));
            currentNumber = '';
        } 
        tokens.push(char);
        }
    }  
    // On ajoute le dernier nombre s'il existe
    if (currentNumber !== '') {
        tokens.push(parseFloat(currentNumber));
    }  
    return tokens;
};
    
// Fonction pour évaluer les tokens en respectant les priorités
function evaluateTokens(tokens) {
// Première passe: évaluation des multiplications et divisions
for (let i = 1; i < tokens.length - 1; i += 2) {
    if (tokens[i] === '*' || tokens[i] === '/') {
        let result;
          
            if (tokens[i] === '*') {
                result = tokens[i - 1] * tokens[i + 1];
            } else {
                result = tokens[i - 1] / tokens[i + 1];
            }     
        // Remplacement des 3 éléments par le résultat
        tokens.splice(i - 1, 3, result);
        i -= 2;
        }
    }     
// Deuxième passe: évaluation des additions et soustractions
let result = tokens[0];
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '+') {
          result += tokens[i + 1];
        } else if (tokens[i] === '-') {
          result -= tokens[i + 1];
        }
    }
    return result;
};