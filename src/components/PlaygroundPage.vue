<script setup lang="ts">
import MouseTracker from './MouseTracker.vue';
import { ref } from 'vue';
import type { MouseTrackerEvent } from '@/types';

const mouseTrackerData = ref<MouseTrackerEvent>({} as any);
</script>
<template>
    <section>
        <h2>Mouse Vector</h2>
        <p>Tracks mouse movement</p>
        <pre>
            {{ mouseTrackerData }}
        </pre>
        <div>
            <MouseTracker target="body" movement drag @change="mouseTrackerData=$event"/>
        </div>
    </section>
</template>