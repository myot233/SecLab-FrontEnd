import {createRouter, createWebHistory} from "vue-router";
import UserLayout from "../layout/User/index.vue"
import Course from "../pages/Courses/index.vue"
import Welcome from "../pages/WelCome/index.vue"

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: "/user",
            component: UserLayout, 
            children: [
                {
                    path: "", 
                    redirect:"/user/welcome"
                },
                {
                    path:"welcome",
                    component:Welcome
                },
                {
                    path: "courses",
                    component: Course
                }]
        },
        {
            path: "/admin", 
            children: []
        }
    ]
})