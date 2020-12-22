import { app, BrowserWindow } from "electron";
import { watch } from "fs";
import { resolve } from "path";

(process.env as any)["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

let win: BrowserWindow;

app.whenReady().then(async () => 
{
	win = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: true,
		}
	});
	win.setMenu(null);
	await win.loadFile(resolve(__dirname, "../../index.html"));
	win.maximize();
	win.show();
	win.webContents.openDevTools();
	watch(resolve(__dirname, "../app"), { recursive: true }, () => win.webContents.reload());
	watch(resolve(__dirname, "../../index.html"), {}, () => win.webContents.reload());
});

app.on("window-all-closed", () => app.quit());
