# Mux Project: User Manual

Welcome to the **Mux Project**, a modular node-based environment for building complex signal and event flows. This guide will help you navigate, build, and manage your projects effectively.

---

## 1. Navigating the Workspace

The **Canvas** is your primary workspace. Use these controls to move around:

*   **Panning:** Click and drag with the **Middle Mouse Button** or **Right Mouse Button** on the empty canvas to move the view.
*   **Zooming:** Use the scroll wheel to zoom in and out.
*   **Zoom Reset (1:1):** Click the **"1:1"** button in the Zoom Controls to reset the scale to 100%.
*   **Zoom Extents:** Click the **"Fit"** button to automatically center and scale the view to show all your modules.

---

## 2. Working with Modules (Nodes)

Modules are the building blocks of your project.

*   **Adding Modules:** Right-click on the canvas to open the **Context Menu** and select a module from the library.
*   **Moving:** Left-click and drag a module to reposition it.
*   **Selecting:** 
    *   Click a module to select it.
    *   **Shift + Click** to select multiple modules.
    *   Click and drag on the empty canvas to create a **Selection Box**.
*   **Cloning:** Hold **Ctrl (or Cmd)** while dragging a selection to create an instant copy.
*   **Nesting (Diving In):** Double-click a **"MUX Modular"** module to go "inside" it. This allows you to build sub-graphs. Use the breadcrumbs at the top of the screen to navigate back to the parent level.
*   **Renaming/Coloring:** Right-click a module to change its name or background color via the context menu.

---

## 3. Connecting Modules (Wires)

Wires carry audio or events between modules.

*   **Creating a Connection:** Click and drag from an **Output Port** (right side) of one module to an **Input Port** (left side) of another.
*   **Editing Wires:** You can click and drag the horizontal or vertical segments of a wire to adjust its path.
*   **Deleting Wires:** Click a wire to select it and press **Delete** or **Backspace**.
*   **Unhooking:** Drag a vertical wire segment away from its connected port to "unhook" it and start drawing it elsewhere.

---

## 4. Organization & Groups

*   **Grouping:** Select multiple modules and press **Ctrl + G** (or use the context menu) to put them into a frame. This helps keep your workspace organized.
*   **Ungrouping:** Right-click a group frame and select **Ungroup**.
*   **Note Nodes:** Use Note modules to add text documentation directly to your canvas. Double-click a note to edit its text.

---

## 5. Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **Ctrl + Z** | Undo |
| **Ctrl + Y** | Redo |
| **Delete / Backspace** | Delete selected modules or wires |
| **Ctrl + G** | Group selected modules |
| **Esc** | Cancel current action (drawing, dragging, or menu) |
| **Shift + Click** | Add/Remove from selection |

---

## 6. Project Management

Use the **Project Controls** panel (usually at the top or side) to manage your work:

*   **Project Name:** Click the project name to rename your current file.
*   **Save:** Saves your current workspace state.
*   **Load:** Opens a previous project file to continue working.

---

*Tip: If the canvas feels cluttered, try using the "Focus Mode" by selecting a specific part of your graph. The rest of the workspace will dim, helping you focus on the active signal path.*
