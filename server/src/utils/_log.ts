export const log = (title: string, data: Record<string, any>) => {
  const date = new Date().toLocaleTimeString('hu-HU', { hour12: false });
  console.log('\n', '\x1b[33m[INFO]\x1b[0m', date, `\x1b[36m${title.toUpperCase()}\x1b[0m`);
  for (const key in data) console.log(`  ${key}:`, data[key]);
};
