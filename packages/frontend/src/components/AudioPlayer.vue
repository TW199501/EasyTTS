<template>
  <div class="tts-audio-player">
    <el-slider v-model="progress" :max="100" @change="seek" show-tooltip />
    <div class="controls">
      <el-button
        circle
        :icon="isPlaying ? VideoPause : CaretRight"
        @click="togglePlay"
      />
      <el-button circle :icon="Refresh" @click="replay" />
      <el-text class="time"
        >{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</el-text
      >
    </div>
    <audio
      ref="audio"
      @timeupdate="updateProgress"
      @ended="onEnded"
      @loadedmetadata="updateDuration"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElSlider, ElButton, ElText } from "element-plus";
import { Refresh, VideoPause, CaretRight } from "@element-plus/icons-vue";
import type { Arrayable } from "element-plus/es/utils/index.mjs";

const props = defineProps<{
  audioData: string | Blob;
}>();

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);

watch(
  () => props.audioData,
  (newData) => {
    if (newData instanceof Blob) {
      if (audio.value) audio.value.src = URL.createObjectURL(newData);
    } else {
      if (audio.value) audio.value.src = newData as string;
    }
    audio.value?.load();
    isPlaying.value = false;
    progress.value = 0;
  },
  { immediate: false }
);

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value?.pause();
  } else {
    audio.value?.play();
  }
  isPlaying.value = !isPlaying.value;
};

const replay = () => {
  if (!audio.value) return;
  audio.value.currentTime = 0;
  audio.value.play();
  isPlaying.value = true;
};

const updateProgress = () => {
  if (!audio.value) return;
  currentTime.value = audio.value.currentTime;
  duration.value = audio.value.duration;
  progress.value = (currentTime.value / duration.value) * 100 || 0;
};

const seek = (value: Arrayable<number>) => {
  if (!audio.value) return;
  if (Array.isArray(value)) return;
  const newTime = (value / 100) * duration.value;
  audio.value.currentTime = newTime;
};

const onEnded = () => {
  isPlaying.value = false;
  progress.value = 0;
};

const updateDuration = () => {
  if (!audio.value) return;
  duration.value = audio.value.duration;
};

const formatTime = (seconds: number) => {
  if (!seconds) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
};
</script>

<style scoped>
.tts-audio-player {
  width: 300px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.time {
  font-size: 12px;
  color: #666;
}
</style>
