import { Ref } from "vue";
import ace from "ace-builds";
export interface HomeData {
    inputSize: {
        minRows: number;
        maxRows: number;
    };
    compileErrMessage: string;
    tips: string;
    rad: Ref<number>;
    gccResponse: string;
    editor: ace.Ace.Editor | undefined;
    example: {
        before: string,
        after: string
    }
}

export interface PostMessage {
    compileErrMessage?: string;//编译错误信息
    sourceCode?: string//源码
    time?: number//编译时间(ms)
    user?: string//user_id
    type: number//1表示依据源码判断，2表示依据编译错误判断，0Test
}