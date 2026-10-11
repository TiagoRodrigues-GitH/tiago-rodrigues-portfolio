import { Locale } from '../../services/i18n.service';

/** Interface text of the comment section, per language. */
export interface ReviewText {
  heading: string;
  empty: string;
  loading: string;
  /** Shown when the free server takes a while to answer (it sleeps after ~15 idle minutes). */
  waking: string;
  unavailable: string;
  loadError: string;
  write: string;
  name: string;
  comment: string;
  rating: string;
  noRating: string;
  stars: (n: number) => string;
  privacy: string;
  send: string;
  sending: string;
  cancel: string;
  thanks: string;
  tooMany: string;
  invalid: string;
  failed: string;
  charsLeft: (n: number) => string;
}

export const REVIEW_TEXT: Record<Locale, ReviewText> = {
  pt: {
    heading: 'Comentários',
    empty: 'Ainda não há comentários. Seja o primeiro.',
    loading: 'Carregando comentários…',
    waking: 'Acordando o servidor (hospedagem gratuita): os comentários podem levar até um minuto…',
    unavailable: 'Os comentários estarão disponíveis em breve.',
    loadError: 'Não foi possível carregar os comentários.',
    write: 'Escrever um comentário',
    name: 'Nome',
    comment: 'Comentário',
    rating: 'Avaliação (opcional)',
    noRating: 'Sem nota',
    stars: (n) => `${n} de 5 estrelas`,
    privacy: 'Seu nome e comentário aparecem depois de aprovados. Não guardamos e-mail nem endereço IP.',
    send: 'Enviar',
    sending: 'Enviando…',
    cancel: 'Cancelar',
    thanks: 'Obrigado! Seu comentário aparece depois de aprovado.',
    tooMany: 'Muitos comentários enviados daqui. Tente de novo mais tarde.',
    invalid: 'Confira o nome e o comentário (mínimo de 3 caracteres).',
    failed: 'Não foi possível enviar agora. Tente de novo mais tarde.',
    charsLeft: (n) => `${n} caracteres restantes`,
  },
  en: {
    heading: 'Comments',
    empty: 'No comments yet. Be the first.',
    loading: 'Loading comments…',
    waking: 'Waking up the server (free hosting): comments can take up to a minute…',
    unavailable: 'Comments will be available soon.',
    loadError: 'The comments could not be loaded.',
    write: 'Write a comment',
    name: 'Name',
    comment: 'Comment',
    rating: 'Rating (optional)',
    noRating: 'No rating',
    stars: (n) => `${n} out of 5 stars`,
    privacy: 'Your name and comment appear once approved. No e-mail or IP address is stored.',
    send: 'Send',
    sending: 'Sending…',
    cancel: 'Cancel',
    thanks: 'Thank you! Your comment appears once approved.',
    tooMany: 'Too many comments from here. Please try again later.',
    invalid: 'Check the name and the comment (at least 3 characters).',
    failed: 'The comment could not be sent. Please try again later.',
    charsLeft: (n) => `${n} characters left`,
  },
  de: {
    heading: 'Kommentare',
    empty: 'Noch keine Kommentare. Schreiben Sie den ersten.',
    loading: 'Kommentare werden geladen …',
    waking: 'Der Server wird geweckt (kostenloses Hosting), die Kommentare können bis zu einer Minute dauern …',
    unavailable: 'Kommentare sind bald verfügbar.',
    loadError: 'Die Kommentare konnten nicht geladen werden.',
    write: 'Kommentar schreiben',
    name: 'Name',
    comment: 'Kommentar',
    rating: 'Bewertung (optional)',
    noRating: 'Keine Bewertung',
    stars: (n) => `${n} von 5 Sternen`,
    privacy: 'Name und Kommentar erscheinen nach der Freigabe. E-Mail- und IP-Adressen werden nicht gespeichert.',
    send: 'Senden',
    sending: 'Wird gesendet …',
    cancel: 'Abbrechen',
    thanks: 'Danke! Ihr Kommentar erscheint nach der Freigabe.',
    tooMany: 'Zu viele Kommentare von hier. Bitte später erneut versuchen.',
    invalid: 'Bitte Name und Kommentar prüfen (mindestens 3 Zeichen).',
    failed: 'Der Kommentar konnte nicht gesendet werden. Bitte später erneut versuchen.',
    charsLeft: (n) => `noch ${n} Zeichen`,
  },
};
