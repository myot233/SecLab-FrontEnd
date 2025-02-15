import {createRouter, createWebHistory} from "vue-router";
import UserLayout from "../layout/User/index.vue"
import AdminLayout from "../layout/Admin/index.vue"
import Courses from "../pages/User/Courses/index.vue"
import Welcome from "../pages/WelCome/index.vue"
import Course from "../pages/User/Course/index.vue"
import Module from "../pages/User/Module/index.vue"
import ScoreBoard from '../pages/User/Scoreboard/index.vue'
import Modules from '../pages/User/Modules/index.vue'
import Profile from '../pages/User/Profile/index.vue'
import Access from '../pages/Access/index.vue'
import UserManage from  '../pages/Admin/Users/index.vue'
import CourseManage from '../pages/Admin/Courses/index.vue'
import LabManage from '../pages/Admin/Labs/index.vue'
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
                    component: Courses
                },{
                    path:"course/:id",
                    component:Course
                },{
                    path:"module/:id",
                    component:Module
                },{
                    path:"scoreboard",
                    component:ScoreBoard
                },{
                    path:"modules",
                    component:Modules
                },{
                    path:"profile",
                    component:Profile
                }]
        },
        {
            path: "/admin",
            component:AdminLayout,
            children: [
                {
                    path:"",
                    redirect:"/admin/welcome"
                },
                {
                    path:"welcome",
                    component:Welcome
                },{
                    path:"user",
                    component:UserManage,
                },{
                    path:"course",
                    component:CourseManage
                },{
                    path:"lab",
                    component:LabManage
                }
            ]
        },{
            path:"",
            component:Access,
        }
    ]
})