import { useState } from 'react'
import { useTeacher } from '../context/TeacherContext'
import { Book, Plus, Video, FileText, Layout, CheckCircle, Clock, Link as LinkIcon, Trash2, X } from 'lucide-react'

export default function SyllabusPlanner() {
    const { myClassNames, currentTeacher, classMappings, saveSyllabus, syllabus, addNotification, addToast } = useTeacher()

    const [selectedClass, setSelectedClass] = useState(myClassNames[0] || '')
    const mySubjectsInClass = classMappings.find(m => m.class === selectedClass)?.subjects?.filter(s => Number(s.teacherId) === Number(currentTeacher?.id)).map(s => s.name) || []
    const [selectedSubject, setSelectedSubject] = useState(mySubjectsInClass[0] || '')

    const classSyllabus = syllabus.filter(s => s.class === selectedClass && s.subject === selectedSubject)

    const [showAdd, setShowAdd] = useState(false)
    const [form, setForm] = useState({ unitId: '', title: '', desc: '', reqClasses: 5, video: '', pdf: '', ppt: '', quiz: '', status: 'Planned' })

    const handleSave = (e) => {
        e.preventDefault()
        if (!form.unitId || !form.title) {
            addToast('Unit ID and Title are required.', 'error')
            return
        }
        saveSyllabus({ ...form, class: selectedClass, subject: selectedSubject })
        addToast(`Unit ${form.unitId} saved for ${selectedSubject}.`, 'success')
        setShowAdd(false)
        setForm({ unitId: '', title: '', desc: '', reqClasses: 5, video: '', pdf: '', ppt: '', quiz: '', status: 'Planned' })
    }

    const toggleStatus = (unit) => {
        const newStatus = unit.status === 'Completed' ? 'In Progress' : 'Completed'
        saveSyllabus({ ...unit, status: newStatus })

        if (newStatus === 'Completed') {
            addNotification({
                userId: 'all',
                userRole: 'student',
                filter: { class: selectedClass },
                type: 'syllabus',
                title: 'New Chapter Unlocked!',
                msg: `Great news! ${selectedSubject} - Unit ${unit.unitId}: ${unit.title} is now completed and unlocked in your Learning Hub.`
            })
            addToast(`Unit marked completed. Content unlocked for students!`, 'success')
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ display: 'flex', gap: 20, padding: 20, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 4 }}>SELECT CLASS</label>
                    <select className="form-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        {myClassNames.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', display: 'block', marginBottom: 4 }}>SELECT SUBJECT</label>
                    <select className="form-input" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                        {mySubjectsInClass.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button className="btn-primary" onClick={() => setShowAdd(true)}>
                    <Plus size={18} /> Add Syllabus Unit
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {classSyllabus.sort((a, b) => a.unitId.localeCompare(b.unitId)).map((unit, i) => (
                    <div key={unit.id} className="card" style={{ border: unit.status === 'Completed' ? '2px solid #10B981' : '1.5px solid #E2E8F0', transition: '0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 10, fontWeight: 900, color: '#1E50E2', background: '#E8EFFD', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 6 }}>UNIT {unit.unitId}</div>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0A2463' }}>{unit.title}</h3>
                            </div>
                            <button onClick={() => toggleStatus(unit)} style={{
                                background: unit.status === 'Completed' ? '#10B981' : '#F1F5F9',
                                color: unit.status === 'Completed' ? 'white' : '#64748B',
                                border: 'none', borderRadius: 10, padding: '8px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                            }}>
                                {unit.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />} {unit.status}
                            </button>
                        </div>
                        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>{unit.desc}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                            <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10, textAlign: 'center' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8' }}>REQ. CLASSES</div>
                                <div style={{ fontSize: 16, fontWeight: 900, color: '#0A2463' }}>{unit.reqClasses}</div>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 10, textAlign: 'center' }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8' }}>RESOURCES</div>
                                <div style={{ fontSize: 16, fontWeight: 900, color: '#0A2463' }}>{[unit.video, unit.pdf, unit.ppt, unit.quiz].filter(Boolean).length}</div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, display: 'flex', gap: 10 }}>
                            <button className="btn-sm" style={{ flex: 1, background: '#F1F5F9', border: 'none', borderRadius: 8, padding: 8, color: '#1E50E2', display: 'flex', justifyContent: 'center' }} title="Video"><Video size={16} /></button>
                            <button className="btn-sm" style={{ flex: 1, background: '#F1F5F9', border: 'none', borderRadius: 8, padding: 8, color: '#EF4444', display: 'flex', justifyContent: 'center' }} title="PDF"><FileText size={16} /></button>
                            <button className="btn-sm" style={{ flex: 1, background: '#F1F5F9', border: 'none', borderRadius: 8, padding: 8, color: '#F59E0B', display: 'flex', justifyContent: 'center' }} title="PPT"><Layout size={16} /></button>
                            <button onClick={() => { setForm(unit); setShowAdd(true) }} className="btn-sm" style={{ flex: 1, background: '#E8EFFD', border: 'none', borderRadius: 8, padding: 8, color: '#1E50E2', display: 'flex', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>EDIT</button>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                    <form onSubmit={handleSave} className="card" style={{ width: 500, maxHeight: '95vh', overflowY: 'auto', padding: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{form.id ? 'Edit Unit' : 'Add New Unit'}</h2>
                            <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                                <div><label className="form-label">UNIT ID</label><input className="form-input" placeholder="1.1" value={form.unitId} onChange={e => setForm({ ...form, unitId: e.target.value })} /></div>
                                <div><label className="form-label">TITLE</label><input className="form-input" placeholder="Laws of Motion" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            </div>
                            <div><label className="form-label">DESCRIPTION</label><textarea className="form-input" style={{ height: 80 }} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} /></div>
                            <div><label className="form-label">REQUIRED CLASSES</label><input type="number" className="form-input" value={form.reqClasses} onChange={e => setForm({ ...form, reqClasses: e.target.value })} /></div>

                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 8 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 12 }}>RESOURCES & LINKS</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ display: 'flex', gap: 10 }}><Video size={18} color="#1E50E2" style={{ marginTop: 12 }} /><input className="form-input" placeholder="YouTube/Video URL" value={form.video} onChange={e => setForm({ ...form, video: e.target.value })} /></div>
                                    <div style={{ display: 'flex', gap: 10 }}><FileText size={18} color="#EF4444" style={{ marginTop: 12 }} /><input className="form-input" placeholder="Notes/PDF Link" value={form.pdf} onChange={e => setForm({ ...form, pdf: e.target.value })} /></div>
                                    <div style={{ display: 'flex', gap: 10 }}><Layout size={18} color="#F59E0B" style={{ marginTop: 12 }} /><input className="form-input" placeholder="PPT/Slides Link" value={form.ppt} onChange={e => setForm({ ...form, ppt: e.target.value })} /></div>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ height: 48, justifyContent: 'center', marginTop: 10 }}>Save Unit</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
