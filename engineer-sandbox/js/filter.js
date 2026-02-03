const filterModule = {
    isInitialized: false,
    ctx: null,
    canvas: null,
    coeffs: { b0: 0, b1: 0, b2: 0, a1: 0, a2: 0 },
    sampleRate: 44100,

    init: function () {
        if (this.isInitialized) return;

        const container = document.getElementById('filter-container');

        container.innerHTML = `
            <div class="tool-controls">
                <h3>Filter Specifications</h3>
                <div class="input-grid">
                    <div class="input-group">
                        <label>Filter Type</label>
                        <select id="filter-type">
                            <option value="lowpass">Low Pass</option>
                            <option value="highpass">High Pass</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Cutoff Freq (Hz)</label>
                        <input type="range" id="cutoff-slider" min="20" max="20000" step="10" value="1000">
                        <input type="number" id="cutoff-freq" value="1000" min="20" max="20000">
                    </div>
                    <div class="input-group">
                        <label>Sample Rate (Hz)</label>
                        <input type="number" id="sample-rate" value="44100" min="8000" max="192000" step="100">
                    </div>
                    <div class="input-group">
                        <label>Q Factor</label>
                        <input type="number" id="filter-q" value="0.707" step="0.1" min="0.1" max="10">
                    </div>
                </div>
                <div class="actions">
                    <button id="btn-plot" class="btn-launch">Update Plot</button>
                    <button id="btn-export" class="btn-secondary">Export C++</button>
                    <button id="btn-export-py" class="btn-secondary">Export Python</button>
                    <button id="btn-reset" class="btn-secondary">Reset</button>
                </div>
            </div>
            
            <div class="canvas-wrapper">
                <canvas id="filter-canvas" height="300"></canvas>
            </div>
            
            <div id="coeff-display" class="coeff-display">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div id="coeff-values">
                        <!-- Coefficients will appear here -->
                    </div>
                    <button id="btn-info" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 1.2rem;" title="What are these?">
                        <i class="fa-solid fa-circle-question"></i>
                    </button>
                </div>
                
                <div id="coeff-info" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; color: var(--text-muted);">
                    <p><strong style="color: var(--primary)">What are these?</strong></p>
                    <p>These are the <strong>Digital Filter Coefficients</strong> used to process audio.</p>
                    <ul style="margin-left: 1.2rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
                        <li><strong style="color: #fff">b (Feedforward):</strong> Controls how the <em>input</em> signal (x) is mixed.</li>
                        <li><strong style="color: #fff">a (Feedback):</strong> Controls how previous <em>outputs</em> (y) affect the current output (Resonance).</li>
                    </ul>
                    <p><strong>The Math:</strong><br>
                    <code>y[n] = (b0*x[n] + b1*x[n-1] + b2*x[n-2]) - (a1*y[n-1] + a2*y[n-2])</code></p>
                </div>
            </div>
        `;

        document.getElementById('filter-container').addEventListener('click', (e) => {
            if (e.target.closest('#btn-info')) {
                const info = document.getElementById('coeff-info');
                info.style.display = info.style.display === 'none' ? 'block' : 'none';
            }
        });

        this.canvas = document.getElementById('filter-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Sync Slider and Number input
        const slider = document.getElementById('cutoff-slider');
        const number = document.getElementById('cutoff-freq');

        slider.addEventListener('input', () => {
            number.value = slider.value;
            this.update();
        });
        number.addEventListener('input', () => {
            slider.value = number.value;
            this.update();
        });

        document.getElementById('filter-type').addEventListener('change', () => this.update());
        document.getElementById('filter-q').addEventListener('change', () => this.update());
        document.getElementById('sample-rate').addEventListener('input', () => this.update());

        document.getElementById('btn-plot').addEventListener('click', () => this.update());
        document.getElementById('btn-export').addEventListener('click', () => this.exportCPP());
        document.getElementById('btn-export-py').addEventListener('click', () => this.exportPython());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetDefaults());

        window.addEventListener('resize', () => this.resizeCanvas());

        this.isInitialized = true;

        // Initial Draw
        setTimeout(() => {
            this.resizeCanvas();
            this.update();
        }, 100);
    },

    resizeCanvas: function () {
        if (this.canvas) {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.update();
        }
    },

    update: function () {
        const type = document.getElementById('filter-type').value;
        const freq = parseFloat(document.getElementById('cutoff-freq').value);
        const q = parseFloat(document.getElementById('filter-q').value);
        const sampleRate = parseFloat(document.getElementById('sample-rate').value) || 44100;

        this.sampleRate = sampleRate;
        this.calculateCoefficients(type, freq, sampleRate, q);
        this.drawBodePlot();
        this.displayCoefficients();
    },

    calculateCoefficients: function (type, f0, Fs, Q) {
        // Standard Audio EQ Cookbook Biquad Formulas
        const w0 = 2 * Math.PI * f0 / Fs;
        const alpha = Math.sin(w0) / (2 * Q);
        const cosw0 = Math.cos(w0);

        let b0, b1, b2, a0, a1, a2;

        if (type === 'lowpass') {
            b0 = (1 - cosw0) / 2;
            b1 = 1 - cosw0;
            b2 = (1 - cosw0) / 2;
            a0 = 1 + alpha;
            a1 = -2 * cosw0;
            a2 = 1 - alpha;
        } else { // highpass
            b0 = (1 + cosw0) / 2;
            b1 = -(1 + cosw0);
            b2 = (1 + cosw0) / 2;
            a0 = 1 + alpha;
            a1 = -2 * cosw0;
            a2 = 1 - alpha;
        }

        // Normalize by a0
        this.coeffs = {
            b0: b0 / a0,
            b1: b1 / a0,
            b2: b2 / a0,
            a1: a1 / a0,
            a2: a2 / a0
        };
    },

    drawBodePlot: function () {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;

        // Clear
        ctx.fillStyle = "#1a1a2e"; // Dark bg matching theme
        ctx.fillRect(0, 0, width, height);

        // Grid & Axis
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Horizontal dB lines (-60 to +20)
        // Map 20dB -> 0px, -100dB -> height
        const mapY = (db) => {
            const range = 80; // +20 to -60
            const max = 20;
            return ((max - db) / range) * height;
        };

        for (let db = 20; db >= -60; db -= 20) {
            const y = mapY(db);
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.fillStyle = "#aaa";
            ctx.fillText(db + "dB", 5, y - 2);
        }
        ctx.stroke();

        // Bode Calculation
        ctx.beginPath();
        ctx.strokeStyle = "#00f2ff"; // Cyan primary
        ctx.lineWidth = 3;

        const { b0, b1, b2, a1, a2 } = this.coeffs;

        for (let x = 0; x < width; x++) {
            // Logarithmic Frequency Mapping
            // x=0 -> 20Hz, x=width -> 20000Hz
            const minLog = Math.log10(20);
            const maxLog = Math.log10(20000);
            const freq = Math.pow(10, minLog + (x / width) * (maxLog - minLog));

            // Evaluate Transfer Function H(z) at z = e^(jw)
            const w = 2 * Math.PI * freq / this.sampleRate;
            const cosw = Math.cos(w);
            const sinw = Math.sin(w);
            const cos2w = Math.cos(2 * w);
            const sin2w = Math.sin(2 * w);

            // Numerator (Real, Imag)
            const numR = b0 + b1 * cosw + b2 * cos2w;
            const numI = -b1 * sinw - b2 * sin2w;

            // Denominator (Real, Imag)
            const denR = 1.0 + a1 * cosw + a2 * cos2w;
            const denI = -a1 * sinw - a2 * sin2w;

            // Magnitude
            const magSq = (numR * numR + numI * numI) / (denR * denR + denI * denI);
            const db = 10 * Math.log10(magSq);

            const y = mapY(db);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    },

    displayCoefficients: function () {
        const c = this.coeffs;
        const fmt = (n) => n.toFixed(6);
        const el = document.getElementById('coeff-values');
        if (el) {
            el.innerHTML =
                `<strong>Coefficients:</strong><br>
                b0 = ${fmt(c.b0)}, b1 = ${fmt(c.b1)}, b2 = ${fmt(c.b2)}<br>
                a1 = ${fmt(c.a1)}, a2 = ${fmt(c.a2)}`;
        }
    },

    exportCPP: function () {
        const c = this.coeffs;
        const code = `
// C++ Biquad Filter Implementation
// Created with The Engineer's Visual Sandbox

class BiquadFilter {
private:
    float b0 = ${c.b0};
    float b1 = ${c.b1};
    float b2 = ${c.b2};
    float a1 = ${c.a1};
    float a2 = ${c.a2};
    float z1 = 0, z2 = 0;

public:
    float process(float input) {
        float out = input * b0 + z1;
        z1 = input * b1 + z2 - out * a1;
        z2 = input * b2 - out * a2;
        return out;
    }
};
`;
        // Trigger Download
        const blob = new Blob([code], { type: 'text/plain' });
        const start = document.createElement('a');
        start.href = URL.createObjectURL(blob);
        start.download = 'filter_gen.cpp';
        start.click();
    },

    exportPython: function () {
        const c = this.coeffs;
        const code = `
# Python Biquad Filter Implementation
# Created with The Engineer's Visual Sandbox

class BiquadFilter:
    def __init__(self):
        self.b0 = ${c.b0}
        self.b1 = ${c.b1}
        self.b2 = ${c.b2}
        self.a1 = ${c.a1}
        self.a2 = ${c.a2}
        self.z1 = 0.0
        self.z2 = 0.0

    def process(self, x):
        y = x * self.b0 + self.z1
        self.z1 = x * self.b1 + self.z2 - y * self.a1
        self.z2 = x * self.b2 - y * self.a2
        return y
`;
        const blob = new Blob([code], { type: 'text/plain' });
        const start = document.createElement('a');
        start.href = URL.createObjectURL(blob);
        start.download = 'filter_gen.py';
        start.click();
    },

    resetDefaults: function () {
        document.getElementById('filter-type').value = 'lowpass';
        document.getElementById('cutoff-slider').value = 1000;
        document.getElementById('cutoff-freq').value = 1000;
        document.getElementById('sample-rate').value = 44100;
        document.getElementById('filter-q').value = 0.707;
        this.update();
    }
};
