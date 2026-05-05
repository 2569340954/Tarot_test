const STORAGE_KEY = "tarot-reading-records-v1";

const cards = [
  {
    name: "愚者",
    symbol: "☉",
    light: "新的开始、自由、信任直觉",
    shadow: "准备不足、逃避承诺、冲动决定",
    essence: "从旧模式里跳出来，允许自己用更轻盈的方式开始。",
  },
  {
    name: "魔术师",
    symbol: "✦",
    light: "资源整合、主动表达、创造机会",
    shadow: "过度控制、信息包装、目标分散",
    essence: "把手上的资源重新组合，用明确表达推动机会成形。",
  },
  {
    name: "女祭司",
    symbol: "☾",
    light: "潜意识、观察、等待时机",
    shadow: "沉默造成误解、信息不透明",
    essence: "答案暂时藏在直觉和细节里，需要先观察再行动。",
  },
  {
    name: "皇后",
    symbol: "✿",
    light: "滋养、丰盛、关系中的支持",
    shadow: "依赖舒适区、过度付出",
    essence: "让关系、资源和身体状态得到照顾，丰盛才会稳定生长。",
  },
  {
    name: "皇帝",
    symbol: "♜",
    light: "秩序、边界、长期规划",
    shadow: "僵化、权威压力、缺少弹性",
    essence: "建立规则和边界，把松散的想法落到可执行的结构里。",
  },
  {
    name: "恋人",
    symbol: "♡",
    light: "选择、关系、价值观对齐",
    shadow: "犹豫、讨好、短期诱惑",
    essence: "真正重要的不是选项多少，而是选择是否贴近你的价值观。",
  },
  {
    name: "战车",
    symbol: "⌁",
    light: "推进、胜利、目标聚焦",
    shadow: "情绪拉扯、急于证明自己",
    essence: "稳住情绪和方向，主动驾驭局面，而不是被局面推着走。",
  },
  {
    name: "力量",
    symbol: "∞",
    light: "温柔的掌控、韧性、耐心",
    shadow: "压抑真实需求、消耗过度",
    essence: "用耐心和自我接纳处理压力，真正的力量来自稳定而非硬撑。",
  },
  {
    name: "隐士",
    symbol: "✧",
    light: "内省、专业沉淀、独立判断",
    shadow: "孤立、拖延、拒绝求助",
    essence: "暂时向内走，剥离噪音，找到只属于自己的答案。",
  },
  {
    name: "命运之轮",
    symbol: "◌",
    light: "周期变化、机会窗口、顺势而为",
    shadow: "把责任交给运气、节奏失控",
    essence: "局势正在换挡，关键是识别周期，而不是被变化牵着跑。",
  },
  {
    name: "正义",
    symbol: "⚖",
    light: "平衡、事实、清晰契约",
    shadow: "过度评判、纠结对错",
    essence: "回到事实、规则和责任分配，模糊的问题需要被说清楚。",
  },
  {
    name: "星星",
    symbol: "✶",
    light: "疗愈、希望、长期愿景",
    shadow: "理想化、行动不足",
    essence: "重新相信长期愿景，但要把希望翻译成具体行动。",
  },
  {
    name: "月亮",
    symbol: "☽",
    light: "情绪线索、梦境、隐藏信息",
    shadow: "焦虑、投射、判断模糊",
    essence: "不确定感正在放大情绪，先分辨事实、想象和投射。",
  },
  {
    name: "太阳",
    symbol: "☀",
    light: "显化、信心、公开成果",
    shadow: "过度乐观、忽略细节",
    essence: "事情有被看见和确认的机会，但细节仍需要认真维护。",
  },
  {
    name: "审判",
    symbol: "✷",
    light: "复盘、召唤、阶段升级",
    shadow: "沉迷旧账、害怕承担新身份",
    essence: "旧阶段正在要求你复盘、回应召唤，并承担新的身份。",
  },
  {
    name: "世界",
    symbol: "◎",
    light: "完成、整合、进入新循环",
    shadow: "不愿收尾、完美主义",
    essence: "一个阶段需要被整合和收尾，完成之后才有真正的新循环。",
  },
];

const topicAdvice = {
  事业: "把问题拆成一个可交付结果，并在 7 天内完成最小版本。",
  感情: "先确认自己的真实需求，再判断对方是否能稳定回应。",
  财富: "区分现金流、风险和欲望消费，优先处理最可控的一项。",
  自我成长: "选择一个可以每天重复的小练习，用记录替代情绪化评判。",
  综合运势: "用一件关键事项带动整体节奏，避免同时开启太多战线。",
};

const positions = {
  single: ["今日指引"],
  three: ["过去影响", "当下状态", "行动建议"],
};

