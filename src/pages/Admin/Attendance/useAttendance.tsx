import { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc, DocumentReference, getDocs, where, query } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';
import { User } from '../Users/useUsers';
import { wait } from '../../../utils/wait';

export interface Attendance {
    studentId: string;
    room: string;
    subject: string;
    timeIn: string;
    id?: string;
    student_ref?: DocumentReference;
    student_rfid?: string;
}

export function useGetAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "attendances"), async (snapshot) => {
            const data = await Promise.all(snapshot.docs.map(async (doc) => {
                const attendanceData = doc.data() as Attendance;
                const studentSnap = await getDoc(attendanceData.student_ref!);
                const studentData = studentSnap.data() as any;

                return {
                    id: doc.id,
                    ...attendanceData,
                    student: studentData,
                    name: studentData?.name || "N/A",
                    role: studentData?.role || "N/A",
                };
            }));
            console.log(data);

            setAttendance(data as any[]);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    return attendance;
}

export function useUpdateAttendance() {
    const [status, setStatus] = useState("idle");

    const updateAttendance = async (id: string, status: string) => {
        setStatus("loading");

        try {
            const attendanceRef = doc(firebaseDB, "attendance", id);
            await updateDoc(attendanceRef, { status });

            setStatus("success");
        } catch (e) {
            console.log(e);
            setStatus("error");
        }
    };

    return { status, updateAttendance };
}

export function useDeleteAttendance() {
    const deleteAttendance = async (id: string) => {
        try {
            const ref = doc(firebaseDB, "attendance", id);
            await deleteDoc(ref);

            return { ok: true, message: "Attendance deleted successfully" };
        } catch (e) {
            console.log(e);
            return { error: true, message: "Error deleting attendance" };
        }
    };

    return { deleteAttendance };
}


export function useAddAttendance() {
    const [loading, setLoading] = useState(1);
    const [error, setError] = useState("");

    const addAttendance = async (data: Attendance, rfid: string) => {
        setLoading(0);
        try {
            const attendanceRef = collection(firebaseDB, "attendances");
            console.log(attendanceRef);
            console.log(data, "wew");

            // find a one student with the rfid input
            const studentRef = query(collection(firebaseDB, "users"), where("rfid", "==", rfid));
            const studentSnapshot = await getDocs(studentRef);

            // if student is not found
            if (studentSnapshot.empty) {
                setLoading(3);
                setError("Student not found");
            }

            // get the first student found
            const studentDoc = studentSnapshot.docs[0];



            const studentData = studentDoc.data();
            console.log(studentData, "studentData");

            //update student data
            const currentStudent = doc(firebaseDB, "users", studentDoc.id);
            await updateDoc(currentStudent, { room: data.room });

            setLoading(2);

        } catch (e) {
            setLoading(3);
            console.log(e);
        } finally {
            await wait(3000);
            setError("");
            setLoading(1);
        }
    };

    return { addAttendance, loading, error };
}


export function useGetUsersWithinRoom(room: string) {
    const [users, setUsers] = useState<User[]>([]);


    useEffect(() => {
        const q = query(collection(firebaseDB, "users"), where("room", "==", room));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const updatedUsers: User[] = [];

            querySnapshot.forEach((doc) => {
                updatedUsers.push({ id: doc.id, ...doc.data() } as User);
            });

            setUsers(updatedUsers);
        });

        // Return the unsubscribe function to stop listening to changes
        return () => unsubscribe();
    }, [room]);

    return users;
}

// non-react hooks
export async function getAttendance(id: string) {
    const docRef = doc(firebaseDB, "attendance", id || "");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

