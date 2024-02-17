import { building, dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { MAILGUN_API_KEY, MAIL_FROM } from '$env/static/private';
import Queue from 'bee-queue';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import type { SvelteComponent } from 'svelte';
import { renderComponent, renderHtmlTemplate } from './render';

type TemplateFileLoad = {
	default: new (...args: unknown[]) => SvelteComponent<Record<string, unknown>>;
};

const mailgun = new Mailgun(FormData);
const mailDomain = MAIL_FROM.replace(/^.+<.+@(.+)>$/, '$1');

const svelteEntries = import.meta.glob('./templates/*.html.svelte', { eager: true });
const textEntries = import.meta.glob('./templates/*.text.svelte', { eager: true });
const uniqTemplateKeys = new Set(Object.keys(svelteEntries).concat(Object.keys(textEntries)));

let mailQueue: Queue;
if (!building) {
	mailQueue = new Queue<{ template: string; props?: Record<string, unknown>; recepient: string }>(
		'sample-mails',
		{
			redis: {
				host: env.REDIS_HOST ?? '127.0.0.1',
				port: env.REDIS_PORT ?? 6379
			}
		}
	);
	mailQueue.process((j) => {
		processMailJob(j.data.recepient, j.data.template, j.data.props);
	});
}

export const loadedTemplates = [...uniqTemplateKeys].reduce<{
	[k: string]: { svelte: boolean; text: boolean };
}>((obj, v) => {
	const key = v.replaceAll(/^\.\/templates\/(.+)\.[^.]+\.(svelte)$/g, '$1');
	obj[key] = {
		svelte: `./templates/${key}.html.svelte` in svelteEntries,
		text: `./templates/${key}.text.svelte` in textEntries
	};
	return obj;
}, {});

export const sendMail = async (
	recepient: string,
	templateName: string,
	props?: Record<string, unknown>
) => {
	if (dev || building) {
		// TODO: found a way to open the browser with an email
		const urlParams = new URLSearchParams({
			template: templateName,
			props: JSON.stringify(props ?? {})
		});
		console.log(`http://localhost:3000/preview/mails?${urlParams.toString()}`);
		return;
	}
	const job = mailQueue.createJob({ template: templateName, props, recepient });
	job.save();
};

export const getMailContent = (
	type: 'svelte' | 'text',
	templateName: string,
	props: Record<string, unknown>
) => {
	switch (type) {
		case 'svelte': {
			return getSvelteMailContent(templateName, props);
		}
		case 'text': {
			return getTextMailContent(templateName, props);
		}
		default: {
			return;
		}
	}
};

const processMailJob = (
	recepient: string,
	templateName: string,
	props: Record<string, unknown>
) => {
	const htmlContent = getSvelteMailContent(templateName, props);
	const textContent = getTextMailContent(templateName, props);

	if (!htmlContent) {
		throw new Error(`There is no Svelte mail template with the name: ${templateName}`);
	}

	if (!textContent) {
		throw new Error(`There is no Svelte mail template with the name: ${templateName}`);
	}

	const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });
	mg.messages.create(mailDomain, {
		from: MAIL_FROM,
		to: recepient,
		html: htmlContent,
		text: textContent
	});
};

const getSvelteMailContent = (templateName: string, props: Record<string, unknown>) => {
	const htmlContent = (svelteEntries[`./templates/${templateName}.html.svelte`] as TemplateFileLoad)
		?.default;
	if (!htmlContent) {
		return;
	}
	const generatedTemplate = renderHtmlTemplate(htmlContent, props ?? {});
	return generatedTemplate;
};

const getTextMailContent = (templateName: string, props?: Record<string, unknown>) => {
	const textContent = (textEntries[`./templates/${templateName}.text.svelte`] as TemplateFileLoad)
		?.default;
	if (!textContent) {
		return;
	}
	const filledContent = renderComponent(textContent, props);
	return filledContent.body;
};
