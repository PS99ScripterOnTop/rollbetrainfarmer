function start() {
    'use strict';

    const config = {
        buttonSelector: 'button.octagonal.before.after.hoverable.e593a4bf',
        checkInterval: 1,
        clickInterval: 1,
        debugMode: false,
        autoStart: true
    };

    let isRunning = false;
    let checkTimer = null;
    let clickTimer = null;
    let clickCount = 0;

    const log = (message) => {
        if (config.debugMode) {
            console.log(`🎮 RollBet Clicker: ${message}`);
        }
    };

    const checkForButton = () => {
        if (!isRunning) return;

        log(`Checking for button: ${config.buttonSelector}`);
        const button = document.querySelector(config.buttonSelector);

        if (button) {
            log('Button found! Clicking now...');
            button.click();
            clickCount++;
            log(`Button clicked! Total clicks: ${clickCount}`);

            log(`Waiting ${config.clickInterval} seconds before next click attempt...`);
            clickTimer = setTimeout(checkForButton, config.clickInterval * 1000);
        } else {
            log(`Button not found, checking again in ${config.checkInterval} seconds...`);
            checkTimer = setTimeout(checkForButton, config.checkInterval * 1000);
        }
    };

    const startAutomation = () => {
        if (isRunning) return;

        isRunning = true;
        log('Starting automation...');
        showStatus(true);
        checkForButton();
    };

    const stopAutomation = () => {
        isRunning = false;
        log('Stopping automation...');
        showStatus(false);

        if (checkTimer) {
            clearTimeout(checkTimer);
            checkTimer = null;
        }

        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
        }
    };

    const createUI = () => {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'roll-auto-control';
        controlPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(58, 28, 89, 0.9);
            border-radius: 8px;
            padding: 10px;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
            min-width: 180px;
            cursor: move;
        `;

        const title = document.createElement('div');
        title.textContent = 'RollBet Auto-Clicker';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;
            font-size: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 5px;
        `;

        const statusDiv = document.createElement('div');
        statusDiv.id = 'roll-auto-status';
        statusDiv.style.cssText = `
            margin: 8px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
        `;
        statusDiv.innerHTML = `
            <span>Status:</span>
            <div style="display: flex; align-items: center;">
                <span id="roll-status-text">Inactive</span>
                <span id="roll-status-dot" style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #ff5555;
                    margin-left: 5px;
                "></span>
            </div>
        `;

        const countDiv = document.createElement('div');
        countDiv.id = 'roll-click-count';
        countDiv.style.cssText = `
            margin: 8px 0;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
        `;
        countDiv.innerHTML = `
            <span>Clicks:</span>
            <span id="roll-count-value">0</span>
        `;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'roll-toggle-button';
        toggleButton.textContent = 'Start';
        toggleButton.style.cssText = `
            width: 100%;
            padding: 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 5px;
            transition: background-color 0.3s;
        `;
        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = isRunning ? '#c0392b' : '#45a049';
        });
        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = isRunning ? '#e74c3c' : '#4CAF50';
        });

        toggleButton.addEventListener('click', () => {
            if (isRunning) {
                stopAutomation();
                toggleButton.textContent = 'Start';
                toggleButton.style.backgroundColor = '#4CAF50';
            } else {
                startAutomation();
                toggleButton.textContent = 'Stop';
                toggleButton.style.backgroundColor = '#e74c3c';
            }
        });

        const minimizeButton = document.createElement('button');
        minimizeButton.id = 'roll-minimize';
        minimizeButton.innerHTML = '−';
        minimizeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 14px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        let minimized = false;
        minimizeButton.addEventListener('click', () => {
            if (minimized) {
                title.style.display = 'block';
                statusDiv.style.display = 'flex';
                countDiv.style.display = 'flex';
                toggleButton.style.display = 'block';
                minimizeButton.innerHTML = '−';
                controlPanel.style.height = 'auto';
                controlPanel.style.width = '180px';
            } else {
                title.style.display = 'none';
                statusDiv.style.display = 'none';
                countDiv.style.display = 'none';
                toggleButton.style.display = 'none';
                minimizeButton.innerHTML = '+';
                controlPanel.style.height = '30px';
                controlPanel.style.width = '30px';
            }
            minimized = !minimized;
        });

        controlPanel.appendChild(title);
        controlPanel.appendChild(statusDiv);
        controlPanel.appendChild(countDiv);
        controlPanel.appendChild(toggleButton);
        controlPanel.appendChild(minimizeButton);
        document.body.appendChild(controlPanel);

        // === Dragging functionality ===
        function makeDraggable(element) {
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            element.addEventListener('mousedown', function (e) {
                isDragging = true;
                offsetX = e.clientX - controlPanel.getBoundingClientRect().left;
                offsetY = e.clientY - controlPanel.getBoundingClientRect().top;
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', stop);
            });

            function move(e) {
                if (isDragging) {
                    controlPanel.style.left = (e.clientX - offsetX) + 'px';
                    controlPanel.style.top = (e.clientY - offsetY) + 'px';
                    controlPanel.style.right = 'auto';
                    controlPanel.style.bottom = 'auto';
                }
            }

            function stop() {
                isDragging = false;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', stop);
            }
        }

        makeDraggable(controlPanel); // << actual call

        return {
            updateStatus: (running) => {
                const statusText = document.getElementById('roll-status-text');
                const statusDot = document.getElementById('roll-status-dot');
                const toggleBtn = document.getElementById('roll-toggle-button');

                if (running) {
                    statusText.textContent = 'Active';
                    statusDot.style.backgroundColor = '#4CAF50';
                    toggleBtn.textContent = 'Stop';
                    toggleBtn.style.backgroundColor = '#e74c3c';
                } else {
                    statusText.textContent = 'Inactive';
                    statusDot.style.backgroundColor = '#ff5555';
                    toggleBtn.textContent = 'Start';
                    toggleBtn.style.backgroundColor = '#4CAF50';
                }
            },
            updateClickCount: (count) => {
                const countValue = document.getElementById('roll-count-value');
                if (countValue) {
                    countValue.textContent = count;
                }
            }
        };
    };

    const ui = createUI();

    const showStatus = (running) => {
        ui.updateStatus(running);
        ui.updateClickCount(clickCount);
    };

    setInterval(() => {
        ui.updateClickCount(clickCount);
    }, 1000);

    if (config.autoStart) {
        setTimeout(() => {
            startAutomation();
        }, 3000);
    }

    window.rollBetClicker = {
        start: startAutomation,
        stop: stopAutomation,
        setInterval: (seconds) => {
            config.clickInterval = seconds;
            log(`Click interval set to ${seconds} seconds`);
        },
        setCheckInterval: (seconds) => {
            config.checkInterval = seconds;
            log(`Check interval set to ${seconds} seconds`);
        }
    };

    log('RollBet Auto-Clicker ready!');
}
