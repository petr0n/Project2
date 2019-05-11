module.exports = function(sequelize, DataTypes) {
  let Event = sequelize.define("Event", {
    eventTitle: {
      type: DataTypes.STRING
    },
    eventLocation: {
      type: DataTypes.STRING
    },
    eventDesc: {
      type: DataTypes.TEXT
    },
    eventDateTime: {
      type: DataTypes.DATE
    },
    byob: {
      type: DataTypes.BOOLEAN
    }
  });

  Event.associate = function (models) {
		Event.belongsTo(models.UsersEvents)
  }

  return Event;
};
