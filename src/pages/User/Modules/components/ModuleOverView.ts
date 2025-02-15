export interface ModuleOverViewType {
  id: number
  name: string
  description: string
  difficulty: 1 | 2 | 3 | 4 | 5
  type: string
  status: 'available' | 'locked' | 'completed'
  prerequisites?: number[]  // 前置模块的ID
  estimatedTime: string    // 预计完成时间
  score?: number          // 如果完成了，显示得分
}
