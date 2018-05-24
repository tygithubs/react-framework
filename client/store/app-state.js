import { observable, computed, action } from 'mobx'

export default class AppState {
    constructor({ count, name } = { count: 0, name: 'Jokcy' }) {
        this.count = count
        this.name = name
    }
    @observable count
    @observable name
    @computed get msg() {
        return `${this.name} say count is ${this.count}`
    }
    @action add() {
        this.count += 1
    }
    @action changeName(name) {
        this.name = name
    }
    // 服务端渲染时将AppState实例得到的数据以json的格式输出
    toJson() {
        return {
            count: this.count,
            name: this.name,
        }
    }
}

// const appState = new AppState()

/* 一旦AppState有更新就执行
autorun(() => {
    console.log(appState.msg)
})

setInterval(() => {
    appState.add()
}, 10000) */

// export default appState
