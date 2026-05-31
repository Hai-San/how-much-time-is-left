<template>
  <div :class="$style.baseCard">
    <slot />
  </div>
</template>

<style module>
.baseCard {
  padding: var(--space-md);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
}
</style>
