let dosen = [
  { id: 1, nama: 'Nur Rachmat, M.Kom.', nip: '0210088501', prodiId: 1 },
  { id: 2, nama: 'Dr. Adinda Joe', nip: '0210088502', prodiId: 1 },
  { id: 3, nama: 'Dr. Budi Santoso', nip: '0210088503', prodiId: 2 },
];
let nextId = 4;

function getAll(prodiId) {
  if (prodiId) return dosen.filter((d) => d.prodiId === prodiId);
  return dosen;
}

function getById(id) {
  return dosen.find((d) => d.id === id);
}

function create(data) {
  const baru = { id: nextId++, ...data };
  dosen.push(baru);
  return baru;
}

module.exports = { getAll, getById, create };