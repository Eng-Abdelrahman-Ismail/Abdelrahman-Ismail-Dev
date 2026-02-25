const screen = document.querySelector('#screen');
const historyDiv = document.querySelector('#calc-preview');
let isDegree = true; // Default to Degrees
let history = []; // Calculation History

// Tab Switching Logic
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Activate button
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });

    // Initialize Unit Options if Unit tab
    if (tabName === 'unit') {
        updateUnitOptions();
    }

    // Initialize Logic Gate if Logic tab
    if (tabName === 'logic') {
        setTimeout(resizeLogicCanvas, 50);
        updateQuickGate();
        startLogicAnimation();
        updateLogicStats();
        updateHudIndicator();
    } else {
        stopLogicAnimation();
    }

    // Render history if History tab
    if (tabName === 'history') {
        renderHistory();
    }
}

// Chat Toggle Logic
function toggleChat() {
    const chatPanel = document.getElementById('ai-chat-panel');
    if (chatPanel.style.display === 'none' || chatPanel.style.display === '') {
        chatPanel.style.display = 'flex';
    } else {
        chatPanel.style.display = 'none';
    }
}

// Calculator Logic
function insert(value) {
    screen.value += value;
}

function clearScreen() {
    screen.value = "";
    historyDiv.innerText = "";
}

function backspc() {
    screen.value = screen.value.substr(0, screen.value.length - 1);
}

function toggleDegRad() {
    isDegree = !isDegree;
    const btn = document.getElementById('degRadBtn');
    btn.innerText = isDegree ? "Deg" : "Rad";
}

function calculate() {
    try {
        let expression = screen.value;
        if (!expression) return;

        historyDiv.innerText = expression + " =";

        let scope = {};

        if (isDegree) {
            scope.sin = function (x) { return math.sin(math.unit(x, 'deg')); };
            scope.cos = function (x) { return math.cos(math.unit(x, 'deg')); };
            scope.tan = function (x) { return math.tan(math.unit(x, 'deg')); };
            scope.asin = function (x) { return math.asin(x).toNumber('deg'); };
            scope.acos = function (x) { return math.acos(x).toNumber('deg'); };
            scope.atan = function (x) { return math.atan(x).toNumber('deg'); };
        }

        scope.ln = math.log; // Natural log
        scope.fact = math.factorial;

        let result = math.evaluate(expression, scope);

        // Handle Complex Numbers display
        if (typeof result === 'object' && 're' in result && 'im' in result) {
            result = math.format(result, { precision: 14 });
        } else {
            result = math.format(result, { precision: 14 });
        }

        screen.value = result;

        // Add to History
        addToHistory(expression, result);

    } catch (e) {
        screen.value = "Error";
        console.error(e);
    }
}

// --- History Logic ---
function addToHistory(expression, result) {
    history.unshift({ expression, result, timestamp: new Date() });
    if (history.length > 50) history.pop(); // Keep last 50
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';

    if (history.length === 0) {
        list.innerHTML = '<div class="empty-state" style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">No history yet</div>';
        return;
    }

    history.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.style.cssText = `
            background: rgba(255,255,255,0.05);
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            border: 1px solid transparent;
            transition: 0.2s;
        `;
        div.innerHTML = `
            <div style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 2px;">${item.expression} =</div>
            <div style="color: var(--primary-color); font-size: 1.1rem; font-weight: 600;">${item.result}</div>
        `;

        div.onmouseover = () => { div.style.background = 'rgba(255,255,255,0.1)'; div.style.borderColor = 'rgba(255,255,255,0.2)'; };
        div.onmouseout = () => { div.style.background = 'rgba(255,255,255,0.05)'; div.style.borderColor = 'transparent'; };
        div.onclick = () => { loadHistory(item); };

        list.appendChild(div);
    });
}

function loadHistory(item) {
    screen.value = item.result;
    historyDiv.innerText = item.expression + " =";
    switchTab('calculator');
}

function clearHistory() {
    history = [];
    renderHistory();
}

// --- Graphing Logic ---
function updateGraphInputs() {
    const mode = document.getElementById('graph-mode').value;
    const input = document.getElementById('graph-input');
    if (mode === '2d') {
        input.placeholder = "Enter function of x, e.g., sin(x)";
    } else {
        input.placeholder = "Enter function of x and y, e.g., sin(x) * cos(y)";
    }
}

function plotGraph() {
    const expression = document.getElementById('graph-input').value;
    const mode = document.getElementById('graph-mode').value;

    if (!expression) return;

    try {
        const expr = math.compile(expression);

        if (mode === '2d') {
            // 2D Plotting
            const xValues = math.range(-10, 10, 0.1).toArray();
            const yValues = xValues.map(x => {
                try {
                    return expr.evaluate({ x: x });
                } catch (e) { return null; }
            });

            const trace = {
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#00d2ff', width: 3 }
            };

            const layout = {
                title: expression,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#fff' },
                xaxis: { gridcolor: '#444', zerolinecolor: '#666' },
                yaxis: { gridcolor: '#444', zerolinecolor: '#666' },
                margin: { t: 40, r: 20, b: 40, l: 40 }
            };

            Plotly.newPlot('plot-container', [trace], layout, { responsive: true });

        } else {
            // 3D Plotting
            const steps = 50;
            const xValues = [];
            const yValues = [];
            const zValues = [];

            const range = 10;
            const step = (range * 2) / steps;

            for (let i = 0; i <= steps; i++) {
                const x = -range + (i * step);
                xValues.push(x);

                const zRow = [];
                for (let j = 0; j <= steps; j++) {
                    const y = -range + (j * step);
                    if (i === 0) yValues.push(y); // Only populate y once

                    try {
                        zRow.push(expr.evaluate({ x: x, y: y }));
                    } catch (e) {
                        zRow.push(0);
                    }
                }
                zValues.push(zRow);
            }

            const trace = {
                z: zValues,
                x: xValues,
                y: yValues,
                type: 'surface',
                colorscale: 'Viridis',
                contours: {
                    z: {
                        show: true,
                        usecolormap: true,
                        highlightcolor: "#42f462",
                        project: { z: true }
                    }
                }
            };

            const layout = {
                title: expression,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#fff' },
                scene: {
                    xaxis: { gridcolor: '#444', title: 'X' },
                    yaxis: { gridcolor: '#444', title: 'Y' },
                    zaxis: { gridcolor: '#444', title: 'Z' }
                },
                margin: { t: 40, r: 20, b: 20, l: 20 }
            };

            Plotly.newPlot('plot-container', [trace], layout, { responsive: true });
        }

    } catch (e) {
        alert("Invalid Function: " + e.message);
        console.error(e);
    }
}

