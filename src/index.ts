import components from './components';

const plugin = {
  install (Vue: any) {
    for (const prop in components) {
      // eslint-disable-next-line no-prototype-builtins
      if (components.hasOwnProperty(prop)) {
        const component = (components as any)[prop]
        Vue.component(component.name, component)
      }
    }
  }
}

export default plugin