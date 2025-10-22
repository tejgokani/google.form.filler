/**
 * Get a random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random item from an array
 */
export function randomChoice<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[randomInt(0, array.length - 1)];
}

/**
 * Pick multiple random items from an array (for checkboxes)
 */
export function randomChoices<T>(array: T[], min: number = 1, max?: number): T[] {
  if (array.length === 0) return [];
  
  const maxChoices = max || Math.min(array.length, 3);
  const numChoices = randomInt(min, maxChoices);
  
  // Shuffle array and take first n items
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numChoices);
}

/**
 * Generate a random date string in MM/DD/YYYY format
 */
export function randomDate(): string {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

/**
 * Generate a random time string in HH:MM format
 */
export function randomTime(): string {
  const hour = randomInt(0, 23);
  const minute = randomInt(0, 59);
  
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Generate a random email address
 */
export function randomEmail(): string {
  const names = ['john', 'jane', 'alex', 'sarah', 'mike', 'emily', 'david', 'lisa'];
  const domains = ['example.com', 'test.com', 'demo.com', 'sample.org'];
  
  const name = randomChoice(names);
  const domain = randomChoice(domains);
  const number = randomInt(1, 999);
  
  return `${name}${number}@${domain}`;
}
