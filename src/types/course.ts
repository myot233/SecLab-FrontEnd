export interface Course {
  id: number
  name: string
  description: string
  cover?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  category: string
  status: 'draft' | 'published' | 'archived'
  studentCount: number
  experimentCount: number
  createTime: string
  updateTime?: string
} 