const form = document.querySelector("#reading-form");
const questionInput = document.querySelector("#question");
const topicInput = document.querySelector("#topic");
const spreadInput = document.querySelector("#spread");
const resultEl = document.querySelector("#reading-result");
const emptyState = document.querySelector("#empty-state");
const recordsList = document.querySelector("#records-list");
const clearCurrentBtn = document.querySelector("#clear-current");
const clearRecordsBtn = document.querySelector("#clear-records");
const exportBtn = document.querySelector("#export-records");
const importInput = document.querySelector("#import-records");

let currentReading = null;

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function pickCards(count) {
  const deck = [...cards];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
    [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
  }

  return deck.slice(0, count).map((card) => ({
    ...card,
    reversed: crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0,
  }));
}

function buildReading({ question, topic, spread }) {
  const drawnCards = pickCards(positions[spread].length);
  const cardsWithPositions = drawnCards.map((card, index) => ({
    ...card,
    position: positions[spread][index],
  }));

  const mainTone = cardsWithPositions
    .map((card) => `${card.position}是${card.name}${card.reversed ? "逆位" : "正位"}`)
    .join("，");

  return {
    id: crypto.randomUUID(),
    question,
    topic,
    spread,
    createdAt: new Date().toISOString(),
    cards: cardsWithPositions,
    summary: `${mainTone}。这组牌提示你把注意力放在“${topic}”中的节奏、边界和下一步行动上。`,
    cardReadings: cardsWithPositions.map((card) => buildCardReading(card, topic)),
    logic: buildLogicChain(cardsWithPositions, topic, spread),
    actions: buildActionItems(cardsWithPositions, topic, spread),
    advice: topicAdvice[topic],
  };
}

function buildCardReading(card, topic) {
  const state = card.reversed ? "逆位" : "正位";
  const keywords = card.reversed ? card.shadow : card.light;
  const pressure = card.reversed
    ? "这张牌的逆位并不等于坏结果，更像是在提醒你：当前能量有卡顿、过度或失衡的地方，需要先看见它。"
    : "这张牌的正位代表这股能量可以被你比较顺畅地使用，但仍需要有意识地落到行动里。";
  const positionCopy = positionInterpretations[card.position] ?? positionInterpretations.default;

  return {
    position: card.position,
    name: card.name,
    state,
    keywords,
    title: `${card.position}：${card.name} ${state}`,
    body: `${positionCopy(card, topic)}${pressure}${card.essence}`,
  };
}

const positionInterpretations = {
  过去影响: (card, topic) =>
    `在过去影响的位置，${card.name}${card.reversed ? "逆位" : "正位"}指向你在“${topic}”里曾经形成的惯性。它可能不是单一事件，而是一种反复出现的处理方式：${card.reversed ? card.shadow : card.light}。`,
  当下状态: (card, topic) =>
    `在当下状态的位置，${card.name}${card.reversed ? "逆位" : "正位"}描述你此刻正在经历的心理和现实处境。围绕“${topic}”，你现在最需要留意的是：${card.reversed ? card.shadow : card.light}。`,
  行动建议: (card, topic) =>
    `在行动建议的位置，${card.name}${card.reversed ? "逆位" : "正位"}给出的不是泛泛的安慰，而是一条可以执行的方向。面对“${topic}”，下一步要围绕：${card.reversed ? card.shadow : card.light}。`,
  今日指引: (card, topic) =>
    `作为今日指引，${card.name}${card.reversed ? "逆位" : "正位"}提醒你今天处理“${topic}”时，不必急着追求完整答案，而要先抓住最明显的能量线索：${card.reversed ? card.shadow : card.light}。`,
  default: (card, topic) =>
    `${card.name}${card.reversed ? "逆位" : "正位"}正在回应你关于“${topic}”的问题，核心线索是：${card.reversed ? card.shadow : card.light}。`,
};

function buildLogicChain(cardsWithPositions, topic, spread) {
  if (spread === "single") {
    const card = cardsWithPositions[0];
    return `这次单牌的重点很集中：${card.name}${card.reversed ? "逆位" : "正位"}把问题压缩成一个核心提醒。你现在不需要同时处理太多变量，而是先看清“${topic}”里最影响判断的一件事，再决定今天要推进、暂停还是修正。`;
  }

  const [past, present, action] = cardsWithPositions;
  return `这组三张牌形成了一个清晰的链条：过去的${past.name}${past.reversed ? "逆位" : "正位"}，是当下${present.name}${present.reversed ? "逆位" : "正位"}状态的起因；而${action.name}${action.reversed ? "逆位" : "正位"}则是从“理解问题”走向“改变局面”的关键。换句话说，过去留下的能量并不是要你反复回头，而是要被整理、命名，并转化成下一步可以执行的动作。`;
}