// Analysis Logic
function analyzeFunction() {
    const expression = document.getElementById('analysis-input').value;
    const domainOut = document.getElementById('prop-domain');
    const linearOut = document.getElementById('prop-linear');
    const timeOut = document.getElementById('prop-time');
    const memoryOut = document.getElementById('prop-memory');
    const causalOut = document.getElementById('prop-causal');
    const stableOut = document.getElementById('prop-stable');

    if (!expression) return;

    // Heuristics
    let domain = "R (All Real Numbers)";
    let isLinear = true;
    let isTimeInvariant = true;
    let isMemoryless = true;
    let isCausal = true;
    let isStable = true;
    let stabilityReason = "Bounded Input -> Bounded Output";

    const lowerExpr = expression.toLowerCase();

    // 1. Domain & Stability
    if (lowerExpr.includes('1/x') || lowerExpr.includes('1 / x')) {
        domain = "x ≠ 0";
        isStable = false;
        stabilityReason = "Unstable at x=0 (Pole)";
    } else if (lowerExpr.includes('sqrt(x)')) {
        domain = "x ≥ 0";
    } else if (lowerExpr.includes('log(x)') || lowerExpr.includes('ln(x)')) {
        domain = "x > 0";
        isStable = false;
        stabilityReason = "Unstable at x=0";
    } else if (lowerExpr.includes('tan(x)')) {
        domain = "x ≠ π/2 + kπ";
        isStable = false;
        stabilityReason = "Unstable at x=π/2";
    }

    // 2. Linearity
    if (lowerExpr.includes('^') || lowerExpr.includes('sin') || lowerExpr.includes('cos') || lowerExpr.includes('tan') || lowerExpr.includes('log') || lowerExpr.includes('sqrt') || lowerExpr.includes('abs')) {
        isLinear = false;
    }

    // 3. Time Invariance
    if (lowerExpr.includes('t')) {
        isTimeInvariant = false;
    }

    // 4. Memory
    if (lowerExpr.includes('integral') || lowerExpr.includes('deriv') || lowerExpr.includes('sum')) {
        isMemoryless = false;
    }

    // 5. Causality
    if (isMemoryless) {
        isCausal = true;
    } else {
        if (lowerExpr.includes('t+') || lowerExpr.includes('n+')) {
            isCausal = false;
        }
    }

    // Update UI
    domainOut.innerText = domain;
    linearOut.innerText = isLinear ? "Linear" : "Non-Linear";
    timeOut.innerText = isTimeInvariant ? "Time Invariant" : "Time Variant";
    recognition.onstart = function () {
        console.log("Listening...");
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        // Basic cleanup
        let cleanTranscript = transcript.toLowerCase()
            .replace(/times/g, '*')
            .replace(/multiply/g, '*')
            .replace(/divided by/g, '/')
            .replace(/plus/g, '+')
            .replace(/minus/g, '-');

        screen.value += cleanTranscript;
    };

    recognition.onerror = function (event) {
        console.error("Voice error", event.error);
        alert("Voice Error: " + event.error);
    };
}

// --- AI Chat Solver Logic ---

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    processAIRequest(text);
}

function processAIRequest(text) {
    const lowerText = text.toLowerCase();
    const cleanText = lowerText.replace(/\s+/g, '');

    if (cleanText.includes('x^2')) {
        solveQuadratic(cleanText);
        return;
    }

    if (cleanText.includes('x^3')) {
        solveCubic(cleanText);
        return;
    }

    if (cleanText.includes('integral') || cleanText.includes('integrate') || cleanText.includes('∫')) {
        solveIntegral(text);
        return;
    }

    try {
        const result = math.evaluate(text);
        addMessage(`Result: ${result}`, 'bot');
    } catch (e) {
        addMessage("I couldn't understand that equation. Try 'ax^2 + bx + c = 0' or a math expression.", 'bot');
    }
}

function solveQuadratic(text) {
    let leftSide = text.split('=')[0];
    let a = 0, b = 0, c = 0;

    const matchA = leftSide.match(/([+-]?\d*\.?\d*)x\^2/);
    if (matchA) {
        let val = matchA[1];
        if (val === '' || val === '+') a = 1;
        else if (val === '-') a = -1;
        else a = parseFloat(val);
    }
    leftSide = leftSide.replace(matchA[0], '');

    const matchB = leftSide.match(/([+-]?\d*\.?\d*)x/);
    if (matchB) {
        let val = matchB[1];
        if (val === '' || val === '+') b = 1;
        else if (val === '-') b = -1;
        else b = parseFloat(val);
        leftSide = leftSide.replace(matchB[0], '');
    }

    const matchC = leftSide.match(/([+-]?\d+\.?\d*)/);
    if (matchC) {
        c = parseFloat(matchC[0]);
    }

    addMessage(`Quadratic: a=${a}, b=${b}, c=${c}`, 'bot');

    if (a === 0) {
        addMessage("Not a quadratic equation (a=0).", 'bot');
        return;
    }

    const delta = b * b - 4 * a * c;

    let solution = "";
    if (delta > 0) {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        solution = `Two real roots:\nx₁ = ${x1}\nx₂ = ${x2}`;
    } else if (delta === 0) {
        const x = -b / (2 * a);
        solution = `One real root:\nx = ${x}`;
    } else {
        const realPart = (-b / (2 * a)).toFixed(2);
        const imagPart = (Math.sqrt(-delta) / (2 * a)).toFixed(2);
        solution = `Complex roots:\nx₁ = ${realPart} + ${imagPart}i\nx₂ = ${realPart} - ${imagPart}i`;
    }

    addMessage(solution, 'bot');
}

function solveCubic(text) {
    addMessage("Cubic equation detected. I can currently only analyze it, not solve step-by-step.", 'bot');
}

function solveIntegral(text) {
    // Basic Integral Solver for Polynomials
    // Format: "integrate x^2 + 2x" or "integral of x^2 from 0 to 5"

    const lowerText = text.toLowerCase();
    let expression = lowerText.replace('integrate', '').replace('integral of', '').replace('integral', '').replace('∫', '').trim();

    // Check for definite integral "from a to b"
    let fromMatch = expression.match(/from\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)/);
    let isDefinite = false;
    let a = 0, b = 0;

    if (fromMatch) {
        isDefinite = true;
        a = parseFloat(fromMatch[1]);
        b = parseFloat(fromMatch[2]);
        expression = expression.replace(fromMatch[0], '').trim();
    }

    // Simple polynomial parser (very basic)
    // Supports terms like ax^n, ax, a

    try {
        // Use math.js to parse, but we need symbolic integration which math.js doesn't fully do.
        // We will simulate it for simple polynomials.

        let terms = expression.split('+').map(t => t.trim());
        let integratedTerms = [];

        terms.forEach(term => {
            term = term.replace(/\s/g, '');
            if (!term) return;

            let coeff = 1;
            let power = 0;

            if (term.includes('x')) {
                let parts = term.split('x');
                if (parts[0] === '' || parts[0] === '+') coeff = 1;
                else if (parts[0] === '-') coeff = -1;
                else coeff = parseFloat(parts[0]);

                if (parts[1] && parts[1].startsWith('^')) {
                    power = parseFloat(parts[1].substring(1));
                } else {
                    power = 1;
                }
            } else {
                coeff = parseFloat(term);
                power = 0;
            }

            // Integrate: x^n -> x^(n+1)/(n+1)
            let newPower = power + 1;
            let newCoeff = coeff / newPower;

            if (newCoeff === 1) integratedTerms.push(`x^${newPower}`);
            else if (newCoeff === -1) integratedTerms.push(`-x^${newPower}`);
            else integratedTerms.push(`${newCoeff}x^${newPower}`);
        });

        let resultExpr = integratedTerms.join(' + ').replace(/\+\s*-/g, '- ');

        if (isDefinite) {
            // Evaluate at b and a
            const evalAt = (x) => {
                let val = 0;
                terms.forEach(term => {
                    term = term.replace(/\s/g, '');
                    let coeff = 1;
                    let power = 0;
                    if (term.includes('x')) {
                        let parts = term.split('x');
                        if (parts[0] === '' || parts[0] === '+') coeff = 1;
                        else if (parts[0] === '-') coeff = -1;
                        else coeff = parseFloat(parts[0]);
                        if (parts[1] && parts[1].startsWith('^')) power = parseFloat(parts[1].substring(1));
                        else power = 1;
                    } else {
                        coeff = parseFloat(term);
                        power = 0;
                    }
                    val += (coeff / (power + 1)) * Math.pow(x, power + 1);
                });
                return val;
            };

            let valB = evalAt(b);
            let valA = evalAt(a);
            let area = valB - valA;

            addMessage(`Definite Integral of ${expression} from ${a} to ${b}:`, 'bot');
            addMessage(`F(x) = ${resultExpr}`, 'bot');
            addMessage(`F(${b}) = ${valB.toFixed(4)}`, 'bot');
            addMessage(`F(${a}) = ${valA.toFixed(4)}`, 'bot');
            addMessage(`Result: ${area.toFixed(4)}`, 'bot');

        } else {
            addMessage(`Indefinite Integral of ${expression}:`, 'bot');
            addMessage(`${resultExpr} + C`, 'bot');
        }

    } catch (e) {
        addMessage("I can only integrate simple polynomials for now (e.g., x^2 + 2x).", 'bot');
    }
}

function startChatVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice control not supported.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        chatInput.value += transcript;
    };
}

// Haptic Feedback
function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(15); // 15ms vibration
    }
}

// Add haptic to all buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', triggerHaptic);
});

// --- Handwriting Logic ---
const canvas = document.getElementById('handwriting-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let isDrawing = false;

// Resize canvas to match display size
function resizeCanvas() {
    if (!canvas || !ctx) return;
    const display = document.querySelector('.display');
    if (!display) return;
    canvas.width = display.offsetWidth;
    canvas.height = display.offsetHeight;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00d4ff'; // Neon Cyan
}

window.addEventListener('resize', resizeCanvas);

function toggleHandwriting() {
    if (!canvas) return;
    const isHidden = canvas.style.display === 'none' || canvas.style.display === '';
    const recognizeBtn = document.getElementById('recognize-btn');
    const clearBtn = document.getElementById('clear-canvas-btn');

    if (isHidden) {
        canvas.style.display = 'block';
        if (recognizeBtn) recognizeBtn.classList.remove('hidden');
        if (clearBtn) clearBtn.classList.remove('hidden');
        resizeCanvas();
    } else {
        canvas.style.display = 'none';
        if (recognizeBtn) recognizeBtn.classList.add('hidden');
        if (clearBtn) clearBtn.classList.add('hidden');
    }
}

function clearCanvas() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Drawing Events
if (canvas && ctx) {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

function startDrawing(e) {
    if (!canvas || !ctx) return;
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing || !canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    if (!canvas || !ctx) return;
    isDrawing = false;
    ctx.beginPath();
}

async function recognizeHandwriting() {
    if (!canvas || !ctx) return;
    const recognizeBtn = document.getElementById('recognize-btn');
    const originalText = recognizeBtn ? recognizeBtn.innerText : '';
    if (recognizeBtn) recognizeBtn.innerText = '⏳'; // Loading state

    try {
        // Use Tesseract.js to recognize text
        const result = await Tesseract.recognize(
            canvas,
            'eng',
            {
                logger: m => console.log(m),
                tessedit_char_whitelist: '0123456789+-*/().sincostanlogsqrt^' // Whitelist math chars
            }
        );

        let text = result.data.text.trim();
        console.log("Recognized:", text);

        // Basic cleanup
        text = text.replace(/[^0-9+\-*/().^a-z]/gi, '');

        if (text) {
            screen.value += text;
            clearCanvas();
            toggleHandwriting(); // Close after success
        } else {
            alert("Could not recognize text. Try writing clearer.");
        }
    } catch (e) {
        console.error(e);
        alert("Error recognizing text.");
    } finally {
        if (recognizeBtn) recognizeBtn.innerText = originalText;
    }
}

chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendChat();
    }
});

// --- Electronics Toolkit Logic ---
function calcOhm() {
    const v = parseFloat(document.getElementById('ohm-v').value);
    const i = parseFloat(document.getElementById('ohm-i').value);
    const r = parseFloat(document.getElementById('ohm-r').value);

    if (!isNaN(v) && !isNaN(i) && isNaN(r)) {
        document.getElementById('ohm-r').value = v / i;
    } else if (!isNaN(v) && isNaN(i) && !isNaN(r)) {
        document.getElementById('ohm-i').value = v / r;
    } else if (isNaN(v) && !isNaN(i) && !isNaN(r)) {
        document.getElementById('ohm-v').value = i * r;
    } else {
        alert("Please enter exactly two values to calculate the third.");
    }
}

function calcFilter() {
    const r = parseFloat(document.getElementById('filter-r').value);
    const c = parseFloat(document.getElementById('filter-c').value);

    if (!isNaN(r) && !isNaN(c)) {
        const fc = 1 / (2 * Math.PI * r * c);
        document.getElementById('filter-result').innerText = `Cutoff Frequency: ${fc.toFixed(2)} Hz`;
    } else {
        alert("Please enter Resistance and Capacitance.");
    }
}

// --- Logic Gate Simulator Logic ---

const logicCanvas = document.getElementById('logic-canvas');
const logicCtx = logicCanvas.getContext('2d');
let gates = [];
let wires = [];
let draggingGate = null;
let wiringStart = null;
let nextGateId = 1;
let mouseX = 0;
let mouseY = 0;
let starterCircuit = null;
let logicPulseOffset = 0;
let logicAnimId = null;
let suppressQuickUpdate = false;
let truthMode = 'quick';
let primaryLightId = null;
let primaryMonitorId = null;
const tutorialState = {
    active: false,
    step: 0,
    events: {
        gateAdded: false,
        switchAdded: false,
        lightAdded: false,
        wires: 0,
        toggled: false
    }
};
const tutorialSteps = [
    'Add any logic gate from the palette.',
    'Add a Switch and a Light.',
    'Create at least two wires to connect inputs and output.',
    'Toggle a Switch and watch the Light change.'
];

// Resize logic canvas
function resizeLogicCanvas() {
    const wrapper = document.querySelector('.logic-canvas-card');
    if (wrapper && logicCanvas) {
        logicCanvas.width = wrapper.offsetWidth;
        logicCanvas.height = wrapper.offsetHeight;
        drawLogicCanvas();
        updateHudIndicator();
    }
}
window.addEventListener('resize', resizeLogicCanvas);

