import type { DisplayQuestionType } from "../../../types/Question.ts";
import { getModuleDetail } from "../../../api";

interface TaskPoint {
    id: number
    name: string
    description: string
    score: number
    document: string // Markdown格式的任务说明文档
    questions: DisplayQuestionType[]
}

interface Module {
    id: number
    name: string
    introduction: string
    difficulty: number
    taskPoints: TaskPoint[]
    targetMachine?: {
        id: string
    }
}

// 获取模块详情
export async function fetchModuleDetail(id: number): Promise<Module> {
    const response = await getModuleDetail(id);
    if (response.isSuccess === 1) {
        return response.data as Module;
    } else {
        throw new Error(response.message || '获取模块详情失败');
    }
}

export type { Module, TaskPoint }