# 🤖 AI Development Guidelines

**Проект:** Idle Tower Defense (3D)
**Стек:** TypeScript, SvelteKit, Svelte 5 Runes, Three.js, Miniplex (ECS)

---

## ⚡ Критичные правила (СТРОГОЕ СОБЛЮДЕНИЕ)

### 1. Только TypeScript

- ❌ **ЗАПРЕЩЕНЫ** `.js` файлы
- ✅ **ИСПОЛЬЗУЙ** `.ts`, `.svelte.ts`, `.svelte`

### 2. Минимальные Svelte компоненты

- Только отображение UI
- Минимум кода в `onMount`
- Вся логика в `modules/*/systems/`

### 3. Без комментариев

- Код должен быть самодокументированным
- Исключение: сложные алгоритмы

### 4. Enum-подобные типы

```typescript
// ✅ ПРАВИЛЬНО
export const EnemyState = {
	MOVING: "moving",
	ATTACKING: "attacking",
} as const;

// ❌ НЕПРАВИЛЬНО
export type EnemyState = "moving" | "attacking";
```

### 5. Импорты

- ✅ Все импорты должны быть в начале файла (в `<script>`)
- ❌ **ЗАПРЕЩЕНЫ** динамические `import()` внутри функций
- ✅ Исключение: реально необходимая ленивая загрузка (только по согласованию)

### 6. tsconfig.json

- ❌ **ЗАПРЕЩЕНО** менять tsconfig.json без явного разрешения
- ✅ Если нужна настройка — спроси у пользователя

### 7. Единые компоненты для статов

- ✅ **Health** — `hp: number, maxHp: number` для башен и врагов
- ✅ **Damage** — `damage: number` для всех атакующих
- ✅ **Speed** — `speed: number` для всех движущихся
- ❌ **НЕЛЬЗЯ** создавать разные компоненты для одного и того же (например, `towerHp` и `enemyHp`)
- ✅ **Баффы/дебаффы** — должны применяться к общим компонентам, чтобы системы работали одинаково

---

## 🏛️ Архитектура

### Структура модуля (строго 3 файла)

```
modules/feature/
├── feature.components.ts   # Типы для ECS
├── factories.ts            # Функции создания сущностей
└── systems/
    └── system.name.ts      # Чистая логика
```

### Запрещённые папки

- ❌ `components/`, `systems/`, `utils/`, `helpers/`
- ✅ `economy/`, `towers/`, `waves/`, `enemies/`

### Анти-Overengineering

- ❌ Классы-фабрики, Repository, Strategy
- ❌ Интерфейсы с префиксом `I`
- ✅ Простые `type` и функции
- ✅ Плоские объекты данных

### Типизация Miniplex (ECS)

Все сущности описываются в `core/world.ts` через единый тип `Entity`:

```typescript
// ✅ ПРАВИЛЬНО — компоненты как объекты
export type Entity = {
	position?: Position;  // { x, y, z }
	view?: View;          // { mesh, originalColor }
	player?: Player;      // { player: true, gold, incomePerSecond }
	tower?: Tower;        // { tower: true, hp, maxHp, damage, ... }
	enemy?: Enemy;        // { enemy: true, type, enemyState, speed, hp, ... }
	projectile?: Projectile; // { projectile: true, damage, targetId }
};

export const world = new World<Entity>();
```

```typescript
// ❌ НЕПРАВИЛЬНО — плоские свойства в корне World
export const world = new World<{
	x?: number;
	y?: number;
	z?: number;
	mesh?: THREE.Mesh;
	hp?: number;
	// ...
}>();
```

**Преимущества:**
- Компоненты сгруппированы по логическим объектам
- Автокомплит работает лучше (пишешь `tower.` и видишь все свойства)
- Типобезопасность — нельзя случайно использовать `hp` врага для башни
- Чёткое разделение данных разных типов сущностей

---

## 📁 Структура проекта

```
src/lib/
├── core/
│   ├── game-loop.ts        # requestAnimationFrame + ECS
│   ├── event-bus.ts        # События UI ↔ Игра
│   └── world.ts            # Miniplex World
│
├── modules/
│   ├── towers/             # Башни
│   ├── enemies/            # Враги
│   ├── economy/            # Экономика
│   └── render/             # Визуализация
│       ├── render.components.ts
│       ├── factories.ts
│       └── systems/
│           └── sync-render.system.ts
│
└── adapters/
    └── ui-state/
        └── game-state.svelte.ts  # Мост $state для Svelte
```

---

## 🔄 Взаимодействие

### Логика → Визуал

```typescript
// Система логики (не знает о Three.js)
entity.position.x += 1;

// SyncRenderSystem (мост)
entity.view.mesh.position.copy(entity.position);
```

### Игра → UI (данные)

```typescript
// modules/economy/system/income.system.ts
uiState.gold = player.gold; // Прямое присваивание

// routes/+page.svelte
{
	uiState.gold;
} // Авто-реактивность
```

### UI → Игра (действия)

```typescript
// Svelte компонент
GameEngine.emit("spawn-enemy", { type: "archer", x: 10 });

// modules/towers/system/spawn.system.ts
GameEngine.on("spawn-enemy", (data) => {
	createArcherTower(data.x);
});
```

---

## 🧪 Тестирование

Тестируем **только** `modules/*/systems/`:

```typescript
// ❌ Не мокать: Three.js, Svelte, DOM
// ✅ Тестировать: чистые функции с данными
```

---

## 📝 Примеры

### Компонент (types)

```typescript
// towers/towers.components.ts
export const TowerType = {
	ARCHER: "archer",
	MAGE: "mage",
} as const;

export type Tower = {
	type: keyof typeof TowerType;
	damage: number;
	range: number;
};
```

### Фабрика

```typescript
// towers/factories.ts
export const createArcherTower = (x: number, z: number) => {
	return world.add({
		position: { x, y: 0, z },
		tower: true,
		type: TowerType.ARCHER,
		damage: 10,
		range: 5,
	});
};
```

### Система

```typescript
// towers/systems/attack.system.ts
export const AttackSystem = (deltaTime: number) => {
	const towers = world.with("tower", "damage", "position");

	for (const tower of towers) {
		// Логика атаки
	}
};
```

### UI мост

```typescript
// adapters/ui-state/game-state.svelte.ts
export const uiState = $state({
	gold: 0,
	wave: 0,
	isPaused: false,
});
```

### Svelte компонент

```svelte
<script lang="ts">
	import { uiState } from "$lib/adapters/ui-state/game-state.svelte";
	import { GameEngine } from "$lib/core/game-loop";
</script>

<div class="hud">
	<p>Золото: {uiState.gold}</p>
	<button onclick={() => GameEngine.emit("buy-tower")}> Построить </button>
</div>
```

---

## 🎯 Чек-лист перед коммитом

- [ ] Нет `.js` файлов
- [ ] Нет лишних комментариев
- [ ] Svelte компоненты минимальны
- [ ] Логика в `modules/*/systems/`
- [ ] Использованы `const object` для enum
- [ ] Модули не импортируют фабрики друг друга
- [ ] UI использует `GameEngine.emit()` для действий

---

## 🛠️ Команды разработки

- ✅ `npm run check` — проверка типов и линтинг (основная команда)
- `npm run build` — продакшен-сборка (только для деплоя)
