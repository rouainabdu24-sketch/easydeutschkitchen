/**
 * EasyDeutschKitchen — Image Generator
 * Uses fal.ai FLUX to generate all recipe images + author photo + OG image
 *
 * Usage:
 *   FAL_KEY=your_key node scripts/generate-images.mjs
 *
 * Or with .env:
 *   node --env-file=.env scripts/generate-images.mjs
 *
 * Options:
 *   --only=sauerbraten-hero    Generate a single image by filename
 *   --dry-run                  Print prompts without generating
 */

import { fal } from '@fal-ai/client';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'public', 'images');

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const onlyFlag  = args.find(a => a.startsWith('--only='))?.split('=')[1];
const isDryRun  = args.includes('--dry-run');

// ─── Model ───────────────────────────────────────────────────────────────────
// fal-ai/flux/dev  → good quality, moderate cost
// fal-ai/flux/schnell → fast, cheaper (less detail)
const MODEL = 'fal-ai/flux/dev';

// ─── Shared style suffix appended to every food prompt ───────────────────────
const FOOD_STYLE = [
  'professional food photography',
  'shot on Canon R5 with 85mm lens',
  'soft natural window light',
  'shallow depth of field',
  'Pinterest food blog aesthetic',
  'crisp sharp focus on food',
  'clean background',
  'appetizing',
  'warm tones',
].join(', ');

// ─── Image definitions ───────────────────────────────────────────────────────
const IMAGES = [

  // ── Sauerbraten ─────────────────────────────────────────────────────────
  {
    filename: 'recipes/sauerbraten-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Sliced classic German Sauerbraten beef roast on a dark wooden board, rich deep brown gravy poured over it, braised red cabbage on the side, large potato dumplings Klöße, fresh parsley garnish, ${FOOD_STYLE}`,
  },
  {
    filename: 'recipes/sauerbraten-mid.jpg',
    width: 1000, height: 1500,
    prompt: `Close-up of dark glossy Sauerbraten gravy being spooned over tender sliced beef, steam rising, cast iron pan in background, rustic German kitchen atmosphere, ${FOOD_STYLE}`,
  },

  // ── Kartoffelsuppe ──────────────────────────────────────────────────────
  {
    filename: 'recipes/kartoffelsuppe-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Creamy German potato soup Kartoffelsuppe in a white ceramic bowl, topped with crispy golden bacon lardons, fresh chive rings, drizzle of cream, rustic wooden table, bread roll beside bowl, ${FOOD_STYLE}`,
  },

  // ── Apfelstrudel ────────────────────────────────────────────────────────
  {
    filename: 'recipes/apfelstrudel-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Freshly baked Viennese apple strudel Apfelstrudel on a wooden board, golden flaky pastry dusted with powdered sugar, sliced open to reveal cinnamon apple and raisin filling, vanilla sauce drizzle beside it, ${FOOD_STYLE}`,
  },
  {
    filename: 'recipes/apfelstrudel-mid.jpg',
    width: 1000, height: 1500,
    prompt: `Hands stretching paper-thin strudel dough over a floured linen tablecloth, sunlight illuminating the translucent dough, traditional home baking scene, flour dusted wooden table, ${FOOD_STYLE}`,
  },

  // ── Brezel ──────────────────────────────────────────────────────────────
  {
    filename: 'recipes/brezel-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Three freshly baked Bavarian lye pretzels Laugenbrezel on a wooden board, deep mahogany brown crust, coarse salt crystals on top, small dish of butter beside them, white linen cloth, ${FOOD_STYLE}`,
  },

  // ── Pfannkuchen ─────────────────────────────────────────────────────────
  {
    filename: 'recipes/pfannkuchen-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Stack of thin golden German pancakes Pfannkuchen on a white plate, fresh mixed berries on top, dusting of powdered sugar, small jar of jam beside plate, morning light, ${FOOD_STYLE}`,
  },

  // ── Rotkohl ─────────────────────────────────────────────────────────────
  {
    filename: 'recipes/rotkohl-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Braised German red cabbage Rotkohl in a black cast iron pot, deep purple-red color, bay leaves and whole spices visible, wooden spoon resting on rim, rustic kitchen counter, ${FOOD_STYLE}`,
  },

  // ── Lebkuchen ────────────────────────────────────────────────────────────
  {
    filename: 'recipes/lebkuchen-hero.jpg',
    width: 1000, height: 1500,
    prompt: `Round Nuremberg Lebkuchen gingerbread cookies on a dark slate board, half dipped in dark chocolate glaze, half with white sugar icing, whole almonds on top, pine cones and cinnamon sticks as decoration, Christmas mood, ${FOOD_STYLE}`,
  },

  // ── OG Default (landscape) ──────────────────────────────────────────────
  {
    filename: 'og-default.jpg',
    width: 1200, height: 630,
    prompt: `Flat lay top view of a German food feast table, Sauerbraten, Brezel pretzels, Lebkuchen, Kartoffelsuppe bowl, seasonal vegetables, rustic wooden table, warm light, authentic Bavarian kitchen atmosphere, ${FOOD_STYLE}`,
  },

  // ── Author portrait ──────────────────────────────────────────────────────
  {
    filename: 'lena-bauer.jpg',
    width: 600, height: 600,
    prompt: `Portrait of a friendly smiling German woman in her early 30s named Lena, standing in a bright modern kitchen, wearing a casual apron, holding a wooden spoon, warm natural light from window, professional headshot style, approachable and authentic, sharp focus on face`,
  },

];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

