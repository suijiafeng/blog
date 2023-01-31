
class MyVue {
    constructor(options) {
        this.$el = options.el
        this.$data = options.data
        this.$options = options
        if (this.$el) {
            // 实现一个数据的观察者
            // 实现一个指令的解析器
            new Complie(this.$el, this)
        }
        this._init()
    }
    _init() {
        console.log('init')
    }
}

const complieUtil = {
    // 更新的函娄
    updater: {
        textUpdater(node, value) {
            node.textContent = value
        },
        htmlUpdater(node, value) {
            node.innerHTML = value
        },
        modelUpdater(node, value) {
            node.value = value
        }
    },
    getVal(expr, vm) {
        return expr.split('.').reduce((data, curr) => {
            return data[curr]
        }, vm.$data)
    },
    html(node, expr, vm) {
        const val = this.getVal(expr, vm)
        this.updater.htmlUpdater(node, val)

    },
    text(node, expr, vm) {
        const val = this.getVal(expr, vm)
        this.updater.textUpdater(node, val)
    },
    model(node, expr, vm) {
        const val = this.getVal(expr, vm)
        this.updater.modelUpdater(node, val)

    },
    if(node, expr, vm,) {
        console.log(vm.$data[expr])
    },
    show(node, expr, vm,) {

    },
    on(node, expr, vm, eventName) {

    },
}

class Complie {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm
        //1. 文档碎片对象把它放入内存中，减少页面中的回流和重绘
        const fragment = this.node2frament(this.el)
        //2. 编译模板
        this.complie(fragment)
        //3. 追加子元素到根元素
        this.el.appendChild(fragment)
    }
    complie(fragment) {
        // 获取到子节点
        const childNodes = fragment.childNodes
        Array.from(childNodes).forEach(child => {
            if (this.isElementNode(child)) {
                // 是元素节点
                // console.log('node',child)
                this.complieElement(child)

            } else {
                // 文本节点
                // console.log('text',child)
                this.complieText(child)

            }
            if (child.childNodes && child.childNodes.length) {
                this.complie(child)
            }
        })
    }
    node2frament(el) {
        const f = document.createDocumentFragment(el)
        let firstChild;
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
        return f
    }
    complieElement(node) {
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            const { name, value } = attr
            if (this.isDireactive(name)) {
                // 是一个指令
                // console.log('是指令',name)
                const [, direactive] = name.split('-')
                const [dirName, eventName] = direactive.split(':')
                complieUtil[dirName](node, value, this.vm, eventName)
                // console.log(dirName)
            }

        })

    }
    complieText(nodes) {

    }
    isDireactive(attrName) {
        return attrName.startsWith('v-')

    }
    isElementNode(node) {
        return node.nodeType === 1
    }
}