// Gate Definitions
const GATE_CONFIG = {
    'AND': { inputs: 2, color: '#00d4ff', display: 'AND' },
    'OR': { inputs: 2, color: '#00d4ff', display: 'OR' },
    'NOT': { inputs: 1, color: '#ff007a', display: 'NOT' },
    'NAND': { inputs: 2, color: '#ff007a', display: 'NAND' },
    'NOR': { inputs: 2, color: '#ff007a', display: 'NOR' },
    'XOR': { inputs: 2, color: '#00d4ff', display: 'XOR' },
    'SWITCH': { inputs: 0, color: '#ff9900', display: 'SW' },
    'LIGHT': { inputs: 1, color: '#ffff00', display: 'OUT' }
};

function addGate(type, x, y, label, idOverride, skipDraw) {
    const config = GATE_CONFIG[type];
    const gateX = typeof x === 'number' ? x : (logicCanvas.width / 2 - 30);
    const gateY = typeof y === 'number' ? y : (logicCanvas.height / 2 - 20);

    const gate = {
        id: typeof idOverride === 'number' ? idOverride : nextGateId++,
        type: type,
        x: gateX,
        y: gateY,
        w: 60,
        h: 40,
        inputs: [],
        outputs: [],
        state: 0
    };

    if (typeof label === 'string' && label.trim()) {
        gate.label = label.trim();
    }

    // Initialize Pins
    for (let i = 0; i < (type === 'SWITCH' ? 0 : config.inputs); i++) {
        gate.inputs.push({ value: 0, connected: false });
    }
    if (type !== 'LIGHT') {
        gate.outputs.push({ value: 0 });
    }

    gates.push(gate);
    if (type === 'LIGHT') {
        primaryLightId = gate.id;
        if (!primaryMonitorId) {
            primaryMonitorId = gate.id;
        }
    }

    notifyTutor('gate', type);
    if (!skipDraw) {
        drawLogicCanvas();
    }
    updateLogicStats();
    return gate;
}

function clearLogicCanvas() {
    gates = [];
    wires = [];
    starterCircuit = null;
    primaryLightId = null;
    primaryMonitorId = null;
    drawLogicCanvas();
    updateLogicStats();
    updateHudIndicator();
    const tableEl = document.getElementById('truth-table');
    if (tableEl) tableEl.innerText = 'Press Generate to build the table.';
}

// --- Quick Gate (Simple Evaluator) ---
const quickGateState = {
    gate: 'AND',
    a: 0,
    b: 0
};

function computeGateOutput(gateType, a, b) {
    const inA = Number(a) ? 1 : 0;
    const inB = Number(b) ? 1 : 0;
    switch (gateType) {
        case 'AND': return (inA && inB) ? 1 : 0;
        case 'OR': return (inA || inB) ? 1 : 0;
        case 'NOT': return (!inA) ? 1 : 0;
        case 'NAND': return (!(inA && inB)) ? 1 : 0;
        case 'NOR': return (!(inA || inB)) ? 1 : 0;
        case 'XOR': return (inA !== inB) ? 1 : 0;
        default: return 0;
    }
}

function getPrimaryLight() {
    if (primaryLightId) {
        const light = gates.find(g => g.id === primaryLightId);
        if (light) return light;
    }
    const lights = gates.filter(g => g.type === 'LIGHT');
    return lights.length ? lights[lights.length - 1] : null;
}

function getMonitorGate() {
    if (primaryMonitorId) {
        const gate = gates.find(g => g.id === primaryMonitorId);
        if (gate) return gate;
    }
    const light = getPrimaryLight();
    if (light) return light;
    return gates.length ? gates[gates.length - 1] : null;
}

function setQuickGate(gate) {
    quickGateState.gate = gate;
    document.querySelectorAll('.quick-gate-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.gate === gate);
    });
    if (gate === 'NOT') {
        quickGateState.b = 0;
    }
    if (!suppressQuickUpdate) {
        updateQuickGate();
        updateLogicStats();
    }
}

function setQuickInput(which, value) {
    if (which === 'b' && quickGateState.gate === 'NOT') return;
    quickGateState[which] = value ? 1 : 0;
    applyQuickToStarter();
    if (!suppressQuickUpdate) {
        updateQuickGate();
        updateLogicStats();
    }
}

function updateQuickGate() {
    const outEl = document.getElementById('quick-out');
    const bitB = document.getElementById('bit-b');

    if (!outEl) return;

    document.querySelectorAll('.bit-btn[data-bit="a"]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === String(quickGateState.a));
        btn.classList.remove('disabled');
    });

    const bButtons = document.querySelectorAll('.bit-btn[data-bit="b"]');
    if (quickGateState.gate === 'NOT') {
        if (bitB) bitB.classList.add('hidden');
        bButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('disabled');
        });
    } else {
        if (bitB) bitB.classList.remove('hidden');
        bButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === String(quickGateState.b));
            btn.classList.remove('disabled');
        });
    }

    let outVal = 0;
    const a = quickGateState.a;
    const b = quickGateState.b;
    outVal = computeGateOutput(quickGateState.gate, a, b);

    const monitorGate = getMonitorGate();
    if (monitorGate) {
        outVal = monitorGate.state;
    }

    outVal = Number(outVal) ? 1 : 0;
    outEl.innerText = outVal;
    outEl.classList.toggle('on', outVal === 1);
    outEl.classList.toggle('off', outVal === 0);
    updateHudIndicator(outVal, monitorGate ? monitorGate.label : null);
}

function applyQuickToStarter() {
    if (!starterCircuit) return;
    const swA = gates.find(g => g.id === starterCircuit.switchAId);
    if (swA) swA.state = quickGateState.a;

    if (starterCircuit.switchBId) {
        const swB = gates.find(g => g.id === starterCircuit.switchBId);
        if (swB) swB.state = quickGateState.b;
    }

    simulate();
    drawLogicCanvas();
}

function syncQuickFromStarter() {
    if (starterCircuit) {
        const swA = gates.find(g => g.id === starterCircuit.switchAId);
        const swB = starterCircuit.switchBId ? gates.find(g => g.id === starterCircuit.switchBId) : null;

        if (swA) quickGateState.a = Number(swA.state) ? 1 : 0;
        if (swB) quickGateState.b = Number(swB.state) ? 1 : 0;
    } else {
        const switches = gates.filter(g => g.type === 'SWITCH');
        if (switches[0]) quickGateState.a = Number(switches[0].state) ? 1 : 0;
        if (switches[1]) quickGateState.b = Number(switches[1].state) ? 1 : 0;
    }

    updateQuickGate();
}

