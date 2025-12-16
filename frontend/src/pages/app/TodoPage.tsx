import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { todosApi, Todo } from '../../api/todos';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const filterParam = filter === 'all' ? undefined : filter === 'open' ? 0 : 1;
      const data = await todosApi.list(filterParam);
      setTodos(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await todosApi.create({ title: newTitle });
      setNewTitle('');
      loadTodos();
    } catch (err: any) {
      alert(err.response?.data?.detail || '创建失败');
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await todosApi.update(todo.id, { done: !todo.done });
      loadTodos();
    } catch (err: any) {
      alert(err.response?.data?.detail || '更新失败');
    }
  };

  const handleEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      await todosApi.update(id, { title: editTitle });
      setEditingId(null);
      setEditTitle('');
      loadTodos();
    } catch (err: any) {
      alert(err.response?.data?.detail || '更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条待办吗？')) return;
    try {
      await todosApi.delete(id);
      loadTodos();
    } catch (err: any) {
      alert(err.response?.data?.detail || '删除失败');
    }
  };

  return (
    <Layout role="FRIEND">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          marginBottom: '30px',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>待办事项</h1>

        {/* Create new todo */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="新待办事项..."
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCreate}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              添加
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          {['all', 'open', 'done'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f ? '#3498db' : 'white',
                color: filter === f ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {f === 'all' ? '全部' : f === 'open' ? '未完成' : '已完成'}
            </button>
          ))}
        </div>

        {/* Todo list */}
        {loading && <p>加载中...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit(todo.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.done ? 'line-through' : 'none',
                    color: todo.done ? '#999' : '#333'
                  }}
                >
                  {todo.title}
                </span>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => handleEdit(todo.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle('');
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      删除
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && todos.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#999'
          }}>
            暂无待办事项
          </div>
        )}
      </div>
    </Layout>
  );
}
