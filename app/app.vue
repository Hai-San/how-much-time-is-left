<script setup>
const { t } = useI18n();

useHead({
  title: () => t('app.title'),
});
</script>

<template>
  <div :class="$style.appShell">
    <header :class="$style.appHeader">
      <h1 :class="$style.appTitle">{{ $t('app.title') }}</h1>
      <div :class="$style.appActions">
        <LocaleSwitcher />
        <ThemeController />
      </div>
    </header>
    <main :class="$style.appMain">
      <PomodoroTimer />
    </main>
  </div>
</template>

<style module>
.appShell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

.appMain {
  flex: 1;
  display: flex;
}

.appHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: var(--border-width) solid var(--color-border);
  background: var(--color-header-bg);
}

.appTitle {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.appActions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}
</style>
