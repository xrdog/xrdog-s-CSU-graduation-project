import { Ref } from "vue";
import ace from "ace-builds";

export interface ExampleData {
    example: {
        before: string,
        after: string
    }
    showExample: boolean
    editorBefore: ace.Ace.Editor | undefined;
    editorAfter: ace.Ace.Editor | undefined;
}