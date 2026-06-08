<script setup>
const {
  phaseLabel,
  isRunning,
  formattedTime,
  workedFormatted,
  goalHours,
  goalMinutes,
  toggle,
  reset,
  togglePip,
  isPipActive,
  pipSupported,
} = usePomodoro();

const pipContent = ref(null);

const onTogglePip = () => {
  if (pipContent.value) {
    togglePip(pipContent.value);
  }
};
</script>

<template>
  <section :class="$style.pomodoro">
    <div
      ref="pipContent"
      :class="$style.pipContent"
    >
      <h2 :class="$style.phase">{{ phaseLabel }}</h2>

      <p :class="$style.time">{{ formattedTime }}</p>
    </div>
    <div :class="$style.controls">
      <BaseButton @click="toggle">
        {{ isRunning ? $t('controls.pause') : $t('controls.play') }}
      </BaseButton>
      <BaseButton @click="reset">
        {{ $t('controls.reset') }}
      </BaseButton>
    </div>
    <p
      v-show="isPipActive"
      :class="$style.pipNote"
    >
      {{ $t('pip.note') }}
    </p>
    <div :class="$style.divider" />
    <div :class="$style.goal">
      <BaseCard :class="$style.field">
        <h3 :class="$style.fieldLabel">{{ $t('goal.label') }}</h3>
        <span :class="$style.inputs">
          <input
            v-model.number="goalHours"
            :class="$style.input"
            type="number"
            min="0"
          />
          <span :class="$style.unit">{{ $t('goal.hours') }}</span>
          <input
            v-model.number="goalMinutes"
            :class="$style.input"
            type="number"
            min="0"
            max="59"
          />
          <span :class="$style.unit">{{ $t('goal.minutes') }}</span>
        </span>
      </BaseCard>
      <BaseCard :class="$style.worked">
        <h3 :class="$style.fieldLabel">{{ $t('goal.worked') }}</h3>
        <span :class="$style.workedValue">{{ workedFormatted }}</span>
      </BaseCard>
    </div>
    <BaseButton
      v-if="pipSupported"
      @click="onTogglePip"
    >
      {{ isPipActive ? $t('pip.close') : $t('pip.open') }}
    </BaseButton>
  </section>
</template>

<style module>
.pomodoro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

.phase {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-primary);
}

.time {
  margin: 0;
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-height-none);
  color: var(--color-text);
}

.pipContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

.pipNote {
  margin: 0;
  color: var(--color-text);
}

.controls {
  display: flex;
  gap: var(--space-md);
}

.divider {
  width: 100%;
  max-width: 320px;
  height: var(--border-width);
  background: var(--color-border);
  margin: var(--space-sm) 0;
}

.goal {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: var(--space-xl);
}

.field,
.worked {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xs);
}

.fieldLabel {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-primary);
}

.inputs {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.unit {
  color: var(--color-text);
}

.input {
  width: 56px;
  border: var(--border-width) solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--radius-md);
  font: inherit;
}

.workedValue {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
</style>
