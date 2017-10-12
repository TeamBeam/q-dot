const Sequelize = require('sequelize');
const SequelizeConfig = require('./sequalize-config.js');
let db;

if (process.env.DATABASE_URL) {
  db = new Sequelize(process.env.DATABASE_URL);
} else {
  db = new Sequelize(SequelizeConfig);
}

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//Manager Audit History Schema
const ManagerAudit = db.define('manageraudit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: Sequelize.STRING
});

//Manager Schema
const Manager = db.define('manager', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING,
  passwordHash: Sequelize.STRING,
  passwordSalt: Sequelize.STRING
});

//Customer Schema
const Customer = db.define('customer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  mobile: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: Sequelize.STRING
});

//Queue Schema
const Queue = db.define('queue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  size: Sequelize.INTEGER,
  wait: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  position: Sequelize.INTEGER
});

//Restaurant Schema
const Restaurant = db.define('restaurant', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  phone: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  nextPosition: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  'total_wait': {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  'average_wait': {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  status: Sequelize.STRING,
  image: Sequelize.STRING,
  type: Sequelize.STRING,
  menu: Sequelize.STRING
});

// Relationship between Restaurant & Queue
Restaurant.hasMany(Queue);
Queue.belongsTo(Restaurant);

//Relationship between Customer & Queue
Customer.hasOne(Queue);
Queue.belongsTo(Customer);

//Relationship between Manager & ManagerAudit
Manager.hasOne(ManagerAudit);
ManagerAudit.belongsTo(Manager);

Customer.sync()
  .then(() => Restaurant.sync())
  .then(() => Queue.sync())
  .catch(error => console.log('error syncing data', error));

module.exports = {
  Sequelize: Sequelize,
  db: db,
  Customer: Customer,
  Queue: Queue,
  Restaurant: Restaurant,
  Manager: Manager,
  ManagerAudit: ManagerAudit
};
