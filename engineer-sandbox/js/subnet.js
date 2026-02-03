const subnetModule = {
    isInitialized: false,

    init: function () {
        if (this.isInitialized) return;

        const container = document.getElementById('subnet-container');

        container.innerHTML = `
            <div class="tool-controls">
                <div class="input-group">
                    <label>IP Address / CIDR</label>
                    <input type="text" id="subnet-input" placeholder="e.g. 192.168.1.1/24" value="192.168.1.1/24">
                </div>
                <div class="input-group">
                    <label>Quick Presets</label>
                    <div class="preset-row">
                        <button class="btn-secondary preset-btn" data-cidr="24">/24</button>
                        <button class="btn-secondary preset-btn" data-cidr="26">/26</button>
                        <button class="btn-secondary preset-btn" data-cidr="28">/28</button>
                        <button class="btn-secondary preset-btn" data-cidr="30">/30</button>
                    </div>
                </div>
                <button id="btn-calc-subnet" class="btn-launch">Calculate</button>
            </div>
            
            <div id="subnet-results" class="results-panel hidden">
                <div class="result-card">
                    <h4>Network Address</h4>
                    <span id="res-network">...</span>
                </div>
                <div class="result-card">
                    <h4>Broadcast Address</h4>
                    <span id="res-broadcast">...</span>
                </div>
                <div class="result-card">
                    <h4>Subnet Mask</h4>
                    <span id="res-mask">...</span>
                </div>
                <div class="result-card">
                    <h4>Wildcard Mask</h4>
                    <span id="res-wildcard">...</span>
                </div>
                <div class="result-card">
                    <h4>Usable Hosts</h4>
                    <span id="res-hosts">...</span>
                </div>
                <div class="result-card">
                    <h4>Total Addresses</h4>
                    <span id="res-total">...</span>
                </div>
                <div class="result-card">
                    <h4>Host Range</h4>
                    <span id="res-range">...</span>
                </div>
                <div class="result-card">
                    <h4>Network Class</h4>
                    <span id="res-class">...</span>
                </div>
                <div class="result-card">
                    <h4>Binary View</h4>
                    <span id="res-binary">...</span>
                </div>
            </div>
        `;

        document.getElementById('btn-calc-subnet').addEventListener('click', () => this.calculate());
        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('subnet-input');
                const cidr = btn.getAttribute('data-cidr');
                const base = input.value.split('/')[0] || '192.168.1.1';
                input.value = `${base}/${cidr}`;
                this.calculate();
            });
        });

        this.isInitialized = true;
    },

    calculate: function () {
        const input = document.getElementById('subnet-input').value.trim();
        const resultsPanel = document.getElementById('subnet-results');

        try {
            const [ip, cidrStr] = input.split('/');
            const cidr = parseInt(cidrStr, 10);

            if (!this.validateIP(ip) || isNaN(cidr) || cidr < 0 || cidr > 32) {
                alert("Invalid IP or CIDR format");
                return;
            }

            const ipNum = this.ipToLong(ip);
            const maskNum = -1 << (32 - cidr);
            const networkNum = ipNum & maskNum;
            const broadcastNum = networkNum | ~maskNum;
            const totalAddresses = Math.pow(2, 32 - cidr);
            const usableHosts = totalAddresses - 2;

            const firstHost = networkNum + 1;
            const lastHost = broadcastNum - 1;
            const wildcardNum = (~maskNum) >>> 0;

            document.getElementById('res-network').textContent = this.longToIp(networkNum);
            document.getElementById('res-broadcast').textContent = this.longToIp(broadcastNum);
            document.getElementById('res-mask').textContent = this.longToIp(maskNum);
            document.getElementById('res-wildcard').textContent = this.longToIp(wildcardNum);
            document.getElementById('res-hosts').textContent = usableHosts > 0 ? usableHosts : 0;
            document.getElementById('res-total').textContent = totalAddresses;
            document.getElementById('res-range').textContent = `${this.longToIp(firstHost)} - ${this.longToIp(lastHost)}`;
            document.getElementById('res-class').textContent = this.getNetworkClass(ip);
            document.getElementById('res-binary').innerHTML = `
                <div class="binary-line">IP: ${this.ipToBinary(ip)}</div>
                <div class="binary-line">Mask: ${this.ipToBinary(this.longToIp(maskNum))}</div>
            `;

            resultsPanel.classList.remove('hidden');
            resultsPanel.style.display = 'grid'; // Ensure grid layout is applied

        } catch (e) {
            console.error(e);
            alert("Error calculating subnet. Please check your input.");
        }
    },

    validateIP: function (ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        return parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    },

    ipToLong: function (ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    },

    longToIp: function (long) {
        return [
            (long >>> 24) & 0xFF,
            (long >>> 16) & 0xFF,
            (long >>> 8) & 0xFF,
            long & 0xFF
        ].join('.');
    },

    getNetworkClass: function (ip) {
        const firstOctet = parseInt(ip.split('.')[0], 10);
        if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
        if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
        if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
        if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
        return 'Class E (Experimental)';
    },

    ipToBinary: function (ip) {
        return ip
            .split('.')
            .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
            .join('.');
    }
};
