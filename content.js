// Handling messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const message = request.message;
    switch (message) {
        case 'show':
            showMinimap()
            break;

        case 'refresh':
            refreshMinimap()
            break;

        case 'hide':
            hideMinimap()
            break;
        default:
            break;
    }
});


// App container
let appContainer = document.createElement('div');
appContainer.id = 'app-container';

// Options
let optionContainer = document.createElement('div');
optionContainer.id = 'option-container';
let refreshButton = document.createElement('button');
refreshButton.innerText = 'refresh';

optionContainer.appendChild(refreshButton);
appContainer.appendChild(optionContainer);

// Minimap
let viewBox, scrollBox;
let minimap = document.createElement('div');
minimap.id = 'minimap'
let mapContainer = document.createElement('div')
mapContainer.id = 'map-container'
mapContainer.inert = true;
let scrollDiv = document.createElement('div');
scrollDiv.id = 'scroll-div';

minimap.appendChild(mapContainer);
minimap.appendChild(scrollDiv);
appContainer.appendChild(minimap);
document.body.appendChild(appContainer);


// Functions
function getViewBox() {
    // cant directly target due to uniquely identified class names
    // so gotta hack it
    viewBox = document.querySelector('[data-testid^="conversation-turn-"]').parentNode
}

function getScrollBox() {
    // Used to retrieve information about scroll position
    scrollBox = viewBox.parentNode.parentNode;
}

function updateScrollDiv() {
    if (scrollBox) {
        scrollPos = (scrollBox.scrollTop / scrollBox.scrollHeight) * 0.1 * viewBox.scrollHeight ;
        scrollDiv.style.top = `${scrollPos}px`;

        let mapContainerScroll = scrollPos - (scrollPos * (minimap.offsetHeight - (scrollDiv.offsetHeight * 0.09)) / (0.1 * viewBox.scrollHeight));
        minimap.scrollTo(0, mapContainerScroll);
    }
}

function showMinimap() {
    minimap.style.display = 'initial'
}

function hideMinimap() {
    minimap.style.display = 'none'
}

function refreshMinimap() {
    getViewBox()
    getScrollBox();
    mapContainer.innerHTML = viewBox.outerHTML;
    updateScrollDiv();
    if (scrollBox) {
        scrollBox.addEventListener('scroll', updateScrollDiv);
    }
};


// Scroll Div logic 
let mousedown = false;
window.addEventListener('mouseup', () => mousedown = false)
scrollDiv.addEventListener('mousedown', (e) => {
    mousedown = true
    handleScrollDivMove(e.clientY)
})
minimap.addEventListener('mousemove', (e) => {
    if (mousedown) {
        handleScrollDivMove(e.clientY)
    }
})
minimap.addEventListener('click', (e) => handleScrollDivMove(e.clientY))

function handleScrollDivMove(mousePos) {
    const y = mousePos - minimap.getBoundingClientRect().top + minimap.scrollTop - 50;
    if (scrollBox) {
        const scrollPos = scrollBox.scrollHeight * y / minimap.scrollHeight
        scrollBox.scrollTo(0, scrollPos)
    }
}