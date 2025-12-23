import React from "react";

function About() {
    return (
        <dialog id="about_modal" className="modal">
            <div className="modal-box glass-card text-[var(--text-primary)]">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg text-[var(--accent-primary)]">About CircleUp</h3>
                <p className="py-4">
                    CircleUp is a modern chat application designed for seamless communication.
                    <br />
                    <br />
                    <span className="font-semibold">Version:</span> 1.1.0
                    <br />
                    <span className="font-semibold">Developer:</span> Ayush Agrawal
                </p>
                <p className="text-sm opacity-70">
                    Built with React, TailwindCSS, DaisyUI, and Node.js.
                </p>
            </div>
        </dialog>
    );
}

export default About;
