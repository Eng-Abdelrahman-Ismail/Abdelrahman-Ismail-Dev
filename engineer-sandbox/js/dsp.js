const dspModule = {
    audioContext: null,
    analyser: null,
    source: null,
    animationId: null,
    canvas: null,
    ctx: null,
    freqData: null,
    timeData: null,
    isInitialized: false,
    currentBuffer: null,
    mode: 'spectrum',
    fftSize: 256,
    smoothing: 0.7,
    toneOscillator: null,
    toneGain: null,
    toneFrequency: 440,
    toneWave: 'sine',
    toneActive: false,

    init: function () {
        if (this.isInitialized) return;

        const container = document.getElementById('dsp-container');

        // Inject UI
        container.innerHTML = `
            <div class="dsp-controls">
                <div class="file-upload-wrapper">
                    <label for="audio-upload" class="custom-file-upload">
                        <i class="fa-solid fa-cloud-upload-alt"></i> Upload Audio File
                    </label>
                    <input type="file" id="audio-upload" accept="audio/*">
                    <span id="file-name">No file chosen</span>
                </div>
                <div class="playback-controls">
                    <button id="btn-play" class="control-btn" disabled><i class="fa-solid fa-play"></i></button>
                    <button id="btn-pause" class="control-btn" disabled><i class="fa-solid fa-pause"></i></button>
                    <button id="btn-stop" class="control-btn" disabled><i class="fa-solid fa-stop"></i></button>
                </div>
                <div class="input-group">
                    <label>View Mode</label>
                    <select id="dsp-mode">
                        <option value="spectrum">Spectrum</option>
                        <option value="waveform">Waveform</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>FFT Size</label>
                    <select id="dsp-fft">
                        <option value="128">128</option>
                        <option value="256" selected>256</option>
                        <option value="512">512</option>
                        <option value="1024">1024</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Tone Generator</label>
                    <div class="preset-row">
                        <select id="tone-wave">
                            <option value="sine">Sine</option>
                            <option value="triangle">Triangle</option>
                            <option value="square">Square</option>
                            <option value="sawtooth">Saw</option>
                        </select>
                        <button id="tone-toggle" class="btn-secondary">Start Tone</button>
                    </div>
                </div>
                <div class="input-group">
                    <label>Frequency (Hz)</label>
                    <input type="range" id="tone-frequency" min="20" max="2000" step="5" value="440">
                    <span class="range-value" id="tone-frequency-value">440</span>
                </div>
                <div class="input-group">
                    <label>Smoothing</label>
                    <input type="range" id="dsp-smoothing" min="0" max="0.9" step="0.1" value="0.7">
                    <span class="range-value" id="dsp-smoothing-value">0.7</span>
                </div>
                <div class="input-group">
                    <label>Snapshot</label>
                    <button id="btn-snapshot" class="btn-secondary">Export PNG</button>
                </div>
                <div class="dsp-info">
                    <span id="dsp-status">Ready</span>
                </div>
            </div>
            
            <div class="canvas-wrapper">
                <canvas id="dsp-canvas"></canvas>
            </div>
        `;

        // Setup References
        this.canvas = document.getElementById('dsp-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        // Event Listeners
        window.addEventListener('resize', () => this.resizeCanvas());

        const fileInput = document.getElementById('audio-upload');
        const fileNameDisplay = document.getElementById('file-name');
        const modeSelect = document.getElementById('dsp-mode');
        const fftSelect = document.getElementById('dsp-fft');
        const smoothingSlider = document.getElementById('dsp-smoothing');
        const smoothingValue = document.getElementById('dsp-smoothing-value');
        const toneWave = document.getElementById('tone-wave');
        const toneToggle = document.getElementById('tone-toggle');
        const toneFrequency = document.getElementById('tone-frequency');
        const toneFrequencyValue = document.getElementById('tone-frequency-value');
        const snapshotBtn = document.getElementById('btn-snapshot');

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                fileNameDisplay.textContent = file.name;
                this.loadAudioFile(file);
            }
        });

        document.getElementById('btn-play').addEventListener('click', () => this.resumeAudio());
        document.getElementById('btn-pause').addEventListener('click', () => this.pauseAudio());
        document.getElementById('btn-stop').addEventListener('click', () => this.stopAudio());

        modeSelect.addEventListener('change', (e) => {
            this.mode = e.target.value;
        });

        fftSelect.addEventListener('change', (e) => {
            this.fftSize = parseInt(e.target.value, 10);
            if (this.analyser) {
                this.analyser.fftSize = this.fftSize;
                this.updateAnalyserBuffers();
            }
        });

        smoothingSlider.addEventListener('input', (e) => {
            this.smoothing = parseFloat(e.target.value);
            smoothingValue.textContent = e.target.value;
            if (this.analyser) {
                this.analyser.smoothingTimeConstant = this.smoothing;
            }
        });

        toneWave.addEventListener('change', (e) => {
            this.toneWave = e.target.value;
            if (this.toneOscillator) {
                this.toneOscillator.type = this.toneWave;
            }
        });

        toneFrequency.addEventListener('input', (e) => {
            this.toneFrequency = parseFloat(e.target.value);
            toneFrequencyValue.textContent = e.target.value;
            if (this.toneOscillator) {
                this.toneOscillator.frequency.setValueAtTime(this.toneFrequency, this.audioContext.currentTime);
            }
        });

        toneToggle.addEventListener('click', () => {
            if (this.toneActive) {
                this.stopTone();
                toneToggle.textContent = 'Start Tone';
                toneToggle.classList.remove('is-active');
            } else {
                this.startTone();
                toneToggle.textContent = 'Stop Tone';
                toneToggle.classList.add('is-active');
            }
        });

        snapshotBtn.addEventListener('click', () => this.exportSnapshot());

        this.isInitialized = true;
    },

    resizeCanvas: function () {
        if (this.canvas) {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = 400; // Fixed height for visualization
        }
    },

    loadAudioFile: function (file) {
        document.getElementById('dsp-status').textContent = "Loading & Decoding...";

        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            this.setupAudioContext(arrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    },

    setupAudioContext: async function (arrayBuffer) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        try {
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.currentBuffer = audioBuffer;
            this.stopTone();
            this.setupSource(audioBuffer);
            document.getElementById('dsp-status').textContent = "Ready to Play";
            this.enableControls(true);
        } catch (error) {
            console.error(error);
            document.getElementById('dsp-status').textContent = "Error decoding audio";
        }
    },

    setupSource: function (audioBuffer) {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
        }

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = this.fftSize;
        this.analyser.smoothingTimeConstant = this.smoothing;
        this.updateAnalyserBuffers();

        // We prepare the buffer logic but don't start until "Play" is clicked 
        // OR we can auto-play. Let's auto-play for UX.
        this.playBuffer(audioBuffer);
    },

    playBuffer: function (buffer) {
        if (this.source) this.source.stop();

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.source.start(0);
        this.visualize();

        document.getElementById('dsp-status').textContent = "Playing";
    },

    resumeAudio: function () {
        if (!this.audioContext || !this.currentBuffer) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
            document.getElementById('dsp-status').textContent = "Playing";
            return;
        }
        if (!this.source) {
            this.playBuffer(this.currentBuffer);
        }
    },

    pauseAudio: function () {
        if (this.audioContext.state === 'running') {
            this.audioContext.suspend();
            document.getElementById('dsp-status').textContent = "Paused";
        }
    },

    stopAudio: function () {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }
        cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.getElementById('dsp-status').textContent = "Stopped";
    },

    startTone: function () {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (!this.analyser) {
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothing;
            this.updateAnalyserBuffers();
        }

        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }

        this.toneOscillator = this.audioContext.createOscillator();
        this.toneGain = this.audioContext.createGain();
        this.toneOscillator.type = this.toneWave;
        this.toneOscillator.frequency.setValueAtTime(this.toneFrequency, this.audioContext.currentTime);
        this.toneGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);

        this.toneOscillator.connect(this.toneGain);
        this.toneGain.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.toneOscillator.start();
        this.toneActive = true;
        document.getElementById('dsp-status').textContent = "Tone Generator Active";
        this.visualize();
    },

    stopTone: function () {
        if (this.toneOscillator) {
            this.toneOscillator.stop();
            this.toneOscillator.disconnect();
            this.toneOscillator = null;
        }
        if (this.toneGain) {
            this.toneGain.disconnect();
            this.toneGain = null;
        }
        this.toneActive = false;
    },

    enableControls: function (enabled) {
        document.getElementById('btn-play').disabled = !enabled;
        document.getElementById('btn-pause').disabled = !enabled;
        document.getElementById('btn-stop').disabled = !enabled;
    },

    updateAnalyserBuffers: function () {
        if (!this.analyser) return;
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeData = new Uint8Array(this.analyser.fftSize);
    },

    exportSnapshot: function () {
        if (!this.canvas) return;
        const link = document.createElement('a');
        link.download = 'dsp-snapshot.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    },

    visualize: function () {
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);

            const width = this.canvas.width;
            const height = this.canvas.height;

            this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-dark');
            this.ctx.fillRect(0, 0, width, height); // Clear screen

            if (this.mode === 'waveform') {
                this.analyser.getByteTimeDomainData(this.timeData);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#00f2ff';
                this.ctx.beginPath();

                const sliceWidth = width / this.timeData.length;
                let x = 0;

                for (let i = 0; i < this.timeData.length; i++) {
                    const v = this.timeData[i] / 128.0;
                    const y = (v * height) / 2;

                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                this.ctx.lineTo(width, height / 2);
                this.ctx.stroke();
            } else {
                this.analyser.getByteFrequencyData(this.freqData);
                const barWidth = (width / this.freqData.length) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < this.freqData.length; i++) {
                    barHeight = this.freqData[i] / 255 * height;

                    const gradient = this.ctx.createLinearGradient(0, height, 0, height - barHeight);
                    gradient.addColorStop(0, '#7000ff');
                    gradient.addColorStop(1, '#00f2ff');

                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.roundRect(x, height - barHeight, barWidth, barHeight, [5, 5, 0, 0]);
                    this.ctx.fill();

                    x += barWidth + 1;
                }
            }
        };

        draw();
    }
};
