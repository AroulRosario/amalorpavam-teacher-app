import { createContext, useContext, useState, useEffect } from 'react'

const TeacherContext = createContext()

const STUDENT_DB_KEY = 'amal_student_db'
const TEACHER_DB_KEY = 'amal_teacher_db'
const HOMEWORK_DB_KEY = 'amal_homework_db'
const EXAM_DB_KEY = 'amal_exam_db'

export function TeacherProvider({ children }) {
    const [currentTeacher, setCurrentTeacher] = useState(() => {
        const saved = localStorage.getItem('amal_current_teacher')
        return saved ? JSON.parse(saved) : { id: 1, name: 'Ms. Anitha K.', email: 'anitha@amal.edu', subjects: ['Mathematics'], classes: ['XII-A'] }
    })

    const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem(STUDENT_DB_KEY)) || [])
    const [teachers, setTeachers] = useState(() => JSON.parse(localStorage.getItem(TEACHER_DB_KEY)) || [])
    const [homework, setHomework] = useState(() => JSON.parse(localStorage.getItem(HOMEWORK_DB_KEY)) || [])
    const [exams, setExams] = useState(() => JSON.parse(localStorage.getItem(EXAM_DB_KEY)) || [])

    // Sync with other apps (Admin/Student) via localStorage storage events
    useEffect(() => {
        const handleSync = (e) => {
            if (e.key === STUDENT_DB_KEY) setStudents(JSON.parse(e.newValue))
            if (e.key === TEACHER_DB_KEY) setTeachers(JSON.parse(e.newValue))
            if (e.key === HOMEWORK_DB_KEY) setHomework(JSON.parse(e.newValue))
            if (e.key === EXAM_DB_KEY) setExams(JSON.parse(e.newValue))
        }
        window.addEventListener('storage', handleSync)
        return () => window.removeEventListener('storage', handleSync)
    }, [])

    const addHomework = (hw) => {
        const newHw = { ...hw, id: Date.now(), teacherId: currentTeacher.id, done: false }
        const updated = [newHw, ...homework]
        setHomework(updated)
        localStorage.setItem(HOMEWORK_DB_KEY, JSON.stringify(updated))
    }

    const saveMarks = (examId, studentMarks) => {
        const updatedExams = exams.map(ex => {
            if (ex.id === examId) {
                const marks = ex.marks || {}
                return { ...ex, marks: { ...marks, ...studentMarks }, lastUpdated: new Date().toISOString() }
            }
            return ex
        })
        setExams(updatedExams)
        localStorage.setItem(EXAM_DB_KEY, JSON.stringify(updatedExams))
    }

    return (
        <TeacherContext.Provider value={{
            currentTeacher, students, teachers, homework, exams,
            addHomework, saveMarks
        }}>
            {children}
        </TeacherContext.Provider>
    )
}

export const useTeacher = () => useContext(TeacherContext)
