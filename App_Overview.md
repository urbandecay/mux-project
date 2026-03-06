MUX VISUALIZER: PROJECT OVERVIEW

I originally proposed this idea a few years ago as a feature request, so consider it a proof of concept. It is a standalone app designed to be used alongside the MUX environment when you are building synths or effects. The goal is to keep your signal flow organized and readable, which is helpful for two main reasons: it makes it easier to study how other people built their synths by tracing their signal paths, and it helps you manage your own complex creations when you need to debug or add features but have forgotten exactly how it all fits together.

The app works almost exactly like MuLab, but I have added several specific features to make visualization much easier:

NAVIGATION AND BASIC CONTROLS
- Corner Slider: This allows you to change the radius of the corners of the connecting wires to suit your preference.
- Zoom Extents: Use the magnifying glass button to instantly zoom out and fit all of your modules onto one screen.
- 1:1 Button: Use this to quickly reset the zoom and zoom back into the center of your graph.
- Save and Load: These buttons allow you to save your entire project as a JSON file and load it back later.

FOCUS MODE
In MuLab, when you select a module, all the connections radiating from it get highlighted. However, this can still be distracting. The Focus button allows you to dim everything on the screen that is not currently selected. I have also included a slider that lets you determine exactly how much you want the background to dim, so you can focus entirely on your active modules without being distracted by the rest of the graph.

INDICATOR HIGHLIGHT
This is for when you want to focus on one specific signal path from beginning to end, rather than just seeing every connection from a single module. The problem with the standard selection approach is that it shows too much at once. 

Indicator Highlight is different: when you turn it on, a connection between two modules only lights up if the indicator light (the toggle button) for both modules is on. If you then turn on a third module that is connected to the second, that connection will highlight as well, allowing you to trace a path through multiple modules. If you use Focus mode at the same time, the entire screen will be dimmed until you start turning on modules, making the active signal path stand out clearly. This is especially useful for figuring out exactly what a signal is doing through a synth when you tweak different knobs. Note that you have actaully to turn on the module indicator light to make this work, not just select the module.  The two buttons above turn all the module lights on or off.

PATCH POINTS (PP)
In the module list, you will find a module called "patch point 2," which is basically just a single point on the screen. The purpose of this is to keep your workspace clean by consolidating your routing. You can route many different wires into one patch point and then have just a single wire coming out of it to connect to another module. This significantly reduces the amount of overlapping connectors on the screen.
- PP Sizes: You can choose between 5px (small), 7px (medium), and 9px (large) squares for the point.
- PP Color: I have added a button to toggle the color of these points. You can make them lighter so they stand out, or set them to the same color as the wires so they blend in more.
- PP Hit Box: This setting gives you some "leeway" when starting a new connection. It defines the number of pixels outside the actual point where you can click and drag to start drawing a connector, so you do not have to be perfectly on the point.

ORGANIZATION AND GROUPS
- Deep Nesting: You can create new MUXes inside of MUXes as many levels deep as you want to go.
- Groups: This feature allows you to select a group of modules, right-click, and move them all in unison. You can right-click the group again later if you need to edit or reposition the modules within it.
- Group Manager: When you create a group, a manager panel pops up in the upper right-hand side. You can use this to rename your groups to keep things organized. Clicking on a group name in the manager will instantly highlight every module that belongs to that group on the canvas.

EXAMPLES
I added the Dakkas synth as an example of this app in action.  I included one version using patch point and one regular version.  So play around it, stress test it, or whatever else you want to do with it.  If find some issues with it I will try to fix it.  
