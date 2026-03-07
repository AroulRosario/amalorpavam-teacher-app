import { createContext, useContext, useState, useEffect } from 'react'

const TeacherContext = createContext()

const STUDENT_DB_KEY = 'amal_student_db'
const TEACHER_DB_KEY = 'amal_teacher_db'
const HOMEWORK_DB_KEY = 'amal_homework_db'
const EXAM_DB_KEY = 'amal_exam_db'
const TIMETABLE_DB_KEY = 'amal_timetable_db'
const TEACHER_PERMS_DB_KEY = 'amal_teacher_perms_db'
const CLASS_MAPPINGS_DB_KEY = 'amal_class_mappings_db'
const CIRCULARS_DB_KEY = 'amal_circulars_db'
const NEWS_DB_KEY = 'amal_news_db'
const ATTENDANCE_DB_KEY = 'amal_attendance_db'
const SYLLABUS_DB_KEY = 'amal_syllabus_db'
const NOTIFICATIONS_DB_KEY = 'amal_notifications_db'

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
    const [classMappings, setClassMappings] = useState(() => JSON.parse(localStorage.getItem(CLASS_MAPPINGS_DB_KEY)) || [])
    const [circulars, setCirculars] = useState(() => JSON.parse(localStorage.getItem(CIRCULARS_DB_KEY)) || [])
    const [news, setNews] = useState(() => JSON.parse(localStorage.getItem(NEWS_DB_KEY)) || [])
    const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem(ATTENDANCE_DB_KEY)) || {})
    const [syllabus, setSyllabus] = useState(() => JSON.parse(localStorage.getItem(SYLLABUS_DB_KEY)) || [])
    const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem(NOTIFICATIONS_DB_KEY)) || [])

    // Real-time sync
    useEffect(() => {
        const sync = (e) => {
            if (!e.newValue) return
            try {
                const parsed = JSON.parse(e.newValue)
                switch (e.key) {
                    case STUDENT_DB_KEY: setStudents(parsed); break
                    case TEACHER_DB_KEY: setTeachers(parsed); break
                    case HOMEWORK_DB_KEY: setHomework(parsed); break
                    case EXAM_DB_KEY: setExams(parsed); break
                    case TIMETABLE_DB_KEY: setTimetable(parsed); break
                    case TEACHER_PERMS_DB_KEY: setPerms(parsed); break
                    case CLASS_MAPPINGS_DB_KEY: setClassMappings(parsed); break
                    case CIRCULARS_DB_KEY: setCirculars(parsed); break
                    case NEWS_DB_KEY: setNews(parsed); break
                    case ATTENDANCE_DB_KEY: setAttendance(parsed); break
                    case SYLLABUS_DB_KEY: setSyllabus(parsed); break
                    case NOTIFICATIONS_DB_KEY: setNotifications(parsed); break
                }
            } catch (err) { }
        }
        window.addEventListener('storage', sync)
        return () => window.removeEventListener('storage', sync)
    }, [])

    useEffect(() => {
        if (currentTeacher) {
            const fresh = teachers.find(t => t.id === currentTeacher.id)
            if (fresh) {
                setCurrentTeacher(fresh)
                localStorage.setItem('amal_current_teacher', JSON.stringify(fresh))
            }
        }
    }, [teachers])

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

    // Model V3: Classes teacher is assigned to for ANY subject
    const myClassNames = currentTeacher
        ? classMappings.filter(m => (m.subjects || []).some(s => Number(s.teacherId) === Number(currentTeacher.id))).map(m => m.class)
        : []

    const myStudents = currentTeacher ? students.filter(s => myClassNames.includes(s.class)) : []
    const myExams = currentTeacher ? exams.filter(ex => String(ex.teacherId) === String(currentTeacher.id)) : []
    const myHomework = currentTeacher ? homework.filter(h => h.teacherId === currentTeacher.id) : []
    const myTimetable = currentTeacher ? timetable.filter(t => t.periods?.some(p => String(p.teacherId) === String(currentTeacher.id))) : []
    const mySyllabus = currentTeacher ? syllabus.filter(s => s.teacherId === currentTeacher.id) : []

    const myPerms = currentTeacher ? (perms[currentTeacher.id] || { homework: true, markEntry: true, attendance: true, contentUpload: true, timetableView: true, studentPerformance: true }) : {}

    const addHomework = (hw) => {
        const updated = [{ ...hw, id: Date.now(), teacherId: currentTeacher.id, done: false }, ...homework]
        setHomework(updated); localStorage.setItem(HOMEWORK_DB_KEY, JSON.stringify(updated))
    }

    const saveMarks = (examId, studentMarks) => {
        const updated = exams.map(ex => ex.id === examId ? { ...ex, marks: { ...(ex.marks || {}), ...studentMarks } } : ex)
        setExams(updated); localStorage.setItem(EXAM_DB_KEY, JSON.stringify(updated))
    }

    const saveAttendance = (date, classId, records) => {
        const updated = { ...attendance, [`${date}_${classId}`]: records }
        setAttendance(updated); localStorage.setItem(ATTENDANCE_DB_KEY, JSON.stringify(updated))
    }

    const saveSyllabus = (s) => {
        const updated = [...syllabus]
        const idx = updated.findIndex(x => x.class === s.class && x.subject === s.subject && x.unitId === s.unitId)
        if (idx >= 0) updated[idx] = { ...updated[idx], ...s }
        else updated.push({ ...s, id: Date.now(), teacherId: currentTeacher.id })
        setSyllabus(updated); localStorage.setItem(SYLLABUS_DB_KEY, JSON.stringify(updated))
    }

    const addNotification = (n) => {
        const updated = [{ ...n, id: Date.now(), time: new Date().toISOString(), read: false }, ...notifications]
        setNotifications(updated); localStorage.setItem(NOTIFICATIONS_DB_KEY, JSON.stringify(updated))
    }

    return (
        <TeacherContext.Provider value={{
            currentTeacher, login, logout,
            students, myStudents, myExams, myHomework, myTimetable, myPerms, myClassNames, mySyllabus,
            homework, exams, timetable, teachers, classMappings, circulars, news, attendance, syllabus, notifications,
            addHomework, saveMarks, saveAttendance, saveSyllabus, addNotification
        }}>
            {children}
        </TeacherContext.Provider>
    )
}

export const useTeacher = () => useContext(TeacherContext)
