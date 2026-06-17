const INTAKE_PREFIX = 'bei_intake_'
const META_PREFIX = 'bei_meta_'

export function saveIntakeData(businessId: string, data: Record<string, any>) {
  try {
    localStorage.setItem(INTAKE_PREFIX + businessId, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save intake data to localStorage', e)
  }
}

export function getIntakeData(businessId: string): Record<string, any> | null {
  try {
    const item = localStorage.getItem(INTAKE_PREFIX + businessId)
    return item ? JSON.parse(item) : null
  } catch (e) {
    console.error('Failed to parse intake data from localStorage', e)
    return null
  }
}

export function saveMetaData(businessId: string, data: Record<string, any>) {
  try {
    localStorage.setItem(META_PREFIX + businessId, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save meta data to localStorage', e)
  }
}

export function getMetaData(businessId: string): Record<string, any> | null {
  try {
    const item = localStorage.getItem(META_PREFIX + businessId)
    return item ? JSON.parse(item) : null
  } catch (e) {
    console.error('Failed to parse meta data from localStorage', e)
    return null
  }
}