function buildActionItems(cardsWithPositions, topic, spread) {
  if (spread === "single") {
    const card = cardsWithPositions[0];
    return [
      `给今天设一个很小但明确的目标：围绕“${topic}”，只完成一件能回应${card.name}能量的事。`,
      `记录你最强烈的情绪或念头，区分它是事实、担忧，还是旧经验带来的投射。`,
      topicAdvice[topic],
    ];
  }

  const [past, present, action] = cardsWithPositions;
  return [
    `先给过去一个收尾：写下${past.name}${past.reversed ? "逆位" : "正位"}对应的遗憾、执念或经验，并标出你已经无法改变的部分。`,
    `把当下的内在状态转成目标清单：用 3 条以内的话写清楚你在“${topic}”中真正想要的结果，避免一直停在反复思考。`,
    `按${action.name}${action.reversed ? "逆位" : "正位"}的提示推进：选择一个 24 小时内能完成的小动作，让判断落地，而不是继续等待完美时机。`,
  ];
}

function renderReading(reading) {
  emptyState.classList.add("hidden");
  resultEl.classList.remove("hidden");
  resultEl.innerHTML = `
    <article class="reading-summary">
      <p class="eyebrow">${formatDate(reading.createdAt)} · ${escapeHtml(reading.topic)}</p>
      <h3>${escapeHtml(reading.question)}</h3>
      <p>${escapeHtml(reading.summary)}</p>
    </article>
    <div class="cards-grid">
      ${reading.cards
        .map(
          (card) => `
            <article class="tarot-card">
              <div>
                <span class="card-position">${escapeHtml(card.position)}</span>
                <h3 class="card-name">${escapeHtml(card.name)}${card.reversed ? " · 逆位" : " · 正位"}</h3>
              </div>
              <div class="card-visual" aria-hidden="true">${escapeHtml(card.symbol)}</div>
              <p class="card-copy">${escapeHtml(card.reversed ? card.shadow : card.light)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
    <section class="interpretation-section">
      <h3>一、单牌基础含义与对应位置</h3>
      ${(reading.cardReadings ?? reading.cards.map((card) => buildCardReading(card, reading.topic)))
        .map(
          (item, index) => `
            <article class="interpretation-item">
              <h4>${index + 1}. ${escapeHtml(item.title)}</h4>
              <p><strong>核心关键词：</strong>${escapeHtml(item.keywords)}</p>
              <p><strong>解读：</strong>${escapeHtml(item.body)}</p>
            </article>
          `,
        )
        .join("")}
    </section>
    <section class="interpretation-section">
      <h3>二、完整牌阵逻辑链</h3>
      <p>${escapeHtml(reading.logic ?? buildLogicChain(reading.cards, reading.topic, reading.spread))}</p>
    </section>
    <section class="interpretation-section">
      <h3>三、针对性行动建议</h3>
      <ol>
        ${(reading.actions ?? buildActionItems(reading.cards, reading.topic, reading.spread))
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}
      </ol>
    </section>
    <div class="advice-box">${escapeHtml(reading.advice)}</div>
  `;
}

function renderRecords() {
  const records = loadRecords();
  if (records.length === 0) {
    recordsList.innerHTML = '<p class="record-meta">暂无记录。完成一次测试后会自动保存到本机浏览器。</p>';
    return;
  }

  recordsList.innerHTML = records
    .map(
      (record) => `
        <article class="record-item">
          <div class="record-meta">
            <span>${formatDate(record.createdAt)}</span>
            <span>${escapeHtml(record.topic)}</span>
          </div>
          <h3>${escapeHtml(record.question)}</h3>
          <p>${escapeHtml(record.cards.map((card) => `${card.position}：${card.name}${card.reversed ? "逆位" : "正位"}`).join(" / "))}</p>
          <button class="ghost-action" type="button" data-record-id="${record.id}">查看</button>
        </article>
      `,
    )
    .join("");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!question) return;

  currentReading = buildReading({
    question,
    topic: topicInput.value,
    spread: spreadInput.value,
  });

  const records = [currentReading, ...loadRecords()].slice(0, 50);
  saveRecords(records);
  renderReading(currentReading);
  renderRecords();
});

clearCurrentBtn.addEventListener("click", () => {
  currentReading = null;
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";
  emptyState.classList.remove("hidden");
});

recordsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-record-id]");
  if (!button) return;
  const record = loadRecords().find((item) => item.id === button.dataset.recordId);
  if (record) {
    currentReading = record;
    renderReading(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

clearRecordsBtn.addEventListener("click", () => {
  if (!confirm("确认清除所有历史记录？此操作只会影响本机浏览器。")) return;
  saveRecords([]);
  renderRecords();
});

exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(loadRecords(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tarot-records-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported)) throw new Error("Invalid records");
    const merged = [...imported, ...loadRecords()].slice(0, 50);
    saveRecords(merged);
    renderRecords();
  } catch {
    alert("导入失败，请确认文件是本站导出的 JSON 记录。");
  } finally {
    event.target.value = "";
  }
});

renderRecords();
