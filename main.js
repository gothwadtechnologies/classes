// main.js

const appRoot = document.getElementById('app-root');

// --- ROUTER FUNCTION (Screen Switcher) ---
async function navigateTo(screenName) {
    try {
        // 1. Screen ki HTML file fetch karo
        const response = await fetch(`./screens/${screenName}.html`);
        
        if (!response.ok) {
            throw new Error(`Screen ${screenName} not found!`);
        }
        
        const html = await response.text();
        
        // 2. Smooth Transition (Blink prevent karne ke liye animation reset)
        appRoot.classList.remove('screen-fade-in');
        void appRoot.offsetWidth; // Trigger reflow
        
        // 3. HTML inject karo
        appRoot.innerHTML = html;
        appRoot.classList.add('screen-fade-in');

        // 4. Injected HTML ke andar ki JS ko run karo
        executeScripts(appRoot);

    } catch (error) {
        console.error("Navigation Error:", error);
        appRoot.innerHTML = `<h2 style="color:red; text-align:center; margin-top:50px;">Error Loading Screen</h2>`;
    }
}

// --- SCRIPT EXECUTOR (Very Important) ---
// innerHTML se aayi hui JS apne aap run nahi hoti, isliye ye function zaruri hai
function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Purane script ke saare attributes (src, type etc) copy karo
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Script ka code copy karo
        newScript.textContent = oldScript.textContent;
        
        // Purane script ko naye se replace karke browser ko force karo JS run karne ke liye
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// --- APP INITIALIZATION ---
function initApp() {
    // Abhi ke liye seedha Splash Screen load karte hain.
    // Baad me yaha Firebase Auth state check karenge (Login hai ya nahi).
    navigateTo('splash');
}

// Jab page load ho jaye toh App start karo
window.addEventListener('DOMContentLoaded', initApp);

// navigateTo function ko global bana do taaki har screen isko call kar sake
window.navigateTo = navigateTo;
