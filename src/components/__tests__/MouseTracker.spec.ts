import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import MouseTracker from '../MouseTracker.vue'

describe('MouseTracker', () => {
  it('renders properly', () => {
    const wrapper = mount(MouseTracker)
    expect(wrapper.text()).toContain('');
  })

  describe('Props', () => {
    describe('Click', () => {
      it('on click there is correct event emitted', async () => {
        const wrapper = mount(MouseTracker, { props: { click: true }});
        await wrapper.vm.$nextTick();

        wrapper.trigger('mousedown', { clientX: 101, clientY: 102 });
        wrapper.trigger('mouseup', { clientX: 201, clientY: 202 });

        expect(wrapper.emitted('change')).to.deep.equal([
          [{
            button: 0,
            buttons: 0,
            clickButton: 0,
            clickButtons: 0,
            clickPosition: [101, 102],
            position: [201, 202],
          }],
        ]);
      });
    });

    describe('Move', () => {
      it('on move there is correct event emitted', async () => {
        const wrapper = mount(MouseTracker, { props: { movement: true }});

        wrapper.trigger('mousemove', { clientX: 301, clientY: 302 });

        expect(wrapper.emitted('change')).to.deep.equal([
          [{
            button: 0,
            buttons: 0,
            position: [301, 302],
            clickButton: undefined,
            clickButtons: undefined,
            clickPosition: undefined,
          }],
        ]);
      });
    });

    describe('Move + Click', () => {
      it('on click there is correct event emitted', async () => {
        const wrapper = mount(MouseTracker, { props: { movement: true, click: true }});
        await wrapper.vm.$nextTick();

        wrapper.trigger('mousedown', { clientX: 101, clientY: 102 });
        wrapper.trigger('mouseup', { clientX: 201, clientY: 202 });

        expect(wrapper.emitted('change')).to.deep.equal([
          [{
            button: 0,
            buttons: 0,
            clickButton: 0,
            clickButtons: 0,
            clickPosition: [101, 102],
            position: [201, 202],
          }],
        ]);
      });

      it('on move there is correct event emitted', async () => {
        const wrapper = mount(MouseTracker, { props: { movement: true, click: true }});

        wrapper.trigger('mousemove', { clientX: 301, clientY: 302 });

        expect(wrapper.emitted('change')).to.deep.equal([
          [{
            button: 0,
            buttons: 0,
            position: [301, 302],
            clickButton: undefined,
            clickButtons: undefined,
            clickPosition: undefined,
          }],
        ]);
      });

      it('on move and click there is correct event emitted', async () => {
        const wrapper = mount(MouseTracker, { props: { movement: true, click: true }});
        await wrapper.vm.$nextTick();

        wrapper.trigger('mousemove', { clientX: 1, clientY: 2 });
        wrapper.trigger('mousedown', { clientX: 101, clientY: 102 });
        wrapper.trigger('mousemove', { clientX: 3, clientY: 4 });
        wrapper.trigger('mouseup', { clientX: 201, clientY: 202 });
        wrapper.trigger('mousemove', { clientX: 5, clientY: 6 });

        expect(wrapper.emitted('change')).to.deep.equal([
          [{
            button: 0,
            buttons: 0,
            clickButton: undefined,
            clickButtons: undefined,
            clickPosition: undefined,
            position: [1, 2],
          }],
          [{
            button: 0,
            buttons: 0,
            clickButton: 0,
            clickButtons: 0,
            clickPosition: [101, 102],
            position: [3, 4],
          }],
          [{
            button: 0,
            buttons: 0,
            clickButton: 0,
            clickButtons: 0,
            clickPosition: [101, 102],
            position: [201, 202],
          }],
          [{
            button: 0,
            buttons: 0,
            clickButton: undefined,
            clickButtons: undefined,
            clickPosition: undefined,
            position: [5, 6],
          }],
        ]);
      });
    });
  });
})
