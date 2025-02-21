export interface CourseOverViewType {
    id: number;
    name: string;
    description: string;
    image: string;
    status: 'in-progress' | 'completed' | 'available';
    category: string;
    progress?: number;
    startDate?: string;
    endDate?: string;
    instructor?: {
        name: string;
        avatar: string;
        title: string;
    };
    tags?: string[];
    difficulty: 1 | 2 | 3 | 4 | 5;
    estimatedHours: number;
    totalStudents?: number;
}
