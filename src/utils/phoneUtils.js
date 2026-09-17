// Normalizes a phone number to the international format WhatsApp needs to open a
// specific chat (549 + area code + number). Without the country/mobile prefix,
// wa.me can't resolve the contact and opens WhatsApp with no chat/message at all.
export function toWhatsappPhone(rawPhone) {
  let digits = (rawPhone || '').replace(/\D/g, '');
  if (!digits) return '';
  digits = digits.replace(/^0+/, '');
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54')) return `549${digits.slice(2)}`;
  return `549${digits}`;
}
