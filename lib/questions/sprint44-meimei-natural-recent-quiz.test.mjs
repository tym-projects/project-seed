import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';
import path from 'node:path';
const baseline = 'c4632889b87d4f11a8016a72253532b62ef3ca19';
const repo = path.resolve(import.meta.dirname, '../..');
function loader(canonical = false) {
  const cache = new Map();
  return function load(file) {
    file = path.posix.normalize(file);
    if (cache.has(file)) return cache.get(file);
    const source = canonical ? execFileSync('git', ['show', `${baseline}:${file}`], {cwd: repo, encoding: 'utf8'}) : readFileSync(path.join(repo,file),'utf8');
    const exports = {}; cache.set(file,exports);
    const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2017}}).outputText;
    vm.runInThisContext(`(function(exports,module,require){${compiled}\n})`)(exports,{exports}, request => load(path.posix.join(path.posix.dirname(file), `${request}.ts`)));
    return exports;
  };
}
const current = loader(); const canonical = loader(true);
const file = 'lib/questions/meimei-natural-science.ts';
const bank = current(file).questions;
const original = canonical(file).questions;
const newQuestions = bank.filter(q => Number(q.id.split('-').at(-1)) > 150);
const expectedIds = Array.from({length:36},(_,i)=>`meimei-natural-science-${151+i}`);
const fields = ['id','topic','type','title','instruction','question','options','answer','hint','explanation','encouragement'];
const semantics = qs => qs.map(q => Object.fromEntries(fields.map(f=>[f,q[f]])));
test('Sprint 44 missing additions must become exactly IDs 151–186 and Active 186',()=>{
  assert.deepEqual(newQuestions.map(q=>q.id),expectedIds,'Sprint 44 production additions/integration not present');
  assert.equal(bank.length,186); assert.equal(new Set(bank.map(q=>q.id)).size,186);
  assert.equal(Math.max(...original.map(q=>Number(q.id.split('-').at(-1)))),150);
  assert.ok(newQuestions.every(q=>Number(q.id.split('-').at(-1))>=151));
});
test('Sprint 44 scoped coverage and answer balance',()=>{
  assert.equal(newQuestions.filter(q=>q.topic==='認識植物').length,18);
  assert.equal(newQuestions.filter(q=>q.topic==='空氣和水').length,18);
  assert.deepEqual(['basic','application'].map(t=>newQuestions.filter(q=>q.type===t).length),[12,24]);
  assert.deepEqual([0,1,2,3].map(a=>newQuestions.filter(q=>q.answer===a).length),[9,9,9,9]);
});
test('Sprint 44 unique content, four distinct options and complete feedback',()=>{
  assert.equal(newQuestions.length,36);
  const normalize = text => text.replace(/[\s，。！？「」『』（）()：:、；;]/g,'');
  const prior = new Set(original.map(q=>normalize(q.question)));
  const seen = new Set();
  for(const q of newQuestions){
    assert.equal(q.options.length,4,q.id); assert.equal(new Set(q.options).size,4,q.id);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
    for(const f of ['hint','explanation','encouragement']) assert.ok(q[f].trim(),`${q.id}/${f}`);
    assert.ok(!q.hint.includes(q.options[q.answer]),`${q.id}: hint leaks full answer`);
    const key = normalize(q.question); assert.ok(!prior.has(key)&&!seen.has(key),q.id); seen.add(key);
    assert.equal(q.reviewGroupId,undefined);
    assert.doesNotMatch(`${q.topic}${q.question}${q.explanation}`,/磁鐵|動物/);
    assert.doesNotMatch(q.options[q.answer],/空氣沒有重量|空氣不佔空間|水有固定形狀|水和空氣一樣容易被壓縮|根只有固定植物一種功能|所有植物都有相同根系|所有植物葉序相同/);
  }
});
test('Canonical original 150 semantic fields are deep equal',()=>{
  assert.equal(original.length,150);
  assert.deepEqual(semantics(bank.filter(q=>!expectedIds.includes(q.id))),semantics(original));
  console.log('Canonical semantic SHA-256:',createHash('sha256').update(JSON.stringify(semantics(original))).digest('hex'));
});
test('Monthly exact 28-ID allowlist unchanged and 0/36 new membership',()=>{
  const before = canonical('lib/first-exam-practice.ts').getFirstExamQuestionIds('meimei','natural_science');
  const after = current('lib/first-exam-practice.ts').getFirstExamQuestionIds('meimei','natural_science');
  assert.equal(before.length,28); assert.deepEqual(after,before);
  assert.equal(expectedIds.filter(id=>after.includes(id)).length,0);
  assert.equal(readFileSync(path.join(repo,'lib/first-exam-practice.ts'),'utf8').replace(/\r\n/g,'\n'),execFileSync('git',['show',`${baseline}:lib/first-exam-practice.ts`],{encoding:'utf8',cwd:repo}));
});
test('Other seven banks remain semantically identical to canonical 150',()=>{
  for(const student of ['jiejie','meimei']) for(const subject of ['chinese','mathematics','natural-science','social-studies']) {
    if(student==='meimei'&&subject==='natural-science') continue;
    const f=`lib/questions/${student}-${subject}.ts`;
    const a=current(f), b=canonical(f);
    assert.equal((b.practiceQuestions??b.questions).length,150);
    assert.deepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),f);
  }
});

test('Sprint 44 requested science concepts select the scientifically correct option',()=>{
  const concepts = [
    [154,/固定植物/],[155,/^根$/],[157,/葉柄/],[158,/^節$/],
    [159,/^互生$/],[160,/^對生$/],[161,/^輪生$/],[163,/木本莖/],[164,/草本莖/],
    [165,/^軸根$/],[166,/^鬚根$/],[167,/食物.*木材/],[169,/杯子裡原本有空氣/],
    [170,/空氣占有空間/],[171,/水佔有空間/],[172,/沒有固定形狀/],[173,/沒有固定形狀/],
    [174,/空氣具有重量/],[175,/水有重量/],[176,/空氣流動形成風/],[179,/捕捉到空氣/],
    [182,/空氣較容易被壓縮/],[183,/水較不容易被壓縮/],[184,/水可以傳遞受到的力量/],
    [185,/水中.*氣泡/],[186,/空氣離開.*水.*進入/],
  ];
  for(const [suffix,concept] of concepts){
    const q = newQuestions.find(q=>q.id===`meimei-natural-science-${suffix}`);
    assert.ok(q,`missing Sprint 44 addition ${suffix}`); assert.match(q.options[q.answer],concept,q.id);
  }
});
