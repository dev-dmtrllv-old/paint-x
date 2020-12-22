const { watch } = require("fs");
const path = require("path");
const { spawn, spawnSync, execSync } = require("child_process");
const webpack = require("webpack");
const find = require('find-process');

spawn(path.resolve(__dirname, "../node_modules", ".bin", "tsc.cmd"), ["--watch", "--p", "main.tsconfig.json"], { stdio: "inherit" });

execSync("npm run build-addon", { stdio: "inherit" });

let electronProc = null;

const killElectron = async () =>
{
	electronProc.kill();
	let list = await find("name", "electron");
	list.forEach(({ bin, pid }) => 
	{
		if (bin.includes("paint-x"))
		{
			try
			{
				process.kill(pid);
			}
			catch { }
		}
	})
}

const startElectron = async () =>
{
	if (electronProc)
	{
		await killElectron();
	}
	electronProc = spawn(path.resolve(__dirname, "../node_modules", ".bin", "electron.cmd"), [process.cwd()], { stdio: "inherit" });
}

let changeTimeout = null;
let didCompile = false;

const com = webpack(require("./webpack.config"));

com.watch({}, (err, stats) => 
{
	if (err)
		console.error(err);
	else
	{
		if (!didCompile)
		{
			didCompile = true;

			try
			{
				startElectron();
				watch(path.resolve(__dirname, "../dist/main"), { recursive: true }, (e, file) => 
				{
					if (file.endsWith(".js"))
					{
						if (changeTimeout)
							clearTimeout(changeTimeout);
						changeTimeout = setTimeout(() => 
						{
							startElectron();
						}, 50);
					}
				});
			}
			catch { }

		}
		console.log(stats.toString("minimal"));
	}
});

let addonTimout = null;

watch(path.resolve(__dirname, "../src/engine/addon"), { recursive: true }, () => 
{
	console.log("changed cpp")

	if (addonTimout)
		clearTimeout(addonTimout)
	addonTimout = setTimeout(async () =>
	{
		console.log("build cpp")
		await killElectron();
		execSync("npm run build-addon", { stdio: "inherit" });
		startElectron();
	}, 150);
});