function buildStarterCircuit() {
    if (!logicCanvas) return;
    if (logicCanvas.width === 0 || logicCanvas.height === 0) {
        resizeLogicCanvas();
    }

    clearLogicCanvas();

    const gateType = quickGateState.gate || 'AND';
    const midY = logicCanvas.height / 2 - 20;
    const leftX = 24;
    const rightX = Math.max(logicCanvas.width - 90, 220);
    const topY = midY - 55;
    const bottomY = midY + 55;

    const swA = addGate('SWITCH', leftX, topY, 'A');
    const swB = gateType === 'NOT' ? null : addGate('SWITCH', leftX, bottomY, 'B');
    const gate = addGate(gateType, logicCanvas.width / 2 - 30, midY, gateType);
    const light = addGate('LIGHT', rightX, midY, 'OUT');

    wires.push({
        from: { gateId: swA.id, pinIndex: 0 },
        to: { gateId: gate.id, pinIndex: 0 }
    });

    if (swB) {
        wires.push({
            from: { gateId: swB.id, pinIndex: 0 },
            to: { gateId: gate.id, pinIndex: 1 }
        });
    }

    wires.push({
        from: { gateId: gate.id, pinIndex: 0 },
        to: { gateId: light.id, pinIndex: 0 }
    });

    starterCircuit = {
        switchAId: swA.id,
        switchBId: swB ? swB.id : null,
        lightId: light.id
    };
    primaryMonitorId = light.id;

    applyQuickToStarter();
    updateQuickGate();
}

// --- Logic UI Helpers ---
function updateLogicStats() {
    const gateCountEl = document.getElementById('stat-gates');
    const switchCountEl = document.getElementById('stat-switches');
    const lightCountEl = document.getElementById('stat-lights');
    const wireCountEl = document.getElementById('stat-wires');

    if (!gateCountEl || !switchCountEl || !lightCountEl || !wireCountEl) return;

    const gateCount = gates.filter(g => !['SWITCH', 'LIGHT'].includes(g.type)).length;
    const switchCount = gates.filter(g => g.type === 'SWITCH').length;
    const lightCount = gates.filter(g => g.type === 'LIGHT').length;

    gateCountEl.innerText = gateCount;
    switchCountEl.innerText = switchCount;
    lightCountEl.innerText = lightCount;
    wireCountEl.innerText = wires.length;
    updateSignalInspector();
}

function updateSignalInspector() {
    const listEl = document.getElementById('logic-signals');
    if (!listEl) return;
    if (gates.length === 0) {
        listEl.innerHTML = '<div class="signal-empty">No signals yet. Add gates to see live outputs.</div>';
        return;
    }

    const sorted = [...gates].sort((a, b) => a.id - b.id);
    const rows = sorted.map((g, idx) => {
        const label = g.label || (g.type === 'SWITCH' ? `Switch ${idx + 1}` : `${g.type} ${g.id}`);
        const value = Number(g.state) ? 1 : 0;
        const cls = value ? 'high' : 'low';
        const monitorClass = primaryMonitorId === g.id ? 'active' : '';
        return `
            <div class="signal-row ${monitorClass}" onclick="setMonitorGate(${g.id})">
                <span class="signal-name">${label}</span>
                <span class="signal-value ${cls}">${value}</span>
            </div>
        `;
    });
    listEl.innerHTML = rows.join('');
}

function setMonitorGate(id) {
    primaryMonitorId = id;
    updateHudIndicator();
    updateQuickGate();
    updateSignalInspector();
}

function updateHudIndicator(forcedOut, label) {
    const highDot = document.getElementById('hud-high-dot');
    const lowDot = document.getElementById('hud-low-dot');
    const monitorLabel = document.getElementById('hud-monitor');
    if (!highDot || !lowDot || !monitorLabel) return;

    const monitorGate = getMonitorGate();
    const outVal = typeof forcedOut === 'number' ? forcedOut : (monitorGate ? Number(monitorGate.state) : 0);
    highDot.classList.toggle('active', outVal === 1);
    lowDot.classList.toggle('active', outVal === 0);

    const labelText = label || (monitorGate && monitorGate.label ? monitorGate.label : (monitorGate ? monitorGate.type : 'Output'));
    monitorLabel.innerText = `Monitor: ${labelText}`;
}

function startLogicAnimation() {
    if (logicAnimId || !logicCanvas) return;
    const animate = () => {
        logicPulseOffset = (logicPulseOffset + 0.8) % 24;
        drawLogicCanvas();
        logicAnimId = requestAnimationFrame(animate);
    };
    logicAnimId = requestAnimationFrame(animate);
}

function stopLogicAnimation() {
    if (logicAnimId) {
        cancelAnimationFrame(logicAnimId);
        logicAnimId = null;
    }
}

function setTruthMode(mode) {
    truthMode = mode;
    document.querySelectorAll('.truth-mode').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

function generateTruthTable() {
    const tableEl = document.getElementById('truth-table');
    if (!tableEl) return;

    if (truthMode === 'quick') {
        const inputCount = quickGateState.gate === 'NOT' ? 1 : 2;
        const headers = inputCount === 1 ? ['A', 'OUT'] : ['A', 'B', 'OUT'];
        const rows = [];
        const max = Math.pow(2, inputCount);
        for (let i = 0; i < max; i++) {
            const a = (i >> (inputCount - 1)) & 1;
            const b = inputCount === 2 ? (i & 1) : 0;
            const out = computeGateOutput(quickGateState.gate, a, b);
            rows.push(inputCount === 1 ? [a, out] : [a, b, out]);
        }
        tableEl.innerHTML = renderTruthTable(headers, rows);
        return;
    }

    const switches = gates.filter(g => g.type === 'SWITCH');
    const lights = gates.filter(g => g.type === 'LIGHT');

    if (switches.length === 0 || lights.length === 0) {
        tableEl.innerText = 'Add at least one Switch and one Light on canvas.';
        return;
    }

    if (switches.length > 3) {
        tableEl.innerText = 'Truth table supports up to 3 switches for now.';
        return;
    }

    const originalStates = switches.map(sw => sw.state);
    const headers = [
        ...switches.map((sw, idx) => sw.label || `S${idx + 1}`),
        ...lights.map((l, idx) => l.label || `L${idx + 1}`)
    ];
    const rows = [];
    const combos = Math.pow(2, switches.length);

    suppressQuickUpdate = true;
    for (let mask = 0; mask < combos; mask++) {
        switches.forEach((sw, idx) => {
            const bit = (mask >> (switches.length - 1 - idx)) & 1;
            sw.state = bit;
        });
        simulate();
        const outputs = lights.map(l => Number(l.state) ? 1 : 0);
        const inputs = switches.map(sw => Number(sw.state) ? 1 : 0);
        rows.push([...inputs, ...outputs]);
    }
    switches.forEach((sw, idx) => {
        sw.state = originalStates[idx];
    });
    suppressQuickUpdate = false;
    simulate();
    drawLogicCanvas();
    updateQuickGate();

    tableEl.innerHTML = renderTruthTable(headers, rows);
}

function renderTruthTable(headers, rows) {
    let html = '<table><thead><tr>';
    headers.forEach(h => {
        html += `<th>${h}</th>`;
    });
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
}

function exportLogic() {
    const textarea = document.getElementById('logic-save-data');
    if (!textarea) return;
    const payload = {
        version: 1,
        primaryLightId,
        gates: gates.map(g => ({
            id: g.id,
            type: g.type,
            x: g.x,
            y: g.y,
            state: g.state,
            label: g.label || ''
        })),
        wires: wires.map(w => ({
            from: { gateId: w.from.gateId, pinIndex: w.from.pinIndex },
            to: { gateId: w.to.gateId, pinIndex: w.to.pinIndex }
        }))
    };
    textarea.value = JSON.stringify(payload, null, 2);
}

function importLogic() {
    const textarea = document.getElementById('logic-save-data');
    if (!textarea) return;
    const raw = textarea.value.trim();
    if (!raw) {
        alert('Paste exported JSON first.');
        return;
    }
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        alert('Invalid JSON format.');
        return;
    }

    clearLogicCanvas();
    suppressQuickUpdate = true;

    if (Array.isArray(data.gates)) {
        data.gates.forEach(g => {
            const gate = addGate(g.type, g.x, g.y, g.label, g.id, true);
            gate.state = Number(g.state) ? 1 : 0;
        });
    }

    wires = Array.isArray(data.wires) ? data.wires : [];
    primaryLightId = typeof data.primaryLightId === 'number' ? data.primaryLightId : primaryLightId;
    primaryMonitorId = primaryLightId || (gates.length ? gates[gates.length - 1].id : null);

    nextGateId = gates.reduce((max, g) => Math.max(max, g.id), 0) + 1;
    suppressQuickUpdate = false;
    simulate();
    drawLogicCanvas();
    updateQuickGate();
}

