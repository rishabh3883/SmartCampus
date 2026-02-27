// Using native fetch in Node 18+

async function seedData() {
    console.log("Starting seed process for Parul Timetable...");

    const apiBase = 'http://localhost:5000/api';

    try {
        // 1. Create Course
        const c1Res = await fetch(`${apiBase}/master-data/courses`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'B.TECH CSE-IEP', code: 'CSE-IEP' })
        });
        const c1Data = await c1Res.json();
        const courseId = c1Data.data._id;
        console.log(`Course created: B.TECH CSE-IEP`);

        // 2. Create Classes
        const cl1Res = await fetch(`${apiBase}/master-data/classes`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: '6QUICK1', course: courseId, year: 3, section: '1' })
        });
        const cl1Data = await cl1Res.json();
        console.log(`Class created: 6QUICK1`);

        // 3. Create Subjects
        const subjects = [
            { name: "Compiler Design", code: "303105349", credits: 4, type: "Lecture", course: courseId },
            { name: "Compiler Design Laboratory", code: "303105350", credits: 2, type: "Lab", course: courseId },
            { name: "MERN Stack Web Dev", code: "303105385", credits: 4, type: "Lecture", course: courseId },
            { name: "MERN Stack Web Dev Lab", code: "303105386", credits: 2, type: "Lab", course: courseId },
            { name: "Employability Skills", code: "303193353", credits: 3, type: "Lecture", course: courseId },
            { name: "Data visualization and Data Analytics", code: "NEW_CODE1", credits: 4, type: "Lecture", course: courseId },
            { name: "Data visualization and Data Analytics Lab", code: "NEW_CODE2", credits: 2, type: "Lab", course: courseId },
            { name: "Impact training", code: "IMPACT", credits: 2, type: "Lecture", course: courseId },
            { name: "APPTITUDE", code: "AT01", credits: 2, type: "Lecture", course: courseId }
        ];

        const subjectIds = [];
        for (const sub of subjects) {
            const res = await fetch(`${apiBase}/master-data/subjects`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });
            const data = await res.json();
            subjectIds.push({ id: data.data._id, code: sub.code });
            console.log(`Subject created: ${sub.name}`);
        }

        const getSubId = (c) => subjectIds.find(s => s.code === c).id;

        // 4. Create Teachers
        const teachers = [
            { name: "MR. E KANNIAPPAN", employeeId: "EMP38089", subjects: [getSubId("303105349"), getSubId("303105350")] },
            { name: "MR. RISAV KUMAR JHA", employeeId: "EMP40654", subjects: [getSubId("303105385"), getSubId("303105386")] },
            { name: "MR. KARMESH THAKKAR", employeeId: "EMP27107", subjects: [getSubId("303193353")] },
            { name: "MS. AKRUTI PANDWAL", employeeId: "EMP36529", subjects: [getSubId("NEW_CODE1"), getSubId("NEW_CODE2")] },
            { name: "SURAJ KACHATE", employeeId: "EMP41562", subjects: [getSubId("IMPACT")] },
            { name: "DIVYA G", employeeId: "EMP00004", subjects: [getSubId("AT01")] }
        ];

        for (const t of teachers) {
            const res = await fetch(`${apiBase}/master-data/teachers`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t)
            });
            const data = await res.json();
            console.log(`Teacher created: ${t.name}`);
        }

        // 5. Create Rooms
        const rooms = [
            { name: "D-414", capacity: 60, type: "Classroom" },
            { name: "A-224", capacity: 80, type: "Classroom" },
            { name: "D-224", capacity: 60, type: "Classroom" },
            { name: "D-413", capacity: 60, type: "Lab" },
            { name: "ONLINE", capacity: 1000, type: "Classroom" },
            { name: "ONLINE LAB", capacity: 1000, type: "Lab" }
        ];

        for (const r of rooms) {
            const res = await fetch(`${apiBase}/master-data/rooms`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(r)
            });
            const data = await res.json();
            console.log(`Room created: ${r.name}`);
        }

        console.log("Done seeding Parul Master Data!");

    } catch (e) {
        console.error("Error seeding:", e);
    }
}

seedData();
