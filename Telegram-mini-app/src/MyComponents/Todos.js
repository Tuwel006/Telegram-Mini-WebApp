import React from 'react'
import { TodoItem } from './TodoItem'
export const Todos = ({toDos, onDelet}) => {
  return (
    <div className='text-center container'>
        {toDos.length===0?"No To Dos List!":toDos.map((todo) => {
            return <TodoItem todo={todo} key={todo.sno} onDelet = {onDelet}/>
        })}
        
        
    </div>
  )
}


