const {contextBridge, shell} = require("electron");
const url = require("node:url");
contextBridge.executeInMainWorld("electronAPI", {
    openExternal: (url) => shell.openExternal(url)
});