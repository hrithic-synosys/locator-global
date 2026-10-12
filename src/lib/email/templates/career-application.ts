import { baseLayout } from './base-layout'

export type CareerApplicationData = {
  jobTitle: string
  jobLocation: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  experiences: string[]
  coverLetter: string
  onsite: string
  salary: string
  screeningQuestion: string
  screeningAnswer: string
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!))

export function careerApplicationTemplate(data: CareerApplicationData) {
  return baseLayout({
    heading: 'New Career Application',
    rows: [
      { label: 'Position', value: data.jobTitle },
      { label: 'Job location', value: data.jobLocation },
      { label: 'Applicant', value: `${data.firstName} ${data.lastName}` },
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone },
      { label: 'Address', value: data.address || '—' },
      { label: 'Experience', value: data.experiences.join('\n') || '—' },
      { label: 'Cover letter', value: data.coverLetter },
      { label: 'On-site availability', value: data.onsite },
      { label: 'Salary expectation', value: data.salary },
      { label: 'Screening question', value: data.screeningQuestion },
      { label: 'Screening answer', value: data.screeningAnswer },
    ].map(row => ({ label: row.label, value: escapeHtml(row.value) })),
  })
}
