import React, { useState } from 'react'
import { TeacherProvider, useTeacher } from './context/TeacherContext'
import {
  LayoutDashboard, BookOpen, ClipboardCheck,
  Users, MessageSquare, Settings, LogOut,
  Plus, Search, Filter, Save, AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function TeacherApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { currentTeacher, students, exams, saveMarks, addHomework } = useTeacher()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marks', label: 'Mark Entry', icon: ClipboardCheck },
    { id: 'homework', label: 'Homework Hub', icon: BookOpen },
    { id: 'students', label: 'My Students', icon: Users },
  ]

  // --- Mark Entry Logic ---
  const [selectedExam, setSelectedExam] = useState(null)
  const [markForm, setMarkForm] = useState({})

  const handleSaveMarks = () => {
    saveMarks(selectedExam.id, markForm)
    alert('Marks saved and synced to Super Admin!')
    setSelectedExam(null)
    setMarkForm({})
  }

  // --- Homework Logic ---
  const [showHwModal, setShowHwModal] = useState(false)
  const [hwForm, setHwForm] = useState({ sub: '', topic: '', deadline: '', desc: '' })

  const handleAddHw = (e) => {
    e.preventDefault()
    addHomework(hwForm)
    setShowHwModal(false)
    setHwForm({ sub: '', topic: '', deadline: '', desc: '' })
  }

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">A</div>
          <div className="sidebar-brand">
            <h3 style={{ margin: 0 }}>Amalorpavam</h3>
            <span style={{ fontSize: 11, opacity: 0.6 }}>Staff Portal v1.0</span>
          </div>
        </div>

        <nav className="nav">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-item ${activeTab === t.id ? 'active' : ''}`}>
              <t.icon size={20} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1E50E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{currentTeacher.name[0]}</div>
            <div style={{ fontSize: 13 }}>
              <div style={{ fontWeight: 700 }}>{currentTeacher.name}</div>
              <div style={{ opacity: 0.5, fontSize: 11 }}>Senior Staff</div>
            </div>
          </div>
          <button className="nav-item" style={{ color: '#EF4444' }} onClick={() => alert('Logout')}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="content">
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0A2463', margin: 0 }}>
            {tabs.find(t => t.id === activeTab).label}
          </h1>
          <p style={{ color: '#64748B', marginTop: 4 }}>Manage class performance and academic updates</p>
        </header>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              <div className="card">
                <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 8 }}>MY STUDENTS</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#1034A6' }}>{students.filter(s => s.teacherId === currentTeacher.id).length}</div>
              </div>
              <div className="card">
                <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 8 }}>PENDING EXAMS</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#F59E0B' }}>{exams.filter(ex => ex.teacherId === String(currentTeacher.id) && !ex.marks).length}</div>
              </div>
              <div className="card">
                <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 8 }}>AVERAGE SCORE</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#10B981' }}>84.2%</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Recent Class Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Kavya Nair submitted Homework', 'Rahul Verma marked as absent', 'Mid-Term Maths allotted by principal'].map((msg, i) => (
                  <div key={i} style={{ padding: 12, background: '#F8FAFC', borderRadius: 12, fontSize: 14 }}>{msg}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marks' && (
          <div className="card">
            {!selectedExam ? (
              <>
                <h3>Allotted Exams</h3>
                <p style={{ color: '#64748B', marginBottom: 24 }}>Select an exam allotted by the Super Admin to enter marks.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {exams.filter(ex => ex.teacherId === String(currentTeacher.id)).map(ex => (
                    <div key={ex.id} className="nav-item" style={{ border: '2px solid #F1F5F9', color: '#0F172A', justifyContent: 'space-between' }} onClick={() => setSelectedExam(ex)}>
                      <div>
                        <strong>{ex.title}</strong>
                        <div style={{ fontSize: 12, opacity: 0.6 }}>Class {ex.class} · {ex.subject}</div>
                      </div>
                      <ClipboardCheck size={20} color="#1034A6" />
                    </div>
                  ))}
                  {exams.filter(ex => ex.teacherId === String(currentTeacher.id)).length === 0 && <p style={{ opacity: 0.5 }}>No exams allotted to you yet.</p>}
                </div>
              </>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3>Enter Marks: {selectedExam.title}</h3>
                  <button className="nav-item" style={{ width: 'auto' }} onClick={() => setSelectedExam(null)}>Back to List</button>
                </div>
                <table className="mark-grid">
                  <thead>
                    <tr><th>Roll No</th><th>Name</th><th>Class</th><th>Marks (Out of 100)</th></tr>
                  </thead>
                  <tbody>
                    {students.filter(s => s.class === selectedExam.class).map(s => (
                      <tr key={s.id}>
                        <td>{s.roll}</td>
                        <td style={{ fontWeight: 700 }}>{s.name}</td>
                        <td>{s.class}</td>
                        <td>
                          <input
                            className="mark-input"
                            type="number"
                            defaultValue={selectedExam.marks?.[s.id] || ''}
                            onChange={e => setMarkForm({ ...markForm, [s.id]: e.target.value })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn-primary" style={{ marginTop: 32, width: '100%', justifyContent: 'center' }} onClick={handleSaveMarks}>
                  <Save size={20} /> Save & Finalize Marks
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'homework' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0 }}>Assignments Management</h3>
              <button className="btn-primary" onClick={() => setShowHwModal(true)}><Plus size={18} /> New Homework</button>
            </div>

            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {useTeacher().homework.filter(h => h.teacherId === currentTeacher.id).map(h => (
                <div key={h.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, background: '#E8EFFD', color: '#1034A6', padding: '4px 10px', borderRadius: 20 }}>{h.sub}</span>
                    <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 800 }}>DUE: {h.deadline}</span>
                  </div>
                  <h4 style={{ margin: '8px 0', fontSize: 18 }}>{h.topic}</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 16px' }}>{h.desc}</p>
                </div>
              ))}
            </div>

            {showHwModal && (
              <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div className="card" style={{ width: 450 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ margin: 0 }}>Allot Homework</h2>
                    <button onClick={() => setShowHwModal(false)} style={{ background: 'none', border: 'none' }}><Plus style={{ transform: 'rotate(45deg)' }} /></button>
                  </div>
                  <form onSubmit={handleAddHw} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800 }}>Subject</label>
                      <input className="form-input" placeholder="e.g. Mathematics" value={hwForm.sub} onChange={e => setHwForm({ ...hwForm, sub: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800 }}>Topic</label>
                      <input className="form-input" placeholder="e.g. Calculus Basics" value={hwForm.topic} onChange={e => setHwForm({ ...hwForm, topic: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800 }}>Deadline</label>
                      <input type="date" className="form-input" value={hwForm.deadline} onChange={e => setHwForm({ ...hwForm, deadline: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800 }}>Description</label>
                      <textarea className="form-input" style={{ height: 100 }} value={hwForm.desc} onChange={e => setHwForm({ ...hwForm, desc: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Assign to Students</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}

function App() {
  return (
    <TeacherProvider>
      <TeacherApp />
    </TeacherProvider>
  )
}

export default App
