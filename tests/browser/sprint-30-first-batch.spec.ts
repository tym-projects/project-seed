import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('loads the new Sprint 30 natural and social questions in isolated first practice flows', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  await context.addInitScript(() => { Math.random = () => 0; });
  const cases = [
    {
      path: '/jiejie/natural-science',
      heading: '🌸 姐姐的自然練習',
      targetPrefixes: ['從冰箱拿出一瓶冰水', '觀察衛星雲圖時'],
      questions: [
        ['陽光照射下，地面上的水逐漸變少', '水變成水蒸氣，進入空氣中'],
        ['小安把洗好的手帕攤開', '攤開並通風，能讓水較容易蒸發'],
        ['把砂糖加入水中並攪拌', '砂糖是溶質，水是溶劑'],
        ['兩杯水的溫度和水量相同', '甲杯較快，因為攪拌能增加水和砂糖接觸、混合的機會'],
        ['從冰箱拿出一瓶冰水', '空氣中的水蒸氣遇冷凝結成小水滴'],
        ['觀察衛星雲圖時', '該地有較多雲層，是否降雨仍需配合其他資料判斷'],
        ['下列哪一個順序最能表示自然界中水循環的一段常見變化', '水蒸發 → 水蒸氣凝結 → 降水'],
        ['將少量砂糖加入水中並充分攪拌', '砂糖均勻分散在水中，糖水各部分都含有砂糖'],
      ],
    },
    {
      path: '/jiejie/social-studies',
      heading: '🌸 姐姐的社會練習',
      targetPrefixes: ['隨著教育機會增加', '臺灣不同族群在生活中互相交流'],
      questions: [
        ['下列哪一項是臺灣民主政治發展中的可查證歷史事實', '1996 年臺灣舉行第一次總統直接民選'],
        ['班級要決定校外教學的集合方式', '透過討論與合乎規則的參與形成共同決定'],
        ['下列哪一個例子最能說明「社會變遷」', '隨著交通與科技改變，人們工作的方式和生活安排也跟著改變'],
        ['學校要辦理族群文化介紹活動', '先查證資料並向文化持有者請教，依對方意願尊重呈現'],
        ['隨著教育機會增加', '個人有更多學習與發展能力的機會'],
        ['臺灣不同族群在生活中互相交流', '族群交流可能讓不同文化互相影響，產生新的生活樣貌'],
      ],
    },
    {
      path: '/meimei/social-studies',
      heading: '🌿 妹妹的社會練習',
      targetPrefixes: ['媽媽的弟弟來家裡作客', '小安明天要交一份報告'],
      questions: [
        ['下列哪一個說法最符合家庭生活中的分工合作', '家庭成員可以依能力和需要一起分擔生活中的工作'],
        ['週末姐姐和弟弟都想使用客廳', '先說明自己的需要，再和家人一起討論使用時間'],
        ['下列哪一項最能說明「學習和成長」', '我們可以在學校、家庭和生活經驗中學會新的知識與做法'],
        ['小華練習寫字時', '請教老師或家人，找出問題後再分段練習'],
        ['媽媽的弟弟來家裡作客', '舅舅'],
        ['小安明天要交一份報告', '先列出需要完成的工作，再安排時間依序進行'],
      ],
    },
  ] as const;

  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  for (const item of cases) {
    await page.goto(item.path);
    await expect(page.getByRole('heading', { name: item.heading })).toBeVisible();
    const seenQuestionPrefixes = new Set<string>();
    for (let step = 0; step < item.questions.length; step += 1) {
      const text = await page.locator('main').innerText();
      const current = item.questions.find(([prefix]) => text.includes(prefix));
      expect(current).toBeDefined();
      seenQuestionPrefixes.add(current![0]);
      await page.getByRole('button', { name: current![1], exact: true }).click();
      await page.getByRole('button', { name: '送出答案' }).click();
      await expect(page.getByText(/答對了！|答錯了。|練習完成！/)).toBeVisible();
      const next = page.getByRole('button', { name: '下一題' });
      if (await next.count() === 0) break;
      await next.click();
    }
    expect(seenQuestionPrefixes.size).toBe(item.questions.length);
    for (const target of item.targetPrefixes) {
      expect(seenQuestionPrefixes.has(target)).toBe(true);
    }
  }

  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});
