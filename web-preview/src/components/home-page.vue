
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-input
      v-model="compileErrMessage"
      placeholder="Please input"
      type="textarea"
      :autosize="inputSize"
    />
    <el-card class="box-card tip-card">
      <span class="pre-wrap">
        {{ tips }}
      </span>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
interface homeData {
  inputSize: {
    minRows: number;
    maxRows: number;
  };
  compileErrMessage: string;
  tips: string;
}
export default defineComponent({
  props: ["msg"],
  data(): homeData {
    return {
      inputSize: {
        minRows: 5,
        maxRows: 10,
      },
      compileErrMessage: "",
      tips: "",
    };
  },
  watch: {
    compileErrMessage(message: string) {
      console.log("compileErrMessage:", message);
      axios({
        method: "post",
        url: "http://localhost:7777/api",
        data: {
          compileErrMessage: message,
        },
        /* headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }, */
      })
        .then((response) => {
          console.log("response", response);
          this.tips = response.data.data.tips;
        })
        .catch((error) => {
          console.log("error:", error);
        });
    },
  },
  methods: {
    changeTips(mes: string) {
      this.tips = mes;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.tip-card {
  margin-top: 40px;
  text-align: left;
}

.pre-wrap {
  white-space: pre-wrap;
}
</style>
