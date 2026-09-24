require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Staff = require('./models/Staff');
const Patient = require('./models/Patient');
const Counter = require('./models/Counter');

const sampleUsers = [
  {
    name: 'Hospital Administrator',
    email: 'admin@hospital.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Dr. Sarah Jenkins',
    email: 'doctor@hospital.com',
    password: 'Doctor@123',
    role: 'doctor',
  },
  {
    name: 'Emily Watson',
    email: 'receptionist@hospital.com',
    password: 'Reception@123',
    role: 'receptionist',
  },
];

const sampleStaff = [
  {
    fullName: 'Dr. Sarah Jenkins',
    gender: 'Female',
    dateOfBirth: new Date('1982-05-14'),
    role: 'Doctor',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    qualification: 'MD, FACC',
    phone: '+1 (555) 234-5678',
    email: 's.jenkins@hospital.com',
    address: '104 Medical Plaza, Suite 300, Boston, MA',
    dateOfJoining: new Date('2018-03-15'),
    shift: 'Morning',
    salary: 195000,
    status: 'Active',
  },
  {
    fullName: 'Dr. Marcus Chen',
    gender: 'Male',
    dateOfBirth: new Date('1979-11-22'),
    role: 'Doctor',
    department: 'Neurology',
    specialization: 'Cerebrovascular & Stroke',
    qualification: 'MD, PhD Neurology',
    phone: '+1 (555) 345-6789',
    email: 'm.chen@hospital.com',
    address: '88 Beacon Hill Way, Boston, MA',
    dateOfJoining: new Date('2016-08-01'),
    shift: 'Morning',
    salary: 210000,
    status: 'Active',
  },
  {
    fullName: 'Dr. Aisha Patel',
    gender: 'Female',
    dateOfBirth: new Date('1985-02-18'),
    role: 'Doctor',
    department: 'Pediatrics',
    specialization: 'Pediatric Critical Care',
    qualification: 'MD Pediatrics, FAAP',
    phone: '+1 (555) 456-7890',
    email: 'a.patel@hospital.com',
    address: '42 Harvard Ave, Brookline, MA',
    dateOfJoining: new Date('2020-01-10'),
    shift: 'Evening',
    salary: 175000,
    status: 'Active',
  },
  {
    fullName: 'Dr. Robert Martinez',
    gender: 'Male',
    dateOfBirth: new Date('1975-09-30'),
    role: 'Doctor',
    department: 'Orthopedics',
    specialization: 'Joint Reconstruction & Sports Medicine',
    qualification: 'MS Ortho, FAAOS',
    phone: '+1 (555) 567-8901',
    email: 'r.martinez@hospital.com',
    address: '15 Commonwealth Ave, Newton, MA',
    dateOfJoining: new Date('2015-06-20'),
    shift: 'Morning',
    salary: 225000,
    status: 'Active',
  },
  {
    fullName: 'Dr. Elena Rostova',
    gender: 'Female',
    dateOfBirth: new Date('1988-07-09'),
    role: 'Doctor',
    department: 'General Medicine',
    specialization: 'Internal Medicine',
    qualification: 'MD, FACP',
    phone: '+1 (555) 678-9012',
    email: 'e.rostova@hospital.com',
    address: '221 Longwood Avenue, Boston, MA',
    dateOfJoining: new Date('2021-04-12'),
    shift: 'Morning',
    salary: 165000,
    status: 'Active',
  },
  {
    fullName: 'Dr. David Kim',
    gender: 'Male',
    dateOfBirth: new Date('1983-12-05'),
    role: 'Doctor',
    department: 'Surgery',
    specialization: 'General & Minimally Invasive Surgery',
    qualification: 'MD, FACS',
    phone: '+1 (555) 789-0123',
    email: 'd.kim@hospital.com',
    address: '55 Boylston Street, Chestnut Hill, MA',
    dateOfJoining: new Date('2019-11-01'),
    shift: 'Night',
    salary: 230000,
    status: 'Active',
  },
  {
    fullName: 'Nurse Chloe Bennett',
    gender: 'Female',
    dateOfBirth: new Date('1992-04-16'),
    role: 'Nurse',
    department: 'Emergency',
    specialization: 'Trauma & Triage Nursing',
    qualification: 'BSN, RN, CEN',
    phone: '+1 (555) 890-1234',
    email: 'c.bennett@hospital.com',
    address: '31 Tremont Street, Cambridge, MA',
    dateOfJoining: new Date('2021-09-01'),
    shift: 'Night',
    salary: 82000,
    status: 'Active',
  },
  {
    fullName: 'Nurse Michael Reynolds',
    gender: 'Male',
    dateOfBirth: new Date('1990-08-25'),
    role: 'Nurse',
    department: 'Pediatrics',
    specialization: 'Pediatric Inpatient Care',
    qualification: 'BSN, RN, CPN',
    phone: '+1 (555) 901-2345',
    email: 'm.reynolds@hospital.com',
    address: '14 Somerville Ave, Somerville, MA',
    dateOfJoining: new Date('2022-02-15'),
    shift: 'Morning',
    salary: 79000,
    status: 'Active',
  },
  {
    fullName: 'Thomas Garcia',
    gender: 'Male',
    dateOfBirth: new Date('1987-03-12'),
    role: 'Lab Technician',
    department: 'Radiology',
    specialization: 'MRI & CT Diagnostics',
    qualification: 'AAS Radiologic Technology, ARRT',
    phone: '+1 (555) 012-3456',
    email: 't.garcia@hospital.com',
    address: '77 Central Square, Cambridge, MA',
    dateOfJoining: new Date('2020-07-10'),
    shift: 'Morning',
    salary: 68000,
    status: 'Active',
  },
  {
    fullName: 'Lisa Adams',
    gender: 'Female',
    dateOfBirth: new Date('1984-10-03'),
    role: 'Pharmacist',
    department: 'Other',
    specialization: 'Clinical Pharmacotherapy',
    qualification: 'Pharm.D, BCPS',
    phone: '+1 (555) 123-7890',
    email: 'l.adams@hospital.com',
    address: '60 Huntington Ave, Boston, MA',
    dateOfJoining: new Date('2017-05-18'),
    shift: 'Morning',
    salary: 125000,
    status: 'Active',
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Hospital Management System DB seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Staff.deleteMany({});
    await Patient.deleteMany({});
    await Counter.deleteMany({});

    console.log('🧹 Cleaned existing data from database.');

    // 1. Create Users
    for (const userData of sampleUsers) {
      await User.create(userData);
    }
    console.log(`✅ Seeded ${sampleUsers.length} initial users (Admin, Doctor, Receptionist)`);

    // 2. Create Staff members sequentially to ensure ordered IDs
    const createdStaff = [];
    for (const staffData of sampleStaff) {
      const staffMember = await Staff.create(staffData);
      createdStaff.push(staffMember);
    }
    console.log(`✅ Seeded ${createdStaff.length} staff members (Doctors, Nurses, Specialists)`);

    // Filter doctors for assigning to patients
    const doctors = createdStaff.filter((s) => s.role === 'Doctor');

    // 3. Create Sample Patients
    const samplePatients = [
      {
        fullName: 'Eleanor Vance',
        gender: 'Female',
        dateOfBirth: new Date('1965-04-12'),
        bloodGroup: 'A+',
        phone: '+1 (555) 111-2233',
        email: 'eleanor.vance@example.com',
        address: '12 Elm Street, Cambridge, MA',
        emergencyContactName: 'Arthur Vance',
        emergencyContactPhone: '+1 (555) 111-2234',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-18T09:30:00Z'),
        assignedDoctor: doctors[0]._id, // Dr. Sarah Jenkins (Cardiology)
        department: 'Cardiology',
        wardNumber: 'Cardio Ward 3',
        roomNumber: 'CW-302',
        diagnosis: 'Acute Coronary Syndrome, Unstable Angina',
        symptoms: 'Substernal chest tightness radiating to left arm, shortness of breath, diaphoresis',
        medicalHistory: 'Hypertension (10 yrs), Hyperlipidemia',
        allergies: 'Penicillin, Aspirin-induced asthma',
        currentMedications: 'Atorvastatin 40mg, Metoprolol 25mg, Heparin drip',
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: 'BCBS-9842104',
        status: 'Admitted',
      },
      {
        fullName: 'James Harrison',
        gender: 'Male',
        dateOfBirth: new Date('1978-09-24'),
        bloodGroup: 'O+',
        phone: '+1 (555) 222-3344',
        email: 'james.harrison@example.com',
        address: '45 Oak Ridge Lane, Somerville, MA',
        emergencyContactName: 'Karen Harrison',
        emergencyContactPhone: '+1 (555) 222-3345',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-20T14:15:00Z'),
        assignedDoctor: doctors[1]._id, // Dr. Marcus Chen (Neurology)
        department: 'Neurology',
        wardNumber: 'Neuro ICU',
        roomNumber: 'NICU-04',
        diagnosis: 'Transient Ischemic Attack (TIA) & Carotid Stenosis',
        symptoms: 'Transient left-sided facial droop, dysarthria resolving in 30 minutes',
        medicalHistory: 'Type 2 Diabetes Mellitus, Smoker',
        allergies: 'None known',
        currentMedications: 'Clopidogrel 75mg, Metformin 500mg BID',
        insuranceProvider: 'Aetna Health',
        insurancePolicyNumber: 'AET-4432190',
        status: 'Critical',
      },
      {
        fullName: 'Sophia Martinez',
        gender: 'Female',
        dateOfBirth: new Date('2018-08-11'),
        bloodGroup: 'B+',
        phone: '+1 (555) 333-4455',
        email: 'martinez.fam@example.com',
        address: '78 Pinecrest Drive, Brookline, MA',
        emergencyContactName: 'Carlos Martinez (Father)',
        emergencyContactPhone: '+1 (555) 333-4456',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-21T08:00:00Z'),
        assignedDoctor: doctors[2]._id, // Dr. Aisha Patel (Pediatrics)
        department: 'Pediatrics',
        wardNumber: 'Pediatric Ward 2',
        roomNumber: 'PW-214',
        diagnosis: 'Bacterial Lobar Pneumonia',
        symptoms: 'High-grade fever (103.2°F), productive cough, tachypnea, lethargy',
        medicalHistory: 'Mild childhood asthma',
        allergies: 'Sulfa drugs',
        currentMedications: 'Ceftriaxone IV, Albuterol nebulization PRN',
        insuranceProvider: 'United Healthcare',
        insurancePolicyNumber: 'UHC-7782103',
        status: 'Under Treatment',
      },
      {
        fullName: 'William Douglas',
        gender: 'Male',
        dateOfBirth: new Date('1952-01-30'),
        bloodGroup: 'AB+',
        phone: '+1 (555) 444-5566',
        email: 'wdouglas@example.com',
        address: '150 Beacon St, Boston, MA',
        emergencyContactName: 'Margaret Douglas',
        emergencyContactPhone: '+1 (555) 444-5567',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-12T11:00:00Z'),
        dischargeDate: new Date('2026-09-23T15:30:00Z'),
        assignedDoctor: doctors[3]._id, // Dr. Robert Martinez (Orthopedics)
        department: 'Orthopedics',
        wardNumber: 'Ortho Recovery',
        roomNumber: 'OR-108',
        diagnosis: 'Post Total Right Knee Arthroplasty',
        symptoms: 'Severe end-stage osteoarthritis, joint crepitus, immobility',
        medicalHistory: 'Osteoarthritis, Mild CKD Stage 2',
        allergies: 'Latex',
        currentMedications: 'Enoxaparin 40mg SC daily, Acetaminophen 1000mg TID',
        insuranceProvider: 'Medicare Part B',
        insurancePolicyNumber: 'MED-1290384',
        status: 'Discharged',
      },
      {
        fullName: 'Grace Hopper-Lee',
        gender: 'Female',
        dateOfBirth: new Date('1994-11-04'),
        bloodGroup: 'O-',
        phone: '+1 (555) 555-6677',
        email: 'grace.lee@example.com',
        address: '300 Technology Square, Cambridge, MA',
        emergencyContactName: 'Daniel Lee',
        emergencyContactPhone: '+1 (555) 555-6678',
        patientType: 'Outpatient',
        admissionDate: new Date('2026-09-22T10:15:00Z'),
        assignedDoctor: doctors[4]._id, // Dr. Elena Rostova (General Medicine)
        department: 'General Medicine',
        wardNumber: 'Outpatient Clinic 1',
        roomNumber: 'OPD-03',
        diagnosis: 'Chronic Fatigue Syndrome & Iron Deficiency Anemia',
        symptoms: 'Persistent exhaustion, dizziness upon standing, pallor',
        medicalHistory: 'Hypothyroidism (treated with Levothyroxine)',
        allergies: 'None',
        currentMedications: 'Ferrous sulfate 325mg daily, Levothyroxine 75mcg',
        insuranceProvider: 'Cigna Health',
        insurancePolicyNumber: 'CIG-5591023',
        status: 'Admitted',
      },
      {
        fullName: 'Lucas Silva',
        gender: 'Male',
        dateOfBirth: new Date('1989-06-19'),
        bloodGroup: 'A-',
        phone: '+1 (555) 666-7788',
        email: 'lucas.silva@example.com',
        address: '89 Brighton Ave, Allston, MA',
        emergencyContactName: 'Mariana Silva',
        emergencyContactPhone: '+1 (555) 666-7789',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-23T02:45:00Z'),
        assignedDoctor: doctors[5]._id, // Dr. David Kim (Surgery)
        department: 'Surgery',
        wardNumber: 'Surgical Ward 1',
        roomNumber: 'SW-112',
        diagnosis: 'Acute Perforated Appendicitis (Post-Op Laparoscopic)',
        symptoms: 'Sudden severe RLQ abdominal pain, rebound tenderness, high fever, vomiting',
        medicalHistory: 'None',
        allergies: 'Ibuprofen',
        currentMedications: 'Piperacillin-Tazobactam IV, Ondansetron 4mg PRN',
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: 'BCBS-3349012',
        status: 'Admitted',
      },
      {
        fullName: 'Patricia O\'Connor',
        gender: 'Female',
        dateOfBirth: new Date('1961-03-27'),
        bloodGroup: 'B-',
        phone: '+1 (555) 777-8899',
        email: 'patricia.oc@example.com',
        address: '50 South Boston Bypass, South Boston, MA',
        emergencyContactName: 'Sean O\'Connor',
        emergencyContactPhone: '+1 (555) 777-8800',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-17T16:20:00Z'),
        assignedDoctor: doctors[0]._id, // Dr. Sarah Jenkins (Cardiology)
        department: 'Cardiology',
        wardNumber: 'Cardio Stepdown',
        roomNumber: 'CW-315',
        diagnosis: 'Congestive Heart Failure Exacerbation (NYHA Class III)',
        symptoms: 'Bilateral lower extremity edema, orthopnea, paroxysmal nocturnal dyspnea',
        medicalHistory: 'CAD, Prior NSTEMI (2021), Atrial Fibrillation',
        allergies: 'ACE Inhibitors (angioedema)',
        currentMedications: 'Furosemide 40mg IV BID, Losartan 50mg daily, Apixaban 5mg BID',
        insuranceProvider: 'Tufts Health Plan',
        insurancePolicyNumber: 'TUF-8841029',
        status: 'Under Treatment',
      },
      {
        fullName: 'Alexander Wright',
        gender: 'Male',
        dateOfBirth: new Date('2001-12-14'),
        bloodGroup: 'O+',
        phone: '+1 (555) 888-9900',
        email: 'alex.wright@example.com',
        address: '112 Fenway, Boston, MA',
        emergencyContactName: 'Rachel Wright (Mother)',
        emergencyContactPhone: '+1 (555) 888-9901',
        patientType: 'Outpatient',
        admissionDate: new Date('2026-09-14T08:30:00Z'),
        dischargeDate: new Date('2026-09-19T14:00:00Z'),
        assignedDoctor: doctors[3]._id, // Dr. Robert Martinez (Orthopedics)
        department: 'Orthopedics',
        wardNumber: 'Ortho Day Unit',
        roomNumber: 'ODU-06',
        diagnosis: 'Complete Anterior Cruciate Ligament (ACL) Tear Left Knee',
        symptoms: 'Audible pop during soccer match, immediate joint effusion, instability',
        medicalHistory: 'Healthy athlete',
        allergies: 'None',
        currentMedications: 'Celecoxib 200mg daily, Cryotherapy regimen',
        insuranceProvider: 'Harvard Pilgrim',
        insurancePolicyNumber: 'HP-9012481',
        status: 'Discharged',
      },
      {
        fullName: 'Maya Lin',
        gender: 'Female',
        dateOfBirth: new Date('2015-05-02'),
        bloodGroup: 'AB-',
        phone: '+1 (555) 999-0011',
        email: 'lin.family@example.com',
        address: '64 Quincy Shore Drive, Quincy, MA',
        emergencyContactName: 'Hao Lin (Father)',
        emergencyContactPhone: '+1 (555) 999-0012',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-22T19:40:00Z'),
        assignedDoctor: doctors[2]._id, // Dr. Aisha Patel (Pediatrics)
        department: 'Pediatrics',
        wardNumber: 'Pediatric ICU',
        roomNumber: 'PICU-02',
        diagnosis: 'Status Asthmaticus refractory to Beta-Agonists',
        symptoms: 'Severe respiratory distress, intercostal retractions, cyanosis, audible wheeze',
        medicalHistory: 'Severe persistent asthma, multiple ED visits',
        allergies: 'Peanuts, Tree nuts',
        currentMedications: 'Continuous Albuterol, IV Methylprednisolone, Magnesium Sulfate infusion',
        insuranceProvider: 'MassHealth',
        insurancePolicyNumber: 'MH-3391024',
        status: 'Critical',
      },
      {
        fullName: 'Benjamin Foster',
        gender: 'Male',
        dateOfBirth: new Date('1972-10-08'),
        bloodGroup: 'A+',
        phone: '+1 (555) 123-4567',
        email: 'ben.foster@example.com',
        address: '202 Salem Street, Malden, MA',
        emergencyContactName: 'Susan Foster',
        emergencyContactPhone: '+1 (555) 123-4568',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-19T13:00:00Z'),
        assignedDoctor: doctors[1]._id, // Dr. Marcus Chen (Neurology)
        department: 'Neurology',
        wardNumber: 'Neuro Ward 2',
        roomNumber: 'NW-205',
        diagnosis: 'New-Onset Tonic-Clonic Seizures (Secondary to cavernoma)',
        symptoms: 'Observed generalized seizure lasting 2.5 minutes, post-ictal confusion',
        medicalHistory: 'No prior seizures, migraine with aura',
        allergies: 'Carbamazepine (rash)',
        currentMedications: 'Levetiracetam (Keppra) 750mg BID',
        insuranceProvider: 'United Healthcare',
        insurancePolicyNumber: 'UHC-5501932',
        status: 'Under Treatment',
      },
      {
        fullName: 'Diana Ross-Kim',
        gender: 'Female',
        dateOfBirth: new Date('1981-07-21'),
        bloodGroup: 'O+',
        phone: '+1 (555) 234-8901',
        email: 'diana.rosskim@example.com',
        address: '17 Waltham Way, Waltham, MA',
        emergencyContactName: 'Kenneth Kim',
        emergencyContactPhone: '+1 (555) 234-8902',
        patientType: 'Inpatient',
        admissionDate: new Date('2026-09-23T11:20:00Z'),
        assignedDoctor: doctors[5]._id, // Dr. David Kim (Surgery)
        department: 'Surgery',
        wardNumber: 'Surgical ICU',
        roomNumber: 'SICU-01',
        diagnosis: 'Acute Cholecystitis with Choledocholithiasis',
        symptoms: 'Right upper quadrant pain with Murphy\'s sign, jaundice, nausea',
        medicalHistory: 'Biliary colic history',
        allergies: 'Codeine',
        currentMedications: 'Ciprofloxacin IV, Metronidazole IV, Ketorolac IV',
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: 'BCBS-1102938',
        status: 'Admitted',
      },
      {
        fullName: 'Carlos Santana',
        gender: 'Male',
        dateOfBirth: new Date('1968-12-01'),
        bloodGroup: 'B+',
        phone: '+1 (555) 345-9012',
        email: 'csantana@example.com',
        address: '92 Revere Beach Blvd, Revere, MA',
        emergencyContactName: 'Teresa Santana',
        emergencyContactPhone: '+1 (555) 345-9013',
        patientType: 'Outpatient',
        admissionDate: new Date('2026-09-10T10:00:00Z'),
        dischargeDate: new Date('2026-09-16T12:00:00Z'),
        assignedDoctor: doctors[4]._id, // Dr. Elena Rostova (General Medicine)
        department: 'General Medicine',
        wardNumber: 'OPD Observation',
        roomNumber: 'OPD-07',
        diagnosis: 'Uncontrolled Type 2 Diabetes with Hyperosmolar State (Resolved)',
        symptoms: 'Severe polyuria, polydipsia, blood glucose > 450 mg/dL upon arrival',
        medicalHistory: 'Type 2 Diabetes, Diabetic Neuropathy',
        allergies: 'None',
        currentMedications: 'Glargine Insulin 24 units bedtime, Metformin 1000mg BID',
        insuranceProvider: 'Aetna Health',
        insurancePolicyNumber: 'AET-8839102',
        status: 'Discharged',
      },
    ];

    for (const patientData of samplePatients) {
      await Patient.create(patientData);
    }
    console.log(`✅ Seeded ${samplePatients.length} patients across Cardiology, Neurology, Ortho, Peds, Surgery, Medicine`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// If run directly from command line (node seed.js)
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedDatabase();
      console.log('Seeder finished, exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding script failed:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
