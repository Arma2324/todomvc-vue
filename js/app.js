~(function () {
	Vue.directive('focus', {
		// 当被绑定的元素插入到 DOM 中时……
		inserted: function (el) {
			// 聚焦元素
			el.focus()
		}
	})

	Vue.directive('todo-focus', {
		update: function (el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	})
	window.app = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
			modeText: window.localStorage.getItem('modeText') || ''
		},
		methods: {
			handleDestroy(id) {
				let todos = this.todos
				todos.forEach(function (item, index) {
					if (id === item.id) {
						todos.splice(index, 1)
					}
				})
			},

			handleAdd(e) {
				let addText = e.target.value.trim()
				if (!addText) return
				let todos = this.todos
				todos.push({
					id: todos.length ? todos[todos.length - 1].id + 1 : 0,
					title: addText,
					completed: false
				})
				e.target.value = ''
			},

			handleEditing(index) {
				this.currentEditing = index
			},

			handleModify(modeItem, e) {
				let todos = this.todos
				if (!e.target.value.trim()) {
					todos.forEach(function (item, index) {
						if (modeItem.id === item.id) {
							todos.splice(index, 1)
						}
					})
				}
				else
					modeItem.title = e.target.value
				this.currentEditing = null
			},

			handleCancelEdit() {
				this.currentEditing = null
			},

			handleClearCompleted() {
				for (let i = 0; i < this.todos.length; i++) {
					if (this.todos[i].completed) {
						this.todos.splice(i, 1)
						i--
					}
				}
			}
		},
		computed: {
			count() {
				return this.todos.filter(item => !item.completed).length
			},
			toggleAllStatus: {
				get() {
					return this.todos.every(item => item.completed == true)
				},
				set(val) {
					return this.todos.forEach(item => item.completed = val)
				}
			},
			mode() {
				switch (this.modeText) {
					case 'active':
						return this.todos.filter(item => !item.completed)
						break
					case 'completed':
						return this.todos.filter(item => item.completed)
						break
					default:
						return this.todos
						break
				}
			}
		},
		watch: {
			modeText(val) {
				window.localStorage.setItem('modeText', val)
			},

			todos: {
				handler(val) {
					window.localStorage.setItem('todos', JSON.stringify(val))
				},
				deep: true
			}
		}
	}).$mount('#app')
	window.onhashchange = function () {
		app.modeText = this.location.hash.substr(2)
	}
})()