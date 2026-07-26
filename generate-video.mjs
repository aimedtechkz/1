// Перед запуском обязательно установи переменную окружения:
// export XAI_API_KEY="твой_ключ"

import { xai } from "@ai-sdk/xai";
import { experimental_generateVideo as generateVideo } from "ai";

const result = await generateVideo({
  model: xai.video("grok-imagine-video-1.5"),
  prompt: {
    text: `Create a cinematic 10-second luxury perfume advertisement video based on the reference image. Style: High-end commercial luxury fragrance ad, elegant and sensual, shot on Arri Alexa 35 with anamorphic lenses, soft cinematic lighting, shallow depth of field, rich color grading with deep jewel tones. Sequence (exactly 10 seconds): 0–3s: Slow, smooth camera orbit around the beautiful perfume bottle, starting close on the glass and liquid, highlighting refraction and elegant details. Soft dramatic lighting with gentle lens flares. 3–6s: Camera pulls back gracefully while the bottle gently rotates. Subtle sparkling particles and fine mist of perfume float around it. Elegant product details shine under the light. 6–10s: Camera continues to pull back into a beautiful final composition with the bottle centered. Soft smoke/perfume mist swirls elegantly. The bottle glows with a luxurious aura. Final shot feels premium and aspirational. Mood: Sophisticated, seductive, mysterious, and ultra-luxurious. Slow, smooth cinematic camera movements. High production value. Technical: 10 seconds duration, 24fps, ultra-realistic, photorealistic materials (glass, liquid, metallic cap), perfect reflections and refractions, subtle motion, high detail, 4K`,
    image: "https://data.x.ai/imagine-console/perfume-advert.webp",
  },
  duration: 10,
  providerOptions: {
    xai: { resolution: "720p" },
  },
});

const videoUrl = result.providerMetadata?.xai?.videoUrl;
console.log("Video URL:", videoUrl);
