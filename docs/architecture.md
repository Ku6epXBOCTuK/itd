# 📖 ARCHITECTURE.md: Руководство по разработке Idle TD

## 🎯 Контекст проекта

**Жанр:** Idle Tower Defense (3D).
**Стек:** TypeScript, SvelteKit (только UI/Роутинг), Svelte 5 Runes (реактивность), Three.js (только рендер), Miniplex (ECS).
**Главная цель:** Максимальная скорость итераций (придумывание механик на ходу) при сохранении чистоты кода, тестируемости и нулевой связанности (Low Coupling) слоев.

## СТРОГО К СОБЛЮДЕНИЮ - Правила

- Svelte файлы должны быть минимально возможными, только отображение интерфейса, без кучи кода (особенно в onMount)
- Код должен быть читаемым, чтобы любой программист мог легко понять, что делает та или иная функция
- JS файлы запрещены, только TypeScript
- не пиши комментарии, если это не сложный кусок кода. все должно быть понятно по названию функции и аргументов

---

## 🏛️ 4 Золотых Правила Архитектуры (СТРОГО К СОБЛЮДЕНИЮ)

### 1. Screaming Architecture («Кричащая» архитектура)

Структура проекта отражает **игровые механики**, а не технические паттерны.

- ❌ **ЗАПРЕЩЕНО:** Папки `components`, `systems`, `utils`, `helpers`.
- ✅ **ОБЯЗАТЕЛЬНО:** Папки по фичам: `economy/`, `towers/`, `waves/`, `modifiers/`.
- Если ИИ нужно добавить механику "Бонус за волну", он должен искать папку `waves/` или `modifiers/`, а не рыться в абстрактных `utils`.

### 2. Анти-Overengineering (Прагматичность)

- ❌ **ЗАПРЕЩЕНО:** Паттерны Repository, Factory (как классы), Strategy, интерфейсы с префиксом `I` (если нет множественных реализаций). Миниплекс _уже_ является твоей фабрикой и хранилищем. Отказ от Svelte Stores в пользу Runes ради избавления от бойлерплейта.
- ✅ Используем простые `type` в TypeScript и обычные функции.
- ✅ **Данные:** Не оборачиваем данные в классы-обертки. Работаем с плоскими объектами.

### 3. Слоеная архитектура модуля (Строгий лимит в 3 файла)

Чтобы избежать Overengineering, **каждый модуль внутри `modules/` делится строго на 3 части**. Нельзя добавлять туда четвертый файл "для удобства":

1.  `*.components.ts` — Определение данных/схем (что хранится в ECS). Пример: `type Tower = { damage: number }`.
2.  `factories.ts` — Функции создания объектов (сборка сущностей для Miniplex). Пример: `createArcherTower()`.
3.  `systems/` — Папка с чистыми функциями логики, которые обрабатывают сущности. Пример: `AttackSystem.ts`. Системы не должны хранить состояние, они только трансформируют данные компонентов.

### 4. Модульный монолит

Модули независимы. Модуль `economy` (золото) не должен напрямую импортировать функции создания из модуля `towers`. Они общаются только через чтение/запись общих компонентов в едином экземпляре Miniplex World или через Event Bus (для одноразовых триггеров).

---

## 📁 Эталонная структура проекта

```text
src/
├── lib/
│   ├── core/                        # Ядро (Глобальное для всей игры)
│   │   ├── game-loop.ts             # Запуск requestAnimationFrame и вызов ECS систем
│   │   ├── event-bus.ts             # Шина событий (для связи UI -> Игра и триггеров)
│   │   └── world.ts                 # Единственный экземпляр Miniplex World
│   │
│   ├── modules/                     # 🎯 SCREAMING ARCHITECTURE
│   │   ├── towers/
│   │   │   ├── towers.components.ts # type TowerProps, type TowerEntity...
│   │   │   ├── factories.ts         # export const createArcherTower = () => world.add({...})
│   │   │   └── systems/
│   │   │       ├── attack.system.ts # Чистая логика: расчет и применение урона
│   │   │       └── targeting.system.ts
│   │   │
│   │   ├── economy/
│   │   │   ├── economy.components.ts
│   │   │   ├── factories.ts         # createGameState()
│   │   │   └── systems/
│   │   │       └── income.system.ts
│   │   │
│   │   └── render/                  # Модуль визуализации (такая же фича, как и башни)
│   │       ├── render.components.ts # type View = { mesh: THREE.Mesh } (ОПЦИОНАЛЬНЫЙ компонент!)
│   │       └── systems/
│   │           └── sync-render.system.ts # Перенос позиций из ECS в Three.js
│   │
│   └── adapters/                    # Слой интеграции (Тонкий мост)
│       └── ui-state/
│           └── game-state.ts        # Мост: Объекты с $state rune для Svelte
│
├── routes/                          # SvelteKit (Только отрисовка UI!)
│   └── game/
│       └── +page.svelte             # Читает uiState.gold, вызывает GameEngine.emit()
```

