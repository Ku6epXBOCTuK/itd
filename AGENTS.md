# AI Development Guidelines

**Проект:** Idle Tower Defense (3D)
**Стек:** TypeScript, SvelteKit, Svelte 5 Runes, Three.js, Miniplex (ECS)

---

## Критичные правила (СТРОГОЕ СОБЛЮДЕНИЕ)

### 1. Только TypeScript

- ЗАПРЕЩЕНЫ `.js` файлы
- ИСПОЛЬЗУЙ `.ts`, `.svelte.ts`, `.svelte`

### 2. Минимальные Svelte компоненты

- Только отображение UI
- Минимум кода в `onMount`
- Вся логика в `modules/*/systems/`

### 3. Без комментариев

- Код должен быть самодокументированным
- Исключение: сложные алгоритмы

### 4. Enum-подобные типы

```typescript
export const EnemyState = {
	MOVING: "moving",
	ATTACKING: "attacking",
} as const;
```

### 5. Импорты

- Все импорты в начале файла
- ЗАПРЕЩЕНЫ динамические `import()` внутри функций

### 6. tsconfig.json

- ЗАПРЕЩЕНО менять без явного разрешения

### 7. Единые компоненты для статов

- Health, Damage, Speed — общие для всех сущностей
- НЕ создавать разные компоненты для одного и того же

---

## Архитектура

### Структура модуля

```
modules/feature/
├── feature.components.ts
├── factories.ts
└── systems/
    └── system.name.ts
```

### Типизация Miniplex

Компоненты как объекты в едином типе Entity.

### Хранение констант

Все magic numbers должны быть вынесены в константы:

- `src/lib/core/constants.ts` — простые значения (FPS, тайминги, размеры)
- `src/lib/core/game-config.ts` — настройки сущностей (hp, damage, speed, цвета)

Импортировать из этих файлов, НЕ использовать числа напрямую.

---

## Чек-лист перед коммитом

- [ ] Нет `.js` файлов
- [ ] Нет лишних комментариев
- [ ] Логика в `modules/*/systems/`
- [ ] Использованы `const object` для enum

## Команды разработки

- `npm run check` — проверка типов и линтинг (ОБЯЗАТЕЛЬНО после каждого изменения)
