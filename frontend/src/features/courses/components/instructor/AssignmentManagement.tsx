import { useState } from 'react'
import { Card, Button, Input, IconButton, Select, Badge } from '@/shared/ui'
import { Plus, Trash2, Calendar, FileText, Link as LinkIcon, Edit2 } from 'lucide-react'
import { useCourseAssignments, useCreateAssignment, useUpdateAssignment, useDeleteAssignment } from '@/features/assignments/api/useAssignments'
import type { Assignment } from '@/shared/types/assignment'
import type { CourseDetail } from '@/shared/types/course'
import { Heading3, Paragraph } from '@/shared/ui/Typography'

interface AssignmentManagementProps {
  course: CourseDetail
}

export function AssignmentManagement({ course }: AssignmentManagementProps) {
  const { data: assignments, isLoading } = useCourseAssignments(course.id)
  const createMutation = useCreateAssignment()
  const updateMutation = useUpdateAssignment()
  const deleteMutation = useDeleteAssignment()

  const [isEditing, setIsEditing] = useState<string | 'new' | null>(null)
  const [formData, setFormData] = useState<Partial<Assignment>>({})

  const handleCreate = () => {
    setIsEditing('new')
    setFormData({
      courseId: course.id,
      title: '',
      description: '',
      maxScore: 100,
      isMandatory: true,
      dueDate: '',
      moduleId: null,
      lessonId: null,
    })
  }

  const handleEdit = (assignment: Assignment) => {
    setIsEditing(assignment.id)
    setFormData(assignment)
  }

  const handleSave = async () => {
    try {
      if (isEditing === 'new') {
        await createMutation.mutateAsync(formData)
      } else if (isEditing) {
        await updateMutation.mutateAsync({ id: isEditing, data: formData })
      }
      setIsEditing(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await deleteMutation.mutateAsync({ id, courseId: course.id })
    }
  }

  const modules = course.modules || []
  const allLessons = modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })))

  if (isLoading) return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading3>Course Assignments</Heading3>
          <Paragraph className="text-slate-500">Manage assignments for this course and link them to specific lessons.</Paragraph>
        </div>
        {!isEditing && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={18} />
            Add Assignment
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="p-6 border-2 border-indigo-100 bg-indigo-50/30">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Assignment Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Score</label>
                <Input
                  type="number"
                  value={formData.maxScore || 100}
                  onChange={e => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description or instructions"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link to Module</label>
                <Select
                  value={formData.moduleId || ''}
                  onChange={(e) => setFormData({ ...formData, moduleId: e.target.value || null })}
                  options={[
                    { label: 'None', value: '' },
                    ...modules.map(m => ({ label: m.title, value: m.id }))
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link to Lesson</label>
                <Select
                  value={formData.lessonId || ''}
                  onChange={(e) => setFormData({ ...formData, lessonId: e.target.value || null })}
                  options={[
                    { label: 'None', value: '' },
                    ...allLessons.map(l => ({ label: l.title, value: l.id }))
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="isMandatory"
                checked={formData.isMandatory ?? true}
                onChange={e => setFormData({ ...formData, isMandatory: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isMandatory" className="text-sm font-medium text-slate-700">
                Required for course completion
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsEditing(null)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {isEditing === 'new' ? 'Create Assignment' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {assignments?.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <FileText size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No assignments created for this course yet.</p>
          </div>
        ) : (
          assignments?.map(assignment => (
            <Card key={assignment.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{assignment.title}</span>
                    <Badge variant="secondary">{assignment.maxScore} pts</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                    {assignment.moduleId && (
                      <div className="flex items-center gap-1 text-indigo-600">
                        <LinkIcon size={12} />
                        Module: {modules.find(m => m.id === assignment.moduleId)?.title}
                      </div>
                    )}
                    {assignment.lessonId && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <LinkIcon size={12} />
                        Lesson: {allLessons.find(l => l.id === assignment.lessonId)?.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  icon={<Edit2 size={16} />}
                  variant="ghost"
                  aria-label={`Edit assignment ${assignment.title}`}
                  onClick={() => handleEdit(assignment)}
                />
                <IconButton
                  icon={<Trash2 size={16} />}
                  variant="ghost"
                  className="text-rose-500"
                  aria-label={`Delete assignment ${assignment.title}`}
                  onClick={() => handleDelete(assignment.id)}
                />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
