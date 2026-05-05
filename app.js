const STORAGE_KEY = "tarot-reading-records-v1";

const cards = [
  {
    name: "愚者",
    symbol: "☉",
    light: "新的开始、自由、信任直觉",
    shadow: "准备不足、逃避承诺、冲动决定",
  },
  {
    name: "魔术师",
    symbol: "✦",
    light: "资源整合、主动表达、创造机会",
    shadow: "过度控制、信息包装、目标分散",
  },
  {
    name: "女祭司",
    symbol: "☾",
    light: "潜意识、观察、等待时机",
    shadow: "沉默造成误解、信息不透明",
  },
  {
    name: "皇后",
    symbol: "✿",
    light: "滋养、丰盛、关系中的支持",
    shadow: "依赖舒适区、过度付出",
  },
  {
    name: "皇帝",
    symbol: "♜",
    light: "秩序、边界、长期规划",
    shadow: "僵化、权威压力、缺少弹性",
  },
  {
    name: "恋人",
    symbol: "♡",
    light: "选择、关系、价值观对齐",
    shadow: "犹豫、讨好、短期诱惑",
  },
  {
    name: "战车",
    symbol: "⌁",
    light: "推进、胜利、目标聚焦",
    shadow: "情绪拉扯、急于证明自己",
  },
  {
    name: "力量",
    symbol: "∞",
    light: "温柔的掌控、韧性、耐心",
    shadow: "压抑真实需求、消耗过度",
  },
  {
    name: "隐士",
    symbol: "✧",
    light: "内省、专业沉淀、独立判断",
    shadow: "孤立、拖延、拒绝求助",
  },
  {
    name: "命运之轮",
    symbol: "◌",
    light: "周期变化、机会窗口、顺势而为",
    shadow: "把责任交给运气、节奏失控",
  },
  {
    name: "正义",
    symbol: "⚖",
    light: "平衡、事实、清晰契约",
    shadow: "过度评判、纠结对错",
  },
  {
    name: "星星",
    symbol: "✶",
    light: "疗愈、希望、长期愿景",
    shadow: "理想化、行动不足",
  },
  {
    name: "月亮",
    symbol: "☽",
    light: "情绪线索、梦境、隐藏信息",
    shadow: "焦虑、投射、判断模糊",
  },
  {
    name: "太阳",
    symbol: "☀",
    light: "显化、信心、公开成果",
    shadow: "过度乐观、忽略细节",
  },
  {
    name: "审判",
    symbol: "✷",
    light: "复盘、召唤、阶段升级",
    shadow: "沉迷旧账、害怕承担新身份",
  },
  {
    name: "世界",
    symbol: "◎",
    light: "完成、整合、进入新循环",
    shadow: "不愿收尾、完美主义",
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
    advice: topicAdvice[topic],
  };
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
  return value.replace(/[&<>"']/g, (char) => {
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
