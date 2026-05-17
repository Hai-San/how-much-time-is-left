<script setup>
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button :class="$style.themeToggle" type="button" @click="toggleTheme">
    Tema: {{ isDark ? 'Escuro' : 'Claro' }}
  </button>
</template>

<style module>
.themeToggle {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font: inherit;
  cursor: pointer;
}
</style>
