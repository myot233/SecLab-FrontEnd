import axios from "axios";
import type { RegisterForm } from "./types/auth";
import type { User } from "./types/user";
import type { ModuleOverViewType } from "./pages/User/Modules/components/ModuleOverView";
import type { Course } from "./pages/User/Course/index.ts";
import type { Module } from "./pages/User/Module/index.ts";

const BASE_URL: string = "http://localhost:8083";
const IMAGE_URL = `${BASE_URL}/images/view/`;

type Result<T> = {
    isSuccess:number,
    status:number,
    message:string,
    data:T
}

// 定义后端返回的课程数据类型
export interface CourseSummaryDto {
    id: number;
    name: string;
    description: string;
    difficulty: number;
    imageUrl: string;
    type: string;
    tags: string[];
    status: string;
}

export let image = (imageName: string | null | undefined) => {
    // 添加空值检查
    if (!imageName) {
        return '/default-course-image.png'; // 默认图片路径
    }
    
    // 如果已经是完整URL，直接返回
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
        return imageName;
    }
    
    // 拼接后端图片URL
    return IMAGE_URL + imageName;
};

export async function login(loginRequest: { userStudentNumber: string; userPassword: string; }): Promise<Result<{ 
    loginData: {
        userId: number; 
        userStudentNumber: string; 
        userImage: string; 
        userName: string; 
        classId: number; 
        token: string; 
    }
}>> {
    // Make a POST request to the login endpoint with the loginRequest data
    const response = await axios.post(`${BASE_URL}/stu/login`, loginRequest);

    // Check if the response is successful
    if (response.status === 200) {
        // Return the response data (e.g., user info, tokens, etc.)
        return response.data;
    } else {
        // Handle unexpected response status
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}

export async function register(registerRequest: RegisterForm): Promise<Result<undefined>> {
    const response = await axios.post(`${BASE_URL}/stu/adduser`, registerRequest);
    if (response.status === 200) {
        // Return the response data (e.g., user info, tokens, etc.)
        return response.data;
    } else {
        // Handle unexpected response status
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}

export async function getUserInfo(token: string): Promise<Result<User>> {
    const response = await axios.get(`${BASE_URL}/stu/profile?token=${token}`);
    if (response.status === 200) {
        // Return the response data (e.g., user info, tokens, etc.)
        return response.data;
    } else {
        // Handle unexpected response status
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}


// This function will call the updateInfoByToken API endpoint
export async function updateUserInfoByToken(user: User,token: string): Promise<Result<User>> {
    try {
        // Make a POST request to the update user token endpoint
        const response = await axios.post(`${BASE_URL}/stu/update/user/token`, user,{headers:{"Authorization":token}});

        // Check if the response is successful
        if (response.status === 200) {
            // Return the response data (e.g., updated user info)
            return response.data;
        } else {
            // Handle unexpected response status
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error updating user info:', error);
        throw new Error('Failed to update user info. Please try again.');
    }
}

export async function getModuleList(): Promise<Result<ModuleOverViewType[]>> {
    const response = await axios.post(`${BASE_URL}/stu/module/modules`);
    if (response.status === 200) {
        // Return the response data (e.g., updated user info)
        return response.data;
    } else {
        // Handle unexpected response status
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}

export async function getCourseList(): Promise<Result<CourseSummaryDto[]>> {
    const response = await axios.get(`${BASE_URL}/course/overview-list`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}   

export async function getCourseDetail(id:number): Promise<Result<Course>> {
    const response = await axios.get(`${BASE_URL}/course/detail?id=${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}

export async function getModuleDetail(id:number): Promise<Result<Module>> {
    const response = await axios.get(`${BASE_URL}/course/module/detail?id=${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Unexpected response status: ${response.status}`);
    }
}   

