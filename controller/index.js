const db = require('../database/index.js');
const { ne, lt, gt, eq } = db.Sequelize.Op;
const helpers = require('../helpers/helpers.js');
const crypto = require('crypto');

const genSalt = function() {
  return crypto.randomBytes(16).toString('hex');
};

const genPassword = function(password, salt) {
  var passwordHash = crypto.createHmac('sha512', salt);
  passwordHash.update(password);
  passwordHash = passwordHash.digest('hex');
  return {
    passwordHash: passwordHash,
    salt: salt
  };
};

//find info for one restaurant with current queue information
const findInfoForOneRestaurant = (restaurantId) => {
  return db.Restaurant.find({
    where: {
      id: restaurantId
    },
    include: [{
      model: db.Queue,
      where: {
        position: {
          [ne]: null
        }
      },
      include: [db.Customer],
      required: false
    }]
  });
};

//find info for all restaurants with current queue information
const findInfoForAllRestaurants = () => {
  return db.Restaurant.findAll({
    include: [db.Queue],
    order: [['id', 'ASC']]
  })
  .then(restaurants => {
    restaurants.forEach(restaurant => {
      restaurant.dataValues.queues = restaurant.queues.filter(row => row.position !== null);
    });
    return restaurants;
  });
};

//update restaurant open/close status
const updateRestaurantStatus = (info) => {
  return db.Restaurant.update({status: info.status}, {where: {id: info.restaurantId}});
};

// find/add customer to database
const findOrAddCustomer = (params) => {
  return db.Customer.findOne({where: {mobile: params.mobile}})
    .then(customer => {
      if (customer === null) {
        const customer = {
          name: helpers.nameFormatter(params.name),
          mobile: helpers.phoneNumberFormatter(params.mobile)
        };

        if (params.email) {
          customer.email = params.email;
        }

        return db.Customer.create(customer);
      } else {
        return customer;
      }
    });
};

const findOrAddCustomerN = (params) => {
  return db.Customer.findOne({where: {mobile: params.mobile}})
    .then(customer => {
      if (customer === null) {
        const customer = {
          name: helpers.nameFormatter(params.name),
          mobile: helpers.phoneNumberFormatter(params.mobile)
        };
        customer.passwordHash = params.passwordHash;
        customer.salt = params.salt;
        if (params.email) {
          customer.email = params.email;
        }


        return db.Customer.create(customer);
      } else {
        return customer;
      }
    });
};

// get current queue info for one restaurant
const getQueueInfo = (restaurantId, customerId, customerPosition) => {
  return db.Queue.findAndCountAll({
    where: {
      restaurantId: restaurantId,
      position: {
        [ne]: null,
        [lt]: customerPosition
      }
    }
  });
};

//add a customer to a queue at a restaurant
const addToQueue = (params) => {
  const queueInfo = {
    size: params.size,
    customer_message: params.customerMessage
  };
  const response = {};

  return findOrAddCustomer(params)
    .then(customer => {
      queueInfo.customerId = customer.id;
      queueInfo.name = customer.name;
      return db.Queue.findOne({where: {customerId: customer.id, restaurantId: params.restaurantId}});
    })
    .then(row => {
      if (row !== null) {
        throw new Error('Already added');
      } else {
        return findInfoForOneRestaurant(params.restaurantId);
      }
    })
    .then(restaurant => {
      if (restaurant.status === 'Open') {
        queueInfo.position = restaurant.nextPosition + 1;
        queueInfo.wait = restaurant.total_wait;
        queueInfo.restaurantId = restaurant.id;
        let totalWait = restaurant.total_wait + restaurant.average_wait;
        return db.Restaurant.upsert({'nextPosition': queueInfo.position, 'total_wait': totalWait, phone: restaurant.phone});
      } else {
        throw new Error('Restaurant has closed the queue');
      }
    })
    .then(result => {
      return db.Queue.create(queueInfo);
    })
    .then(result => {
      response.wait = result.wait;
      response.queueId = result.id;
      response.size = result.size;
      response.position = result.position;
      return getQueueInfo(result.restaurantId, result.customerId, queueInfo.position);
    })
    .then(result => {
      response.queueList = result.rows;
      response.queueCount = result.count;
      return response;
    });
};

// get queue info for one customer
const getCustomerInfo = (queueId) => {
  return db.Queue.findOne({
    where: {
      id: queueId
    },
    include: [db.Customer, db.Restaurant]
  });
};

// get info for one manager
const getManagerInfo = (username) => {
  return db.Manager.findOne({
    where: {
      username: username
    }
  });
};

//remove customer from queue
const removeFromQueue = (queueId) => {
  let restaurant;
  return db.Queue.find({where: {id: queueId}, include: [db.Restaurant]})
    .then(row => {
      if (!row.position && !row.wait) {
        throw new Error('Already removed');
      } else {
        restaurant = row.restaurant;
        return db.Queue.findAll({
          where: {
            position: {
              [ne]: null,
              [gt]: row.position
            },
            restaurantId : {
              [eq]: row.restaurantId
            }
          }
        });
      }
    })
    .then(results => {
      var promises = [];
      for (var i = 0; i < results.length; i++) {
        promises.push(results[i].update({
          wait: results[i].wait - restaurant.average_wait,
          position: results[i].position - 1,
        }));
      }
      return Promise.all(promises);
    })
    .then(() => db.Restaurant.upsert({'total_wait': restaurant.total_wait - restaurant.average_wait, phone: restaurant.phone}))
    .then(() => {
      return db.Queue.update({
          position: null,
          wait: null
        }, {
          where: {
            id: {
              [eq]: queueId
            }
          }
        });
    })
    .then(() => getQueueInfo(restaurant.id, 0, restaurant.nextPosition + 1));
};

// calculate average wait time
const getAverageWait = (restaurantId) => {
  return db.LongTerm.find({where: {'restaurant_id': restaurantId}})
    .then(results => {
      console.log(results);
    });

};

let EMACalc = (mArray, mRange) => {
  var k = 2 / (mRange + 1);
  // first item is just the same as the first item in the input
  emaArray = [mArray[0]];
  // for the rest of the items, they are computed with the previous one
  for (var i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
};

module.exports = {
  findInfoForAllRestaurants: findInfoForAllRestaurants,
  findInfoForOneRestaurant: findInfoForOneRestaurant,
  findOrAddCustomer: findOrAddCustomer,
  findOrAddCustomerN: findOrAddCustomerN,
  addToQueue: addToQueue,
  updateRestaurantStatus: updateRestaurantStatus,
  getQueueInfo: getQueueInfo,
  getCustomerInfo: getCustomerInfo,
  getManagerInfo: getManagerInfo,
  removeFromQueue: removeFromQueue,
  genSalt: genSalt,
  genPassword: genPassword,
  getAverageWait: getAverageWait
};
