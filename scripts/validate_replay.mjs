import fs from 'node:fs';
import path from 'node:path';

const artifactsDir = path.join(process.cwd(), 'src', 'data', 'demoArtifacts');
const files = fs.readdirSync(artifactsDir)
  .filter((file) => file.endsWith('.v1.json'))
  .sort();

const findLatencyKeys = (value, trail = []) => {
  if (!value || typeof value !== 'object') return [];

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findLatencyKeys(item, [...trail, String(index)]));
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const nextTrail = [...trail, key];
    const ownMatch = key.toLowerCase().includes('latency') ? [nextTrail.join('.')] : [];
    return ownMatch.concat(findLatencyKeys(child, nextTrail));
  });
};

const assertReplay = (file, replay) => {
  const errors = [];
  const latencyKeys = findLatencyKeys(replay);

  if (latencyKeys.length > 0) {
    errors.push(`latency keys found: ${latencyKeys.join(', ')}`);
  }

  if (replay.frames?.heldout?.n !== 30) {
    errors.push(`heldout.n expected 30, received ${replay.frames?.heldout?.n}`);
  }

  if (replay.frames?.isolation?.n !== 10) {
    errors.push(`isolation.n expected 10, received ${replay.frames?.isolation?.n}`);
  }

  if (!Number.isFinite(replay.frames?.optimization?.trial_count) || replay.frames.optimization.trial_count <= 0) {
    errors.push(`optimization.trial_count must be greater than 0, received ${replay.frames?.optimization?.trial_count}`);
  }

  if (!replay.limitations?.includes('not_sota')) {
    errors.push('limitations must include not_sota');
  }

  if (errors.length > 0) {
    throw new Error(`${file}: ${errors.join('; ')}`);
  }
};

for (const file of files) {
  const fullPath = path.join(artifactsDir, file);
  const replay = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  assertReplay(file, replay);
  console.log(
    `${file}: passed (heldout n=${replay.frames.heldout.n}, isolation n=${replay.frames.isolation.n}, trials=${replay.frames.optimization.trial_count})`
  );
}

console.log(`validate_replay: checked ${files.length} replay artifacts`);
