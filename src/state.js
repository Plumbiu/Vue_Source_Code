import { observe } from "./observe/index"

export function initState(vm) {
  const opts = vm.$options // 获取所有的选项
  if(opts.data) {
    initData(vm)
  }
}

function proxy(vm ,target, key) {
  Object.defineProperty(vm, key, { // vm.name
    get() {
      return vm[target][key] // vm._data.name
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data // data 可能是函数和对象
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data // data 是用户返回的对象，此操作是将此对象放入 _data 上
  // 对数据进行劫持，vue2 里采用了一个 api：defineProperty
  observe(data)
  // 将 vm._data 用 vm 来代理就可以了
  for(let key in data) {
    proxy(vm, '_data', key)
  }
}
