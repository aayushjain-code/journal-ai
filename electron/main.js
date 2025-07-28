const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain,
  shell,
} = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.env.NODE_ENV === "development";

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../assets/icon.png"),
    titleBarStyle: "default",
    show: false,
    backgroundColor: "#f9fafb",
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Auto-hide menu bar on macOS
    if (process.platform === "darwin") {
      mainWindow.setMenuBarVisibility(false);
    }
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Create menu
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Export Data",
          accelerator: "CmdOrCtrl+E",
          click: () => {
            mainWindow.webContents.send("export-data");
          },
        },
        {
          label: "Import Data",
          accelerator: "CmdOrCtrl+I",
          click: () => {
            mainWindow.webContents.send("import-data");
          },
        },
        {
          label: "Clear All Data",
          click: () => {
            dialog
              .showMessageBox(mainWindow, {
                type: "warning",
                title: "Clear All Data",
                message:
                  "Are you sure you want to clear all data? This action cannot be undone.",
                buttons: ["Cancel", "Clear All"],
                defaultId: 0,
                cancelId: 0,
              })
              .then((result) => {
                if (result.response === 1) {
                  mainWindow.webContents.send("clear-all-data");
                }
              });
          },
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About AI Personal Journal",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About AI Personal Journal",
              message: "AI Personal Journal v1.0.0",
              detail:
                "Your AI-enhanced personal journal for life tracking and insights.\n\nAll data is stored locally on your computer for complete privacy.",
            });
          },
        },
        {
          label: "Open Data Folder",
          click: () => {
            const userDataPath = app.getPath("userData");
            shell.openPath(userDataPath);
          },
        },
        {
          label: "Report Issue",
          click: () => {
            shell.openExternal(
              "https://github.com/aayushjain-code/journal-ai/issues"
            );
          },
        },
      ],
    },
  ];

  // Add macOS-specific menu items
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers for file operations
ipcMain.handle("save-file", async (event, data) => {
  const { filePath, content } = data;
  try {
    fs.writeFileSync(filePath, content);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Save Journal Data",
    defaultPath: `journal-backup-${
      new Date().toISOString().split("T")[0]
    }.json`,
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
    ...options,
  });
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Import Journal Data",
    properties: ["openFile"],
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
    ...options,
  });
  return result;
});

// Handle app security
app.on("web-contents-created", (event, contents) => {
  contents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
