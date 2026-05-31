<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

const rootRef = ref(null)
const open = ref(false)
const highlighted = ref(-1)

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue),
)

const selectedLabel = computed(() => selectedOption.value?.label ?? '')

const close = () => {
  open.value = false
}

const openMenu = () => {
  open.value = true
  highlighted.value = props.options.findIndex((o) => o.value === props.modelValue)
}

const select = (option) => {
  emit('update:modelValue', option.value)
  close()
}

const onTriggerClick = () => {
  if (open.value) {
    close()
  } else {
    openMenu()
  }
}

const move = (delta) => {
  if (!open.value) {
    openMenu()
    return
  }

  const count = props.options.length
  if (count === 0) {
    return
  }

  highlighted.value = (highlighted.value + delta + count) % count
}

const onKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open.value && props.options[highlighted.value]) {
        select(props.options[highlighted.value])
      } else {
        onTriggerClick()
      }
      break
    case 'Escape':
      close()
      break
  }
}

const onDocumentMousedown = (event) => {
  if (rootRef.value && !rootRef.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMousedown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMousedown)
})
</script>

<template>
  <div ref="rootRef" :class="$style.root">
    <button
      type="button"
      :class="$style.trigger"
      :aria-label="ariaLabel"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="onTriggerClick"
      @keydown="onKeydown"
    >
      <span>{{ selectedLabel }}</span>
      <span :class="[$style.chevron, open && $style.chevronOpen]" aria-hidden="true">▾</span>
    </button>
    <ul v-if="open" :class="$style.list" role="listbox">
      <li
        v-for="(option, index) in options"
        :key="option.value"
        :class="[
          $style.option,
          (index === highlighted || option.value === modelValue) && $style.optionActive,
        ]"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="select(option)"
        @mouseenter="highlighted = index"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style module>
.root {
  position: relative;
  display: inline-block;
}

.trigger {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  border: var(--border-width) solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font: inherit;
  cursor: pointer;
}

.chevron {
  transition: transform var(--duration-base) var(--ease-standard);
}

.chevronOpen {
  transform: rotate(180deg);
}

.list {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
  margin: var(--space-2xs) 0 0;
  padding: var(--space-2xs);
  list-style: none;
  background: var(--color-bg);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  z-index: 10;
}

.option {
  padding: var(--space-xs) var(--space-md);
  color: var(--color-text);
  border-radius: var(--radius-md);
  white-space: nowrap;
  cursor: pointer;
}

.optionActive {
  background: var(--color-header-bg);
}
</style>
