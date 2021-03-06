
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-radio-group v-model="rad">
      <el-radio :label="1">输入C语言源码</el-radio>
      <el-radio :label="2">输入编译错误</el-radio>
    </el-radio-group>
    <el-input
      v-model="compileErrMessage"
      placeholder="Please input"
      type="textarea"
      :autosize="inputSize"
      v-show="rad === 2"
    />
    <el-card class="box-card tip-card" v-show="rad === 1">
      <div id="editor"></div>
      <div style="display: block; text-align: center">
        <el-button
          type="primary"
          class="button"
          size="large"
          v-on:click="onEditorChange(editor)"
          >提交代码</el-button
        >
      </div>
    </el-card>
    <el-card
      class="box-card tip-card"
      v-show="rad === 1 && gccResponse.length > 0"
    >
      <template #header>
        <div class="card-header">
          <span class="card-title">编译器反馈信息</span>
        </div>
      </template>
      <span class="pre-wrap">
        {{ gccResponse }}
      </span>
    </el-card>
    <el-card class="box-card tip-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">修改建议</span>
        </div>
      </template>
      <span class="pre-wrap">
        {{ tips }}
      </span>
    </el-card>
    <CodeExample :ex="example" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "axios";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import { HomeData, PostMessage } from "./home-page";
import CodeExample from "./code-example.vue";

export default defineComponent({
  props: ["msg"],
  components: {
    CodeExample,
  },
  data(): HomeData {
    return {
      inputSize: {
        minRows: 5,
        maxRows: 10,
      },
      compileErrMessage: "",
      tips: "",
      rad: ref(1),
      gccResponse: "",
      editor: undefined,
      example: {
        before: "111",
        after: "",
      },
    };
  },
  mounted() {
    this.initEditor(); //初始化文本编辑框
    console.log("mounted!");
  },
  watch: {
    compileErrMessage(message: string) {
      this.getTips({
        compileErrMessage: message,
        type: this.rad,
      });
    },
    example(example) {
      console.log("ex1", example);
    },
  },
  methods: {
    changeTips(mes: string) {
      this.tips = mes;
    },
    initEditor() {
      const editor = ace.edit("editor");
      this.editor = editor;
      editor.setTheme("ace/theme/monokai");
      editor.session.setMode("ace/mode/c_cpp");
      editor.setHighlightActiveLine(true);
      editor.setFontSize("20px");
      /*  editor.on("change", (e) => {
        if (this.rad === 1) {
          this.onEditorChange(editor);
        }
      }); */
    },
    getTips(message: PostMessage) {
      axios({
        method: "post",
        url: "http://localhost:7777/api",
        data: message,
      })
        .then((response) => {
          console.log("response", response);
          const item = response.data.data.tips;
          this.tips = item.tips;
          this.gccResponse = item.gccResponse || "";
          this.example = item.example;
          if (this.editor) {
            this.editor.gotoLine(item.line || 1, 0, true);
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    },
    onEditorChange(editor: ace.Ace.Editor | undefined) {
      if (!editor) return;
      const code = editor.getValue();
      console.log("code", code);
      this.getTips({
        sourceCode: code,
        type: this.rad,
      });
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

#editor {
  width: 100%;
  height: 400px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 25px;
}

.button {
  margin: 15px;
}
</style>
