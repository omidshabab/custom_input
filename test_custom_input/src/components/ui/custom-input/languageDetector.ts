export function detectLanguageAndApplyFont(element: HTMLElement) {
  const text = element.textContent || "";

  if (!text.trim()) {
    element.innerHTML = "";
    element.className = "input-text";
    element.style.direction = "ltr";
    return;
  }

  const persianArabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const latinRegex = /[A-Za-z]/;

  let processedHTML = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (persianArabicRegex.test(char)) {
      processedHTML += `<span style="font-family: 'Estedad', sans-serif">${char}</span>`;
    } else if (latinRegex.test(char)) {
      processedHTML += `<span style="font-family: 'Manrope', sans-serif">${char}</span>`;
    } else {
      if (i > 0) {
        const prevChar = text[i - 1];
        if (persianArabicRegex.test(prevChar)) {
          processedHTML += `<span style="font-family: 'Estedad', sans-serif">${char}</span>`;
        } else {
          processedHTML += `<span style="font-family: 'Manrope', sans-serif">${char}</span>`;
        }
      } else {
        processedHTML += `<span style="font-family: 'Manrope', sans-serif">${char}</span>`;
      }
    }
  }

  const persianArabicCount = (text.match(persianArabicRegex) || []).length;
  const latinCount = (text.match(latinRegex) || []).length;
  element.style.direction = persianArabicCount > latinCount ? "rtl" : "ltr";

  element.className = "input-text";
  element.innerHTML = processedHTML;
}
