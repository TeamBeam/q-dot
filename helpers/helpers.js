const request = require('request');

const changeCase = (name) => {
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
};

const nameFormatter = (name) => {
  if (name.includes(' ')) {
    return name.split(' ').map(changeCase).join(' ');
  } else {
    return changeCase(name);
  }
};

const phoneNumberFormatter = (number) => {
  return number.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');
};


module.exports = {
  nameFormatter: nameFormatter,
  phoneNumberFormatter: phoneNumberFormatter,
};

