import { Locale } from '../../services/i18n.service';

/** Interface text of the contact form, per language. */
export interface ContactFormText {
  heading: string;
  intro: string;
  name: string;
  email: string;
  message: string;
  charsLeft: (n: number) => string;
  privacy: string;
  privacyLink: string;
  send: string;
  sending: string;
  waking: string;
  thanks: string;
  another: string;
  invalid: string;
  tooMany: string;
  failed: string;
}

export const CONTACT_FORM_TEXT: Record<Locale, ContactFormText> = {
  pt: {
    heading: 'Enviar uma mensagem',
    intro: 'Escreva direto por aqui; respondo pelo e-mail que você informar.',
    name: 'Nome',
    email: 'Seu e-mail',
    message: 'Mensagem',
    charsLeft: (n) => `${n} caracteres restantes`,
    privacy: 'Seu nome, e-mail e mensagem são usados só para responder e apagados em até 12 meses.',
    privacyLink: 'Privacidade',
    send: 'Enviar mensagem',
    sending: 'Enviando…',
    waking: 'Acordando o servidor (hospedagem gratuita): isso pode levar até um minuto…',
    thanks: 'Mensagem enviada. Obrigado! Respondo assim que possível.',
    another: 'Enviar outra mensagem',
    invalid: 'Confira o nome, o e-mail e a mensagem (mínimo de 10 caracteres).',
    tooMany: 'Muitas mensagens enviadas daqui. Tente de novo mais tarde ou escreva por e-mail.',
    failed: 'Não foi possível enviar agora. Tente de novo ou escreva por e-mail.',
  },
  en: {
    heading: 'Send a message',
    intro: 'Write here directly; I reply to the e-mail address you give.',
    name: 'Name',
    email: 'Your e-mail',
    message: 'Message',
    charsLeft: (n) => `${n} characters left`,
    privacy: 'Your name, e-mail and message are used only to reply and are deleted within 12 months.',
    privacyLink: 'Privacy',
    send: 'Send message',
    sending: 'Sending…',
    waking: 'Waking up the server (free hosting): this can take up to a minute…',
    thanks: 'Message sent. Thank you! I will reply as soon as I can.',
    another: 'Send another message',
    invalid: 'Check the name, the e-mail and the message (at least 10 characters).',
    tooMany: 'Too many messages from here. Please try again later or write by e-mail.',
    failed: 'The message could not be sent. Please try again or write by e-mail.',
  },
  de: {
    heading: 'Nachricht senden',
    intro: 'Schreiben Sie direkt hier; ich antworte an die angegebene E-Mail-Adresse.',
    name: 'Name',
    email: 'Ihre E-Mail-Adresse',
    message: 'Nachricht',
    charsLeft: (n) => `noch ${n} Zeichen`,
    privacy: 'Name, E-Mail-Adresse und Nachricht werden nur für die Antwort genutzt und spätestens nach 12 Monaten gelöscht.',
    privacyLink: 'Datenschutz',
    send: 'Nachricht senden',
    sending: 'Wird gesendet …',
    waking: 'Der Server wird geweckt (kostenloses Hosting), das kann bis zu einer Minute dauern …',
    thanks: 'Nachricht gesendet. Danke! Ich antworte so bald wie möglich.',
    another: 'Weitere Nachricht senden',
    invalid: 'Bitte Name, E-Mail-Adresse und Nachricht prüfen (mindestens 10 Zeichen).',
    tooMany: 'Zu viele Nachrichten von hier. Bitte später erneut versuchen oder per E-Mail schreiben.',
    failed: 'Die Nachricht konnte nicht gesendet werden. Bitte erneut versuchen oder per E-Mail schreiben.',
  },
};
