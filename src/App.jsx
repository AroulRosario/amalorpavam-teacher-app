import React, { useState } from 'react'
import { TeacherProvider, useTeacher } from './context/TeacherContext'
import AttendanceMarking from './pages/AttendanceMarking'
import SyllabusPlanner from './pages/SyllabusPlanner'
import {
  LayoutDashboard, BookOpen, ClipboardCheck, Users, LogOut, Plus, Save,
  Calendar, Eye, BarChart2, X, Clock, User, CheckCircle, Toast
} from 'lucide-react'
import './index.css'

// ── Login Screen ───────────────────────────
function LoginScreen() {
  const { login } = useTeacher()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (!login(email, password)) setError('Invalid credentials or account inactive.')
    else setError('')
  }

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A2463, #1E50E2)', position: 'fixed', top: 0, left: 0 }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 40, width: 420, boxShadow: '0 40px 80px rgba(0,0,0,0.3)', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #1034A6, #4F83EE)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 32, fontWeight: 900 }}>A</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#0A2463' }}>Staff Portal Login</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 4 }}>Amalorpavam Higher Secondary School</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginLeft: 4 }}>Email Address</label>
            <input className="form-input" placeholder="anitha@amal.edu" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginLeft: 4 }}>Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: '#EF4444', fontSize: 12, fontWeight: 700, padding: '8px 12px', background: '#FEE2E2', borderRadius: 8 }}>{error}</div>}
          <button className="btn-primary" type="submit" style={{ justifyContent: 'center', width: '100%', padding: '14px', borderRadius: 14, fontSize: 16 }}>Sign In</button>
        </form>
      </div>
    </div>
  )
}

