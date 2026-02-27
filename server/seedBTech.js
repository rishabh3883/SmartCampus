// Using native fetch in Node 18+

async function seedData() {
    console.log("Starting seed process for B.Tech...");

    const apiBase = 'http://localhost:5000/api';

    try {
        // 1. Create Course
        const c1Res = await fetch(`${apiBase}/master-data/courses`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'B.Tech CS', code: 'BTCS' })
        });
        const c1Data = await c1Res.json();
        const courseId = c1Data.data._id;
        console.log(`Course B.Tech created: ${courseId}`);

        // 2. Create Classes
        const cl1Res = await fetch(`${apiBase}/master-data/classes`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'B.Tech 3rd Yr Sec A', course: courseId, year: 3, section: 'A' })
        });
        const cl1Data = await cl1Res.json();
        console.log(`Class created: B.Tech 3rd Yr Sec A`);

        const cl2Res = await fetch(`${apiBase}/master-data/classes`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'B.Tech 3rd Yr Sec B', course: courseId, year: 3, section: 'B' })
        });
        const cl2Data = await cl2Res.json();
        console.log(`Class created: B.Tech 3rd Yr Sec B`);

        // 3. Create Subjects
        const subjects = [
            { name: "Computer Networks", code: "CS301", credits: 4, type: "Lecture", course: courseId },
            { name: "Database Systems", code: "CS302", credits: 4, type: "Lecture", course: courseId },
            { name: "Operating Systems", code: "CS303", credits: 4, type: "Lecture", course: courseId },
            { name: "Web Technologies", code: "CS304", credits: 3, type: "Lecture", course: courseId },
            { name: "Networking Lab", code: "CS301L", credits: 2, type: "Lab", course: courseId },
            { name: "Database Lab", code: "CS302L", credits: 2, type: "Lab", course: courseId }
        ];

        const subjectIds = [];
        for (const sub of subjects) {
            const res = await fetch(`${apiBase}/master-data/subjects`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });
            const data = await res.json();
            subjectIds.push({ id: data.data._id, type: data.data.type, name: data.data.name });
            console.log(`Subject created: ${data.data.name}`);
        }

        // 4. Create Teachers
        const theorySubs = subjectIds.filter(s => s.type === 'Lecture').map(s => s.id);
        const labSubs = subjectIds.filter(s => s.type === 'Lab').map(s => s.id);

        const teachers = [
            { name: "Dr. Alan Turing", employeeId: "EMP001", subjects: theorySubs.slice(0, 2) }, // Networks, DB
            { name: "Prof. Grace Hopper", employeeId: "EMP002", subjects: theorySubs.slice(2, 4) }, // OS, Web
            { name: "Dr. Linus Torvalds", employeeId: "EMP003", subjects: labSubs } // Labs
        ];

        for (const t of teachers) {
            const res = await fetch(`${apiBase}/master-data/teachers`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t)
            });
            const data = await res.json();
            console.log(`Teacher created: ${data.data.name}`);
        }

        // 5. Create Rooms
        const rooms = [
            { name: "LT-1", capacity: 60, type: "Classroom" },
            { name: "LT-2", capacity: 80, type: "Classroom" },
            { name: "CS Lab 1", capacity: 30, type: "Lab" },
            { name: "CS Lab 2", capacity: 30, type: "Lab" }
        ];

        for (const r of rooms) {
            const res = await fetch(`${apiBase}/master-data/rooms`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(r)
            });
            const data = await res.json();
            console.log(`Room created: ${data.data.name}`);
        }

        console.log("Done seeding B.Tech Master Data!");

    } catch (e) {
        console.error("Error seeding:", e);
    }
}

seedData();
