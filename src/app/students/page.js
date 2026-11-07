import StudentsSection from "@/components/StudentsSection";
import prisma from "@/lib/prisma";

async function getStudents() {
  "use cache";
  try {
    const list = await prisma.student.findMany();
    return list.sort((a, b) =>
      a.name.localeCompare(b.name, "id", { sensitivity: "base" })
    );
  } catch (error) {
    console.error("Failed to load students on server:", error);
    return [];
  }
}

export default async function StudentsPage() {
  const students = await getStudents();
  return (
    <div className="w-full">
      <StudentsSection initialStudents={students} />
    </div>
  );
}
