import fs from 'node:fs';
import path from 'node:path';
import { env } from '$env/dynamic/private';

const pushLogToFile = (msg: Record<string, unknown>) => {
	// Check if logs folder exist
	const logPath = path.join(process.cwd(), 'logs', 'gelf.log');
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath, {
			recursive: true
		});
	}

	// open & write msg
	fs.appendFileSync(logPath, JSON.stringify(msg));
};

const pushLogsToFile = (msgs: Record<string, unknown>[]) => {
	// Check if logs folder exist
	const logPath = path.join(process.cwd(), 'logs', 'gelf.log');
	if (!fs.existsSync(logPath)) {
		fs.mkdirSync(logPath, {
			recursive: true
		});
	}

	// open & write msg
	fs.appendFileSync(logPath, msgs.map((v) => JSON.stringify(v)).join('\n'));
};

const readMissedLogs = (): Record<string, unknown>[] => {
	const logPath = path.join(process.cwd(), 'logs', 'gelf.log');
	if (!fs.existsSync(logPath)) {
		return [];
	}
	const logs = fs.readFileSync(logPath, {
		encoding: 'utf-8'
	});
	// Clear file
	fs.writeFileSync(logPath, '');
	return logs.split('\n').map((log) => JSON.parse(log));
};

let cleaningBacklog = false;

// Returns promise we should not await in this case
export const log = async (type: string, message: string, data: Record<string, string>) => {
	if (!env.GELF_ENDPOINT) {
		return;
	}

	// Enforcing a type will make query-writing easier if we need to find a specific event
	data.logtype = type;

	// Storing the timestamp so we can push the message at a later moment
	const timestamp = Math.round(Date.now() / 1000);
	const gelfMsg = {
		// https://go2docs.graylog.org/5-0/getting_in_log_data/gelf.html?tocpath=Getting%20in%20Logs%7CLog%20Sources%7CGELF%7C_____0#GELFPayloadSpecification
		version: '1.1',
		host: env.ORIGIN,
		short_message: message,
		full_message: JSON.stringify(data, null, 2),
		timestamp
	};

	try {
		const resp = await fetch(env.GELF_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(gelfMsg)
		});
		if (!resp.ok) {
			pushLogToFile(gelfMsg);
			return;
		}

		if (!cleaningBacklog) return;
		cleaningBacklog = true;

		// TODO: push all the logs that currently stored in the file if the previous log push worked
		let i = 0;
		const backlog = readMissedLogs();

		for (i; i < backlog.length; i++) {
			try {
				const resp = await fetch(env.GELF_ENDPOINT, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(backlog[i])
				});
				if (!resp.ok) {
					break;
				}
			} catch (e) {
				console.error(e);
				break;
			}
		}

		if (i < backlog.length - 1) {
			const newBacklog = backlog.slice(i);
			pushLogsToFile(newBacklog);
		}

		cleaningBacklog = false;
	} catch (e) {
		console.error(e);
		pushLogToFile(gelfMsg);
	}
};