function pad(n, width = 2) {
  return String(n).padStart(width, ' ');
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function generateImage(img, index, total) {
  const outputPath = join(OUTPUT_DIR, img.filename);
  const label = `[${pad(index + 1)}/${total}] ${img.filename}`;

  if (isDryRun) {
    console.log(`\n${label}`);
    console.log(`  Size   : ${img.width}×${img.height}`);
    console.log(`  Prompt : ${img.prompt.slice(0, 120)}…`);
    return;
  }

  // Skip if already exists
  if (existsSync(outputPath)) {
    console.log(`  ⏭  ${label} — already exists, skipping`);
    return;
  }

  console.log(`\n  ⏳ Generating ${label}…`);

  try {
    const result = await fal.subscribe(MODEL, {
      input: {
        prompt: img.prompt,
        image_size: { width: img.width, height: img.height },
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'jpeg',
        enable_safety_checker: true,
      },
      logs: false,
    });

    const imageUrl = result.data?.images?.[0]?.url;
    if (!imageUrl) throw new Error('No image URL in response');

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const buffer = await response.arrayBuffer();

    ensureDir(outputPath);
    writeFileSync(outputPath, Buffer.from(buffer));

    const size = formatBytes(buffer.byteLength);
    console.log(`  ✅ Saved → ${outputPath.replace(ROOT, '.')}  (${size})`);

  } catch (err) {
    console.error(`  ❌ Failed: ${err.message}`);
    if (err.body) console.error('     API error:', JSON.stringify(err.body, null, 2));
  }
}

async function main() {
  // Check API key
  const apiKey = process.env.FAL_KEY;
  if (!apiKey && !isDryRun) {
    console.error('\n❌  FAL_KEY environment variable not set.');
    console.error('    Run: FAL_KEY=your_key node scripts/generate-images.mjs');
    console.error('    Or:  node --env-file=.env scripts/generate-images.mjs\n');
    process.exit(1);
  }

  if (apiKey) {
    fal.config({ credentials: apiKey });
  }

  // Filter if --only flag
  const toGenerate = onlyFlag
    ? IMAGES.filter(img => img.filename.includes(onlyFlag))
    : IMAGES;

  if (toGenerate.length === 0) {
    console.error(`❌  No image found matching: ${onlyFlag}`);
    process.exit(1);
  }

  console.log(`\n🍳 EasyDeutschKitchen — Image Generator`);
  console.log(`   Model  : ${MODEL}`);
  console.log(`   Images : ${toGenerate.length}`);
  console.log(`   Output : public/images/`);
  if (isDryRun) console.log(`   Mode   : DRY RUN (no API calls)\n`);

  const start = Date.now();

  // Generate sequentially to avoid rate limits
  for (let i = 0; i < toGenerate.length; i++) {
    await generateImage(toGenerate[i], i, toGenerate.length);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✨ Done in ${elapsed}s`);
}

main();
