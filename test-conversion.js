const mammoth = require("mammoth");
const TurndownService = require("turndown");
const fs = require("fs");

// Simular contenido HTML típico de un documento Word
const testHtml = `
<html>
<body>
  <h1>Título Principal</h1>
  <p>Este es un párrafo con <strong>texto en negrita</strong> y <em>texto en cursiva</em>.</p>
  <h2>Subtítulo</h2>
  <ul>
    <li>Elemento de lista 1</li>
    <li>Elemento de lista 2</li>
    <li>Elemento de lista 3</li>
  </ul>
  <ol>
    <li>Primer elemento numerado</li>
    <li>Segundo elemento numerado</li>
  </ol>
  <p>Párrafo con <s>texto tachado</s> y texto normal.</p>
</body>
</html>
`;

console.log("🔧 Testing HTML to Markdown conversion...");

try {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  // Add custom rules for better markdown conversion
  turndownService.addRule("strikethrough", {
    filter: ["del", "s", "strike"],
    replacement: function (content) {
      return "~~" + content + "~~";
    },
  });

  const markdown = turndownService.turndown(testHtml);
  console.log("✅ Conversion successful!");
  console.log("📄 Resulting Markdown:");
  console.log("---");
  console.log(markdown);
  console.log("---");

  // Save result to file for inspection
  fs.writeFileSync(
    "/Users/mac/Documents/UNAM-Server/test-conversion-result.md",
    markdown
  );
  console.log("💾 Result saved to test-conversion-result.md");
} catch (error) {
  console.error("❌ Conversion failed:", error);
}
