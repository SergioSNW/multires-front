const mockEmployees = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "+34 612 345 678",
    schedule: [  // ← AÑADE array vacío o con datos
      { day: "Lunes", from: "10:00", to: "19:00" }
    ],
    allServices: true,
  },
  {
    id: 2,
    name: "María García", 
    phone: "+34 699 123 456",
    schedule: [],    // ← array vacío = badge "0 días"
    allServices: true,
  },
  {
    id: 3,
    name: "Carlos López",
    phone: "+34 655 789 012",
    schedule: [      // ← 1 día = badge azul
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Miércoles", from: "09:00", to: "18:00" },
      { day: "Jueves", from: "09:00", to: "18:00" },
      { day: "Sabado", from: "09:00", to: "18:00" },
      { day: "Domingo", from: "09:00", to: "14:00" }
    ],
    allServices: true,
  },
  {
    id: 4,
    name: "Anton Pirulero",
    phone: "+34 655 789 012",
    schedule: [],
    allServices: true,
  },
  {
    id: 5,
    name: "Antonio Gonzalez",
    phone: "+34 655 789 012",
    schedule: [      // ← 1 día = badge azul
      { day: "Miércoles", from: "09:00", to: "18:00" }
    ],
    allServices: false,
  },
];
export default mockEmployees;
