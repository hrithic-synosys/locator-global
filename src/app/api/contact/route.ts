import { verifyTurnstile } from '@/lib/turnstile'
import { sendMail } from '@/lib/email/send-mail'
import { contactMessageTemplate } from '@/lib/email/templates/contact-message'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_REQUEST_BYTES = 11 * 1024 * 1024
const TOPICS = [
  'Sales & pricing', 'Product demo', 'Technical support',
  'Regulatory certification (Asateel / Shahin / SecurePath)', 'Partnership', 'Something else',
]
const FILE_TYPES: Record<string, string> = {
  pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
}
const validEmail = (value: string) => value.length <= 254 && /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value)
const failure = (error: string, status = 400) => Response.json({ success: false, error }, { status })

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.startsWith('multipart/form-data;')) return failure('Please use the contact form.')

  let form: FormData
  try {
    const reader = request.body?.getReader()
    if (!reader) return failure('The message is empty.')
    const chunks: Uint8Array[] = []
    let bytes = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_REQUEST_BYTES) {
        await reader.cancel()
        return failure('The message is too large. Attachments must be no larger than 10 MB.', 413)
      }
      chunks.push(value)
    }
    form = await new Request(request.url, {
      method: 'POST', headers: { 'content-type': contentType }, body: Buffer.concat(chunks),
    }).formData()
  } catch {
    return failure('Unable to read your message. Please try again.')
  }

  const text = (key: string) => {
    const value = form.get(key)
    return typeof value === 'string' ? value.trim() : ''
  }
  const name = text('name'), email = text('email'), phone = text('phone')
  const company = text('company'), topic = text('topic'), message = text('message')
  if (!name || !email || !message || !TOPICS.includes(topic)) return failure('Please complete all required fields and select a subject.')
  if (!validEmail(email)) return failure('Please enter a valid email address.')
  if (text('consent') !== 'on') return failure('Please agree that Locator may contact you about this enquiry.')
  if (name.length > 150 || /[\r\n]/.test(name) || phone.length > 50 || company.length > 250 || message.length > 10000) {
    return failure('Some details are too long. Please shorten them and try again.')
  }

  const verification = await verifyTurnstile(form, 'contact')
  if (!verification.success) return failure(verification.error, 400)

  const attachment = form.get('attachment')
  let attachments: { filename: string; content: Buffer; contentType: string }[] | undefined
  if (attachment && !(attachment instanceof File)) return failure('Please select a valid attachment.')
  if (attachment instanceof File && (attachment.size || attachment.name)) {
    if (!attachment.size) return failure('The attachment is empty. Please choose another file.')
    if (attachment.size > MAX_FILE_BYTES) return failure('Attachments must be no larger than 10 MB.', 413)
    const extension = attachment.name.split('.').pop()?.toLowerCase() || ''
    if (!FILE_TYPES[extension]) return failure('Please attach a PDF, DOC, DOCX, JPG, or PNG file.')
    attachments = [{
      filename: attachment.name.replace(/[\\/\x00-\x1f\x7f]/g, '_').slice(-120),
      content: Buffer.from(await attachment.arrayBuffer()), contentType: FILE_TYPES[extension],
    }]
  }

  const recipient = process.env.CONTACT_RECIPIENT_EMAIL?.trim()
  if (!recipient || !validEmail(recipient)) {
    console.error('CONTACT_RECIPIENT_EMAIL is missing or invalid.')
    return failure('Unable to send your message right now. Please contact info@locator.ae.', 503)
  }
  try {
    await sendMail({
      to: recipient,
      fromName: 'Contact Enquiries',
      replyTo: email,
      subject: `Contact enquiry: ${topic} — ${name}`,
      html: contactMessageTemplate({ name, email, phone, company, topic, message }),
      attachments,
    })
    return Response.json({ success: true })
  } catch {
    console.error('Contact enquiry email could not be sent.')
    return failure('Unable to send your message. Please try again or contact info@locator.ae.', 500)
  }
}
