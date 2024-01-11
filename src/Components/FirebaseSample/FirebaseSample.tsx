import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where, getDocs, getDoc } from "firebase/firestore";
import { firebaseDB } from '../../config/firebase';

interface User {
    id: string;
    name_user: string;
    role: string;
}

interface Todo {
    id: string;
    todo: string;
}

export default function FirebaseSample() {
    const [userName, setUserName] = useState("");
    const [listUsers, setUsers] = useState<User[]>([]);
    const [todo, setTodo] = useState("");
    const [listTodo, setListTodo] = useState<Todo[]>([]);
    const [userRef, setUserRef] = useState("");


    useEffect(() => {
        console.log("fetch users");
        const unsubscribe = onSnapshot(collection(firebaseDB, "users"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("live");
            setUsers(data as User[]);
        });

        return () => unsubscribe(); // This is the cleanup function
    }, []);

    useEffect(() => {
        console.log("fetch todos");
        const unsubscribe = onSnapshot(collection(firebaseDB, "todos"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("live");
            setListTodo(data as Todo[]);
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
                    <input
                        type="text"
                        placeholder="Todo?"
                        onChange={(e) => setTodo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ref?"
                        onChange={(e) => setUserRef(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn"
                        onClick={() => {
                            addTodo(todo, userRef);
                            // addTodoWithUser(todo, userRef);
                        }}
                    >
                        Submit
                    </button>
                </div>
                <div className="todo-content">
                    {
                        listTodo?.map((current, i) => (
                            <p key={i}>
                                {`${current.id} \n ${current.todo}`}
                                <button onClick={() => deleteTodo(current.id)}>Delete</button>
                            </p>
                        ))
                    }
                </div>
                <h1>Users</h1>
                <div className="todo-content">
                    <input
                        type="text"
                        placeholder="What do you have to do today?"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn"
                        onClick={() => addUser(userName)}
                    >
                        Submit
                    </button>
                </div>
                {
                    listUsers?.map((current, i) => (
                        <p key={i}>
                            {`${current.id} \n ${current.name_user}  ${current.role}`}
                            <button onClick={() => deleteUser(current.name_user)}>Delete</button>
                        </p>
                    ))
                }
            </div>
        </section>
    )
}

async function deleteUser(name: string) {
    try {
        const todosQuery = query(collection(firebaseDB, "todos"), where("name_user", "==", name));
        const todosSnapshot = await getDocs(todosQuery);

        // Delete each todo
        const deletePromises = todosSnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
        await Promise.all(deletePromises);

        await deleteDoc(doc(firebaseDB, 'users', name));
        console.log('Todo deleted with ID:', name);
    } catch (e) {
        console.error('Error deleting todo:', e);
    }
}

async function addUser(name: string) {
    try {
        const docRef = await addDoc(collection(firebaseDB, "users"), {
            name_user: name,
            role: "sample",
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function deleteTodo(todoId: string) {
    try {
        await deleteDoc(doc(firebaseDB, 'todos', todoId));
        console.log('Todo deleted with ID:', todoId);
    } catch (e) {
        console.error('Error deleting todo:', e);
    }
}

async function addTodo(todo: string, name: string) {
    try {
        const usersRef = collection(firebaseDB, "users");
        const q = query(usersRef, where("name_user", "==", name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = await addDoc(collection(firebaseDB, "todos"), {
                todo: todo,
                name_user: name,
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Todo added");
        } else {
            console.log("No such user!");
            alert("No such user!");
        }

    } catch (e) {
        console.error("Error adding document: ", e);
    }

}