async function copyLogic() {
    const textarea = document.getElementById('logic-save-data');
    if (!textarea) return;
    if (!textarea.value.trim()) exportLogic();
    try {
        await navigator.clipboard.writeText(textarea.value);
    } catch (e) {
        alert('Copy failed. Please copy manually.');
    }
}

function clampValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function placeX(width, pct) {
    return clampValue(width * pct, 18, width - 80);
}

function placeY(height, pct) {
    return clampValue(height * pct, 12, height - 52);
}

function buildTemplate(name) {
    if (!logicCanvas) return;
    if (logicCanvas.width === 0 || logicCanvas.height === 0) {
        resizeLogicCanvas();
    }

    clearLogicCanvas();

    const w = logicCanvas.width;
    const h = logicCanvas.height;
    const col1 = placeX(w, 0.08);
    const col2 = placeX(w, 0.32);
    const col3 = placeX(w, 0.52);
    const col4 = placeX(w, 0.68);
    const col5 = placeX(w, 0.84);
    const topY = placeY(h, 0.26);
    const midY = placeY(h, 0.5);
    const bottomY = placeY(h, 0.74);

    if (name === 'half_adder') {
        const swA = addGate('SWITCH', col1, topY, 'A');
        const swB = addGate('SWITCH', col1, bottomY, 'B');
        const xor = addGate('XOR', col2, topY, 'XOR');
        const and = addGate('AND', col2, bottomY, 'AND');
        const sum = addGate('LIGHT', col5, topY, 'SUM');
        const carry = addGate('LIGHT', col5, bottomY, 'CARRY');

        wires.push({ from: { gateId: swA.id, pinIndex: 0 }, to: { gateId: xor.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swB.id, pinIndex: 0 }, to: { gateId: xor.id, pinIndex: 1 } });
        wires.push({ from: { gateId: swA.id, pinIndex: 0 }, to: { gateId: and.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swB.id, pinIndex: 0 }, to: { gateId: and.id, pinIndex: 1 } });
        wires.push({ from: { gateId: xor.id, pinIndex: 0 }, to: { gateId: sum.id, pinIndex: 0 } });
        wires.push({ from: { gateId: and.id, pinIndex: 0 }, to: { gateId: carry.id, pinIndex: 0 } });

        primaryLightId = sum.id;
        primaryMonitorId = sum.id;
    }

    if (name === 'full_adder') {
        const swA = addGate('SWITCH', col1, topY, 'A');
        const swB = addGate('SWITCH', col1, midY, 'B');
        const swC = addGate('SWITCH', col1, bottomY, 'CIN');

        const xor1 = addGate('XOR', col2, topY, 'X1');
        const xor2 = addGate('XOR', col3, topY, 'X2');
        const and1 = addGate('AND', col2, bottomY, 'A1');
        const and2 = addGate('AND', col3, bottomY, 'A2');
        const orGate = addGate('OR', col4, bottomY, 'OR');

        const sum = addGate('LIGHT', col5, topY, 'SUM');
        const cout = addGate('LIGHT', col5, bottomY, 'COUT');

        wires.push({ from: { gateId: swA.id, pinIndex: 0 }, to: { gateId: xor1.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swB.id, pinIndex: 0 }, to: { gateId: xor1.id, pinIndex: 1 } });

        wires.push({ from: { gateId: xor1.id, pinIndex: 0 }, to: { gateId: xor2.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swC.id, pinIndex: 0 }, to: { gateId: xor2.id, pinIndex: 1 } });
        wires.push({ from: { gateId: xor2.id, pinIndex: 0 }, to: { gateId: sum.id, pinIndex: 0 } });

        wires.push({ from: { gateId: swA.id, pinIndex: 0 }, to: { gateId: and1.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swB.id, pinIndex: 0 }, to: { gateId: and1.id, pinIndex: 1 } });

        wires.push({ from: { gateId: xor1.id, pinIndex: 0 }, to: { gateId: and2.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swC.id, pinIndex: 0 }, to: { gateId: and2.id, pinIndex: 1 } });

        wires.push({ from: { gateId: and1.id, pinIndex: 0 }, to: { gateId: orGate.id, pinIndex: 0 } });
        wires.push({ from: { gateId: and2.id, pinIndex: 0 }, to: { gateId: orGate.id, pinIndex: 1 } });
        wires.push({ from: { gateId: orGate.id, pinIndex: 0 }, to: { gateId: cout.id, pinIndex: 0 } });

        primaryLightId = sum.id;
        primaryMonitorId = sum.id;
    }

    if (name === 'mux_2_1') {
        const swA = addGate('SWITCH', col1, topY, 'A');
        const swB = addGate('SWITCH', col1, midY, 'B');
        const swS = addGate('SWITCH', col1, bottomY, 'SEL');

        const notS = addGate('NOT', col2, bottomY, 'NOT');
        const and1 = addGate('AND', col2, topY, 'A1');
        const and2 = addGate('AND', col2, midY, 'A2');
        const orGate = addGate('OR', col3, midY, 'OR');
        const out = addGate('LIGHT', col5, midY, 'OUT');

        wires.push({ from: { gateId: swS.id, pinIndex: 0 }, to: { gateId: notS.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swA.id, pinIndex: 0 }, to: { gateId: and1.id, pinIndex: 0 } });
        wires.push({ from: { gateId: notS.id, pinIndex: 0 }, to: { gateId: and1.id, pinIndex: 1 } });

        wires.push({ from: { gateId: swB.id, pinIndex: 0 }, to: { gateId: and2.id, pinIndex: 0 } });
        wires.push({ from: { gateId: swS.id, pinIndex: 0 }, to: { gateId: and2.id, pinIndex: 1 } });

        wires.push({ from: { gateId: and1.id, pinIndex: 0 }, to: { gateId: orGate.id, pinIndex: 0 } });
        wires.push({ from: { gateId: and2.id, pinIndex: 0 }, to: { gateId: orGate.id, pinIndex: 1 } });
        wires.push({ from: { gateId: orGate.id, pinIndex: 0 }, to: { gateId: out.id, pinIndex: 0 } });

        primaryLightId = out.id;
        primaryMonitorId = out.id;
    }

    simulate();
    drawLogicCanvas();
    updateQuickGate();
}

