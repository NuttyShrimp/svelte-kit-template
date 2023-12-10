import { MAIL_FROM } from "$env/static/private";
import { MAILGUN_API_KEY } from "$env/static/private";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { renderTemplate } from "./render";

const mailgun = new Mailgun(FormData);
const mailDomain = MAIL_FROM.replace(/^.+<.+@(.+)>$/, "$1");

const svelteEntries = import.meta.glob("./templates/*.svelte", { eager: true });
const textEntries = import.meta.glob("./templates/*.txt", { eager: true, as: "raw" });
const uniqTemplateKeys = new Set(Object.keys(svelteEntries).concat(Object.keys(textEntries)));

export const loadedTemplates = [...uniqTemplateKeys].reduce<{ [k: string]: { svelte: boolean; text: boolean; } }>((obj, v) => {
  const key = v.replaceAll(/^\.\/templates\/(.+)\.(svelte|txt)$/g, "$1")
  obj[key] = {
    svelte: `./templates/${key}.svelte` in svelteEntries,
    text: `./templates/${key}.svelte` in textEntries,
  }
  return obj;
}, {});

export const sendMail = async (recepient: string, templateName: string, props?: Record<string, unknown>) => {
  const htmlContent = getSvelteMailContent(templateName, props);
  const textContent = getTextMailContent(templateName, props);

  if (!htmlContent) {
    throw new Error(`There is no Svelte mail template with the name: ${templateName}`);
  }

  const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });
  mg.messages.create(mailDomain, {
    from: MAIL_FROM,
    to: recepient,
    html: htmlContent,
    text: textContent,
  });
};

export const getMailContent = (type: "svelte" | "text", templateName: string, props?: Record<string, unknown>) => {
  switch (type) {
    case "svelte": {
      return getSvelteMailContent(templateName, props);
    }
    case "text": {
      return getTextMailContent(templateName, props);
    }
    default: {
      return;
    }
  }
}

const getSvelteMailContent = (templateName: string, props?: Record<string, unknown>) => {
  const htmlContent = svelteEntries[`./templates/${templateName}.svelte`].default;
  if (!htmlContent) {
    return;
  }
  const generatedTemplate = renderTemplate(htmlContent, props ?? {});
  return generatedTemplate;
}

const getTextMailContent = (templateName: string, props?: Record<string, unknown>) => {
  let textContent: string | undefined = undefined;
  const textKey = `./templates/${templateName}.txt`;
  if (textKey in textEntries) {
    textContent = textEntries[textKey];
  }
  return textContent;
}
