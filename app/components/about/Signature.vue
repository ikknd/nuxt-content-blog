<script setup lang="ts"></script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="25 75 158 145"
    width="250"
    fill="none"
    class="signature"
  >
    <g id="layer2">
      <path
        class="sig-path"
        d="M 31.522482,125.04614 31.94,214.39463 65.758821,214.18588 65.550062,125.2549 Z"
        id="path6"
      />
      <circle
        class="sig-path"
        id="path7"
        cx="48.640652"
        cy="98.116341"
        r="17.11817"
      />
      <path
        class="sig-path"
        d="m 82.87699,108.97176 0.417517,104.7966 h 5.218954 l 29.017389,-24.00719 -0.62628,-21.08457 39.87281,-1.0438 -0.41752,-29.01738 h -39.03777 v -26.72104 l 64.50627,-0.83504 -0.20876,-29.434899 -66.59385,0.626275 z"
        id="path8"
      />
    </g>
  </svg>
</template>

<style scoped>
.sig-path {
  fill: none;
  stroke: #06B6D4;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 3s ease-in-out forwards;
}

/* Delay each path slightly for a more realistic signature effect */
.sig-path:nth-child(1) {
  animation-delay: 0s;
}

.sig-path:nth-child(2) {
  animation-delay: 0.8s;
}

.sig-path:nth-child(3) {
  animation-delay: 1.6s;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>