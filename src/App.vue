<template>
  <div id="app">
    <h1>Vue Todo App</h1>
    <div class="add-task-wrapper">
      <input type="text" v-model="newTaskInput" @keydown.enter="addTask" />
      <button @click="addTask">Add task</button>
    </div>

    <div class="task" v-for="task in tasks" :key="task.id">
      <span>{{ task.id }}</span
      >
      <span>{{ task.name }}</span
      ><span class="delete"
        ><button @click="removeTask(task.id)">X</button></span
      >
    </div>
    <button v-on:click="downloadCSV">
  ダウンロード
</button>
  </div>
</template>


<script>
export default {
  name: "App",
  data() {
    return {
      newTaskInput: "",
      tasks: [],
    };
  },
  async created() {
    const response = await fetch(
      "https://5gprlny6jj.execute-api.ap-northeast-1.amazonaws.com/todos"
    );
    this.tasks = await response.json();
  },
  methods: {
    async addTask() {
      let taskId = String(Math.floor(
        Math.random() * (999999999 - 100000000) + 1000000000
      ));
      let newTask = {
        id: taskId,
        name: this.newTaskInput,
      };
      await fetch(
        "https://5gprlny6jj.execute-api.ap-northeast-1.amazonaws.com/todos",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );
      this.tasks.push(newTask);
      this.newTaskInput = "";
    },
    downloadCSV () {
      var csv = '\ufeff' + 'id,name\n'
      this.tasks.forEach(el => {
        var line = el['id'] + ',' + el['name'] + '\n'
        csv += line
      })
      let blob = new Blob([csv], { type: 'text/csv' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'Result.csv'
      link.click()
    },
    

    async removeTask(taskId) {
      await fetch(
        "https://5gprlny6jj.execute-api.ap-northeast-1.amazonaws.com/todos",
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: taskId }),
        }
      );
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 500px;
  margin: 0 auto;
}

button,
input {
  border-radius: 5px;
  padding: 5px 10px;
  border: 1px solid #aaa;
  margin: 5px;
}

.add-task-wrapper {
  display: flex;
}

.add-task-wrapper input {
  flex: 1;
}

.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
  border-radius: 5px;
  margin: 5px 10px;
  padding: 5px 10px;
}
</style>
