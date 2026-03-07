import { useState } from 'react'
import { useTeacher } from '../context/TeacherContext'
import { CheckCircle, XCircle, Search, Calendar, Users, Save } from 'lucide-react'

export default function AttendanceMarking() {
    const { myClassNames, students, saveAttendance, attendance, addToast } = useTeacher()
    const [selectedClass, setSelectedClass] = useState(myClassNames[0] || '')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const classStudents = students.filter(s => s.class === selectedClass)
    const recordKey = `${date}_${selectedClass}`
    const existingRecords = attendance[recordKey] || {}

    // Temporary local state for marking before saving
    const [marks, setMarks] = useState({})

    // Initialize marks from existing or default to present
    const initMarks = () => {
        const newMarks = {}
        classStudents.forEach(s => {
            newMarks[s.id] = existingRecords[s.id] !== undefined ? existingRecords[s.id] : true
        })
        setMarks(newMarks)
    }

    // Effect-like initialization when class or date changes
    const [lastRef, setLastRef] = useState('')
    if (lastRef !== recordKey) {
        initMarks()
        setLastRef(recordKey)
    }

    const handleSave = () => {
        saveAttendance(date, selectedClass, marks)
        addToast(`Attendance for ${selectedClass} saved.`, 'success')
    }

    const stats = {
        total: classStudents.length,
        present: Object.values(marks).filter(v => v === true).length,
        absent: Object.values(marks).filter(v => v === false).length
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 4 }}>CLASS</label>
                        <select className="form-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                            {myClassNames.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 4 }}>DATE</label>
                        <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>SUMMARY</div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#0A2463' }}>{stats.present} Present / {stats.absent} Absent</div>
                    </div>
                    <button className="btn-primary" onClick={handleSave} style={{ alignSelf: 'center' }}>
                        <Save size={18} /> Save Attendance
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Users size={18} color="#1E50E2" />
                        <span style={{ fontWeight: 800, color: '#0A2463' }}>Student List — {selectedClass}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ background: 'none', border: 'none', color: '#10B981', fontWeight: 800, fontSize: 12, cursor: 'pointer' }} onClick={() => {
                            const m = { ...marks }; classStudents.forEach(s => m[s.id] = true); setMarks(m)
                        }}>Mark All Present</button>
                        <button style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 800, fontSize: 12, cursor: 'pointer' }} onClick={() => {
                            const m = { ...marks }; classStudents.forEach(s => m[s.id] = false); setMarks(m)
                        }}>Mark All Absent</button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC' }}>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>ROLL</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>STUDENT NAME</th>
                            <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#64748B' }}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classStudents.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#64748B' }}>{s.roll}</td>
                                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 800, color: '#0A2463' }}>{s.name}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: 4, borderRadius: 12, gap: 4 }}>
                                        <button onClick={() => setMarks({ ...marks, [s.id]: true })} style={{
                                            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800,
                                            background: marks[s.id] ? '#10B981' : 'transparent',
                                            color: marks[s.id] ? 'white' : '#64748B',
                                            transition: '0.2s'
                                        }}>
                                            <CheckCircle size={14} /> Present
                                        </button>
                                        <button onClick={() => setMarks({ ...marks, [s.id]: false })} style={{
                                            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800,
                                            background: marks[s.id] === false ? '#EF4444' : 'transparent',
                                            color: marks[s.id] === false ? 'white' : '#64748B',
                                            transition: '0.2s'
                                        }}>
                                            <XCircle size={14} /> Absent
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {classStudents.length === 0 && (
                    <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>
                        <Search size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
                        <div>No students found for this class.</div>
                    </div>
                )}
            </div>
        </div>
    )
}
