// Set the XAI_API_KEY environment variable before running.
// Рекомендуется: скопируй .env.example → .env и вставь ключ

import "dotenv/config";
import { xai } from "@ai-sdk/xai";
import { experimental_generateVideo as generateVideo } from "ai";

async function main() {
  if (!process.env.XAI_API_KEY) {
    console.error("❌  XAI_API_KEY не задан. Создай файл .env или экспортируй переменную.");
    process.exit(1);
  }

  console.log("🎬  Генерация видео запущена... (это может занять 1–3 минуты)");

  try {
    const result = await generateVideo({
      model: xai.video("grok-imagine-video-1.5"),
      prompt: {
        text: `Create a cinematic 10-second luxury perfume advertisement video based on the reference image.
Style: High-end commercial luxury fragrance ad, elegant and sensual, shot on Arri Alexa 35 with anamorphic lenses, soft cinematic lighting, shallow depth of field, rich color grading with deep jewel tones.

Sequence (exactly 10 seconds):
0–3s: Slow, smooth camera orbit around the beautiful perfume bottle, starting close on the glass and liquid, highlighting refraction and elegant details. Soft dramatic lighting with gentle lens flares.
3–6s: Camera pulls back gracefully while the bottle gently rotates. Subtle sparkling particles and fine mist of perfume float around it. Elegant product details shine under the light.
6–10s: Camera continues to pull back into a beautiful final composition with the bottle centered. Soft smoke/perfume mist swirls elegantly. The bottle glows with a luxurious aura. Final shot feels premium and aspirational.

Mood: Sophisticated, seductive, mysterious, and ultra-luxurious.
Slow, smooth cinematic camera movements. High production value.

Technical: 10 seconds duration, 24fps, ultra-realistic, photorealistic materials (glass, liquid, metallic cap), perfect reflections and refractions, subtle motion, high detail, 4K`,
        image: "https://data.x.ai/imagine-console/perfume-advert.webp",
      },
      duration: 10,
      providerOptions: {
        xai: {
          resolution: "720p",
          // pollTimeoutMs: 600_000, // раскомментируй, если нужно ждать дольше 10 минут
        },
      },
    });

    const videoUrl = result.providerMetadata?.xai?.videoUrl;

    if (videoUrl) {
      console.log("\n✅  Видео готово!");
      console.log("🔗  URL:", videoUrl);
      console.log("\nСкачай видео по ссылке (ссылка временная).");
    } else {
      console.log("Результат:", JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("❌  Ошибка генерации:", error.message || error);
    process.exit(1);
  }
}

main();
