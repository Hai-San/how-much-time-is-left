<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
});
</script>

<template>
  <button
    :type="type"
    :class="$style.baseButton"
  >
    <slot />
  </button>
</template>

<style module>
.baseButton {
  border: var(--border-width) solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font: inherit;
  cursor: pointer;
}
</style>
