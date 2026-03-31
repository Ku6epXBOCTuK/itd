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
{uiState.gold} // Авто-реактивность
```

### UI → Игра (действия)
```typescript
// Svelte компонент
GameEngine.emit("spawn-tower", { type: "archer", x: 10 });

// modules/towers/system/spawn.system.ts
GameEngine.on("spawn-tower", (data) => {
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
	<button onclick={() => GameEngine.emit("buy-tower")}>
		Построить
	</button>
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
