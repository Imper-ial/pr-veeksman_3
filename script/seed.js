require("dotenv").config();
const mongoose = require("mongoose");
const argon2 = require("argon2");

const User = require("../models/User");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Placement = require("../models/Placement");
const Statement = require("../models/Statement");

const CONFIG = {
  clearOldData: true,

  users: {
    admin: 15,
    lærer: 120,
    bedrift: 500,
    elev: 4000,
  },

  students: 4000,
  companies: 800,
  statementsPerStudentMin: 1,
  statementsPerStudentMax: 6,
};

const firstNames = [
  "Ola", "Kari", "Jonas", "Emma", "Noah", "Sara", "Maja", "William",
  "Sofie", "Elias", "Lukas", "Ingrid", "Thea", "Henrik", "Filip",
  "Aksel", "Nora", "Leah", "Iben", "Markus", "Mathias", "Julie",
  "Ida", "Oliver", "Jakob", "Tobias", "Linnea", "Sander", "Magnus",
  "Amalie", "Sebastian", "Adrian", "Victoria", "Mikkel", "Aurora"
];

const lastNames = [
  "Hansen", "Olsen", "Johansen", "Larsen", "Nilsen", "Andersen",
  "Pedersen", "Kristiansen", "Berg", "Solberg", "Dahl", "Hagen",
  "Eide", "Moen", "Lie", "Aas", "Strand", "Knutsen", "Andreassen",
  "Halvorsen", "Isaksen", "Paulsen", "Eriksen", "Thorsen"
];

const companyPrefixes = [
  "Atea", "Telenor", "Elkjøp", "Power", "Komplett", "NetNordic",
  "Advania", "Tech Drift", "Nordic Systems", "Cloud Service",
  "Digital Partner", "IT Support", "Data Gruppen", "Secure Network"
];

const companyTypes = ["praksisbedrift", "laerebedrift"];