---

## 🔄 Схема взаимодействия (Low Coupling) — ЭТАЛОНЫ ДЛЯ ИИ

### А) Связь "Логика -> Визуал" (Three.js как деталь)

Three.js — это просто "глаза", которые смотрят на данные ECS. Логика не знает о нем вообще.

- **Данные:** Сущность в ECS имеет _опциональный_ компонент `view` (например, `view: { meshRef: THREE.Mesh }`).
- **Логика:** `entity.position.x += 1;` (Система перемещения не трогает `view`).
- **Визуал:** Специализированная `SyncSystem` (в модуле `render`) находит все сущности, у которых есть И `position`, И `view`, и делает `entity.view.meshRef.position.copy(entity.position)`.
- **⚡ Итог:** Если мы полностью удалим Three.js из проекта, все системы логики и тесты пройдут без единого изменения. Визуал абсолютно заменяем.

### Б) Связь "UI -> Игра" (Svelte 5 Runes + Event Bus)

UI не должен вызывать методы систем напрямую. Отказываемся от Svelte Stores (`writable`) в пользу modern Svelte Runes (`$state`) для максимальной простоты.

- **Игра -> UI (Данные):** Используем прямой мост через разделяемый объект. В `adapters/ui-state/game-state.ts` создается объект, размеченный руной `$state`. Модуль `economy` при изменении золота делает прямое присваивание `uiState.gold = newAmount`. Svelte-компонент (`GoldCounter.svelte`) просто импортирует этот объект и читает `uiState.gold` — реактивность сработает автоматически.
- **UI -> Игра (Действия):** Используем Event Bus. Когда игрок кликает "Построить башню", Svelte не вызывает функцию `buildTower()`. Он делает: `GameEngine.emit('spawn-tower', { type: 'archer', x: 10 })`. Система внутри модуля `towers` слушает это событие и вызывает `factories.ts`.

---

## 🧪 Тестирование (TDD подход)

Тестируем **только папку `modules/*/systems/`**.
Так как системы — это чистые функции, берущие данные из Miniplex и отдающие их туда же, мы можем в тесте создать фейковый мир (Miniplex `World`), добавить тестовые сущности через `factories.ts`, запустить систему и проверить изменившиеся компоненты.
**Запрещено:** Мокать Three.js, Svelte (или его руны) и DOM в тестах логики. Тесты работают только с числами и типами.

---

## 📝 Пример кода (Эталон для ИИ)

Пример того, как работает мост с `$state` rune без бойлерплейта:

**`src/lib/adapters/ui-state/game-state.ts`** (Мост)

```typescript
// Обычный TS файл, но руна $state заставляет Svelte отслеживать изменения
export const uiState = $state({
	gold: 0,
	wave: 1,
	isPaused: false,
});
```

**`src/lib/modules/economy/systems/income.system.ts`** (Логика)

```typescript
import { world } from "$lib/core/world";
import { uiState } from "$lib/adapters/ui-state/game-state";

export const IncomeSystem = () => {
	const players = world.with("player");

	for (const player of players) {
		player.gold += player.incomePerSecond;

		// ПРЯМОЕ присваивание. Никаких .set() или вызовов функций.
		// Это максимально просто и не нарушает изоляцию логики.
		uiState.gold = player.gold;
	}
};
```

**`src/routes/game/+page.svelte`** (UI)

```svelte
<script lang="ts">
	import { uiState } from "$lib/adapters/ui-state/game-state";
	import { GameEngine } from "$lib/core/game-loop";
</script>

<!-- Svelte автоматически обновит DOM при изменении uiState.gold в ECS -->
<div class="hud">
	<p>Золото: {uiState.gold}</p>
	<button onclick={() => GameEngine.emit("buy-tower")}>Построить</button>
</div>
```
