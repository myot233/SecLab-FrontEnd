import {createRouter, createWebHashHistory} from "vue-router";
import UserLayout from "../layout/User/index.vue"
import AdminLayout from "../layout/Admin/index.vue"
import Courses from "../pages/User/Courses/index.vue"
import Welcome from "../pages/WelCome/index.vue"
import Course from "../pages/User/Course/index.vue"
import Module from "../pages/User/Module/index.vue"
import ScoreBoard from '../pages/User/Scoreboard/index.vue'
import Modules from '../pages/User/Modules/index.vue'
import Profile from '../pages/User/Profile/index.vue'
import Community from '../pages/User/Community/index.vue'
import Points from '../pages/User/Points/index.vue'
import Access from '../pages/Access/index.vue'
import UserManage from  '../pages/Admin/Users/index.vue'
import CourseManage from '../pages/Admin/Courses/index.vue'
import LabManage from '../pages/Admin/Labs/index.vue'
import MockTarget from '../mock/MockTarget.vue'
import DashBoard from '../pages/Admin/DashBoard/index.vue'
import CourseCreate from '../pages/Admin/Courses/create/create.vue'
export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),

    routes: [{
        path: "/container/550e8400-e29b-41d4-a716-446655440000",
        component: MockTarget
    },
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
                    path:"community",
                    component:Community
                },{
                    path:"scoreboard",
                    component:ScoreBoard
                },{
                    path:"modules",
                    component:Modules
                },{
                    path:"profile",
                    component:Profile
                },{
                    path:"points",
                    component:Points
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
                // 在admin路径下
                {
                    path:"course/create",
                    component:CourseCreate
                },{
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
                },{
                    path:"dashboard",
                    component:DashBoard
                }
            ]
        },{
            path:"",
            component:Access,
        }
    ]
})