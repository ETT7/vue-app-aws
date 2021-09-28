<template>
  <div id="app">
    <link
      href="//netdna.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <div class="card text-center m-3">
      <h3 class="card-header">一覧画面</h3>
      <br />
      <div class="card-body">
        <div v-for="task in pageOfItems" :key="task.id">
          <span>{{ task.id }}</span> <span>{{ task.name }}</span>
        </div>
      </div>
      <div class="card-footer pb-0 pt-3">
        <jw-pagination
          :labels="customLabels"
          :items="tasks"
          @changePage="onChangePage"
        ></jw-pagination>
      </div>
    </div>

    <button v-on:click="downloadCSV">
      ダウンロード
    </button>
  </div>
</template>

<script>
const customLabels = {
  first: "最初",
  last: "最後",
  previous: "<",
  next: ">",
};
export default {
  name: "App",
  data() {
    return {
      newTaskInput: "",
      tasks: [],
      customLabels,
      pageOfItems: [],
      timer: "", 
    };
  },
  async created() {
    this.fetchData()
    
    this.timer = setInterval(this.fetchData, 2000);
  },
  methods: {
    async fetchData() {
      const response = await fetch("https://5gprlny6jj.execute-api.ap-northeast-1.amazonaws.com/todos")
      this.tasks = await response.json();
    },

    cancelAutoUpdate() {  
      clearInterval(this.timer);  
    },


    downloadCSV() {
      var csv = "\ufeff" + "id,name\n";
      this.pageOfItems.forEach((el) => {
        var line = el["id"] + "," + el["name"] + "\n";
        csv += line;
      });
      let blob = new Blob([csv], { type: "text/csv" });
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Result.csv";
      link.click();
    },

    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
  },
  beforeDestroy() {  
    this.cancelAutoUpdate();  
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
