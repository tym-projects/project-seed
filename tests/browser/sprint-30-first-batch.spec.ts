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
        ['雲中的小水滴或小冰晶逐漸變大', '降水'],
        ['想觀察糖水中的砂糖', '水蒸發後留下砂糖'],
        ['下列哪一項最能說明空氣中的水氣遇冷後可能發生的變化', '凝結成小水滴'],
        ['若要比較兩種水溶液是否容易導電', '使用相同裝置與相同體積，再比較結果'],
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
        ['下列哪一項最符合現代家庭分工的觀念', '家庭成員可依能力、時間與需要協調分工'],
        ['同學對未來興趣不同', '依自己的興趣與能力探索，並尊重別人的選擇'],
        ['要了解一項族群文化活動', '了解生活環境、歷史交流與活動意義'],
        ['介紹不同族群的飲食文化時', '說明文化交流形成的特色，也尊重同一族群內的差異'],
        ['網路和數位工具普及後', '科技改變可能增加人們學習與取得資訊的方式'],
        ['小組要介紹不同族群的節慶', '查找可靠資料並說明不同家庭或地區可能有差異'],
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
        ['下列哪一項最適合說明家庭的樣子', '家庭組成可能不同，但都可以互相照顧與合作'],
        ['小安要整理自己的書包', '先自己整理，再在需要時請家人協助'],
        ['住在不同地方的家人想知道彼此近況', '用電話或訊息互相問候，並在需要時提供幫助'],
        ['開始寫作業前', '先準備需要的文具，整理桌面並安排安靜的時間'],
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
