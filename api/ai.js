import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { query, sites } = req.body;

  // MOCK dati (qui collegherai Subito / Autoscout / Marketplace)
  const mock = [
    { title:"Fiat Panda 1.2", price:"5200 €", km:"65000 km", year:"2016", site:"subito", link:"#"},
    { title:"VW Golf 1.6 TDI", price:"4800 €", km:"145000 km", year:"2012", site:"autoscout", link:"#"}
  ];

  // Claude
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = `
Sei un assistente esperto di auto usate.
Analizza questi annunci e restituisci:
- verdict: good / medium / bad
- verdictLabel: etichetta sintetica
- aiSummary: 1 frase utile e concreta
- summary finale: 1 frase

Annunci:
${JSON.stringify(mock)}
`;

  const claude = await client.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 800,
    messages: [{ role:"user", content: prompt }]
  });

  const text = claude.content[0].text;

  // Claude restituisce testo → lo convertiamo in JSON
  const parsed = JSON.parse(text);

  return res.status(200).json(parsed);
}
