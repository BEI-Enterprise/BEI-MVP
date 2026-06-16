/**
 * MRI Storage Utilities
 * Handles localStorage operations for BEI intake data following MVP 1 architecture.
 * Ensures data consistency between Supabase and client-side cache.
 */

export interface MRIIntakeData {
  [key: string]: string
}

export interface MRIMeta {
  businessName: string
  businessId: string
  createdAt?: string
}

/**
 * Storage key constants
 */
const STORAGE_KEYS = {
  intake: (businessId: string) => `bei_intake_${businessId}`,
  meta: (businessId: string) => `bei_meta_${businessId}`,
  timestamp: (businessId: string) => `bei_timestamp_${businessId}`,
} as const

/**
 * Save intake answers to localStorage
 * @param businessId - Business ID to save for
 * @param answers - Intake form answers
 * @returns true if successful, false if localStorage unavailable
 */
export function saveIntakeToStorage(businessId: string, answers: MRIIntakeData): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('[MRI Storage] localStorage is not available')
      return false
    }
    localStorage.setItem(STORAGE_KEYS.intake(businessId), JSON.stringify(answers))
    localStorage.setItem(STORAGE_KEYS.timestamp(businessId), new Date().toISOString())
    return true
  } catch (error) {
    console.error('[MRI Storage] Failed to save intake data:', error)
    return false
  }
}

/**
 * Save business metadata to localStorage
 * @param businessId - Business ID to save for
 * @param meta - Business metadata (name, etc.)
 * @returns true if successful, false if localStorage unavailable
 */
export function saveMRIMetaToStorage(businessId: string, meta: MRIMeta): boolean {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('[MRI Storage] localStorage is not available')
      return false
    }
    localStorage.setItem(STORAGE_KEYS.meta(businessId), JSON.stringify(meta))
    return true
  } catch (error) {
    console.error('[MRI Storage] Failed to save meta data:', error)
    return false
  }
}

/**
 * Retrieve intake answers from localStorage
 * @param businessId - Business ID to retrieve for
 * @returns Parsed intake data or null if not found
 */
export function getIntakeFromStorage(businessId: string): MRIIntakeData | null {
  try {
    if (!isLocalStorageAvailable()) {
      return null
    }
    const stored = localStorage.getItem(STORAGE_KEYS.intake(businessId))
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.error('[MRI Storage] Failed to parse intake data:', error)
    return null
  }
}

/**
 * Retrieve business metadata from localStorage
 * @param businessId - Business ID to retrieve for
 * @returns Parsed meta data or null if not found
 */
export function getMRIMetaFromStorage(businessId: string): MRIMeta | null {
  try {
    if (!isLocalStorageAvailable()) {
      return null
    }
    const stored = localStorage.getItem(STORAGE_KEYS.meta(businessId))
    if (!stored) return null
    return JSON.parse(stored)
  } catch (error) {
    console.error('[MRI Storage] Failed to parse meta data:', error)
    return null
  }
}

/**
 * Clear all MRI data for a specific business
 * @param businessId - Business ID to clear
 * @returns true if successful
 */
export function clearMRIStorage(businessId: string): boolean {
  try {
    if (!isLocalStorageAvailable()) return false
    localStorage.removeItem(STORAGE_KEYS.intake(businessId))
    localStorage.removeItem(STORAGE_KEYS.meta(businessId))
    localStorage.removeItem(STORAGE_KEYS.timestamp(businessId))
    return true
  } catch (error) {
    console.error('[MRI Storage] Failed to clear storage:', error)
    return false
  }
}

/**
 * Check if specific business data exists in localStorage
 * @param businessId - Business ID to check
 * @returns true if both intake and meta data exist
 */
export function hasMRIData(businessId: string): boolean {
  try {
    if (!isLocalStorageAvailable()) return false
    const hasIntake = !!localStorage.getItem(STORAGE_KEYS.intake(businessId))
    const hasMeta = !!localStorage.getItem(STORAGE_KEYS.meta(businessId))
    return hasIntake && hasMeta
  } catch (error) {
    return false
  }
}

/**
 * Get the timestamp when data was last saved
 * @param businessId - Business ID
 * @returns ISO timestamp or null
 */
export function getMRITimestamp(businessId: string): string | null {
  try {
    if (!isLocalStorageAvailable()) return null
    return localStorage.getItem(STORAGE_KEYS.timestamp(businessId))
  } catch (error) {
    return null
  }
}

/**
 * Check if localStorage is available in the current environment
 * @returns true if localStorage is available and writable
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__bei_storage_test__'
    if (typeof window === 'undefined') return false
    if (typeof window.localStorage === 'undefined') return false
    
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch (error) {
    return false
  }
}
