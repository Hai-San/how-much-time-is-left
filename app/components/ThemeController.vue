<script setup>
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <BaseButton @click="toggleTheme">
    {{ $t('theme.label') }}: {{ isDark ? $t('theme.dark') : $t('theme.light') }}
  </BaseButton>
</template>
