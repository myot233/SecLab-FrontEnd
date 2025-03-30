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
    // 立即重置之前的计时器，以确保新消息能立即显示
    toastVisible.value = false;
    
    // 小延迟后显示新消息，避免闪烁
    setTimeout(() => {
        toastMessage.value = message;
        toastVisible.value = true;
    }, 10);

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