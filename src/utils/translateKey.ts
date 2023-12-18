export const translateKey = ({ key }: { key: any }) => {
  const objectKey = {
    weight: 'Peso',
    height: 'Altura',
    bodyFat: '% de gordura corporal',
    neck: 'Pescoço',
    shoulder: 'Ombros',
    chest: 'Peito',
    waist: 'Cintura',
    biceps: 'Bíceps',
    forearm: 'Antebraço',
    wrist: 'Punho',
    buttocks: 'Glúteos',
    hip: 'Quadril',
    calf: 'Panturrilha',
    ankle: 'Tornozelo',
  }
  return objectKey[key]
}
