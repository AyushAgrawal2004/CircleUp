const PptxGenJS = require("pptxgenjs");

let pres = new PptxGenJS();

// --- Theme & Style ---
pres.layout = "LAYOUT_16x9";
const bgDark = { color: "111827" }; // Dark Gray/Black (Tailwind Gray-900) - Object for Slide Background
const textLight = "F9FAFB"; // Gray-50 - String for Text
const accentColor = "DF6D6D"; // Coral Pink - String for Text
const subTextColor = "9CA3AF"; // Gray-400 - String for Text

function addTitleSlide(title, subtitle) {
    let slide = pres.addSlide();
    slide.background = bgDark;
    slide.addText(title, { x: 1, y: 2, w: "80%", h: 1, fontSize: 44, color: accentColor, bold: true, align: "left" });
    if (subtitle) {
        slide.addText(subtitle, { x: 1, y: 3.2, w: "80%", h: 1, fontSize: 24, color: textLight, align: "left" });
    }
    // Add Logo if available
    // slide.addImage({ path: "Frontend/src/assets/logo-readme.svg", x: 8, y: 0.5, w: 1, h: 1 });
}

function addContentSlide(title, contentArray) {
    let slide = pres.addSlide();
    slide.background = bgDark;

    // Header
    slide.addText(title, { x: 0.5, y: 0.5, w: "90%", h: 0.8, fontSize: 32, color: accentColor, bold: true, border: { pt: 0, pb: "1", color: accentColor } });

    // Content
    let yPos = 1.5;
    contentArray.forEach(item => {
        let textOps = { x: 0.5, y: yPos, w: "90%", h: 0.5, fontSize: 18, color: textLight, bullet: true };

        if (item.label && item.text) {
            slide.addText([
                { text: item.label + ": ", options: { bold: true, color: "FFFFFF" } },
                { text: item.text, options: { color: subTextColor } }
            ], { x: 0.5, y: yPos, w: "90%", h: 0.5, fontSize: 18, bullet: true });
        } else {
            slide.addText(item, textOps);
        }
        yPos += 0.6;
    });
}

// --- SLIDES ---

// 1. Title
addTitleSlide("CircleUp", "DevOps & Workflow Presentation");

// 2. Introduction
addContentSlide("1. Introduction", [
    { label: "Project", text: "CircleUp" },
    { label: "Concept", text: "Real-time community engagement platform (Chat, Events, Status Music)." },
    { label: "Tech Stack", text: "MERN (MongoDB, Express, React, Node.js) + Socket.IO." }
]);

// 3. Problem Identification
addContentSlide("2. Problem Identification", [
    { label: "No Event Planning in WhatsApp", text: "Details lost in spam. Confusion on who/where." },
    { label: "Boring Status Updates", text: "Static text/images lack 'vibe'. No local music support." },
    { label: "Fragmented Tools", text: "Switching apps (Insta, G-Forms, WhatsApp) to manage one event." },
    { label: "Social Disconnect (FB Events)", text: "Good features, but empty 'ghost town' engagement." },
    { label: "Complexity (Discord)", text: "Powerful but overwhelming for non-tech users." },
    { label: "Lack of Admin Control", text: "Group chats lack owner-managed threads." }
]);

// 4. The Solution
addContentSlide("3. The Solution: CircleUp", [
    { label: "All-in-One", text: "Unified Chat + Event Management." },
    { label: "Status Music", text: "Expressive local audio statuses (Green DevOps: no server bloat)." },
    { label: "User-Centric", text: "Dark Mode, Responsive, Simple UI." },
    { label: "Secure", text: "JWT Auth, Owner-only Event Deletion." }
]);

// 5. Architecture
addContentSlide("4. Technical Architecture (Brief)", [
    { label: "Frontend", text: "React + Vite, TailwindCSS (for Dark Mode), Zustand." },
    { label: "Backend", text: "Node/Express, MongoDB (Flexible schema)." },
    { label: "Real-time", text: "Socket.IO for instant msg & status updates." }
]);

// 6. Git Strategy
addContentSlide("5. Version Control Strategy", [
    { label: "Feature Branch Workflow", text: "Isolated branches per feature (main, dark-mode, status-music)." },
    { label: "Rebase vs Merge", text: "Used 'git rebase' to maintain linear history and avoid merge bubbles." },
    { label: "Integration", text: "Fast-Forward merges for clean deployment." }
]);

// 7. Workflow Diagram
let workflowSlide = pres.addSlide();
workflowSlide.background = bgDark;
workflowSlide.addText("Git Workflow Visualized", { x: 0.5, y: 0.5, w: "90%", h: 0.8, fontSize: 32, color: accentColor, bold: true, border: { pt: 0, pb: "1", color: accentColor } });
// Image path relative to where script is run
try {
    workflowSlide.addImage({ path: "workflow_chart.png", x: 0.5, y: 1.5, w: "90%", h: 3.5 });
} catch (e) {
    workflowSlide.addText("Error loading diagram image.", { x: 0.5, y: 2, fontSize: 18, color: textLight });
}

// 8. Key Features (DevOps)
addContentSlide("6. Key Feature Delivery", [
    { label: "Dark Mode (v1.1)", text: "Config-based theming (Tailwind). Persisted via LocalStorage." },
    { label: "Status Music", text: "Binary data handling. Decision: Client-side IndexedDB (Efficiency)." },
    { label: "v1.5 Releases", text: "Agile fixes: Logout Button, Secure Event Deletion." }
]);

// 9. GitHub Usage
addContentSlide("7. GitHub Usage", [
    "Remote Collaboration suitable for teams.",
    "Release Management with Git Tags.",
    "Comprehensive Documentation (README w/ Badges)."
]);

// 10. Conclusion
addContentSlide("8. Conclusion", [
    "Demonstrates Full-Stack + DevOps Mindset.",
    "Git used as a strategic tool, not just a save button.",
    "Result: Robust, clean, and user-centric software delivery."
]);

// --- Gen ---
pres.writeFile({ fileName: "CircleUp_Presentation.pptx" });
console.log("Presentation generated successfully!");
