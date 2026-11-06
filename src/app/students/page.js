export default function StudentsPage() {
  const students = [
    { id: 1, name: "Ahmad Fadil", role: "Ketua Kelas", status: "Aktif" },
    { id: 2, name: "Siti Rahma", role: "Sekretaris", status: "Aktif" },
    { id: 3, name: "Budi Santoso", role: "Bendahara", status: "Aktif" },
    { id: 4, name: "Dewi Lestari", role: "Anggota", status: "Aktif" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <section className="bg-white border border-[#e9e9e9] rounded-xl p-8 sm:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-[#f0f0f0] text-[#555] rounded-md mb-4">
          Direktori
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111]">
          Daftar Siswa (Students)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#666]">
          Berikut adalah daftar data siswa kelas fadil.
        </p>

        <div className="mt-6 border border-[#e9e9e9] rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f9f9f9] border-b border-[#e9e9e9] text-[#444] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e9]">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#111]">{student.name}</td>
                  <td className="py-3 px-4 text-[#555]">{student.role}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-[11px] rounded bg-green-50 text-green-700 border border-green-200">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
