const app = {
    currentView: 'home',

    init: function () {
        console.log("Engineer's Visual Sandbox Initialized");
        this.showHome();
    },

    showHome: function () {
        this.hideAllViews();
        document.getElementById('home-view').classList.remove('hidden');
        document.getElementById('home-view').style.display = 'block';
    },

    loadTool: function (toolName) {
        this.hideAllViews();
        const viewId = `${toolName}-view`;
        const viewElement = document.getElementById(viewId);

        if (viewElement) {
            viewElement.classList.add('active');
            viewElement.style.display = 'block';

            // Initialize specific tool logic if needed
            if (toolName === 'dsp' && typeof dspModule !== 'undefined') dspModule.init();
            if (toolName === 'subnet' && typeof subnetModule !== 'undefined') subnetModule.init();
            if (toolName === 'filter' && typeof filterModule !== 'undefined') filterModule.init();
        } else {
            console.error(`View for ${toolName} not found.`);
        }
    },

    hideAllViews: function () {
        const views = document.querySelectorAll('.tool-view');
        views.forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });
        document.getElementById('home-view').style.display = 'none';
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Placeholder Modules (to be implemented)
// Modules are now loaded from external files (dsp.js, subnet.js, filter.js)