// ── Main App ───────────────────────────────
function TeacherApp() {
  const { currentTeacher, logout, myStudents, myExams, myHomework, myTimetable, myPerms, students, classMappings, addHomework, saveMarks, syllabus } = useTeacher()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedExam, setSelectedExam] = useState(null)
  const [markForm, setMarkForm] = useState({})
  const [showHwModal, setShowHwModal] = useState(false)
  const [hwForm, setHwForm] = useState({ sub: '', topic: '', deadline: '', desc: '', assignedTo: [], class: '' })

  if (!currentTeacher) return <LoginScreen />

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: null },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle, perm: 'attendance' },
    { id: 'syllabus', label: 'Syllabus Planner', icon: BookOpen, perm: 'contentUpload' },
    { id: 'students', label: 'My Students', icon: Users, perm: null },
    { id: 'homework', label: 'Homework', icon: ClipboardCheck, perm: 'homework' },
    { id: 'marks', label: 'Mark Entry', icon: Save, perm: 'markEntry' },
    { id: 'timetable', label: 'My Timetable', icon: Calendar, perm: 'timetableView' },
    { id: 'performance', label: 'Performance', icon: BarChart2, perm: 'studentPerformance' },
  ]
  const tabs = allTabs.filter(t => !t.perm || myPerms[t.perm])

  const myAssignments = classMappings.filter(m => (m.subjects || []).some(s => Number(s.teacherId) === Number(currentTeacher.id)))

  const handleSaveMarks = () => {
    saveMarks(selectedExam.id, markForm)
    setSelectedExam(null)
    setMarkForm({})
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">A</div>
          <div><h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Amalorpavam</h3><span style={{ fontSize: 11, opacity: 0.6 }}>Staff Portal v3.0</span></div>
        </div>
        <nav className="nav">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-item ${activeTab === t.id ? 'active' : ''}`}>
              <t.icon size={20} /> {t.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white' }}>{currentTeacher.name[0]}</div>
            <div style={{ fontSize: 13, color: 'white' }}>
              <div style={{ fontWeight: 700 }}>{currentTeacher.name}</div>
              <div style={{ opacity: 0.5, fontSize: 11 }}>Teacher Account</div>
            </div>
          </div>
          <button className="nav-item" style={{ color: '#EF4444' }} onClick={logout}><LogOut size={20} /> Sign Out</button>
        </div>
      </aside>

      <main className="content">
        <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A2463', margin: 0 }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p style={{ color: '#64748B', marginTop: 4, fontSize: 14 }}>{currentTeacher.name} · Staff Member</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>TERM STATUS</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#10B981' }}>SYLLABUS ACTIVE</div>
          </div>
        </header>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>MY STUDENTS</div><div style={{ fontSize: 28, fontWeight: 900, color: '#1034A6' }}>{myStudents.length}</div></div>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>COMPLETED UNITS</div><div style={{ fontSize: 28, fontWeight: 900, color: '#10B981' }}>{syllabus.filter(s => s.teacherId === currentTeacher.id && s.status === 'Completed').length}</div></div>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>HOMEWORK GIVEN</div><div style={{ fontSize: 28, fontWeight: 900, color: '#6366F1' }}>{myHomework.length}</div></div>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>AVG PERFORMANCE</div><div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B' }}>{myStudents.length ? Math.round(myStudents.reduce((a, s) => a + s.avg, 0) / myStudents.length) : '0'}%</div></div>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0, fontSize: 18, fontWeight: 900 }}>My Academic Allotments</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
                {myAssignments.map(m => (
                  <div key={m.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1.5px solid #E2E8F0' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#0A2463', marginBottom: 4 }}>{m.class}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {m.subjects.filter(s => Number(s.teacherId) === Number(currentTeacher.id)).map(s => (
                        <span key={s.name} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, color: '#1E50E2' }}>{s.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {myAssignments.length === 0 && <div style={{ color: '#94A3B8', fontSize: 14 }}>No classes assigned to you.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === 'attendance' && <AttendanceMarking />}

        {/* SYLLABUS PLANNER */}
        {activeTab === 'syllabus' && <SyllabusPlanner />}

        {/* MY STUDENTS */}
        {activeTab === 'students' && (
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>NAME</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>CLASS</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>ROLL</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>PERFORMANCE</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>ATTENDANCE</th>
              </tr></thead>
              <tbody>
                {myStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: '#0A2463' }}>{s.name}</td>
                    <td style={{ padding: '16px 24px' }}><span style={{ padding: '4px 10px', background: '#E8EFFD', borderRadius: 8, fontSize: 11, fontWeight: 800, color: '#1E50E2' }}>{s.class}</span></td>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#64748B' }}>{s.roll}</td>
                    <td style={{ padding: '16px 24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: `${s.avg}%`, height: '100%', background: s.avg >= 80 ? '#10B981' : '#F59E0B' }} /></div><span style={{ fontSize: 12, fontWeight: 800 }}>{s.avg}%</span></div></td>
                    <td style={{ padding: '16px 24px', fontWeight: 800, color: '#0A2463' }}>{s.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myStudents.length === 0 && <div style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>No students mapped to you yet.</div>}
          </div>
        )}

        {/* HOMEWORK (Simplified for now) */}
        {activeTab === 'homework' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <p style={{ color: '#64748B', fontSize: 14 }}>Assign and track homework for your subjects.</p>
              <button className="btn-primary" onClick={() => setShowHwModal(true)}><Plus size={18} /> Assign Homework</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {myHomework.map(h => (
                <div key={h.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ padding: '4px 10px', background: '#E8EFFD', borderRadius: 8, fontSize: 11, fontWeight: 800, color: '#1E50E2' }}>{h.sub} · {h.class}</span>
                    <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 800 }}>{h.deadline}</span>
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16 }}>{h.topic}</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px' }}>{h.desc}</p>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#10B981' }}>{h.assignedTo?.length} Students Assigned</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MARK ENTRY */}
        {activeTab === 'marks' && (
          <div className="card">
            {!selectedExam ? (
              <>
                <h3 style={{ marginTop: 0 }}>Term Exam Allotments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                  {myExams.map(ex => (
                    <div key={ex.id} onClick={() => setSelectedExam(ex)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', border: '2px solid #F1F5F9', borderRadius: 16, cursor: 'pointer', background: 'white' }}>
                      <div><div style={{ fontSize: 14, fontWeight: 900, color: '#0A2463' }}>{ex.title}</div><div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{ex.class} · {ex.subject}</div></div>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: ex.marks ? '#D1FAE5' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ex.marks ? '#10B981' : '#64748B' }}><ClipboardCheck size={20} /></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                  <div><h3 style={{ margin: 0 }}>Entry: {selectedExam.title}</h3><p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>{selectedExam.class} · {selectedExam.subject}</p></div>
                  <button onClick={() => setSelectedExam(null)} className="btn-outline btn-sm">← Back</button>
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ background: '#F8FAFC' }}><th style={{ padding: 12, textAlign: 'left' }}>ROLL</th><th style={{ padding: 12, textAlign: 'left' }}>NAME</th><th style={{ padding: 12, textAlign: 'center' }}>MARKS (/100)</th></tr></thead>
                    <tbody>
                      {students.filter(s => s.class === selectedExam.class).map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: 16 }}>{s.roll}</td>
                          <td style={{ padding: 16, fontWeight: 800 }}>{s.name}</td>
                          <td style={{ padding: 16, textAlign: 'center' }}>
                            <input className="form-input" style={{ width: 80, textAlign: 'center' }} type="number" defaultValue={selectedExam.marks?.[s.id] || ''} onChange={e => setMarkForm({ ...markForm, [s.id]: e.target.value })} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn-primary" style={{ marginTop: 24, width: '100%', height: 50, justifyContent: 'center' }} onClick={handleSaveMarks}><Save size={18} /> Finalize & Submit Marks</button>
              </div>
            )}
          </div>
        )}

        {/* TIMETABLE */}
        {activeTab === 'timetable' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {myTimetable.map(day => (
              <div key={day.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Calendar size={18} color="#1E50E2" />
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{day.day} · {day.class}</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {day.periods.filter(p => Number(p.teacherId) === Number(currentTeacher.id)).map((p, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Clock size={12} /> {p.time}</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#0A2463' }}>{p.subject}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {myTimetable.length === 0 && <div className="card" style={{ padding: 60, textAlign: 'center', color: '#94A3B8' }}>No periods yet.</div>}
          </div>
        )}
      </main>

      {/* Shared Modals etc could go here */}
    </div>
  )
}

export default function App() {
  return <TeacherProvider><TeacherApp /></TeacherProvider>
}