const statementTexts = [
  "Eleven møter presis og jobber godt.",
  "Viser god innsats og lærer raskt.",
  "Samarbeider bra med andre ansatte.",
  "Tar ansvar og følger oppgaver på en god måte.",
  "Har hatt god utvikling i praksisperioden.",
  "Er positiv, høflig og arbeidsvillig.",
  "Jobber selvstendig og spør når det trengs hjelp.",
  "Utfører oppgavene på en ryddig måte."
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeFullName() {
  return `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");
}

function makeEmail(name, index, domain = "test.no") {
  return `${slugify(name)}.${index}@${domain}`;
}

function makePhone(index) {
  const number = 90000000 + (index % 9999999);
  return String(number).padStart(8, "9").slice(0, 8);
}

function makeCompanyName(index) {
  return `${randomItem(companyPrefixes)} ${index}`;
}

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Koblet til databasen");
}

async function clearData() {
  if (!CONFIG.clearOldData) return;

  console.log("Sletter gammel testdata...");
  await Statement.deleteMany({});
  await Placement.deleteMany({});
  await Student.deleteMany({});
  await Company.deleteMany({});
  await User.deleteMany({});
  console.log("Gammel data slettet");
}

async function createUsers(passwordHash) {
  const usersToInsert = [];

  for (let i = 0; i < CONFIG.users.admin; i++) {
    const navn = makeFullName();
    usersToInsert.push({
      navn,
      epost: makeEmail(navn, i, "admin.test.no"),
      passord: passwordHash,
      rolle: "admin",
    });
  }

  for (let i = 0; i < CONFIG.users.lærer; i++) {
    const navn = makeFullName();
    usersToInsert.push({
      navn,
      epost: makeEmail(navn, i, "laerer.test.no"),
      passord: passwordHash,
      rolle: "lærer",
    });
  }

  for (let i = 0; i < CONFIG.users.bedrift; i++) {
    const navn = makeFullName();
    usersToInsert.push({
      navn,
      epost: makeEmail(navn, i, "bedrift.test.no"),
      passord: passwordHash,
      rolle: "bedrift",
    });
  }

  for (let i = 0; i < CONFIG.users.elev; i++) {
    const navn = makeFullName();
    usersToInsert.push({
      navn,
      epost: makeEmail(navn, i, "elev.test.no"),
      passord: passwordHash,
      rolle: "elev",
    });
  }

  const users = await User.insertMany(usersToInsert);
  console.log(`Laget ${users.length} users`);
  return users;
}

async function createStudents() {
  const studentsToInsert = [];

  for (let i = 0; i < CONFIG.students; i++) {
    const navn = makeFullName();
    studentsToInsert.push({
      navn,
      epost: makeEmail(navn, i, "student.test.no"),
      telefon: makePhone(i),
    });
  }

  const students = await Student.insertMany(studentsToInsert);
  console.log(`Laget ${students.length} students`);
  return students;
}

async function createCompanies(companyUsers) {
  const companiesToInsert = [];

  for (let i = 0; i < CONFIG.companies; i++) {
    const companyUser = randomItem(companyUsers);

    companiesToInsert.push({
      navn: makeCompanyName(i + 1),
      type: randomItem(companyTypes),
      kontaktperson: companyUser.navn,
    });
  }

  const companies = await Company.insertMany(companiesToInsert);
  console.log(`Laget ${companies.length} companies`);
  return companies;
}

async function createPlacements(students, companies) {
  const praksisbedrifter = companies.filter(
    (company) => company.type === "praksisbedrift"
  );

  const laerebedrifter = companies.filter(
    (company) => company.type === "laerebedrift"
  );

  const placementsToInsert = students.map((student) => {
    const praksisbedrift =
      praksisbedrifter.length > 0
        ? randomItem(praksisbedrifter)
        : randomItem(companies);

    const laerebedrift =
      laerebedrifter.length > 0
        ? randomItem(laerebedrifter)
        : randomItem(companies);

    const startDato = new Date(
      2026,
      randomInt(0, 10),
      randomInt(1, 28)
    );

    return {
      student: student._id,
      praksisbedrift: praksisbedrift._id,
      laerebedrift: laerebedrift._id,
      startDato,
    };
  });

  const placements = await Placement.insertMany(placementsToInsert);
  console.log(`Laget ${placements.length} placements`);
  return placements;
}

async function createStatements(students, companyUsers) {
  const statementsToInsert = [];

  for (const student of students) {
    const amount = randomInt(
      CONFIG.statementsPerStudentMin,
      CONFIG.statementsPerStudentMax
    );

    for (let i = 0; i < amount; i++) {
      const writer = randomItem(companyUsers);

      statementsToInsert.push({
        student: student._id,
        tekst: randomItem(statementTexts),
        skrevetAv: writer.navn,
        dato: new Date(
          2026,
          randomInt(0, 10),
          randomInt(1, 28)
        ),
      });
    }
  }

  const statements = await Statement.insertMany(statementsToInsert);
  console.log(`Laget ${statements.length} statements`);
  return statements;
}

async function runSeed() {
  try {
    await connectDB();
    await clearData();

    console.log("Hasher passord med argon2...");
    const passwordHash = await argon2.hash("test123");

    const users = await createUsers(passwordHash);
    const students = await createStudents();

    const companyUsers = users.filter((user) => user.rolle === "bedrift");

    const companies = await createCompanies(companyUsers);
    const placements = await createPlacements(students, companies);
    const statements = await createStatements(students, companyUsers);

    console.log("\nFERDIG!");
    console.log("-----------------------------");
    console.log(`Users: ${users.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Companies: ${companies.length}`);
    console.log(`Placements: ${placements.length}`);
    console.log(`Statements: ${statements.length}`);
    console.log("-----------------------------");
    console.log("Passord for alle users: test123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Feil ved seeding:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

runSeed();