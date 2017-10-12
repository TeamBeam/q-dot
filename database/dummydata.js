const db = require('./index.js');
const dbQuery = require('../controller/index.js');

/*
const addToQueue = () => {
  // return dbQuery.addToQueue({name: 'Tiffany', restaurantId: 1, size: 2, mobile: '4158475697'})
  //   .then(() => dbQuery.addToQueue({name: 'Neha', restaurantId: 1, size: 3, mobile: '4158965693', email: 'nez@gmail.com'}))
  //   .then(() => dbQuery.addToQueue({name: 'Eugene', restaurantId: 2, size: 3, mobile: '4157855678', email: 'eugene@gmail.com'}))
  //   .then(() => dbQuery.addToQueue({name: 'Johnny', restaurantId: 2, size: 2, mobile: '4156844758'}));
};
*/

const addRestaurants = () => {
  return db.Restaurant.findOrCreate({where: {name: 'Tempest', phone: '(123) 456-7890', image: '../images/tempestbar.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10, 'type': 'bar', 'menu': 'http://www.pourguys.com/box-night-menu'}})
    .then(() => db.Restaurant.findOrCreate({where: {name: 'House of Prime Rib', phone: '(415) 885-4605', image: '../images/houseofprimerib.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10, 'type': 'american', 'menu': 'http://houseofprimerib.net/home.html'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Tsunami Panhandle', phone: '(415) 567-7664', image: '../images/tsunamipanhandle.jpg', status: 'Open', 'average_wait': 5, 'total_wait': 5, 'type': 'sushi', 'menu': 'http://dajanigroup.net/menus/'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Kitchen Story', phone: '(415) 525-4905', image: '../images/kitchenstory.jpg', status: 'Open', 'average_wait': 15, 'total_wait': 15, 'type': 'modern', 'menu': 'http://kitchenstorysf.com/menu/'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Burma Superstar', phone: '(415) 387-2147', image: '../images/burmasuperstar.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10, 'type': 'chinese', 'menu': 'http://www.burmasuperstar.com/menu/'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'State Bird Provisions', phone: '(415) 795-1272', image: '../images/statebirdprovisions.jpg', status: 'Closed', 'average_wait': 8, 'total_wait': 8, 'type': 'american', 'menu': 'http://statebirdsf.com/dinner/'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Limon Rotisserie', phone: '(415) 821-2134', image: '../images/limonrotisserie.jpg', status: 'Closed', 'average_wait': 12, 'total_wait': 12, 'type': 'peruvian', 'menu': 'http://www.limonrotisserie.com/menus'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Nopa', phone: '(415) 864-8643', image: '../images/nopa.jpg', status: 'Open', 'average_wait': 20, 'total_wait': 20, 'type': 'american', 'menu': 'http://nopasf.com/menus/dinner/'}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Farmhouse Kitchen', phone: '(415) 814-2920', image: '../images/farmhousekitchen.jpg', status: 'Open', 'average_wait': 15, 'total_wait': 15, 'type': 'asian', 'menu': 'http://farmhousesf.com/wp-content/uploads/2017/06/Farmhouse-Kitchen-Thai-Dinner-Menu-Executive-Chef-Kasem-Saengsawang-Apr2017-1.pdf'}}));
};

const addManager = () => {
  return db.Manager.findOrCreate({
    where: {
      username: 'johnny',
      passwordHash: 'a48af21cebc18c880a2b9c53dd8b3fab483e26ff2b7b77dd9def2afe8305ff44b17f1b8d58e6106bb49570e602fde2b960e0e420d53874b2d8626016bbd97f83',
      passwordSalt: '8b1269b13d1258b15af6c66f4f4d5cd9'
    }
  });
};

const dropDB = () => {
  return db.Queue.drop()
    .then(() => db.Customer.drop())
    .then(() => db.Restaurant.drop())
    .then(() => db.ManagerAudit.drop())
    .then(() => db.Manager.drop())
    .then(() => db.Restaurant.sync({force: true}))
    .then(() => db.Customer.sync({force: true}))
    .then(() => db.Queue.sync({force: true}))
    .then(() => db.Manager.sync({force: true}))
    .then(() => db.ManagerAudit.sync({force: true}))
    .then(() => addRestaurants())
    //.then(() => addToQueue())
    .then(() => addManager());
};

module.exports = {
  addRestaurants: addRestaurants,
  //addToQueue: addToQueue,
  addManager: addManager,
  dropDB: dropDB
};
