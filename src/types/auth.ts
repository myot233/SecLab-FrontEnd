export interface LoginForm {
  userStudentNumber: string
  userPassword: string
  remember?: boolean
}

export interface RegisterForm {
  userStudentNumber: string
  userPassword: string
  userName: string
  userEmail: string
  userTel?: string
  userAcademy?: string
  classId?: number
  userGender?: number
} 