import React from 'react'

export const TodoItem = ({todo, onDelet}) => {
  return (
    <div>
        <h4><span>{todo.sno}. </span>{todo.title}</h4>
        <p>{todo.desc}</p>
        <button onClick={()=>{onDelet(todo)}} className='btn btn-sm btn-danger'>Delet</button>
    </div>
  )
}

