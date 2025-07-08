<template>
  <div class="mt-6 pb-20">
    <Divider />
    <footer class="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6">
      <Logo :size="8" />
      <span class="text-center text-sm text-muted">
        © {{ new Date().getFullYear() }}, <ULink to="https://google.com">Igor Fomin</ULink> - All rights reserved.
      </span>
    </footer>
  </div>
</template>
