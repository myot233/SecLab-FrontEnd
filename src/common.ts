import { inject, ref } from "vue";
import type { VueCookies } from "vue-cookies";

export type MergeId<A> = Omit<A, 'id'> &  { id:number }

export const useCookie = () => {
    return inject<VueCookies>('$cookies')!;
}

// Toast 相关
const toastMessage = ref('');
const toastVisible = ref(false);

export const showToast = (message: string) => {
    toastMessage.value = message;
    toastVisible.value = true;

    // 自动隐藏
    setTimeout(() => {
        toastVisible.value = false;
    }, 3000); // 3秒后隐藏
};

// Toast 组件
export const useToast = () => {
    return {
        toastMessage,
        toastVisible,
    };
};