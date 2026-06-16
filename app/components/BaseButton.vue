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

<style lang="scss" module>
.baseButton {
  display: flex;
  align-items: center;
  border: var(--border-width) solid var(--color-border);
  background-color: var(--button-color-background);
  color: var(--button-color-text);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  gap: var(--space-xs);
  font: inherit;
  cursor: pointer;
  transition-duration: var(--duration-base);
  transition-timing-function: ease-in-out;
  transition-property: color, background-color;

  &:hover {
    color: var(--button-color-text-hover);
    background-color: var(--button-color-background-hover);
  }
}
</style>
