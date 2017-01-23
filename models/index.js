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
    }
}, { getterMethods: {
        route: function() {
            return '/wiki/' + this.urlTitle;
        },
        //getter to return obj of values
        get: function(){
            return {
                title: this.title,
                urlTitle: this.urlTitle,
                content: this.content,
                status: this.status,
                date: this.date
            };
        }
  }
});

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
      isEmail: true
  }
}, {getterMethods: {
    get: function(){
            return {
                name: this.name,
                email: this.email,
            };
        }
    }
});

//set up an association between users and page
Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
