/**
 * Runs the server based on the WEB_SERVER environment variable.
 * Change in .env file
 * Can be "elysia" or "express"
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the WEB_SERVER value from environment variables
const webServer = process.env.WEB_SERVER || "elysia";

async function startServer() {
	console.log(`Starting server with ${webServer} web server...`);

	try {
		if (webServer.toLowerCase() === "elysia") {
			// Run the Elysia server
			const serverPath = join(__dirname, "server-elysia.ts");
			console.log(`Running: ${serverPath}`);

			// Using Bun to run the TypeScript file directly
			const server = spawn("bun", [serverPath], { stdio: "inherit" });

			server.on("error", (err) => {
				console.error("Failed to start Elysia server:", err);
				process.exit(1);
			});

			process.on("SIGINT", () => {
				server.kill("SIGINT");
				process.exit(0);
			});
		} else if (webServer.toLowerCase() === "express") {
			// Run the Express server
			const serverPath = join(__dirname, "server-express.js");
			console.log(`Running: ${serverPath}`);

			// Using Bun to run the JavaScript file
			const server = spawn("bun", [serverPath], { stdio: "inherit" });

			server.on("error", (err) => {
				console.error("Failed to start Express server:", err);
				process.exit(1);
			});

			process.on("SIGINT", () => {
				server.kill("SIGINT");
				process.exit(0);
			});
		} else if (webServer.toLowerCase() === "hono") {
			// Run the Hono server
			const serverPath = join(__dirname, "build/server/index.js");
			console.log(`Running: ${serverPath}`);

			// Using Bun to run the JavaScript file
			const server = spawn("bun", [serverPath], { stdio: "inherit" });

			// server.on('error', (err) => {
			//   console.error('Failed to start Hono server:', err);
			//   process.exit(1);
			// });

			process.on("SIGINT", () => {
				server.kill("SIGINT");
				process.exit(0);
			});
		} else {
			console.error(`Unknown web server type: ${webServer}`);
			console.error(
				'Please set WEB_SERVER environment variable to "elysia" or "express"',
			);
			process.exit(1);
		}
	} catch (error) {
		console.error("Error starting server:", error);
		process.exit(1);
	}
}

startServer();
