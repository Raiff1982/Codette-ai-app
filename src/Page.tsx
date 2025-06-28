import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';

function Page() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    async function getTodos() {
      try {
        const { data, error } = await supabase.from('todos').select('*');
        
        if (error) {
          console.error('Error fetching todos:', error);
          return;
        }

        if (data && data.length > 0) {
          setTodos(data);
        }
      } catch (error) {
        console.error('Error in getTodos:', error);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
      ))}
    </div>
  );
}

export default Page;