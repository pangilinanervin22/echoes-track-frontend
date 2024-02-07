/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc, DocumentReference, getDocs, where, query, Timestamp, addDoc } from 'firebase/firestore';
import { firebaseDB } from '../../../config/firebase';
import { User } from '../Users/useUsers';
import { wait } from '../../../utils/wait';

export interface Attendance {
    studentId: string;
    room: string;
    subject: string;
    date: Timestamp;
    section: string;
    id?: string;
    student_ref?: DocumentReference;
    student_rfid?: string;
}

export function useGetAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firebaseDB, "attendances"), async (snapshot) => {
            const data = await Promise.all(snapshot.docs.map(async (doc) => {
                const attendanceData = doc.data();
                const studentSnap = await getDoc(attendanceData.student_ref!);
                const studentData = studentSnap.data() as any;

                return {
                    id: doc.id,
                    ...attendanceData,
                    student: studentData,
                    name: studentData?.name || "N/A",
                    role: studentData?.role || "N/A",
                    date: attendanceData.date.toDate()
                };
            }));

            setAttendance(data as any[]);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    return attendance;
}

// export function useUpdateAttendance() {
//     const [status, setStatus] = useState("idle");

//     const updateAttendance = async (id: string, status: string) => {
//         setStatus("loading");

//         try {
//             const attendanceRef = doc(firebaseDB, "attendances", id);
//             await updateDoc(attendanceRef, {});

//             setStatus("success");
//         } catch (e) {
//             console.log(e);
//             setStatus("error");
//         }
//     };

//     return { status, updateAttendance };
// }

export function useDeleteAttendance() {
    const deleteAttendance = async (id: string) => {
        try {
            const ref = doc(firebaseDB, "attendances", id);
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
            // find a one student with the rfid input
            const studentRef = query(collection(firebaseDB, "users"), where("rfid", "==", rfid));
            const studentSnapshot = await getDocs(studentRef);

            // if student is not found
            if (studentSnapshot.empty) {
                setLoading(3);
                setError("Rfid not found");
                return { error: true, message: "Rfid not found" };
            }

            //update student data
            const studentDoc = studentSnapshot.docs[0];
            const currentStudent = doc(firebaseDB, "users", studentDoc.id);

            // get the first student found
            const userDoc = studentSnapshot.docs[0];
            const userData = userDoc.data() as User;

            // validate if student is already in the room
            if (userData.room === data.room) {
                setLoading(3);
                setError("Already in the room");
                return { error: true, message: "Already in the room" };
            } else if (userData.section !== data.section && "student" === userData.role) {
                setLoading(3);
                setError("Wrong section");
                return { error: true, message: "Wrong section" };
            }
            else {
                await updateDoc(currentStudent, { room: data.room });
                if ("student" !== userData.role) {
                    setLoading(2);
                    return { ok: true, message: "User entered successfully" };
                }
            }
            // validate user if not same section
            const studentData = {
                student_ref: userDoc.ref,
                section: userData.section,
                subject: data.subject,
                room: data.room,
                date: data.date
            };

            // add attendance
            await addDoc(collection(firebaseDB, "attendances"), { ...studentData });
            setLoading(2);
            return { ok: true, message: "User entered successfully" };

        } catch (e) {
            setLoading(3);
            console.log(e);
        } finally {
            await wait(2000);
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

export function useUpdateUserRoomByRFID() {
    const updateUserRoom = async (rfid: string, newRoom: string) => {
        try {
            const q = query(collection(firebaseDB, "users"), where("rfid", "==", rfid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { ok: false, message: "User not found" };
            }

            const userDoc = querySnapshot.docs[0];
            const userRef = doc(firebaseDB, "users", userDoc.id);

            //validate users if not already in a room
            const userData = userDoc.data() as User;
            if (userData.room === newRoom) {
                return { error: true, message: "User already in the room" };
            } else if (userData.room === "" && newRoom === "exit") {
                return { error: true, message: "User not in the room" };
            }

            if (newRoom === "exit") {
                await updateDoc(userRef, { room: "" });
                return { ok: true, message: "User exited successfully" };
            }

            await updateDoc(userRef, { room: newRoom });
            return { ok: true, message: "User entered successfully" };
        } catch (e) {
            console.log(e);
            return { ok: false, message: "Failed to update user room" };
        }
    };

    return { updateUserRoom };
}

// non-react hooks

export function useGetAllUsersWithRoom() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(firebaseDB, "users"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const updatedUsers: User[] = [];

            querySnapshot.forEach((doc) => {
                if (doc.data().room)
                    updatedUsers.push({ id: doc.id, ...doc.data() } as User);
            });

            setUsers(updatedUsers);
            setLoading(false);
        });

        // Return the unsubscribe function to stop listening to changes
        return () => unsubscribe();
    }, []);

    return { users, loading };
}

// non-react hooks
export async function getAttendance(id: string) {
    const docRef = doc(firebaseDB, "attendances", id || "");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

