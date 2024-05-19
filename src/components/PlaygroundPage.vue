<script setup lang="ts">
import MouseTracker from './MouseTracker.vue';
import KeyboardTracker from './KeyboardTracker.vue';
import ControlPoint from './ControlPoint.vue';
import SelectionRectangle from './SelectionRectangle.vue';
import { ref } from 'vue';
import type { TupplePoint, MouseTrackerEvent, KeyboardTrackerEvent } from '@/types';

const mouseTrackerMovement = ref<boolean>(true);
const mouseTrackerClick = ref<boolean>(true);
const mouseTrackerData = ref<MouseTrackerEvent>({} as any);

const controlPointPosition = ref<TupplePoint>([50, 200]);
const controlPointPosition2 = ref<TupplePoint>([80, 200]);

const keyboardTrackerDown = ref<boolean>(true);
const keyboardTrackerUp = ref<boolean>(true);
const keyboardTrackerData = ref<KeyboardTrackerEvent>({} as any);

const selectionData = ref<MouseTrackerEvent>({} as any);
</script>
<template>
    <section style="min-height: 530px">
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

    <section style="position: relative; user-select: none;">
        <h2>Control point</h2>
        <p>Displays draggable point</p>
        <button @click="()=>controlPointPosition=[50,200]">Set to [50, 200]</button>
        <ul>
        </ul>
        <pre>{{ controlPointPosition }}</pre>
        <div>
            <ControlPoint target="body" :position="controlPointPosition" @drag="controlPointPosition=$event.end"/>
            <ControlPoint color="red" :position="controlPointPosition2" @drag="controlPointPosition2=$event.end"/>
        </div>
    </section>

    <section style="min-width: 200px">
        <h2>Keyboard Tracker</h2>
        <p>Tracks keyboard</p>
        <h3>Props</h3>
        <ul>
            <li><label><input type="checkbox" v-model="keyboardTrackerDown">Down</label></li>
            <li><label><input type="checkbox" v-model="keyboardTrackerUp">Up</label></li>
        </ul>
        <pre>{{ keyboardTrackerData }}</pre>
        <div>
            <KeyboardTracker target="body" :down="keyboardTrackerDown" :up="keyboardTrackerUp" @key="keyboardTrackerData=$event" />
        </div>
    </section>

    <section style="position: relative;">
        <h2>Selection Rectangle</h2>
        <ul>
        </ul>
        <pre style="min-height: 30vw;min-height: 40vh;border: 1px solid #CCC;position: relative;user-select: none;">
{{ selectionData }}
            <SelectionRectangle @change="selectionData=$event" />
        </pre>
    </section>
</template>
<style>
section {
    margin: 60px 0;
}
h2 { font-size: 32px; }
</style>