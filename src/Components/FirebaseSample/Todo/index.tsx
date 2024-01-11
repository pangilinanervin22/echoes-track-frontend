import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { firebaseDB } from '../../../config/firebase';

interface Todo {
    id: string;
    todo: string;
}

export default function Todo() {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);


    useEffect(() => {
        console.log("fetch todos");
        const unsubscribe = onSnapshot(collection(firebaseDB, "todos"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("live");

            setTodos(data as Todo[]);
        });

        return () => unsubscribe(); // This is the cleanup function
    }, []);


    return (
        <section className="todo-container">
            <div className="todo">
                <h1 className="header">
                    Todo-App
                </h1>
                <div>
                    <div>
                        <input
                            type="text"
                            placeholder="What do you have to do today?"
                            onChange={(e) => setTodo(e.target.value)}
                        />
                    </div>
                    <div className="btn-container">
                        <button
                            type="submit"
                            className="btn"
                            onClick={() => addTodo(todo)}
                        >
                            Submit
                        </button>
                    </div>

                </div>

                <div className="todo-content">
                    {
                        todos?.map((todo, i) => (
                            <p key={i}>
                                {todo.todo}
                                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </p>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

async function deleteTodo(todoId: string) {
    try {
        await deleteDoc(doc(firebaseDB, 'todos', todoId));
        console.log('Todo deleted with ID:', todoId);
    } catch (e) {
        console.error('Error deleting todo:', e);
    }
}

async function addTodo(todo: string) {
    try {
        const docRef = await addDoc(collection(firebaseDB, "todos"), {
            todo: todo,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}