function startTutor() {
    tutorialState.active = true;
    tutorialState.step = 0;
    tutorialState.events = { gateAdded: false, switchAdded: false, lightAdded: false, wires: 0, toggled: false };
    updateTutorUI();
}

function nextTutor() {
    if (!tutorialState.active) return;
    tutorialState.step = Math.min(tutorialSteps.length, tutorialState.step + 1);
    updateTutorUI();
}

function resetTutor() {
    tutorialState.active = false;
    tutorialState.step = 0;
    tutorialState.events = { gateAdded: false, switchAdded: false, lightAdded: false, wires: 0, toggled: false };
    updateTutorUI();
}

function notifyTutor(action, detail) {
    if (!tutorialState.active) return;
    if (action === 'gate' && !['SWITCH', 'LIGHT'].includes(detail)) tutorialState.events.gateAdded = true;
    if (action === 'gate' && detail === 'SWITCH') tutorialState.events.switchAdded = true;
    if (action === 'gate' && detail === 'LIGHT') tutorialState.events.lightAdded = true;
    if (action === 'wire') tutorialState.events.wires += 1;
    if (action === 'toggle') tutorialState.events.toggled = true;

    const step = tutorialState.step;
    if (step === 0 && tutorialState.events.gateAdded) tutorialState.step = 1;
    if (step === 1 && tutorialState.events.switchAdded && tutorialState.events.lightAdded) tutorialState.step = 2;
    if (step === 2 && tutorialState.events.wires >= 2) tutorialState.step = 3;
    if (step === 3 && tutorialState.events.toggled) tutorialState.step = 4;
    updateTutorUI();
}

function updateTutorUI() {
    const stepEl = document.getElementById('logic-tutor-step');
    const progressEl = document.getElementById('tutor-progress');
    if (!stepEl || !progressEl) return;

    if (!tutorialState.active) {
        stepEl.innerText = 'Press Start to begin.';
        progressEl.innerText = '0';
        return;
    }

    const stepIndex = Math.min(tutorialState.step, tutorialSteps.length);
    if (tutorialState.step >= tutorialSteps.length) {
        stepEl.innerText = 'Great! You can now build any circuit.';
    } else {
        stepEl.innerText = tutorialSteps[tutorialState.step];
    }
    progressEl.innerText = stepIndex;
}

// Interaction
if (logicCanvas) {
    logicCanvas.addEventListener('mousedown', (e) => {
        const rect = logicCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check for Pin Clicks (Wiring)
        for (let g of gates) {
            // Output Pins
            if (g.type !== 'LIGHT') {
                const px = g.x + g.w;
                const py = g.y + g.h / 2;
                if (dist(x, y, px, py) < 10) {
                    wiringStart = { gateId: g.id, pinIndex: 0, type: 'output' };
                    return;
                }
            }
            // Input Pins
            for (let i = 0; i < g.inputs.length; i++) {
                const px = g.x;
                const py = g.y + (g.h * (i + 1)) / (g.inputs.length + 1);
                if (dist(x, y, px, py) < 10) {
                    wiringStart = { gateId: g.id, pinIndex: i, type: 'input' };
                    return;
                }
            }
        }

        // Check for Gate Clicks
        for (let i = gates.length - 1; i >= 0; i--) {
            const g = gates[i];
            if (x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h) {
                if (g.type === 'SWITCH') {
                    g.state = g.state ? 0 : 1;
                    simulate();
                    drawLogicCanvas();
                    syncQuickFromStarter();
                    notifyTutor('toggle');
                } else {
                    if (g.type === 'LIGHT') {
                        primaryLightId = g.id;
                        primaryMonitorId = g.id;
                    } else {
                        primaryMonitorId = g.id;
                    }
                    updateHudIndicator();
                    updateQuickGate();
                    updateSignalInspector();
                    draggingGate = g;
                    g.offsetX = x - g.x;
                    g.offsetY = y - g.y;
                }
                return;
            }
        }
    });

    logicCanvas.addEventListener('mousemove', (e) => {
        const rect = logicCanvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if (draggingGate) {
            draggingGate.x = mouseX - draggingGate.offsetX;
            draggingGate.y = mouseY - draggingGate.offsetY;
            drawLogicCanvas();
        } else if (wiringStart) {
            drawLogicCanvas();
        }
    });

    logicCanvas.addEventListener('mouseup', (e) => {
        if (draggingGate) {
            draggingGate = null;
        }

        if (wiringStart) {
            const rect = logicCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            for (let g of gates) {
                if (wiringStart.type === 'output' && g.type !== 'SWITCH') {
                    for (let i = 0; i < g.inputs.length; i++) {
                        const px = g.x;
                        const py = g.y + (g.h * (i + 1)) / (g.inputs.length + 1);
                        if (dist(x, y, px, py) < 15) {
                            wires.push({
                                from: { gateId: wiringStart.gateId, pinIndex: 0 },
                                to: { gateId: g.id, pinIndex: i }
                            });
                            notifyTutor('wire');
                            simulate();
                            break;
                        }
                    }
                } else if (wiringStart.type === 'input' && g.type !== 'LIGHT') {
                    const px = g.x + g.w;
                    const py = g.y + g.h / 2;
                    if (dist(x, y, px, py) < 15) {
                        wires.push({
                            from: { gateId: g.id, pinIndex: 0 },
                            to: { gateId: wiringStart.gateId, pinIndex: wiringStart.pinIndex }
                        });
                        notifyTutor('wire');
                        simulate();
                        break;
                    }
                }
            }
            wiringStart = null;
            drawLogicCanvas();
        }
    });
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function simulate() {
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 100) {
        changed = false;
        iterations++;

        // Propagate Wires
        for (let w of wires) {
            const fromGate = gates.find(g => g.id === w.from.gateId);
            const toGate = gates.find(g => g.id === w.to.gateId);
            if (fromGate && toGate) {
                let val = fromGate.type === 'SWITCH' ? fromGate.state : (fromGate.outputs[0] ? fromGate.outputs[0].value : 0);
                if (toGate.inputs[w.to.pinIndex].value !== val) {
                    toGate.inputs[w.to.pinIndex].value = val;
                    changed = true;
                }
            }
        }

        // Evaluate Gates
        for (let g of gates) {
            let val = 0;
            const in0 = g.inputs[0] ? g.inputs[0].value : 0;
            const in1 = g.inputs[1] ? g.inputs[1].value : 0;

            switch (g.type) {
                case 'AND': val = (in0 && in1) ? 1 : 0; break;
                case 'OR': val = (in0 || in1) ? 1 : 0; break;
                case 'NOT': val = (!in0) ? 1 : 0; break;
                case 'NAND': val = (!(in0 && in1)) ? 1 : 0; break;
                case 'NOR': val = (!(in0 || in1)) ? 1 : 0; break;
                case 'XOR': val = (in0 !== in1) ? 1 : 0; break;
                case 'LIGHT': g.state = in0; break;
                case 'SWITCH': break;
            }

            if (g.type !== 'LIGHT' && g.type !== 'SWITCH') {
                if (g.outputs[0] && g.outputs[0].value !== val) {
                    g.outputs[0].value = val;
                    changed = true;
                }
                g.state = val;
            }
        }
    }

    updateQuickGate();
}

