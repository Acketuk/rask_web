const cache = new Map<string, string>();

export async function translate(text: string, targetLang: string): Promise<string> {
  if (!text.trim() || targetLang === "en") return text;
  const key = `${targetLang}:${text}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const q = encodeURIComponent(text.slice(0, 500));
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${q}&langpair=en|${targetLang}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return text;
    const data = await res.json();
    const translated: string = data?.responseData?.translatedText;
    if (!translated || translated.includes("QUERY LENGTH LIMIT")) return text;
    cache.set(key, translated);
    return translated;
  } catch {
    return text;
  }
}
