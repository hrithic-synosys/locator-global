import { baseLayout } from './base-layout'

export type ContactMessageData = {
  name: string
  email: string
  phone: string
  company: string
  topic: string
  message: string
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!))

export function contactMessageTemplate(data: ContactMessageData) {
  return baseLayout({
    heading: 'New Contact Enquiry',
    rows: [
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone || '—' },
      { label: 'Company', value: data.company || '—' },
      { label: 'Subject', value: data.topic },
      { label: 'Message', value: data.message },
      { label: 'Consent to contact', value: 'Yes' },
    ].map(row => ({ label: row.label, value: escapeHtml(row.value) })),
  })
}
