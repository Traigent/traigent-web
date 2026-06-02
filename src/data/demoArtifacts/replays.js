import birdReplay from './bird.v1.json';
import spiderReplay from './spider.v1.json';
import hotpotqaReplay from './hotpotqa.v1.json';

export const replayDemos = [
  {
    id: 'bird',
    name: 'BIRD',
    label: 'BIRD mini-dev',
    deck: 'SQL optimizer fixed slice',
    dataset: birdReplay,
  },
  {
    id: 'spider',
    name: 'Spider',
    label: 'Spider',
    deck: 'Text-to-SQL fixed slice',
    dataset: spiderReplay,
  },
  {
    id: 'hotpotqa',
    name: 'HotpotQA',
    label: 'HotpotQA',
    deck: 'RAG QA fixed slice',
    dataset: hotpotqaReplay,
  },
];

export const birdDemo = replayDemos[0];

export const replayColumns = (dataset) => dataset.knobs.map((knob) => knob.key);
