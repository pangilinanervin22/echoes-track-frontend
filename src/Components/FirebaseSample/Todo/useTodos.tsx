import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';

interface Todo {
    id: string;
    todo: string;
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "todos"), (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTodos(data as Todo[]);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    return todos;
}