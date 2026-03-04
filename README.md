Ek seamless, Android-like interface wala educational web-app banana jo HTML, CSS, aur JS ka use kare, par feel ekdum native app jaisi de.

📂 Folder Structure 
(The Blueprint)

root/
├── index.html           # Main Entry Point (The Shell)

├── main.js              # Global Logic & Screen Router

├── style.css            # Global Styles & Design System

├── screens/             # UI Components (Single File Components)

│   ├── splash.html

│   ├── lin.html

│   ├── batch.html

│   └── ...
=[p]
├── server/              # Backend Config


│   └── firebaseConfig.js

└── assets/              # Media (Images, Icons, Lottie)


🛠 Technical Architecture & Rules

1. The "Shell" Concept (index.html)
Saara content ek hi page par load hoga. Index file mein ek <div id="app-root"></div> hoga jaha saari screens dynamic tarike se "inject" ki jayengi.

2. Main.js (The Brain 🧠)
No Hard Reloads: window.location.href ka use sakht mana hai! 🚫

Screen Switcher: fetch() API ka use karke screens/ folder se HTML files mangwani hai aur unhe #app-root mein daalna hai.

Firebase Hub: Firebase ko initialize karna aur user ka Auth State (Login/Logout) check karna isi ki zimmedari hai.

3. Style.css (The Skin 🎨)
Isme sirf Global Settings hongi: CSS Variables (Colors), Fonts, aur Buttons ka common look.

Android Look & Feel: Padding, Icon sizes, aur Layouts ko bilkul Material Design (Android) jaisa rakhna hai taaki mobile view mein wo "website" nahi, "app" lage.

4. Single File Screens (SFS Strategy)
Har screen (e.g., login.html) apne andar hi sab kuch rakhegi:

HTML: UI structure.

CSS: <style> tag ke andar (Screen-specific styling).

JS: <script> tag ke andar, par ek IIFE (function() { ... })(); ke saath taaki variables doosri screens se clash na karein.

5. Security & Assets
Firebase Safety: Saari API keys server/firebaseConfig.js mein rahengi.

Asset Management: Saari images aur icons hamesha assets/ folder se hi relative path se call karni hain.

🚀 Implementation Strategy for AI
Jab bhi koi nayi screen banani ho, AI ko ye step-by-step follow karna hai:

Fetch content from screens/name.html.

Inject content into #app-root.

Ensure Smooth Transition (Blink nahi hona chahiye).

Execute Script jo us screen ke andar hai.
