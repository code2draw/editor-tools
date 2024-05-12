<script setup lang="ts">
/**
 * Goal of this component is to track mouse click actions and emit vector of positions
 * where MouseDown and MouseUp events were triggered
 */
import { defineEmits, onMounted, onBeforeUnmount, watch, ref } from 'vue';
import type { KeyboardTrackerEvent } from '../types';
import { getTargetElement } from '../util/helper';

const props = defineProps({
    // Should the movement be tracked?
    down: { type: Boolean, default: true },
    // Should the drag be tracked?
    up: { type: Boolean, default: false },
    // Where should the mouse be tracked
    // - "body" - within body
    // - [HtmlElement] TupplePointement
    // - [undefined] - within parent
    target: { type: [HTMLElement, String], default: undefined },
});
const targetEl = ref<HTMLElement>(document.body);
const emit = defineEmits<{
    (e: 'key', value: KeyboardTrackerEvent): void,
}>();
let unregisterCb = () => {};

onMounted(() => {
    watch(() => props.target, () => targetEl.value = getTargetElement(props.target), { immediate: true });

    function onKeyDown(e: KeyboardEvent) {
        emit('key', {
            direction: 'down',
            key: e.key,
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            meta: e.metaKey,
        });
    }
    function onKeyUp(e: KeyboardEvent) {
        emit('key', {
            direction: 'up',
            key: e.key,
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            meta: e.metaKey,
        });
    }

    watch([() => props.down, () => props.up, () => targetEl], () => {
        unregisterCb();
        const currentTarget = targetEl.value;
        props.down && currentTarget.addEventListener('keydown', onKeyDown, { passive: true, capture: true });
        props.up && currentTarget.addEventListener('keyup', onKeyUp, { passive: true, capture: true });

        unregisterCb = () => {
            currentTarget.removeEventListener('keydown', onKeyDown, { capture: true });
            currentTarget.removeEventListener('keyup', onKeyUp, { capture: true });
        }
    }, { immediate: true });

    onBeforeUnmount(() => unregisterCb());
});

</script>
<template>
    <span class="keyboard-tracker"></span>
</template>