function drawLogicCanvas() {
    if (!logicCtx) return;
    logicCtx.clearRect(0, 0, logicCanvas.width, logicCanvas.height);

    // Draw Wires
    logicCtx.lineWidth = 3;
    for (let w of wires) {
        const fromGate = gates.find(g => g.id === w.from.gateId);
        const toGate = gates.find(g => g.id === w.to.gateId);
        if (fromGate && toGate) {
            const startX = fromGate.x + fromGate.w;
            const startY = fromGate.y + fromGate.h / 2;
            const endX = toGate.x;
            const endY = toGate.y + (toGate.h * (w.to.pinIndex + 1)) / (toGate.inputs.length + 1);

            const signal = fromGate.type === 'SWITCH' ? fromGate.state : (fromGate.outputs[0] ? fromGate.outputs[0].value : 0);
            logicCtx.strokeStyle = signal ? '#00ff88' : '#2f2f2f';
            logicCtx.setLineDash(signal ? [10, 6] : []);
            logicCtx.lineDashOffset = signal ? -logicPulseOffset : 0;

            logicCtx.beginPath();
            logicCtx.moveTo(startX, startY);
            logicCtx.bezierCurveTo(startX + 30, startY, endX - 30, endY, endX, endY);
            logicCtx.stroke();
        }
    }
    logicCtx.setLineDash([]);
    logicCtx.lineDashOffset = 0;

    // Draw Dragging Wire
    if (wiringStart) {
        const g = gates.find(g => g.id === wiringStart.gateId);
        let startX, startY;
        if (wiringStart.type === 'output') {
            startX = g.x + g.w;
            startY = g.y + g.h / 2;
        } else {
            startX = g.x;
            startY = g.y + (g.h * (wiringStart.pinIndex + 1)) / (g.inputs.length + 1);
        }

        logicCtx.strokeStyle = '#fff';
        logicCtx.beginPath();
        logicCtx.moveTo(startX, startY);
        logicCtx.lineTo(mouseX, mouseY);
        logicCtx.stroke();
    }

    // Draw Gates
    for (let g of gates) {
        if (g.id === primaryMonitorId) {
            logicCtx.save();
            logicCtx.strokeStyle = 'rgba(0, 255, 136, 0.9)';
            logicCtx.lineWidth = 2;
            logicCtx.shadowColor = 'rgba(0, 255, 136, 0.9)';
            logicCtx.shadowBlur = 18;
            logicCtx.beginPath();
            logicCtx.roundRect(g.x - 4, g.y - 4, g.w + 8, g.h + 8, 10);
            logicCtx.stroke();
            logicCtx.restore();
        }

        logicCtx.fillStyle = 'rgba(0,0,0,0.8)';
        logicCtx.strokeStyle = GATE_CONFIG[g.type].color;
        logicCtx.lineWidth = 2;

        if (g.type === 'SWITCH') {
            logicCtx.fillStyle = g.state ? '#ff9900' : '#333';
            if (g.state) {
                logicCtx.shadowColor = '#ffb347';
                logicCtx.shadowBlur = 14;
            }
        } else if (g.type === 'LIGHT') {
            logicCtx.fillStyle = g.state ? '#ffff00' : '#333';
            if (g.state) {
                logicCtx.shadowColor = '#ffff00';
                logicCtx.shadowBlur = 20;
            } else {
                logicCtx.shadowBlur = 0;
            }
        } else if (g.state) {
            logicCtx.shadowColor = GATE_CONFIG[g.type].color;
            logicCtx.shadowBlur = 12;
        }

        logicCtx.beginPath();
        logicCtx.roundRect(g.x, g.y, g.w, g.h, 8);
        logicCtx.fill();
        logicCtx.stroke();
        logicCtx.shadowBlur = 0;

        logicCtx.fillStyle = '#fff';
        const gateDisplay = GATE_CONFIG[g.type].display || g.type;
        const displayText = ((g.type === 'SWITCH' || g.type === 'LIGHT') && g.label) ? g.label : gateDisplay;
        const textSize = displayText.length > 4 ? 9 : (displayText.length > 3 ? 10 : 12);
        logicCtx.font = `bold ${textSize}px Outfit`;
        logicCtx.textAlign = 'center';
        logicCtx.textBaseline = 'middle';
        logicCtx.fillText(displayText, g.x + g.w / 2, g.y + g.h / 2);

        if (g.label && !['SWITCH', 'LIGHT'].includes(g.type)) {
            logicCtx.save();
            logicCtx.font = '600 10px Outfit';
            const labelText = g.label;
            const paddingX = 6;
            const rectH = 14;
            const textWidth = logicCtx.measureText(labelText).width;
            const rectW = textWidth + paddingX * 2;
            let labelX = g.x + g.w / 2 - rectW / 2;
            let labelY = g.y - rectH - 6;
            if (labelY < 6) {
                labelY = g.y + g.h + 6;
            }
            labelX = Math.max(4, Math.min(labelX, logicCanvas.width - rectW - 4));

            logicCtx.fillStyle = 'rgba(0,0,0,0.65)';
            logicCtx.strokeStyle = 'rgba(255,255,255,0.25)';
            logicCtx.lineWidth = 1;
            logicCtx.beginPath();
            logicCtx.roundRect(labelX, labelY, rectW, rectH, 6);
            logicCtx.fill();
            logicCtx.stroke();

            logicCtx.fillStyle = 'rgba(255,255,255,0.8)';
            logicCtx.textAlign = 'center';
            logicCtx.textBaseline = 'middle';
            logicCtx.fillText(labelText, labelX + rectW / 2, labelY + rectH / 2);
            logicCtx.restore();
        }

        // Pins
        logicCtx.fillStyle = '#fff';
        for (let i = 0; i < g.inputs.length; i++) {
            const py = g.y + (g.h * (i + 1)) / (g.inputs.length + 1);
            logicCtx.beginPath();
            logicCtx.arc(g.x, py, 4, 0, Math.PI * 2);
            logicCtx.fill();
        }
        if (g.type !== 'LIGHT') {
            const py = g.y + g.h / 2;
            logicCtx.beginPath();
            logicCtx.arc(g.x + g.w, py, 4, 0, Math.PI * 2);
            logicCtx.fill();
            if (['NOT', 'NAND', 'NOR'].includes(g.type)) {
                logicCtx.beginPath();
                logicCtx.arc(g.x + g.w + 4, py, 3, 0, Math.PI * 2);
                logicCtx.stroke();
            }
        }
    }
}

// Initial Call
setTimeout(resizeLogicCanvas, 500);
setTimeout(updateQuickGate, 500);
setTimeout(updateLogicStats, 500);
