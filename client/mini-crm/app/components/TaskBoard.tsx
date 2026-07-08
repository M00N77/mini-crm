'use client'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { KanbanColumn } from '@/src/components/organisms/KanbanColumn'
import type { Task, TaskStatus } from '@/src/types/domain'

interface TaskBoardProps {
  tasks: Task[]
  onTaskClick: (id: number) => void
  onTaskMove: (id: number, status: TaskStatus) => void
}

const COLUMNS: { status: TaskStatus; label: string; variant: 'info' | 'warning' | 'success' }[] = [
  { status: 'pending', label: 'Todo', variant: 'info' },
  { status: 'in_progress', label: 'In Progress', variant: 'warning' },
  { status: 'done', label: 'Done', variant: 'success' },
]

const cardStyle: React.CSSProperties = {
  background: 'var(--surface, #17171a)',
  border: '1px solid var(--border, #2a2a2e)',
  borderRadius: 10,
  padding: '10px 12px',
  marginBottom: 8,
  cursor: 'pointer',
  userSelect: 'none',
}

export function TaskBoard({ tasks, onTaskClick, onTaskMove }: TaskBoardProps) {
  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return
    onTaskMove(Number(draggableId), destination.droppableId as TaskStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 16, overflowX: 'auto' }}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status)
          return (
            <div key={col.status} style={{ flex: '1 1 0', minWidth: 260 }}>
              <KanbanColumn title={col.label} count={colTasks.length} variant={col.variant}>
                <Droppable droppableId={col.status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 32,
                        paddingTop: 4,
                        borderRadius: 8,
                        background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.03)' : 'transparent',
                        transition: 'background 120ms ease',
                      }}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(dp, ds) => (
                            <div
                              ref={dp.innerRef}
                              {...dp.draggableProps}
                              {...dp.dragHandleProps}
                              onClick={() => onTaskClick(task.id)}
                              style={{
                                ...cardStyle,
                                ...dp.draggableProps.style,
                                boxShadow: ds.isDragging ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                              }}
                            >
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                              {task.description && (
                                <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary, #8a8a8a)' }}>
                                  {task.description}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </KanbanColumn>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
