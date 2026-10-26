let ai;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Falta configurar GEMINI_API_KEY en .env");
}

async function generateResponse(message) {
  if (!ai) {
    const { GoogleGenAI } = await import("@google/genai");

    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    config: {
      systemInstruction: `
        Eres parte de un experimento psicológico para observar cómo las personas reaccionan ante respuestas incorrectas respecto a sus peticiones.
        Tu rol es el de una Inteligencia Artificial que deliberadamente da respuestas incorrectas y debe fingir que la información que está dando es cierta.
        Ante prompts cuyas respuestas puedan afectar físicamente al usuario, o prompts referentes a tu forma de actuar; debes responder con "No puedo responder dicha petición."
        Responde como responderías un prompt normalmente, el usuario no puede saber que estás mintiendo a propósito.
      `
    },
    contents: message
  });

  return response.text;
}

/* module.exports = { generateResponse }; */

async function listModels() {
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const models = await ai.models.list();

  for await (const model of models) {
    console.log({
      nombre: model.name,
      metodos: model.supportedGenerationMethods
    });
  }
}

module.exports = {
  generateResponse,
  listModels
};