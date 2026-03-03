import { createContext, useContext, useState, useEffect } from 'react'

const TeacherContext = createContext()

const STUDENT_DB_KEY = 'amal_student_db'
const TEACHER_DB_KEY = 'amal_teacher_db'
const HOMEWORK_DB_KEY = 'amal_homework_db'
const EXAM_DB_KEY = 'amal_exam_db'
const TIMETABLE_DB_KEY = 'amal_timetable_db'
const TEACHER_PERMS_DB_KEY = 'amal_teacher_perms_db'

export function TeacherProvider({ children }) {
    const [currentTeacher, setCurrentTeacher] = useState(() => {
        const saved = localStorage.getItem('amal_current_teacher')
        return saved ? JSON.parse(saved) : null
    })

    const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem(STUDENT_DB_KEY)) || [])
    const [teachers, setTeachers] = useState(() => JSON.parse(localStorage.getItem(TEACHER_DB_KEY)) || [])
    const [homework, setHomework] = useState(() => JSON.parse(localStorage.getItem(HOMEWORK_DB_KEY)) || [])
    const [exams, setExams] = useState(() => JSON.parse(localStorage.getItem(EXAM_DB_KEY)) || [])
    const [timetable, setTimetable] = useState(() => JSON.parse(localStorage.getItem(TIMETABLE_DB_KEY)) || [])
    const [perms, setPerms] = useState(() => JSON.parse(localStorage.getItem(TEACHER_PERMS_DB_KEY)) || {})

    // Real-time sync with Admin
    useEffect(() => {
        const sync = (e) => {
            if (e.key === STUDENT_DB_KEY) setStudents(JSON.parse(e.newValue || '[]'))
            if (e.key === TEACHER_DB_KEY) setTeachers(JSON.parse(e.newValue || '[]'))
            if (e.key === HOMEWORK_DB_KEY) setHomework(JSON.parse(e.newValue || '[]'))
            if (e.key === EXAM_DB_KEY) setExams(JSON.parse(e.newValue || '[]'))
            if (e.key === TIMETABLE_DB_KEY) setTimetable(JSON.parse(e.newValue || '[]'))
            if (e.key === TEACHER_PERMS_DB_KEY) setPerms(JSON.parse(e.newValue || '{}'))
        }
        window.addEventListener('storage', sync)
        return () => window.removeEventListener('storage', sync)
    }, [])

    const login = (email, password) => {
        const t = teachers.find(t => t.email === email && t.password === password && t.active)
        if (t) {
            setCurrentTeacher(t)
            localStorage.setItem('amal_current_teacher', JSON.stringify(t))
            return true
        }
        return false
    }

    const logout = () => {
        setCurrentTeacher(null)
        localStorage.removeItem('amal_current_teacher')
    }

    // Filtered data for current teacher
    const myStudents = currentTeacher ? students.filter(s => s.teacherId === currentTeacher.id) : []
    const myExams = currentTeacher ? exams.filter(ex => String(ex.teacherId) === String(currentTeacher.id)) : []
    const myHomework = currentTeacher ? homework.filter(h => h.teacherId === currentTeacher.id) : []
    const myTimetable = currentTeacher ? timetable.filter(t => t.periods?.some(p => String(p.teacherId) === String(currentTeacher.id))) : []
    const myPerms = currentTeacher ? (perms[currentTeacher.id] || { homework: true, markEntry: true, attendance: true, contentUpload: false, timetableView: true, studentPerformance: true }) : {}

    const addHomework = (hw) => {
        const newHw = { ...hw, id: Date.now(), teacherId: currentTeacher.id, done: false }
        const updated = [newHw, ...homework]
        setHomework(updated)
        localStorage.setItem(HOMEWORK_DB_KEY, JSON.stringify(updated))
    }

    const saveMarks = (examId, studentMarks) => {
        const updated = exams.map(ex => ex.id === examId ? { ...ex, marks: { ...(ex.marks || {}), ...studentMarks }, lastUpdated: new Date().toISOString() } : ex)
        setExams(updated)
        localStorage.setItem(EXAM_DB_KEY, JSON.stringify(updated))
    }

    return (
        <TeacherContext.Provider value={{
            currentTeacher, login, logout,
            students, myStudents, myExams, myHomework, myTimetable, myPerms,
            homework, exams, timetable, teachers,
            addHomework, saveMarks
        }}>
            {children}
        </TeacherContext.Provider>
    )
}

export const useTeacher = () => useContext(TeacherContext)
