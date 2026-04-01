# Roadmap

## Active

### ECS Data-Only Entities

**Цель:** Полностью отвязать сущности от Three.js для 100% тестируемости логики.

#### Этап 1: Очистка сущностей

- [ ] Убрать `mesh: THREE.Mesh` из типа `View`, заменить на `viewId: string`
- [ ] Убрать `sprite?: THREE.Sprite` из типа `Enemy`, заменить на `spriteViewId?: string`
- [ ] Убрать `import * as THREE from "three"` из factories

#### Этап 2: ViewRegistry в SyncRender

- [ ] Создать `const viewRegistry = new Map<string, { mesh, sprite }>()`
- [ ] Init Handler: создавать графику и регистрировать по viewId
- [ ] Sync Handler: читать данные из entity и применять к объектам из Registry

#### Этап 3: Жизненный цикл

- [ ] `world.onEntityRemoved`: удалять объекты из Registry и из сцены
- [ ] Вызывать dispose для sprite material

#### Этап 4: Тестирование

- [ ] Unit-тесты для систем без моканья Three.js

**Файлы:** `world.ts`, `factories.ts`, `sync-render/system.ts`, `sync-render/handlers/*`

---

## Backlog

(Добавляйте новые пункты здесь)

###

**Цель:**

####

- [ ]

**Файлы:**
