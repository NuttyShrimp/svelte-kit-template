import { MAIL_FROM } from "$env/static/private";
import { MAILGUN_API_KEY } from "$env/static/private";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { renderTemplate } from "./render";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });
const mailDomain = MAIL_FROM.replace(/^.+<.+@(.+)>$/, "$1");

const svelteEntries = import.meta.glob("./templates/*.svelte", { eager: true });
const textEntries = import.meta.glob("./templates/*.txt", { eager: true, as: "raw" });

export const sendMail = async (recepient: string, templateName: string, props?: Record<string, any>) => {
	const htmlContent = svelteEntries[`./templates/${templateName}.svelte`].default;
	const generatedTemplate = renderTemplate(htmlContent, props ?? {});

	let textContent: string | undefined = undefined;
	const textKey = `./templates/${templateName}.txt`;
	if (textKey in textEntries) {
		textContent = textEntries[textKey];
	}

	mg.messages.create(mailDomain, {
		from: MAIL_FROM,
		to: recepient,
		html: generatedTemplate,
		text: textContent,
	});
};
