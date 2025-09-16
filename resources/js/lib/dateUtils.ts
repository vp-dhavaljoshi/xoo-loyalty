/**
 * Date formatting utilities for consistent date display across the application
 */

/**
 * Format a date to mm-dd-yyyy format
 * @param date - Date object or date string
 * @returns Formatted date string (mm-dd-yyyy)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${month}-${day}-${year}`;
}

/**
 * Format a date to mm-dd-yyyy HH:mm format
 * @param date - Date object or date string
 * @returns Formatted date string (mm-dd-yyyy HH:mm)
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${month}-${day}-${year} ${hours}:${minutes}`;
}

/**
 * Format a date to mm-dd-yyyy HH:mm:ss format
 * @param date - Date object or date string
 * @returns Formatted date string (mm-dd-yyyy HH:mm:ss)
 */
export function formatDateTimeWithSeconds(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format time to HH:mm format
 * @param date - Date object or date string
 * @returns Formatted time string (HH:mm)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }
  
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Format time to HH:mm:ss format
 * @param date - Date object or date string
 * @returns Formatted time string (HH:mm:ss)
 */
export function formatTimeWithSeconds(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }
  
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}
