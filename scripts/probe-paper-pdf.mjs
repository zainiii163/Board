const url = process.argv[2] || "https://fbisepastpapers.com/class-9-biology-fbise-past-paper-2026/";
const html = await (await fetch(url)).text();
const pdfs = [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.pdf[^"'\\\s>]*/gi)].map((m) => m[0]);
const uploads = [...html.matchAll(/wp-content\/uploads\/[^"'\\\s>]+/g)].map((m) => m[0]).slice(0, 20);
console.log(JSON.stringify({ url, pdfs: [...new Set(pdfs)].slice(0, 15), uploads }, null, 2));
