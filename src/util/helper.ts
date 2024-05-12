import { getCurrentInstance } from 'vue';

export function getTargetElement(target?: HTMLElement | string): HTMLElement {
    if (target instanceof HTMLElement) {
        return target;
    }
    if (target === 'body') {
        return document.body;
    }

    const instance = getCurrentInstance();
    const el = instance?.vnode.el as HTMLElement | null;
    const parentEl = el?.parentElement;

    if (!parentEl) {
        throw new Error('Cannot get target element');
    }

    return parentEl;
}