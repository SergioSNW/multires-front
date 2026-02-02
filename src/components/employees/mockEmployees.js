// src/components/employees/mockEmployees.js
export default [
  {
    id: 1,
    name: "Ana García López",
    phone: "+34 612 345 678",
    email: "ana@barberia.com",
    schedule: "general",
    holidays: []
  },
  {
    id: 2,
    name: "Carlos Martínez Ruiz",
    phone: "+34 699 123 456",
    email: "carlos@barberia.com",
    schedule: "custom",
    holidays: [
      { name: "Vacaciones verano", date: "15/07/2026 - 30/07/2026", days: 16 },
      { name: "Puente diciembre", date: "24/12/2026", days: 1 }
    ]
  },
  {
    id: 3,
    name: "María Fernández Soto",
    phone: "+34 655 987 654",
    email: "maria@barberia.com",
    schedule: "custom",
    holidays: [
      { name: "Cirugía", date: "10/03/2026 - 20/03/2026", days: 11 }
    ]
  },
  {
    id: 4,
    name: "Manuel Fernández Garcia",
    phone: "+34 655 987 654",
    email: "maria@barberia.com",
    schedule: "custom",
    custom_schedule: [  // ← NUEVO formato
      {
        days: ["MO", "WE", "FR", "SA"],
        start: "15:00",
        end: "21:30",
        rrule: "",
        breaks: [
          { start: "19:00", end: "20:15", label: "Kit-kat-flush" },
          { start: "16:00", end: "18:00", label: "Lunch" }
        ]
      },
      {
        days: ["WE"],
        start: "09:00", 
        end: "18:00",
        rrule: "",
        breaks: [
          { start: "12:00", end: "17:00", label: "Lunch-b22" }
        ]
      }
    ],    holidays: [
      { name: "Ciraaaaaa", date: "10/03/2026 - 20/03/2026", days: 11 }
    ]
  },
  {
    id: 5,
    name: "Juan",
    phone: "+34 655 987 654",
    email: "maria@barberia.com",
    schedule: "general",
    holidays: [
      { name: "Cirugía", date: "10/03/2026 - 20/03/2026", days: 11 }
    ]
  },
  {
    id: 6,
    name: "Jose luis",
    phone: "+34 655 987 654",
    email: "maria@barberia.com",
    schedule: "general",
    holidays: [
      { name: "Cirugía", date: "10/03/2026 - 20/03/2026", days: 11 }
    ]
  }
];
