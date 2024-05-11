<script setup lang="ts">
import MouseTracker from './MouseTracker.vue';
import ControlPoint from './ControlPoint.vue';
import { ref } from 'vue';
import { TupplePoint, type MouseTrackerEvent } from '@/types';

const mouseTrackerMovement = ref<boolean>(true);
const mouseTrackerClick = ref<boolean>(true);
const mouseTrackerData = ref<MouseTrackerEvent>({} as any);

const controlPointPosition = ref<TupplePoint>([50, 200]);
</script>
<template>
    <!--
    <section style="min-height: 600px">
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
    -->

    <section style="position: relative">
        <h2>Control point</h2>
        <p>Displays draggable point</p>
        <h3>Props</h3>
        <ul>
        </ul>
        <pre>
            {{ controlPointPosition }}
        </pre>
        <div>
            <ControlPoint target="body" :position="controlPointPosition" @drag="controlPointPosition=$event.end"/>
        </div>
    </section>
</template>