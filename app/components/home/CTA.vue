<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 sm:gap-2">
    <div class="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2">
      <UTooltip
        text="Contact me"
        :shortcuts="['⌘', 'O']"
      >
        <SpotlightButton>
          <NuxtLink
            class="font-mona relative flex items-center justify-center gap-2 bg-gradient-to-b from-white/25 to-white bg-clip-text text-lg font-medium text-transparent transition-all duration-200"
            to="/contact"
          >
            Let's work together
            <UIcon
              name="heroicons-envelope"
              class="size-5 text-white/80"
            />
          </NuxtLink>
        </SpotlightButton>
      </UTooltip>
      <MeetingButton />
    </div>
  </div>
</template>
