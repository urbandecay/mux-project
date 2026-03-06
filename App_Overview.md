# Mux Visualizer: A New Way to Build

I originally proposed this idea a few years ago as a feature request, so think of this app as a "proof of concept" for that vision. It's a standalone tool designed to live alongside your MUX environment to help keep your signal flows clean, organized, and—most importantly—readable. Whether you're trying to deconstruct a complex synth made by someone else or debugging your own creation after being away from it for months, this tool is meant to stop you from getting lost in the "spaghetti."

### The Workflow
The app feels a lot like MuLab, but I've added a few specific features to make visualization better:
*   **Visual Tweaks:** There's a corner slider to change how rounded your connecting wires are.
*   **Navigation:** Use the magnifying glass (**Zoom Extents**) to instantly fit everything on one screen, or the **1:1 button** to jump back to full size.
*   **Saving:** Use the Save/Load buttons to keep your projects as JSON files.

### Focus & Isolation
One of the biggest headaches in a complex patch is distraction. I've added two ways to cut through the noise:
1.  **Focus Mode:** When you select something and hit "Focus," everything else dims out. You can use the slider to decide exactly how much "darkness" you want in the background.
2.  **Indicator Highlight:** This is for tracing a specific signal path from start to finish. In standard MuLab, selecting a module highlights everything connected to it. Here, if you turn this mode on, connections only light up if the modules they connect are actually toggled "on." This lets you see the exact path a signal is taking through your synth in real-time.

### Cleaning up with Patch Points (PP)
To keep the screen from getting cluttered with crossing wires, I added **Patch Points**. These are tiny nodes (basically just a dot) that you can use as a hub. Route multiple signals to one point, then run a single wire out of it. 
*   **Customization:** You can choose three different sizes and toggle the color so they either stand out or blend into the wires. 
*   **The Hitbox:** I've also included a "PP Hit Box" setting, which gives you a bit of "leeway" when clicking near a point, so you don't have to be pixel-perfect to start a new connection.

### Organization & Groups
You can nest MUXes inside MUXes as deep as you need to go. I've also added a **Group** feature: just select a bunch of modules, right-click, and move them all as one unit. When you create a group, it shows up in the **Group Manager** (top-right), where you can rename it or click it to instantly highlight everything in that group.

To see how this all works in practice, check out the **Dakkas synth** examples I included. I've provided a "regular" version and a "patch point" version so you can see the difference for yourself.
