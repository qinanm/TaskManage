// 引入路由组件
import TaskManage from '@/pages/TaskManage'
import MoodWatch from '@/pages/MoodWatch'
import SomeMusic from '@/pages/SomeMusic'
import RandomWord from '@/pages/RandomWord'

// 配置路由 并暴露出路由
export default [
    {
        path: '/task_manage',
        component: TaskManage,
        meta:{
            isNeedTime: true
        }
    },
    {
        path: '/mood_watch',
        component: MoodWatch,
        meta:{
            isNeedTime: true
        }
    },
    {
        path:'/some_music',
        component: SomeMusic,
        meta:{
            isNeedTime: false
        }
    },
    {
        path:'/random_word',
        component: RandomWord,
        meta:{
            isNeedTime: false
        }
    },
]