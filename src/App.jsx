import React, { useState } from 'react'
import { TeacherProvider, useTeacher } from './context/TeacherContext'
import {
  LayoutDashboard, BookOpen, ClipboardCheck, Users, LogOut, Plus, Save,
  Calendar, Eye, BarChart2, X, Clock, User
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
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A2463, #1E50E2)' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 40, width: 400, boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg, #1034A6, #4F83EE)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 900 }}>A</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#0A2463' }}>Staff Portal Login</h2>
          <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>Amalorpavam Higher Secondary School</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input className="form-input" placeholder="Email (e.g. anitha@amal.edu)" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="form-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div style={{ color: '#EF4444', fontSize: 12, fontWeight: 700 }}>{error}</div>}
          <button className="btn-primary" type="submit" style={{ justifyContent: 'center', width: '100%' }}>Sign In</button>
        </form>
        <div style={{ marginTop: 24, padding: 16, background: '#F8FAFC', borderRadius: 12, fontSize: 12, color: '#64748B' }}>
          <strong>Demo:</strong> anitha@amal.edu / teacher123
        </div>
      </div>
    </div>
  )
}

// ── Main App ───────────────────────────────
function TeacherApp() {
  const { currentTeacher, logout, myStudents, myExams, myHomework, myTimetable, myPerms, students, addHomework, saveMarks, homework } = useTeacher()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedExam, setSelectedExam] = useState(null)
  const [markForm, setMarkForm] = useState({})
  const [showHwModal, setShowHwModal] = useState(false)
  const [hwForm, setHwForm] = useState({ sub: '', topic: '', deadline: '', desc: '', assignedTo: [], class: '' })

  if (!currentTeacher) return <LoginScreen />

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: null },
    { id: 'students', label: 'My Students', icon: Users, perm: null },
    { id: 'homework', label: 'Homework', icon: BookOpen, perm: 'homework' },
    { id: 'marks', label: 'Mark Entry', icon: ClipboardCheck, perm: 'markEntry' },
    { id: 'timetable', label: 'My Timetable', icon: Calendar, perm: 'timetableView' },
    { id: 'performance', label: 'Performance', icon: BarChart2, perm: 'studentPerformance' },
  ]
  const tabs = allTabs.filter(t => !t.perm || myPerms[t.perm])

  const toggleHwStudent = (id) => setHwForm(f => ({ ...f, assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter(x => x !== id) : [...f.assignedTo, id] }))
  const handleAddHw = (e) => {
    e.preventDefault()
    if (!hwForm.topic || !hwForm.deadline || hwForm.assignedTo.length === 0) return
    addHomework(hwForm)
    setShowHwModal(false)
    setHwForm({ sub: '', topic: '', deadline: '', desc: '', assignedTo: [], class: '' })
  }
  const handleSaveMarks = () => { saveMarks(selectedExam.id, markForm); setSelectedExam(null); setMarkForm({}) }

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">A</div>
          <div><h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Amalorpavam</h3><span style={{ fontSize: 11, opacity: 0.6 }}>Staff Portal v2.0</span></div>
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
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1E50E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white' }}>{currentTeacher.name[0]}</div>
            <div style={{ fontSize: 13, color: 'white' }}>
              <div style={{ fontWeight: 700 }}>{currentTeacher.name}</div>
              <div style={{ opacity: 0.5, fontSize: 11 }}>{currentTeacher.subjects?.join(', ')}</div>
            </div>
          </div>
          <button className="nav-item" style={{ color: '#EF4444' }} onClick={logout}><LogOut size={20} /> Sign Out</button>
        </div>
      </aside>

      <main className="content">
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0A2463', margin: 0 }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
          <p style={{ color: '#64748B', marginTop: 4, fontSize: 14 }}>Manage your classes, students, and academic records</p>
        </header>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>MY STUDENTS</div><div style={{ fontSize: 28, fontWeight: 900, color: '#1034A6' }}>{myStudents.length}</div></div>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>PENDING EXAMS</div><div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B' }}>{myExams.filter(e => !e.marks).length}</div></div>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>HOMEWORK GIVEN</div><div style={{ fontSize: 28, fontWeight: 900, color: '#10B981' }}>{myHomework.length}</div></div>
              <div className="card"><div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>AVG SCORE</div><div style={{ fontSize: 28, fontWeight: 900, color: '#6366F1' }}>{myStudents.length ? Math.round(myStudents.reduce((a, s) => a + s.avg, 0) / myStudents.length) : '—'}%</div></div>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>My Classes</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {currentTeacher.classes?.map(c => <span key={c} style={{ padding: '8px 16px', background: '#E8EFFD', borderRadius: 10, fontWeight: 800, color: '#1034A6', fontSize: 13 }}>{c}</span>)}
              </div>
            </div>
          </div>
        )}

        {/* MY STUDENTS */}
        {activeTab === 'students' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>NAME</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>CLASS</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>ROLL</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>AVG</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>ATTENDANCE</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748B' }}>FEE</th>
              </tr></thead>
              <tbody>
                {myStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{s.name}</td>
                    <td style={{ padding: '14px 16px' }}>{s.class}</td>
                    <td style={{ padding: '14px 16px' }}>{s.roll}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontWeight: 800, color: s.avg >= 80 ? '#10B981' : '#F59E0B' }}>{s.avg}%</span></td>
                    <td style={{ padding: '14px 16px' }}>{s.attendance}%</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 8, background: s.fee === 'Paid' ? '#D1FAE5' : '#FEF3C7', color: s.fee === 'Paid' ? '#059669' : '#D97706' }}>{s.fee}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myStudents.length === 0 && <div style={{ padding: 48, textAlign: 'center', color: '#94A3B8' }}>No students mapped to you yet. Ask your Admin to assign students.</div>}
          </div>
        )}

        {/* HOMEWORK */}
        {activeTab === 'homework' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div />
              <button className="btn-primary" onClick={() => setShowHwModal(true)}><Plus size={18} /> Assign Homework</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {myHomework.map(h => (
                <div key={h.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, background: '#E8EFFD', color: '#1034A6', padding: '3px 10px', borderRadius: 20 }}>{h.sub}</span>
                    <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 800 }}>DUE: {h.deadline}</span>
                  </div>
                  <h4 style={{ margin: '6px 0', fontSize: 16 }}>{h.topic}</h4>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 12px' }}>{h.desc}</p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(h.assignedTo || []).map(sid => {
                      const st = students.find(s => s.id === sid)
                      return st ? <span key={sid} style={{ fontSize: 10, fontWeight: 700, background: '#F1F5F9', padding: '2px 8px', borderRadius: 6 }}>{st.name.split(' ')[0]}</span> : null
                    })}
                  </div>
                </div>
              ))}
            </div>

            {showHwModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div className="card" style={{ width: 500, maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ margin: 0 }}>Assign Homework</h2>
                    <button onClick={() => setShowHwModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleAddHw} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div><label style={{ fontSize: 12, fontWeight: 800 }}>Subject</label><input className="form-input" value={hwForm.sub} onChange={e => setHwForm({ ...hwForm, sub: e.target.value })} /></div>
                      <div><label style={{ fontSize: 12, fontWeight: 800 }}>Class</label>
                        <select className="form-input" value={hwForm.class} onChange={e => setHwForm({ ...hwForm, class: e.target.value, assignedTo: [] })}>
                          <option value="">Select Class</option>
                          {currentTeacher.classes?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label style={{ fontSize: 12, fontWeight: 800 }}>Topic</label><input className="form-input" value={hwForm.topic} onChange={e => setHwForm({ ...hwForm, topic: e.target.value })} /></div>
                    <div><label style={{ fontSize: 12, fontWeight: 800 }}>Deadline</label><input type="date" className="form-input" value={hwForm.deadline} onChange={e => setHwForm({ ...hwForm, deadline: e.target.value })} /></div>
                    <div><label style={{ fontSize: 12, fontWeight: 800 }}>Description</label><textarea className="form-input" style={{ height: 80 }} value={hwForm.desc} onChange={e => setHwForm({ ...hwForm, desc: e.target.value })} /></div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label style={{ fontSize: 12, fontWeight: 800 }}><Users size={14} style={{ verticalAlign: 'middle' }} /> Select Students ({hwForm.assignedTo.length})</label>
                        <button type="button" onClick={() => setHwForm(f => ({ ...f, assignedTo: students.filter(s => s.class === f.class).map(s => s.id) }))} style={{ fontSize: 11, fontWeight: 800, color: '#1034A6', background: 'none', border: 'none', cursor: 'pointer' }}>Select All</button>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: 12, border: '1.5px solid #E2E8F0', borderRadius: 12, maxHeight: 140, overflowY: 'auto' }}>
                        {students.filter(s => s.class === hwForm.class).length === 0
                          ? <div style={{ padding: 12, color: '#94A3B8', fontSize: 12, width: '100%', textAlign: 'center' }}>Select a class first</div>
                          : students.filter(s => s.class === hwForm.class).map(s => (
                            <button type="button" key={s.id} onClick={() => toggleHwStudent(s.id)} style={{
                              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
                              borderColor: hwForm.assignedTo.includes(s.id) ? '#1034A6' : '#E2E8F0',
                              background: hwForm.assignedTo.includes(s.id) ? '#E8EFFD' : 'white',
                              color: hwForm.assignedTo.includes(s.id) ? '#1034A6' : '#64748B',
                            }}>{hwForm.assignedTo.includes(s.id) ? '✓ ' : ''}{s.name}</button>
                          ))
                        }
                      </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Assign Homework</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MARK ENTRY */}
        {activeTab === 'marks' && (
          <div className="card">
            {!selectedExam ? (
              <>
                <h3 style={{ marginTop: 0 }}>Allotted Exams</h3>
                <p style={{ color: '#64748B', marginBottom: 20 }}>Select an exam to enter marks for your students.</p>
                {myExams.map(ex => (
                  <div key={ex.id} onClick={() => setSelectedExam(ex)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '2px solid #F1F5F9', borderRadius: 12, marginBottom: 8, cursor: 'pointer' }}>
                    <div><strong>{ex.title}</strong><div style={{ fontSize: 12, color: '#64748B' }}>Class {ex.class} · {ex.subject}</div></div>
                    <ClipboardCheck size={20} color={ex.marks ? '#10B981' : '#1034A6'} />
                  </div>
                ))}
                {myExams.length === 0 && <p style={{ color: '#94A3B8' }}>No exams allotted yet. Wait for your Admin to assign exams.</p>}
              </>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ margin: 0 }}>Marks: {selectedExam.title}</h3>
                  <button onClick={() => setSelectedExam(null)} style={{ background: '#F1F5F9', border: 'none', padding: '6px 14px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>← Back</button>
                </div>
                <table className="mark-grid">
                  <thead><tr><th>Roll</th><th>Name</th><th>Class</th><th>Marks (/100)</th></tr></thead>
                  <tbody>
                    {students.filter(s => s.class === selectedExam.class).map(s => (
                      <tr key={s.id}>
                        <td>{s.roll}</td><td style={{ fontWeight: 700 }}>{s.name}</td><td>{s.class}</td>
                        <td><input className="mark-input" type="number" defaultValue={selectedExam.marks?.[s.id] || ''} onChange={e => setMarkForm({ ...markForm, [s.id]: e.target.value })} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }} onClick={handleSaveMarks}><Save size={18} /> Save & Sync Marks</button>
              </div>
            )}
          </div>
        )}

        {/* TIMETABLE */}
        {activeTab === 'timetable' && (
          <div>
            {myTimetable.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center', color: '#94A3B8' }}>
                <Calendar size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <div style={{ fontWeight: 700 }}>No timetable entries found for you.</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Ask your Admin to set up the timetable and assign you to periods.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {myTimetable.map(entry => (
                  <div key={entry.id} className="card">
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, color: '#0A2463' }}>
                      <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />{entry.class} — {entry.day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {entry.periods.filter(p => String(p.teacherId) === String(currentTeacher.id)).map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: '#F8FAFC', borderRadius: 10 }}>
                          <Clock size={16} color="#64748B" />
                          <span style={{ fontWeight: 600, fontSize: 13, width: 140 }}>{p.time}</span>
                          <span style={{ fontWeight: 800, background: '#E8EFFD', color: '#1034A6', padding: '4px 12px', borderRadius: 8, fontSize: 13 }}>{p.subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PERFORMANCE */}
        {activeTab === 'performance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {myStudents.map(s => (
              <div key={s.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: '#E8EFFD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#1034A6', fontSize: 16 }}>{s.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><div style={{ fontWeight: 800 }}>{s.name}</div><div style={{ fontSize: 12, color: '#64748B' }}>{s.class} · Roll {s.roll}</div></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div style={{ textAlign: 'center', padding: 8, background: '#F8FAFC', borderRadius: 8 }}><div style={{ fontSize: 10, fontWeight: 800, color: '#64748B' }}>AVG</div><div style={{ fontWeight: 900, color: s.avg >= 80 ? '#10B981' : '#F59E0B' }}>{s.avg}%</div></div>
                  <div style={{ textAlign: 'center', padding: 8, background: '#F8FAFC', borderRadius: 8 }}><div style={{ fontSize: 10, fontWeight: 800, color: '#64748B' }}>ATT.</div><div style={{ fontWeight: 900, color: '#1034A6' }}>{s.attendance}%</div></div>
                  <div style={{ textAlign: 'center', padding: 8, background: '#F8FAFC', borderRadius: 8 }}><div style={{ fontSize: 10, fontWeight: 800, color: '#64748B' }}>FEE</div><div style={{ fontWeight: 900, color: s.fee === 'Paid' ? '#10B981' : '#EF4444' }}>{s.fee}</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default function App() {
  return <TeacherProvider><TeacherApp /></TeacherProvider>
}
