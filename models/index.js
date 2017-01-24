var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

//Defining Schemas
var Page = db.define('page', {
  title: {
      type: Sequelize.STRING,
      allowNull: false
  },
  urlTitle: {
      type: Sequelize.STRING,
      allowNull: false
  },
  content: {
      //text can be more chars than string
      type: Sequelize.TEXT,
      allowNull: false
  },
  status: {
        //ENUM takes 2 possible values
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
     tags: {
        //How to et a data value to an array
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        set: function (tags) {

            tags = tags || [];

            if (typeof tags === 'string') {
                tags = tags.split(',').map(function (str) {
                    return str.trim();
                });
            }

            this.setDataValue('tags', tags);

        }
    }
    //define also takes an object of options, where you can add your extra methods, hooks, etc
}, { getterMethods: {
        //a virtual, not saved in the db bc it is derived from another field (title in this case)
        route: function() {
            return '/wiki/' + this.urlTitle;
        }
    }
});

//another way to attach a hook to a schema (takes an instance as a parameter)
Page.beforeValidate(function (page) {
  if (page.title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    page.urlTitle = Math.random().toString(36).substring(2, 7);
  }
});


var User = db.define('user', {
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
          isEmail: true
      },
      unique: true
  }
});

//set up an association between users and page

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
