<template>
  <el-card class="box-card tip-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">修改示例</span>
      </div>
    </template>
    <div style="display: block; text-align: center">
      <div id="editor-before" class="editor"></div>
      <h4 class="editor-title">错误示例</h4>
      <div id="editor-after" class="editor"></div>
      <h4 class="editor-title">修改后</h4>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import { ExampleData } from "./code-example";
export default defineComponent({
  props: ["ex"],
  data(): ExampleData {
    return {
      example: this.ex,
      editorAfter: undefined,
      editorBefore: undefined,
    };
  },
  mounted() {
    console.log("code-example-mounted", this.example);
    const editorBefore = ace.edit("editor-before");
    editorBefore.setTheme("ace/theme/monokai");
    editorBefore.session.setMode("ace/mode/c_cpp");
    editorBefore.setFontSize("20px");
    const editorAfter = ace.edit("editor-after");
    editorAfter.setTheme("ace/theme/monokai");
    editorAfter.session.setMode("ace/mode/c_cpp");
    editorAfter.setFontSize("20px");
    this.editorAfter = editorAfter;
    this.editorBefore = editorBefore;
  },
  watch: {
    ex(value) {
      this.example = value;
    },
    example(value) {
      this.editorAfter?.setValue(value.after);
      this.editorBefore?.setValue(value.before);
      console.log("this.editorBefore", this.editorBefore?.getValue());
    },
  },
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 25px;
}

.editor {
  height: 300px;
  width: 100%;
}
.editor-title {
  margin-bottom: 30px;
  margin-top: 5px;
}
</style>