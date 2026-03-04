// main.js
import { auth, db } from './server/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const appRoot = document.getElementById('app-root');

// --- ROUTER FUNCTION (Screen Switcher) ---
async function navigateTo(screenName) {
    try {
        const response = await fetch(`./screens/${screenName}.html`);
        if (!response.ok) throw new Error(`Screen ${screenName} not found!`);
        
        const html = await response.text();
        
        appRoot.classList.remove('screen-fade-in');
        void appRoot.offsetWidth; // Trigger reflow
        
        appRoot.innerHTML = html;
        appRoot.classList.add('screen-fade-in');

        executeScripts(appRoot);
    } catch (error) {
        console.error("Navigation Error:", error);
        appRoot.innerHTML = `<h2 style="text-align:center; margin-top:50px;">Error Loading Screen</h2>`;
    }
}

// --- SCRIPT EXECUTOR ---
function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = oldScript.textContent;
        // Agar module type script hai toh use waisa hi rehne do
        if(oldScript.type === 'module') newScript.type = 'module';
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

// --- FIREBASE AUTH STATE CHECKER (Smart Routing) ---
function initApp() {
    // Jab tak Firebase auth status check kar raha hai, ek chota loading text dikha do
    appRoot.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; height:100vh; font-size:1.2rem; color:#6200EE; font-weight:bold;">Checking Auth...</div>`;

    // Ye continuously dekhega ki user login hua ya logout
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User Logged In:", user.uid);
            // User logged in hai -> Ab uska role check karo (Admin ya Student)
            try {
                const userRef = ref(db, 'users/' + user.uid);
                const snapshot = await get(userRef);
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.role === 'admin') {
                        navigateTo('adminhome');
                    } else {
                        navigateTo('userhome');
                    }
                } else {
                    // Agar DB me role nahi mila, by default userhome bhej do
                    navigateTo('userhome');
                }
            } catch (error) {
                console.error("Error fetching role:", error);
                navigateTo('userhome');
            }
        } else {
            console.log("User Not Logged In. Going to Login Screen.");
            // User login nahi hai -> Login screen par bhejo
            navigateTo('login');
        }
    });
}

// Make navigateTo global
window.navigateTo = navigateTo;

// Start the app
window.addEventListener('DOMContentLoaded', initApp);