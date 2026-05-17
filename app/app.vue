<script setup>
const appConfig = useAppConfig()
</script>

<template>
  <div :class="$style.appShell">
    <header :class="$style.appHeader">
      <h1 :class="$style.appTitle">{{ appConfig.title }}</h1>
      <ThemeController />
    </header>
    <NuxtWelcome />
  </div>
</template>

<style module>
.appShell {
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
}

.appHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--header-bg);
}

.appTitle {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
}
</style>
