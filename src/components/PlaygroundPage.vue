<script setup lang="ts">
import MouseTracker from './MouseTracker.vue';
import { ref } from 'vue';
import type { MouseTrackerEvent } from '@/types';

const mouseTrackerMovement = ref<boolean>(true);
const mouseTrackerClick = ref<boolean>(true);
const mouseTrackerData = ref<MouseTrackerEvent>({} as any);
</script>
<template>
    <section>
        <h2>Mouse Vector</h2>
        <p>Tracks mouse movement</p>
        <h3>Props</h3>
        <ul>
            <li><label><input type="checkbox" v-model="mouseTrackerMovement">Movement</label></li>
            <li><label><input type="checkbox" v-model="mouseTrackerClick">Click</label></li>
        </ul>
        <pre>
            {{ mouseTrackerData }}
        </pre>
        <div>
            <MouseTracker target="body" :movement="mouseTrackerMovement" :click="mouseTrackerClick" @change="mouseTrackerData=$event"/>
        </div>
    </section>
</template>